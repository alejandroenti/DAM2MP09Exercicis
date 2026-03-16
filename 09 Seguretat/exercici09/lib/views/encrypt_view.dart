import 'dart:io';
import 'dart:typed_data';

import 'package:exercici09/widgets/custom_input.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';

// Importaciones de criptografía
import 'package:encrypt/encrypt.dart' as encrypt_lib;
import 'package:pointycastle/asymmetric/api.dart';
import 'package:pointycastle/asymmetric/oaep.dart';
import 'package:pointycastle/asymmetric/rsa.dart';
import 'package:pointycastle/api.dart' as pc;

class EncryptView extends StatefulWidget {
  const EncryptView({super.key});

  @override
  State<StatefulWidget> createState() => _EncryptViewState();
}

class _EncryptViewState extends State<EncryptView> {
  final pkCtrl = TextEditingController();
  final fileCtrl = TextEditingController();

  String pkPath = "";
  String filePath = "";
  bool _isProcessing = false;

  // --- Lógica de Encriptación ---

  Future<RSAPublicKey> parsePublicKey(String path) async {
    String content = await File(path).readAsString();
    return encrypt_lib.RSAKeyParser().parse(content) as RSAPublicKey;
  }

  Future<void> encryptFile(String filePath, RSAPublicKey pk) async {
    Uint8List data = await File(filePath).readAsBytes();

    final encryptor = OAEPEncoding(RSAEngine())
      ..init(true, pc.PublicKeyParameter<RSAPublicKey>(pk)); // true = encrypt

    Uint8List datosEncriptados = _processInBlocks(encryptor, data);

    // Guarda el archivo con extensión .encrypted
    File encryptedFile = File('$filePath.encrypted');
    await encryptedFile.writeAsBytes(datosEncriptados);
  }

  Uint8List _processInBlocks(pc.AsymmetricBlockCipher engine, Uint8List input) {
    final numBlocks = (input.length / engine.inputBlockSize).ceil();
    final output = Uint8List(numBlocks * engine.outputBlockSize);

    var inputOffset = 0;
    var outputOffset = 0;
    while (inputOffset < input.length) {
      final chunkSize = (inputOffset + engine.inputBlockSize <= input.length)
          ? engine.inputBlockSize
          : input.length - inputOffset;

      outputOffset += engine.processBlock(
          input, inputOffset, chunkSize, output, outputOffset);

      inputOffset += chunkSize;
    }

    return (output.length == outputOffset)
        ? output
        : output.sublist(0, outputOffset);
  }

  // --- Interfaz ---

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Text(
          "Encriptar Archivo",
          style: TextStyle(
            fontSize: 18,
            color: Colors.black54,
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 20),
        
        // Selector de Clave Pública
        CustomInput(
          label: "Public Key (PEM)",
          controller: pkCtrl,
          readOnly: true,
          onTap: () async {
            FilePickerResult? r = await FilePicker.platform.pickFiles();
            if (r != null) {
              setState(() {
                pkCtrl.text = r.files.single.name;
                pkPath = r.files.single.path!;
              });
            }
          },
        ),
        const SizedBox(height: 16),
        
        // Selector de Archivo a encriptar
        CustomInput(
          label: "Archivo a encriptar",
          controller: fileCtrl,
          readOnly: true,
          onTap: () async {
            FilePickerResult? r = await FilePicker.platform.pickFiles();
            if (r != null) {
              setState(() {
                fileCtrl.text = r.files.single.name;
                filePath = r.files.single.path!;
              });
            }
          },
        ),
        
        const SizedBox(height: 32),

        _isProcessing 
          ? const CircularProgressIndicator(color: Color(0xFF6A11CB))
          : SizedBox(
              width: double.infinity,
              height: 55,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6A11CB), // Color morado principal
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                  elevation: 5,
                ),
                onPressed: () async {
                  if (pkPath.isEmpty || filePath.isEmpty) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text("Selecciona la clave y el archivo")),
                    );
                    return;
                  }

                  setState(() => _isProcessing = true);

                  try {
                    // 1. Parsear clave
                    RSAPublicKey key = await parsePublicKey(pkPath);
                    
                    // 2. Encriptar (Proceso asíncrono fuera de setState)
                    await encryptFile(filePath, key);

                    if (!mounted) return;
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text("¡Archivo encriptado correctamente!")),
                    );

                    // 3. Limpiar formulario
                    setState(() {
                      pkCtrl.clear();
                      fileCtrl.clear();
                      pkPath = "";
                      filePath = "";
                    });
                  } catch (e) {
                    if (!mounted) return;
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text("Error al encriptar: $e")),
                    );
                  } finally {
                    setState(() => _isProcessing = false);
                  }
                },
                icon: const Icon(Icons.lock),
                label: const Text(
                  "ENCRIPTAR AHORA",
                  style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1),
                ),
              ),
            ),
      ],
    );
  }
}
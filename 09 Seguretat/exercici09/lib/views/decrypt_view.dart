import 'dart:io';
import 'dart:typed_data';

import 'package:exercici09/widgets/custom_input.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';

// Importaciones de criptografía con prefijos para evitar conflictos
import 'package:pointycastle/api.dart' as pc; 
import 'package:pointycastle/asymmetric/api.dart';
import 'package:pointycastle/asymmetric/oaep.dart';
import 'package:pointycastle/asymmetric/rsa.dart';
import 'package:encrypt/encrypt.dart' as encrypt_lib;

class DecryptView extends StatefulWidget {
  const DecryptView({super.key});

  @override
  State<StatefulWidget> createState() => _DecryptViewState();
}

class _DecryptViewState extends State<DecryptView> {
  final pkCtrl = TextEditingController();
  final fileCtrl = TextEditingController();
  final fileDecryptCtrl = TextEditingController();

  String pkPath = "";
  String filePath = "";
  String fileDecryptPath = "";
  bool _isProcessing = false;

  // --- Lógica de Desencriptación ---

  Future<RSAPrivateKey> parsePrivateKey(String path) async {
    String content = await File(path).readAsString();
    return encrypt_lib.RSAKeyParser().parse(content) as RSAPrivateKey;
  }

  Future<void> decryptFile(String encryptedPath, String destinationPath, RSAPrivateKey privateKey) async {
    Uint8List encryptedData = await File(encryptedPath).readAsBytes();

    final decryptor = OAEPEncoding(RSAEngine())
      ..init(false, pc.PrivateKeyParameter<RSAPrivateKey>(privateKey));

    Uint8List decryptedData = _processInBlocks(decryptor, encryptedData);

    File decryptedFile = File(destinationPath);
    await decryptedFile.writeAsBytes(decryptedData);
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

  // --- Interfaz Adaptada al Contenedor ---

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min, // Ajusta el tamaño al contenido
      children: [
        const Text(
          "Desencriptar Archivo",
          style: TextStyle(
            fontSize: 18,
            color: Colors.black54,
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 20),
        
        CustomInput(
          label: "Private Key (PEM)",
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
        
        CustomInput(
          label: "Archivo Encriptado",
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
        const SizedBox(height: 16),
        
        CustomInput(
          label: "Guardar como...",
          controller: fileDecryptCtrl,
          readOnly: true,
          onTap: () async {
            String? outputFile = await FilePicker.platform.saveFile(
              dialogTitle: 'Selecciona dónde guardar el archivo',
              fileName: 'archivo_desencriptado.png',
            );

            if (outputFile != null) {
              setState(() {
                fileDecryptPath = outputFile;
                fileDecryptCtrl.text = outputFile.split(Platform.pathSeparator).last;
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
                  backgroundColor: const Color(0xFF2575FC), // Azul para diferenciar de encriptar
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                  elevation: 5,
                ),
                onPressed: () async {
                  if (pkPath.isEmpty || filePath.isEmpty || fileDecryptPath.isEmpty) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text("Completa todos los campos")),
                    );
                    return;
                  }

                  setState(() => _isProcessing = true);

                  try {
                    RSAPrivateKey key = await parsePrivateKey(pkPath);
                    await decryptFile(filePath, fileDecryptPath, key);

                    if (!mounted) return;
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text("¡Archivo desencriptado con éxito!")),
                    );

                    setState(() {
                      pkCtrl.clear();
                      fileCtrl.clear();
                      fileDecryptCtrl.clear();
                      pkPath = "";
                      filePath = "";
                      fileDecryptPath = "";
                    });
                  } catch (e) {
                    if (!mounted) return;
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text("Error: $e")),
                    );
                  } finally {
                    setState(() => _isProcessing = false);
                  }
                },
                icon: const Icon(Icons.lock_open),
                label: const Text(
                  "DESENCRIPTAR AHORA",
                  style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1),
                ),
              ),
            ),
      ],
    );
  }
}
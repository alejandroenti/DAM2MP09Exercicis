import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:encrypt/encrypt.dart';
import 'package:exercici09/widgets/custom_input.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:pointycastle/api.dart';
import 'package:pointycastle/asn1/asn1_parser.dart';
import 'package:pointycastle/asn1/primitives/asn1_bit_string.dart';
import 'package:pointycastle/asn1/primitives/asn1_integer.dart';
import 'package:pointycastle/asn1/primitives/asn1_sequence.dart';
import 'package:pointycastle/asymmetric/api.dart';
import 'package:pointycastle/asymmetric/oaep.dart';
import 'package:pointycastle/asymmetric/rsa.dart';
import 'package:pointycastle/asymmetric/api.dart';
import 'package:pointycastle/asymmetric/api.dart';


class EncryptView  extends StatefulWidget {

  const EncryptView({super.key});

  @override
  State<StatefulWidget> createState() => _EncryptViewState();
}

class _EncryptViewState extends State<EncryptView> {

  final pkCtrl = TextEditingController();
  final fileCtrl = TextEditingController();

  String pkPath = "";
  String filePath = "";

  Future<RSAPublicKey> parsePublicKey(String path) async {
    String content = await File(path).readAsString();
    return RSAKeyParser().parse(content) as RSAPublicKey;
  }

  Future<Uint8List> getBytesFromFile(String filePath) async {
    return await File(filePath).readAsBytes();
  }

  void encryptFile(String filePath, RSAPublicKey pk) async {
    try {
      Uint8List data = await getBytesFromFile(filePath);

      final encryptor = OAEPEncoding(RSAEngine())
      ..init(true, PublicKeyParameter<RSAPublicKey>(pk)); // true=encrypt

      Uint8List datosEncriptados = _processInBlocks(encryptor, data);

      File encryptedFile = File('$filePath.encrypted');
      await encryptedFile.writeAsBytes(datosEncriptados);
      
    } catch (e) {
      print("Error: $e");
    }
  }

  Uint8List _processInBlocks(AsymmetricBlockCipher engine, Uint8List input) {
    final numBlocks = input.length ~/ engine.inputBlockSize +
        ((input.length % engine.inputBlockSize != 0) ? 1 : 0);

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

  @override
  Widget build(Object context) {
    return Card(
      color: Colors.purple,
      child: Column(
        children: [
          Text("Encrypt a file"),
          Divider(height: 10, thickness: 2,),
          SizedBox(height: 20),
          Expanded(
            child: 
              CustomInput(
                label: "Public Key (RSA)",
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
                }
              )
          ),
          Expanded(
            child: 
              CustomInput(
                label: "File to encrypt",
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
                }
              )
          ),
          FloatingActionButton(
            child: Text("Encrypt the file"),
            onPressed: () => {
              setState(() async {
                
                RSAPublicKey key = await parsePublicKey(pkPath);
                encryptFile(filePath, key);

                pkCtrl.text = "";
                fileCtrl.text = "";
                pkPath = "";
                filePath = "";
              })
            }
          )
        ],
      )
    );
  }
  
}
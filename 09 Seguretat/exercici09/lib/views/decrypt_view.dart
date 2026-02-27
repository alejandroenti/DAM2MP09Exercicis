import 'package:exercici09/widgets/custom_input.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';

class DecryptView  extends StatefulWidget {

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

  @override
  Widget build(Object context) {
    return Card(
      color: Colors.purple,
      child: Column(
        children: [
          Text("Decrypt a file"),
          Divider(height: 10, thickness: 2,),
          SizedBox(height: 20),
          Expanded(
            child: 
              CustomInput(
                label: "Private Key (RSA)",
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
                label: "Encrypted file",
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
          Expanded(
            child: 
              CustomInput(
                label: "Decrypted file destination",
                controller: fileCtrl,
                readOnly: true,
                onTap: () async {
                  FilePickerResult? r = await FilePicker.platform.pickFiles();
                  if (r != null) {
                    setState(() {
                      fileDecryptCtrl.text = r.files.single.name;
                      fileDecryptPath = r.files.single.path!;
                    });
                  }  
                }
              )
          ),
          FloatingActionButton(
            child: Text("Decrypt the file"),
            onPressed: () => 1+1
          )
        ],
      )
    );
  }
  
}
import 'package:exercici09/views/decrypt_view.dart';
import 'package:exercici09/views/encrypt_view.dart';
import 'package:flutter/material.dart';

class MainScreen extends StatefulWidget{
  
  const MainScreen({super.key});

  @override
  State<StatefulWidget> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {

  Widget actionWidget = EncryptView();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text('EncryptApp'),
      ),
      body: Center(
        child: Card(
          color: Colors.amber,
          child: Column(
            children: [
              Expanded(child: actionWidget),
              Row(
                children: [
                  FloatingActionButton(
                    backgroundColor: Colors.green,
                    tooltip: "Encrypt file",
                    child: Text("Encrypt"),
                    onPressed: () => setState(() {
                      actionWidget = EncryptView();
                    })
                  ),
                  FloatingActionButton(
                    backgroundColor: Colors.pinkAccent,
                    tooltip: "Decrypt file",
                    child: Text("Decrypt"),
                    onPressed: () => {
                      setState(() {
                        actionWidget = DecryptView();
                      })
                    },
                  ),
                ]
              )
            ],
          ),
        ),
      ),
    );
  }
}
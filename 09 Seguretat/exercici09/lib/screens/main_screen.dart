import 'package:exercici09/views/decrypt_view.dart';
import 'package:exercici09/views/encrypt_view.dart';
import 'package:flutter/material.dart';

class MainScreen extends StatefulWidget{
  
  const MainScreen({super.key});

  @override
  State<StatefulWidget> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {

  bool isEncrypt = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF6A11CB), Color(0xFF2575FC)],
          ),
        ),
        child: Center(
          child: SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Icono y Título superior
                const Icon(Icons.security, size: 80, color: Colors.white),
                const SizedBox(height: 10),
                const Text(
                  "CryptoManager",
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.5,
                  ),
                ),
                const SizedBox(height: 30),
                
                // Contenedor tipo Login
                Container(
                  width: 400, // Ancho fijo estilo card de escritorio/web
                  margin: const EdgeInsets.symmetric(horizontal: 20),
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(28),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.2),
                        blurRadius: 20,
                        offset: const Offset(0, 10),
                      )
                    ],
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Selector de opciones (Tabs personalizados)
                      Row(
                        children: [
                          _buildTabButton("Encriptar", isEncrypt, () {
                            setState(() => isEncrypt = true);
                          }),
                          _buildTabButton("Desencriptar", !isEncrypt, () {
                            setState(() => isEncrypt = false);
                          }),
                        ],
                      ),
                      const SizedBox(height: 30),
                      
                      // Animación de cambio de vista
                      AnimatedSwitcher(
                        duration: const Duration(milliseconds: 300),
                        child: isEncrypt 
                          ? const EncryptView(key: ValueKey("enc")) 
                          : const DecryptView(key: ValueKey("dec")),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTabButton(String label, bool active, VoidCallback onTap) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            border: Border(
              bottom: BorderSide(
                color: active ? const Color(0xFF6A11CB) : Colors.transparent,
                width: 3,
              ),
            ),
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: active ? const Color(0xFF6A11CB) : Colors.grey,
            ),
          ),
        ),
      ),
    );
  }
}
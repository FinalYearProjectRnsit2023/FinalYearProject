import 'package:flutter/material.dart';
import 'package:scas/Slides/Login.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

Future<void> main() async{
  await Supabase.initialize(url: "https://dzbenvnmvqbvzcukhgnx.supabase.co", anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6YmVudm5tdnFidnpjdWtoZ254Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzY2MTkwMjQsImV4cCI6MTk5MjE5NTAyNH0.a-J21Lx1IJACnC98KWo54GGHBRf34aWvxhcfngVq9k0");
  runApp(const MyApp());
}

final supabase=Supabase.instance.client;

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      home: LoginPage(),
    );
  }
}
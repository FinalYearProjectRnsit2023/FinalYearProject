import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class DisplayCode extends StatelessWidget {
 late String Code;

 DisplayCode({required this.Code});



  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Color(0xff8e6eec),
        title: Text('CODE'),
      ),
        body: Center(
        child: Text(Code),
        ),
    );
  }
}
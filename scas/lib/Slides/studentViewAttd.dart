import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class DisplayStudentAtt extends StatelessWidget {
  late String AttCount;

  DisplayStudentAtt({required this.AttCount});



  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Color(0xff8e6eec),
        title: Text('Student Attendnace'),
      ),
      body: Center(
        child: Text(AttCount),
      ),
    );
  }
}
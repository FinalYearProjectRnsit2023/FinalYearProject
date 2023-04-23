import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class DisplayTeacherAtt extends StatelessWidget {
  late String AttCount;

  DisplayTeacherAtt({required this.AttCount});



  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Color(0xff8e6eec),
        title: Text('Teacher Attendnace'),
      ),
      body: Center(
        child: Text(AttCount),
      ),
    );
  }
}
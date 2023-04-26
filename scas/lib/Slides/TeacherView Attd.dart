import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class DisplayTeacherAtt extends StatelessWidget {
  late String Name;
  late int Count;

  DisplayTeacherAtt({required this.Count,required this.Name});



  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Color(0xff8e6eec),
        title: Text('Teacher Attendnace'),
      ),
      body:  Center(
        child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            // crossAxisAlignment: CrossAxisAlignment.center,
            children:[
              Center(
                child: Row(children:[
                  Text("Name"),Text("              "),Text(Name)
                ]),
              ),
              Center(
                child: Row(children:[
                  Text("Attdence"),Text("              "),Text(Count.toString())
                ]),
              ),
            ]),
      ),
    );
  }
}
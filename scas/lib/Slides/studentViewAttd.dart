import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class DisplayStudentAtt extends StatelessWidget {
  late String Attdence;
  late String Name;
  // ,required this.Count
  DisplayStudentAtt({ required this.Name, required this.Attdence});



  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Color(0xff8e6eec),
        title: Text('Student Attendnace'),
      ),
      body: Center(
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
                  Text("Attdence"),Text("              "),Text(Attdence)
                ]),
              ),
            ]),
      ),
    );
  }
}
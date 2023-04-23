
import 'package:flutter/material.dart';
import 'package:scas/Lib/Api.dart';
import 'package:scas/Slides/Login.dart';
import 'package:scas/Slides/code%20display.dart';
import 'package:scas/Slides/TeacherMarkingAtt.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:scas/Slides/TeacherView Attd.dart';
class TeacherHomePage extends StatelessWidget {
  Future<void> signOut() async {
    final client = Supabase.instance.client;
    await client.auth.signOut();
  }
  List<dynamic> users=[];
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Color(0xff8e6eec),
        title: Text('Teacher HomePage'),
      ),
      body:  Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Center(
            child: ElevatedButton( style: ElevatedButton.styleFrom(
             backgroundColor: Colors.purpleAccent.shade400),
              onPressed: () async {
                print('tets');
                var code = await Api.Post(Api.Baseurl + "attdence/create_code" , {"Id": Supabase.instance.client.auth.currentUser?.id});
                print(code["Code"]);
                Navigator.push(context, MaterialPageRoute(builder: (context) => DisplayCode(Code: code["Code"].toString())));
              },
              child: Text(' Take Attendance'),
            ),
          ),
          SizedBox(height: 10), // Add some space between the buttons
          Center(
            child: ElevatedButton(style: ElevatedButton.styleFrom(
           backgroundColor: Colors.purpleAccent.shade400),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => const TeacherPage()),
                );
              },
              child: Text('Mark Attendance'),
            ),
          ),
          SizedBox(height: 10),
          Center(
            child: ElevatedButton(style: ElevatedButton.styleFrom(
            backgroundColor: Colors.purpleAccent.shade400),
              onPressed: () {
                var Id=Supabase.instance.client.auth.currentUser?.id;
                var attendance= Api.Get(Api.Baseurl + "" + "?Id="+Id!);
                Navigator.push(context, MaterialPageRoute(builder: (context) => DisplayTeacherAtt(AttCount: attendance["AttCount"])));
              },
              child: Text(' View Attendance'),
            ),
          ),
          SizedBox(height: 10),

        ],
      ),

    floatingActionButton: FloatingActionButton(
    onPressed: () async {
      await signOut(); // Call your sign-out function here
      Navigator.pushReplacement(
          context, MaterialPageRoute(builder: (context) => LoginPage()));
    },
    child: Icon(Icons.logout_rounded),
    backgroundColor: Colors.green,
    ),
    );
  }
}


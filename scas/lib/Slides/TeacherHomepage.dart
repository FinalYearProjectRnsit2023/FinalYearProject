
import 'package:flutter/material.dart';
import 'package:scas/Lib/Api.dart';
import 'package:scas/Slides/Login.dart';
import 'package:scas/Slides/code%20display.dart';
import 'package:scas/Slides/teacherMakingAtt.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
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
        title: Text('Teacher'),
      ),
      body:  Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Center(
            child: ElevatedButton(
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
            child: ElevatedButton(
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
            child: ElevatedButton(
              onPressed: () {},
              child: Text('Attendance'),
            ),
          ),
          SizedBox(height: 10),
          Center(
            child:ElevatedButton(
              onPressed:() {},
              child:Text('Time Table')
            )
          ),
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


import 'package:flutter/material.dart';
import 'package:scas/Lib/Api.dart';
import 'package:scas/Slides/Login.dart';
import 'package:scas/Slides/student%20attendance.dart';
import 'package:scas/Slides/studentViewAttd.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:scas/Slides/studentViewAttd.dart';
class StudentHomepage extends StatelessWidget {
  Future<void> signOut() async {
    final client = Supabase.instance.client;
    await client.auth.signOut();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
            backgroundColor: Color(0xff8e6eec),
            title: const Text(' Student HomePage')
        ),
        body: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Center(
              child: ElevatedButton(style: ElevatedButton.styleFrom(
              backgroundColor: Colors.purpleAccent.shade400),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => const StudentPage()),
                  );
                },
                child: Text('Attendance'),
              ),
            ),
            SizedBox(height: 10), // Add some space between the buttons
            Center(
              child: ElevatedButton(style: ElevatedButton.styleFrom(
              backgroundColor: Colors.purpleAccent.shade400),
                onPressed: () async {
                var Id=Supabase.instance.client.auth.currentUser?.id;
                var attendance= await Api.Post(Api.Baseurl + "attdence/count", {"Id": Supabase.instance.client.auth.currentUser?.id});
                print(attendance);
                Navigator.push(context,
                    MaterialPageRoute(builder: (context) => DisplayStudentAtt(
                        Name: attendance["name"],
                        Attdence: attendance["attdence"],
                      )
                    )
                );

                },
                child: Text('View Attendnace'),
              ),
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
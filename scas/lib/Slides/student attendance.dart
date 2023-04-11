import 'package:flutter/material.dart';
import 'package:scas/Slides/Login.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class StudentPage extends StatefulWidget {
  const StudentPage({super.key});
  // static apiResult<user1> res= apiResult();


  @override
  State<StudentPage> createState() => _StudentPageState();
}

class _StudentPageState extends State<StudentPage>{

  var codetext=TextEditingController();
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return  Scaffold(
        appBar: AppBar(
            backgroundColor: Color(0xff8e6eec),
            title: const Text('Student page')
        ),
        body:Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextFormField(
              controller: codetext,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                  filled: true,
                  hintText: 'Enter your code',
                  hintStyle: const TextStyle(color: Colors.white),
                  prefixIcon: const Icon(
                    Icons.security,
                    color: Colors.white,
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(36.0),
                    borderSide: BorderSide.none,
                  ),
                  fillColor: Colors.deepPurpleAccent,
                  focusColor: Colors.white),
            ),
            SizedBox(height: 10),
            Center(
              child: ElevatedButton( style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.deepPurple),
                onPressed: ()  {
                  // http.get(Uri.http('localhost:6969','student/attendance_code'))

                },
                child: Text('Submit'),

              ),
            ),


          ],
        ),

    );


  }
}

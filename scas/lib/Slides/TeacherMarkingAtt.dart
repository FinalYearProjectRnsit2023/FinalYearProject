import 'package:flutter/material.dart';
import 'package:scas/Lib/Api.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
class TeacherPage extends StatefulWidget {
  const TeacherPage({super.key});
  // static apiResult<user1> res= apiResult();


  @override
  State<TeacherPage> createState() => _TeacherPageState();
}

class _TeacherPageState extends State<TeacherPage>{
  var studentusn=TextEditingController();

@override
Widget build(BuildContext context) {
  return Scaffold(
      appBar: AppBar(
          backgroundColor: Color(0xff8e6eec),
          title: const Text('Mark Attendance')
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          TextFormField(
            controller: studentusn,
            style: const TextStyle(color: Colors.white),
            decoration: InputDecoration(
                filled: true,
                hintText: 'Student USN',
                hintStyle: const TextStyle(color: Colors.white),
                prefixIcon: const Icon(
                  Icons.security,
                  color: Colors.white,
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(36.0),
                  borderSide: BorderSide.none,
                ),
                fillColor: Colors.purpleAccent.shade100,
                focusColor: Colors.white),
          ),
          SizedBox(height: 10),
          Center(
            child: ElevatedButton(style: ElevatedButton.styleFrom(
                backgroundColor: Colors.purpleAccent.shade400),
              onPressed: () async{
                var code = await Api.Post(Api.Baseurl + "" , {
                  "Id": Supabase.instance.client.auth.currentUser?.id,
                  "Usn":studentusn,
                });
              },
              child: Text('submit'),

            ),
          ),


        ],
      )
  );
}

}
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:scas/Lib/Api.dart';
import 'package:scas/Lib/ApiResult.dart';
import 'package:scas/Slides/Login.dart';
import 'package:scas/Slides/TeacherHomepage.dart';
import 'package:scas/Slides/student%20hoem%20page.dart';

import 'package:scas/main.dart';


// class apiResult<type>{
//   late type Data;
//   late String error;
//
//   apiResult(){
//
//   }
// }
// class user{
//   late String ID;
//   late String name;
//
// }
class user1{
  late String xyz;
  late String name;

}
class HomePage extends StatefulWidget {
  const HomePage({super.key});
  // static apiResult<user1> res= apiResult();
  // static ApiResult<user1> res = Api.Get() as ApiResult<user1>;


  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage>{

  @override
  Widget build(BuildContext context) {
    print("??????????????????????");
    print(client);
  if(client.session==null){
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const LoginPage()),
    );
    return Text('');
  }

  switch(client.userMetadata.Role){
    case "Student":return StudentHomepage();
    case "Teacher":
      return TeacherHomePage();
    default:return Text("error");
  }

   return Text("home");
  }
}


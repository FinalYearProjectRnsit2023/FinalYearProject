import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
class Client{
  late Session? session;
  late User? user;
  late String firstName;
  late String? middleName;
  late String lastName;
  late String DOB;
  late String role;

  Client(String firstName,String lastName,String DOB,String role,Session? session,User? user,String? middleName){
    this.session=session;
    this.user=user;
    this.firstName=firstName;
    this.middleName=middleName;
    this.lastName=lastName;
    this.DOB=DOB;
    this.role=role;

  }
}
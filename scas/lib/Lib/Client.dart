import 'package:flutter/material.dart';
import 'package:scas/Lib/user.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
class Client{
  late Session? session;
  late User? user;
  late UserMetadata userMetadata;

  Client(Session? session,User? user,Map<String, dynamic>? userMetadata){
    this.session=session;
    this.user=user;
    this.userMetadata=UserMetadata(userMetadata!);
    
    print(user?.id);

  }
}
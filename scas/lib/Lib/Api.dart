 import 'dart:convert';

import 'package:scas/Lib/ApiResult.dart';
 import 'package:http/http.dart' as http;

class Api{

  static late String Baseurl = "http://192.168.29.143:6969/";
  static late String PBaseurl = "http://192.168.29.143:8080/";


  static dynamic Get<T>(String url) async {

    final response = await http.get(Uri.parse(url));
    if (response.statusCode == 200) {
      // Parse the response body here
      // print(response.body);
      final  json = jsonDecode(response.body);
      print(json);
      return json;
    } else {
      // Handle the error case here
      print('Error: ${response.statusCode}');
      return Null;
    }
  }


  static dynamic Post<T>(String url, T body) async {
    // print('this is post test');
    // print(jsonEncode(body));
      final response = await http.post(Uri.parse(url),
          body: body
      );
      if (response.statusCode == 201) {
        // Handle the success case here
        print('Post successful!');
        print(response.body);
        return jsonDecode(response.body);
      } else {
        // Handle the error case here
        print('Error: ${response.statusCode}');
      }
    return ApiResult();
  }
 }

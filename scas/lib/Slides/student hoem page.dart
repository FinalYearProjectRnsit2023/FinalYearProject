import 'package:flutter/material.dart';
import 'package:scas/Slides/student%20attendance.dart';
class StudentHomepage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
            backgroundColor: Color(0xff8e6eec),
            title: const Text(' Student Homepage')
        ),
        body: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Center(
              child: ElevatedButton(
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
              child: ElevatedButton(
                onPressed: () {},
                child: Text('Time Table'),
              ),
            ),


          ],
        )


    );
  }
}
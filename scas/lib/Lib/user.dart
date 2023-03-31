class UserMetadata{
  late NameClass Name;
  // late DateTime Dob;
  late String Role;

  UserMetadata(Map<String, dynamic> metaData){
    print("constructer metadata");
    print(metaData["Role"]);
    for(var i=0;i<metaData.keys.length;i++){
      print(metaData.keys.toList()[i]);
    }
    if (metaData["Name"] == null) {
      return;
    }
    Map<String, dynamic> name = metaData["Name"];
    this.Name=NameClass(name["FirstName"], name["LastName"], name["MiddleName"]);
    // this.Dob=DateTime(metaData["Dob"] as int);
    this.Role=metaData["Role"] as String;
  }
}
class NameClass{
  late String FirstName;
  late String? MiddleName;
  late String LastName;

  NameClass(String FirstName,String LastName,String? MiddleName){
    this.FirstName=FirstName;
    this.MiddleName=MiddleName;
    this.LastName=LastName;
  }
}
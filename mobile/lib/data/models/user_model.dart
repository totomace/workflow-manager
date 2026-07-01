import 'package:taskflow_mobile/domain/entities/user.dart';

class UserModel extends User {
  UserModel({required super.id, required super.email, required super.fullName});

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'],
      email: json['email'],
      fullName: json['full_name'] ?? '',
    );
  }
}
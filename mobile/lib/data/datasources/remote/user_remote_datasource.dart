import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:taskflow_mobile/core/constants/app_constants.dart';
import 'package:taskflow_mobile/data/datasources/local/shared_prefs_local_datasource.dart';
import 'package:taskflow_mobile/data/models/user_model.dart';

class UserRemoteDataSource {
  final SharedPrefsLocalDataSource localDataSource;
  final String baseUrl = AppConstants.baseUrl;

  UserRemoteDataSource({required this.localDataSource});

  Future<Map<String, String>> _headers() async {
    final token = await localDataSource.getToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  Future<UserModel> getProfile() async {
    final response = await http.get(
      Uri.parse('$baseUrl/users/me'),
      headers: await _headers(),
    );
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return UserModel.fromJson(data['user']);
    }
    throw Exception('Failed to load profile');
  }

  Future<UserModel> updateProfile(String fullName) async {
    final response = await http.put(
      Uri.parse('$baseUrl/users/me'),
      headers: await _headers(),
      body: jsonEncode({'full_name': fullName}),
    );
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return UserModel.fromJson(data['user']);
    }
    throw Exception(jsonDecode(response.body)['error'] ?? 'Failed to update profile');
  }

  Future<void> changePassword(String currentPassword, String newPassword) async {
    final response = await http.put(
      Uri.parse('$baseUrl/users/me/password'),
      headers: await _headers(),
      body: jsonEncode({'currentPassword': currentPassword, 'newPassword': newPassword}),
    );
    if (response.statusCode != 200) {
      throw Exception(jsonDecode(response.body)['error'] ?? 'Failed to change password');
    }
  }
}
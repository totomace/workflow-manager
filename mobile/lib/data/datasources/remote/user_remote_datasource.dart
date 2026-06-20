import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../core/constants/app_constants.dart';

abstract class UserRemoteDataSource {
  Future<Map<String, dynamic>> getProfile(String token);
  Future<Map<String, dynamic>> updateProfile(String token, String fullName);
  Future<void> changePassword(String token, String currentPassword, String newPassword);
}

class UserRemoteDataSourceImpl implements UserRemoteDataSource {
  final http.Client client;

  UserRemoteDataSourceImpl(this.client);

  @override
  Future<Map<String, dynamic>> getProfile(String token) async {
    final response = await client.get(
      Uri.parse('${AppConstants.baseUrl}/users/me'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body)['user'];
    } else {
      throw Exception('Không thể tải thông tin người dùng');
    }
  }

  @override
  Future<Map<String, dynamic>> updateProfile(String token, String fullName) async {
    final response = await client.put(
      Uri.parse('${AppConstants.baseUrl}/users/me'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({'full_name': fullName}),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body)['user'];
    } else {
      throw Exception('Không thể cập nhật hồ sơ');
    }
  }

  @override
  Future<void> changePassword(String token, String currentPassword, String newPassword) async {
    final response = await client.put(
      Uri.parse('${AppConstants.baseUrl}/users/me/password'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({'currentPassword': currentPassword, 'newPassword': newPassword}),
    );
    if (response.statusCode != 200) {
      throw Exception(jsonDecode(response.body)['error'] ?? 'Đổi mật khẩu thất bại');
    }
  }
}
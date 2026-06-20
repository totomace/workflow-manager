import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../core/constants/app_constants.dart';

abstract class AuthRemoteDataSource {
  Future<Map<String, dynamic>> login(String email, String password);
  Future<Map<String, dynamic>> register(String email, String fullName, String password);
  Future<Map<String, dynamic>> googleLogin(String credential);
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final http.Client client;

  AuthRemoteDataSourceImpl(this.client);

  @override
  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await client.post(
      Uri.parse('${AppConstants.baseUrl}/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception(jsonDecode(response.body)['error'] ?? 'Đăng nhập thất bại');
    }
  }

  @override
  Future<Map<String, dynamic>> register(String email, String fullName, String password) async {
    final response = await client.post(
      Uri.parse('${AppConstants.baseUrl}/auth/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'full_name': fullName, 'password': password}),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception(jsonDecode(response.body)['error'] ?? 'Đăng ký thất bại');
    }
  }

  @override
  Future<Map<String, dynamic>> googleLogin(String credential) async {
    final response = await client.post(
      Uri.parse('${AppConstants.baseUrl}/auth/google'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'credential': credential}),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception(jsonDecode(response.body)['error'] ?? 'Đăng nhập Google thất bại');
    }
  }
}
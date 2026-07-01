import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:taskflow_mobile/core/constants/app_constants.dart';
import 'package:taskflow_mobile/core/utils/agent_debug_log.dart';
import 'package:taskflow_mobile/data/datasources/local/shared_prefs_local_datasource.dart';
import 'package:taskflow_mobile/data/models/user_model.dart';

class AuthRemoteDataSource {
  final SharedPrefsLocalDataSource localDataSource;
  final String baseUrl = AppConstants.baseUrl;

  AuthRemoteDataSource({required this.localDataSource});

  Future<Map<String, String>> _headers() async {
    final token = await localDataSource.getToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  Future<UserModel> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: await _headers(),
      body: jsonEncode({'email': email, 'password': password}),
    );
    // #region agent log
    agentDebugLog(
      location: 'auth_remote_datasource.dart:login',
      message: 'login response',
      hypothesisId: 'B,C',
      data: {
        'statusCode': response.statusCode,
        'hasToken': response.statusCode == 200
            ? (jsonDecode(response.body) as Map).containsKey('token')
            : false,
        'hasUser': response.statusCode == 200
            ? (jsonDecode(response.body) as Map).containsKey('user')
            : false,
      },
    );
    // #endregion
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      await localDataSource.saveToken(data['token']);
      return UserModel.fromJson(data['user'] ?? _parseToken(data['token']));
    }
    throw Exception(jsonDecode(response.body)['error'] ?? 'Login failed');
  }

  Future<UserModel> register(String email, String password, String fullName) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: await _headers(),
      body: jsonEncode({'email': email, 'password': password, 'full_name': fullName}),
    );
    // #region agent log
    agentDebugLog(
      location: 'auth_remote_datasource.dart:register',
      message: 'register response',
      hypothesisId: 'B',
      data: {'statusCode': response.statusCode},
    );
    // #endregion
    if (response.statusCode == 200) {
      // After register, login to get token
      return login(email, password);
    }
    throw Exception(jsonDecode(response.body)['error'] ?? 'Register failed');
  }

  Future<UserModel> googleLogin(String credential) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/google'),
      headers: await _headers(),
      body: jsonEncode({'credential': credential}),
    );
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      await localDataSource.saveToken(data['token']);
      return UserModel.fromJson(_parseToken(data['token']));
    }
    throw Exception(jsonDecode(response.body)['error'] ?? 'Google login failed');
  }

  Map<String, dynamic> _parseToken(String token) {
    final parts = token.split('.');
    if (parts.length != 3) return {};
    final payload = parts[1];
    final normalized = base64.normalize(payload);
    final decoded = utf8.decode(base64.decode(normalized));
    return jsonDecode(decoded);
  }
}

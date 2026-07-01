import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:taskflow_mobile/domain/entities/user.dart';
import 'package:taskflow_mobile/domain/usecases/auth/login_usecase.dart';
import 'package:taskflow_mobile/domain/usecases/auth/register_usecase.dart';
import 'package:taskflow_mobile/domain/usecases/auth/google_login_usecase.dart';

class AuthProvider extends ChangeNotifier {
  final LoginUseCase loginUseCase;
  final RegisterUseCase registerUseCase;
  final GoogleLoginUseCase googleLoginUseCase;

  User? _user;
  bool _loading = false;
  String? _error;

  AuthProvider({
    required this.loginUseCase,
    required this.registerUseCase,
    required this.googleLoginUseCase,
  });

  User? get user => _user;
  bool get loading => _loading;
  String? get error => _error;
  bool get isLoggedIn => _user != null;

  Future<void> login(String email, String password) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      _user = await loginUseCase(email, password);
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool('is_logged_in', true);
    } catch (e) {
      _error = e.toString();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> register(String email, String password, String fullName) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      _user = await registerUseCase(email, password, fullName);
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool('is_logged_in', true);
    } catch (e) {
      _error = e.toString();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> googleLogin(String credential) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      _user = await googleLoginUseCase(credential);
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool('is_logged_in', true);
    } catch (e) {
      _error = e.toString();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    _user = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('is_logged_in');
    await prefs.remove('token');
    notifyListeners();
  }

  Future<bool> tryAutoLogin() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    if (token == null || token.isEmpty) {
      return false;
    }

    final payload = _decodeJwt(token);
    final id = payload['id'];
    final email = payload['email'];
    if (id is int && email is String && email.isNotEmpty) {
      _user = User(id: id, email: email, fullName: email);
      notifyListeners();
      return true;
    }

    return false;
  }

  Map<String, dynamic> _decodeJwt(String token) {
    final parts = token.split('.');
    if (parts.length != 3) return {};
    final normalized = base64.normalize(parts[1]);
    final decoded = utf8.decode(base64Url.decode(normalized));
    return jsonDecode(decoded) as Map<String, dynamic>;
  }
}

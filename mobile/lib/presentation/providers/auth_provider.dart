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
    notifyListeners();
  }

  Future<bool> tryAutoLogin() async {
    final prefs = await SharedPreferences.getInstance();
    final isLoggedIn = prefs.getBool('is_logged_in') ?? false;
    if (isLoggedIn) {
      // Nếu có token (đã lưu trong SharedPrefs), có thể gọi getProfile để khôi phục user
      // Nhưng tạm thời để trống, sẽ xử lý sau
    }
    return false;
  }
}
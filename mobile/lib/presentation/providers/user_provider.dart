import 'package:flutter/material.dart';
import 'package:taskflow_mobile/domain/entities/user.dart';
import 'package:taskflow_mobile/domain/usecases/user/get_profile_usecase.dart';
import 'package:taskflow_mobile/domain/usecases/user/update_profile_usecase.dart';
import 'package:taskflow_mobile/domain/usecases/user/change_password_usecase.dart';

class UserProvider extends ChangeNotifier {
  final GetProfileUseCase getProfileUseCase;
  final UpdateProfileUseCase updateProfileUseCase;
  final ChangePasswordUseCase changePasswordUseCase;

  User? _user;
  bool _loading = false;
  String? _error;
  String? _successMessage;

  UserProvider({
    required this.getProfileUseCase,
    required this.updateProfileUseCase,
    required this.changePasswordUseCase,
  });

  User? get user => _user;
  bool get loading => _loading;
  String? get error => _error;
  String? get successMessage => _successMessage;

  Future<void> fetchProfile() async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      _user = await getProfileUseCase();
    } catch (e) {
      _error = e.toString();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> updateProfile(String fullName) async {
    _loading = true;
    _error = null;
    _successMessage = null;
    notifyListeners();

    try {
      _user = await updateProfileUseCase(fullName);
      _successMessage = 'Cập nhật hồ sơ thành công!';
    } catch (e) {
      _error = e.toString();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> changePassword(String currentPassword, String newPassword) async {
    _loading = true;
    _error = null;
    _successMessage = null;
    notifyListeners();

    try {
      await changePasswordUseCase(currentPassword, newPassword);
      _successMessage = 'Đổi mật khẩu thành công!';
    } catch (e) {
      _error = e.toString();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  void clearMessages() {
    _error = null;
    _successMessage = null;
    notifyListeners();
  }
}
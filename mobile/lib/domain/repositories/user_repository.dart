import 'package:taskflow_mobile/domain/entities/user.dart';

abstract class UserRepository {
  Future<User> getProfile();
  Future<User> updateProfile(String fullName);
  Future<void> changePassword(String currentPassword, String newPassword);
}
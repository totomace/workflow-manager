import 'package:taskflow_mobile/data/datasources/remote/user_remote_datasource.dart';
import 'package:taskflow_mobile/data/datasources/local/shared_prefs_local_datasource.dart';
import 'package:taskflow_mobile/domain/entities/user.dart';
import 'package:taskflow_mobile/domain/repositories/user_repository.dart';

class UserRepositoryImpl implements UserRepository {
  final UserRemoteDataSource remote;
  final SharedPrefsLocalDataSource local;

  UserRepositoryImpl({required this.remote, required this.local});

  @override
  Future<User> getProfile() async {
    return await remote.getProfile();
  }

  @override
  Future<User> updateProfile(String fullName) async {
    return await remote.updateProfile(fullName);
  }

  @override
  Future<void> changePassword(String currentPassword, String newPassword) async {
    await remote.changePassword(currentPassword, newPassword);
  }
}
import '../../domain/entities/user.dart';
import '../../domain/repositories/user_repository.dart';
import '../datasources/local/shared_prefs_local_datasource.dart';
import '../datasources/remote/user_remote_datasource.dart';

class UserRepositoryImpl implements UserRepository {
  final UserRemoteDataSource remote;
  final SharedPrefsLocalDataSource local;

  UserRepositoryImpl({required this.remote, required this.local});

  @override
  Future<User> getProfile() async {
    final token = await local.getToken();
    if (token == null) throw Exception('Chưa đăng nhập');
    final data = await remote.getProfile(token);
    return User.fromJson(data);
  }

  @override
  Future<User> updateProfile(String fullName) async {
    final token = await local.getToken();
    if (token == null) throw Exception('Chưa đăng nhập');
    final data = await remote.updateProfile(token, fullName);
    return User.fromJson(data);
  }

  @override
  Future<void> changePassword(String currentPassword, String newPassword) async {
    final token = await local.getToken();
    if (token == null) throw Exception('Chưa đăng nhập');
    await remote.changePassword(token, currentPassword, newPassword);
  }
}
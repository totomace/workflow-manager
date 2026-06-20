import '../../domain/entities/user.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/local/shared_prefs_local_datasource.dart';
import '../datasources/remote/auth_remote_datasource.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remote;
  final SharedPrefsLocalDataSource local;

  AuthRepositoryImpl({required this.remote, required this.local});

  @override
  Future<User> login(String email, String password) async {
    final response = await remote.login(email, password);
    final token = response['token'] as String;
    await local.saveToken(token);
    // Decode JWT to get user info (simplified)
    final parts = token.split('.');
    if (parts.length != 3) throw Exception('Token không hợp lệ');
    final payload = _decodeBase64(parts[1]);
    return User.fromJson(payload);
  }

  @override
  Future<User> register(String email, String fullName, String password) async {
    final response = await remote.register(email, fullName, password);
    // Auto login after register
    return login(email, password);
  }

  @override
  Future<User> googleLogin(String credential) async {
    final response = await remote.googleLogin(credential);
    final token = response['token'] as String;
    await local.saveToken(token);
    final parts = token.split('.');
    if (parts.length != 3) throw Exception('Token không hợp lệ');
    final payload = _decodeBase64(parts[1]);
    return User.fromJson(payload);
  }

  @override
  Future<void> logout() async {
    await local.removeToken();
  }

  @override
  Future<String?> getToken() async {
    return local.getToken();
  }

  Map<String, dynamic> _decodeBase64(String str) {
    String normalized = base64.normalize(str);
    String decoded = utf8.decode(base64.decode(normalized));
    return jsonDecode(decoded);
  }
}
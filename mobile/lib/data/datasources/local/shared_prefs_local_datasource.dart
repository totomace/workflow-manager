import 'package:shared_preferences/shared_preferences.dart';

abstract class SharedPrefsLocalDataSource {
  Future<String?> getToken();
  Future<void> saveToken(String token);
  Future<void> removeToken();
}

class SharedPrefsLocalDataSourceImpl implements SharedPrefsLocalDataSource {
  final SharedPreferences _prefs;
  static const String _tokenKey = 'auth_token';

  SharedPrefsLocalDataSourceImpl(this._prefs);

  @override
  Future<String?> getToken() async {
    return _prefs.getString(_tokenKey);
  }

  @override
  Future<void> saveToken(String token) async {
    await _prefs.setString(_tokenKey, token);
  }

  @override
  Future<void> removeToken() async {
    await _prefs.remove(_tokenKey);
  }
}
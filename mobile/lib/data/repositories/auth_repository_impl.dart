import 'dart:convert';
import 'package:taskflow_mobile/data/datasources/remote/auth_remote_datasource.dart';
import 'package:taskflow_mobile/data/datasources/local/shared_prefs_local_datasource.dart';
import 'package:taskflow_mobile/data/models/user_model.dart';
import 'package:taskflow_mobile/domain/entities/user.dart';
import 'package:taskflow_mobile/domain/repositories/auth_repository.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remote;
  final SharedPrefsLocalDataSource local;

  AuthRepositoryImpl({required this.remote, required this.local});

  @override
  Future<User> login(String email, String password) async {
    return await remote.login(email, password);
  }

  @override
  Future<User> register(String email, String password, String fullName) async {
    return await remote.register(email, password, fullName);
  }

  @override
  Future<User> googleLogin(String credential) async {
    return await remote.googleLogin(credential);
  }
}
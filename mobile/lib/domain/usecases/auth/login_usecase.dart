import 'package:taskflow_mobile/domain/entities/user.dart';
import 'package:taskflow_mobile/domain/repositories/auth_repository.dart';

class LoginUseCase {
  final AuthRepository repository;
  LoginUseCase(this.repository);

  Future<User> call(String email, String password) async {
    return await repository.login(email, password);
  }
}
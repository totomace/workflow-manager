import 'package:taskflow_mobile/domain/entities/user.dart';
import 'package:taskflow_mobile/domain/repositories/auth_repository.dart';

class RegisterUseCase {
  final AuthRepository repository;
  RegisterUseCase(this.repository);

  Future<User> call(String email, String password, String fullName) async {
    return await repository.register(email, password, fullName);
  }
}
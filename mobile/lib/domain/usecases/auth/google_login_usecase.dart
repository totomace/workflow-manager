import 'package:taskflow_mobile/domain/entities/user.dart';
import 'package:taskflow_mobile/domain/repositories/auth_repository.dart';

class GoogleLoginUseCase {
  final AuthRepository repository;
  GoogleLoginUseCase(this.repository);

  Future<User> call(String credential) async {
    return await repository.googleLogin(credential);
  }
}
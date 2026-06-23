import 'package:taskflow_mobile/domain/entities/user.dart';
import 'package:taskflow_mobile/domain/repositories/user_repository.dart';

class GetProfileUseCase {
  final UserRepository repository;
  GetProfileUseCase(this.repository);

  Future<User> call() async {
    return await repository.getProfile();
  }
}
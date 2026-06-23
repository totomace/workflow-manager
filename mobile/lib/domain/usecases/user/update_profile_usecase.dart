import 'package:taskflow_mobile/domain/entities/user.dart';
import 'package:taskflow_mobile/domain/repositories/user_repository.dart';

class UpdateProfileUseCase {
  final UserRepository repository;
  UpdateProfileUseCase(this.repository);

  Future<User> call(String fullName) async {
    return await repository.updateProfile(fullName);
  }
}
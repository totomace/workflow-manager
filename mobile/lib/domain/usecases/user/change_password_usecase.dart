import 'package:taskflow_mobile/domain/repositories/user_repository.dart';

class ChangePasswordUseCase {
  final UserRepository repository;
  ChangePasswordUseCase(this.repository);

  Future<void> call(String currentPassword, String newPassword) async {
    await repository.changePassword(currentPassword, newPassword);
  }
}
import 'package:taskflow_mobile/domain/repositories/task_repository.dart';

class DeleteTaskUseCase {
  final TaskRepository repository;
  DeleteTaskUseCase(this.repository);

  Future<void> call(int id) async {
    await repository.deleteTask(id);
  }
}
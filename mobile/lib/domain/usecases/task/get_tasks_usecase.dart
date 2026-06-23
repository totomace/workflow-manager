import 'package:taskflow_mobile/domain/entities/task.dart';
import 'package:taskflow_mobile/domain/repositories/task_repository.dart';

class GetTasksUseCase {
  final TaskRepository repository;
  GetTasksUseCase(this.repository);

  Future<List<TaskEntity>> call() async {
    return await repository.getTasks();
  }
}
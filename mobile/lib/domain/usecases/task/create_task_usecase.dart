import 'package:taskflow_mobile/domain/entities/task.dart';
import 'package:taskflow_mobile/domain/repositories/task_repository.dart';

class CreateTaskUseCase {
  final TaskRepository repository;
  CreateTaskUseCase(this.repository);

  Future<TaskEntity> call({
    required String title,
    String? description,
    String status = 'todo',
    double amount = 0,
    String? taskDate,
    String? startTime,
    String? endTime,
  }) async {
    return await repository.createTask(
      title: title,
      description: description,
      status: status,
      amount: amount,
      taskDate: taskDate,
      startTime: startTime,
      endTime: endTime,
    );
  }
}
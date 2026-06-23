import 'package:taskflow_mobile/domain/entities/task.dart';
import 'package:taskflow_mobile/domain/repositories/task_repository.dart';

class UpdateTaskUseCase {
  final TaskRepository repository;
  UpdateTaskUseCase(this.repository);

  Future<TaskEntity> call({
    required int id,
    String? title,
    String? description,
    String? status,
    double? amount,
    String? taskDate,
    String? startTime,
    String? endTime,
  }) async {
    return await repository.updateTask(
      id: id,
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
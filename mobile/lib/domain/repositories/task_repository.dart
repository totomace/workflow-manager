import 'package:taskflow_mobile/domain/entities/task.dart';

abstract class TaskRepository {
  Future<List<TaskEntity>> getTasks();
  Future<double> getMoneyStats({String period});
  Future<Map<String, int>> getStatusStats({String period});
  Future<TaskEntity> createTask({
    required String title,
    String? description,
    String status = 'todo',
    double amount = 0,
    String? taskDate,
    String? startTime,
    String? endTime,
  });
  Future<TaskEntity> updateTask({
    required int id,
    String? title,
    String? description,
    String? status,
    double? amount,
    String? taskDate,
    String? startTime,
    String? endTime,
  });
  Future<void> deleteTask(int id);
}

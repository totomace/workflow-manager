import 'package:taskflow_mobile/data/datasources/remote/task_remote_datasource.dart';
import 'package:taskflow_mobile/data/datasources/local/shared_prefs_local_datasource.dart';
import 'package:taskflow_mobile/domain/entities/task.dart';
import 'package:taskflow_mobile/domain/repositories/task_repository.dart';

class TaskRepositoryImpl implements TaskRepository {
  final TaskRemoteDataSource remote;
  final SharedPrefsLocalDataSource local;

  TaskRepositoryImpl({required this.remote, required this.local});

  @override
  Future<List<TaskEntity>> getTasks() async {
    final tasks = await remote.getTasks();
    return tasks;
  }

  @override
  Future<TaskEntity> createTask({
    required String title,
    String? description,
    String status = 'todo',
    double amount = 0,
    String? taskDate,
    String? startTime,
    String? endTime,
  }) async {
    return await remote.createTask({
      'title': title,
      if (description != null) 'description': description,
      'status': status,
      'amount': amount,
      if (taskDate != null) 'task_date': taskDate,
      if (startTime != null) 'start_time': startTime,
      if (endTime != null) 'end_time': endTime,
    });
  }

  @override
  Future<TaskEntity> updateTask({
    required int id,
    String? title,
    String? description,
    String? status,
    double? amount,
    String? taskDate,
    String? startTime,
    String? endTime,
  }) async {
    return await remote.updateTask(id, {
      if (title != null) 'title': title,
      if (description != null) 'description': description,
      if (status != null) 'status': status,
      if (amount != null) 'amount': amount,
      if (taskDate != null) 'task_date': taskDate,
      if (startTime != null) 'start_time': startTime,
      if (endTime != null) 'end_time': endTime,
    });
  }

  @override
  Future<void> deleteTask(int id) async {
    await remote.deleteTask(id);
  }
}
import '../../domain/entities/task.dart';
import '../../domain/repositories/task_repository.dart';
import '../datasources/local/shared_prefs_local_datasource.dart';
import '../datasources/remote/task_remote_datasource.dart';

class TaskRepositoryImpl implements TaskRepository {
  final TaskRemoteDataSource remote;
  final SharedPrefsLocalDataSource local;

  TaskRepositoryImpl({required this.remote, required this.local});

  @override
  Future<List<Task>> getTasks() async {
    final token = await local.getToken();
    if (token == null) throw Exception('Chưa đăng nhập');
    final list = await remote.getTasks(token);
    return list.map((e) => Task.fromJson(e)).toList();
  }

  @override
  Future<Task> createTask(Map<String, dynamic> data) async {
    final token = await local.getToken();
    if (token == null) throw Exception('Chưa đăng nhập');
    final result = await remote.createTask(token, data);
    return Task.fromJson(result);
  }

  @override
  Future<Task> updateTask(int taskId, Map<String, dynamic> data) async {
    final token = await local.getToken();
    if (token == null) throw Exception('Chưa đăng nhập');
    final result = await remote.updateTask(token, taskId, data);
    return Task.fromJson(result);
  }

  @override
  Future<void> deleteTask(int taskId) async {
    final token = await local.getToken();
    if (token == null) throw Exception('Chưa đăng nhập');
    await remote.deleteTask(token, taskId);
  }

  @override
  Future<Map<String, dynamic>> getMoneyStats(String period) async {
    final token = await local.getToken();
    if (token == null) throw Exception('Chưa đăng nhập');
    return remote.getMoneyStats(token, period);
  }

  @override
  Future<Map<String, dynamic>> getStatusStats(String period) async {
    final token = await local.getToken();
    if (token == null) throw Exception('Chưa đăng nhập');
    return remote.getStatusStats(token, period);
  }
}
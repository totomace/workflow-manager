import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:taskflow_mobile/core/constants/app_constants.dart';
import 'package:taskflow_mobile/core/utils/agent_debug_log.dart';
import 'package:taskflow_mobile/data/datasources/local/shared_prefs_local_datasource.dart';
import 'package:taskflow_mobile/data/models/task_model.dart';

class TaskRemoteDataSource {
  final SharedPrefsLocalDataSource localDataSource;
  final String baseUrl = AppConstants.baseUrl;

  TaskRemoteDataSource({required this.localDataSource});

  Future<Map<String, String>> _headers() async {
    final token = await localDataSource.getToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  Future<List<TaskModel>> getTasks() async {
    final headers = await _headers();
    final response = await http.get(
      Uri.parse('$baseUrl/tasks'),
      headers: headers,
    );
    // #region agent log
    final token = await localDataSource.getToken();
    dynamic firstAmount;
    dynamic firstAmountRuntimeType;
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final list = data['tasks'] as List;
      if (list.isNotEmpty) {
        firstAmount = list.first['amount'];
        firstAmountRuntimeType = firstAmount.runtimeType.toString();
      }
    }
    agentDebugLog(
      location: 'task_remote_datasource.dart:getTasks',
      message: 'getTasks response',
      hypothesisId: 'A,C',
      data: {
        'statusCode': response.statusCode,
        'hasAuthHeader': headers.containsKey('Authorization'),
        'tokenPresent': token != null,
        'taskCount': response.statusCode == 200
            ? (jsonDecode(response.body)['tasks'] as List).length
            : 0,
        'firstAmountType': firstAmountRuntimeType,
        'firstAmountValue': firstAmount?.toString(),
      },
    );
    // #endregion
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final list = data['tasks'] as List;
      return list.map((e) => TaskModel.fromJson(e)).toList();
    }
    throw Exception('Failed to load tasks');
  }

  Future<TaskModel> createTask(Map<String, dynamic> body) async {
    final response = await http.post(
      Uri.parse('$baseUrl/tasks'),
      headers: await _headers(),
      body: jsonEncode(body),
    );
    if (response.statusCode == 201) {
      final data = jsonDecode(response.body);
      return TaskModel.fromJson(data['task']);
    }
    throw Exception(jsonDecode(response.body)['error'] ?? 'Failed to create task');
  }

  Future<TaskModel> updateTask(int id, Map<String, dynamic> body) async {
    final response = await http.put(
      Uri.parse('$baseUrl/tasks/$id'),
      headers: await _headers(),
      body: jsonEncode(body),
    );
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return TaskModel.fromJson(data['task']);
    }
    throw Exception(jsonDecode(response.body)['error'] ?? 'Failed to update task');
  }

  Future<void> deleteTask(int id) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/tasks/$id'),
      headers: await _headers(),
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to delete task');
    }
  }
}
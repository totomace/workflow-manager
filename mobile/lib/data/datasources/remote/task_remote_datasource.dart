import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../core/constants/app_constants.dart';

abstract class TaskRemoteDataSource {
  Future<List<Map<String, dynamic>>> getTasks(String token);
  Future<Map<String, dynamic>> createTask(String token, Map<String, dynamic> data);
  Future<Map<String, dynamic>> updateTask(String token, int taskId, Map<String, dynamic> data);
  Future<void> deleteTask(String token, int taskId);
  Future<Map<String, dynamic>> getMoneyStats(String token, String period);
  Future<Map<String, dynamic>> getStatusStats(String token, String period);
}

class TaskRemoteDataSourceImpl implements TaskRemoteDataSource {
  final http.Client client;

  TaskRemoteDataSourceImpl(this.client);

  @override
  Future<List<Map<String, dynamic>>> getTasks(String token) async {
    final response = await client.get(
      Uri.parse('${AppConstants.baseUrl}/tasks'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return List<Map<String, dynamic>>.from(data['tasks']);
    } else {
      throw Exception('Không thể tải danh sách task');
    }
  }

  @override
  Future<Map<String, dynamic>> createTask(String token, Map<String, dynamic> data) async {
    final response = await client.post(
      Uri.parse('${AppConstants.baseUrl}/tasks'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(data),
    );
    if (response.statusCode == 201) {
      return jsonDecode(response.body)['task'];
    } else {
      throw Exception('Không thể tạo task');
    }
  }

  @override
  Future<Map<String, dynamic>> updateTask(String token, int taskId, Map<String, dynamic> data) async {
    final response = await client.put(
      Uri.parse('${AppConstants.baseUrl}/tasks/$taskId'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(data),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body)['task'];
    } else {
      throw Exception('Không thể cập nhật task');
    }
  }

  @override
  Future<void> deleteTask(String token, int taskId) async {
    final response = await client.delete(
      Uri.parse('${AppConstants.baseUrl}/tasks/$taskId'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );
    if (response.statusCode != 200) {
      throw Exception('Không thể xóa task');
    }
  }

  @override
  Future<Map<String, dynamic>> getMoneyStats(String token, String period) async {
    final response = await client.get(
      Uri.parse('${AppConstants.baseUrl}/tasks/stats/money?period=$period'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Không thể tải thống kê tiền');
    }
  }

  @override
  Future<Map<String, dynamic>> getStatusStats(String token, String period) async {
    final response = await client.get(
      Uri.parse('${AppConstants.baseUrl}/tasks/stats/status?period=$period'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Không thể tải thống kê trạng thái');
    }
  }
}
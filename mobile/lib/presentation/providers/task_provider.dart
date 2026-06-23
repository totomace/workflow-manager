import 'package:flutter/material.dart';
import 'package:taskflow_mobile/domain/entities/task.dart';
import 'package:taskflow_mobile/domain/usecases/task/get_tasks_usecase.dart';
import 'package:taskflow_mobile/domain/usecases/task/create_task_usecase.dart';
import 'package:taskflow_mobile/domain/usecases/task/update_task_usecase.dart';
import 'package:taskflow_mobile/domain/usecases/task/delete_task_usecase.dart';

class TaskProvider extends ChangeNotifier {
  final GetTasksUseCase getTasksUseCase;
  final CreateTaskUseCase createTaskUseCase;
  final UpdateTaskUseCase updateTaskUseCase;
  final DeleteTaskUseCase deleteTaskUseCase;

  List<TaskEntity> _tasks = [];
  bool _loading = false;
  String? _error;

  TaskProvider({
    required this.getTasksUseCase,
    required this.createTaskUseCase,
    required this.updateTaskUseCase,
    required this.deleteTaskUseCase,
  });

  List<TaskEntity> get tasks => _tasks;
  bool get loading => _loading;
  String? get error => _error;

  Future<void> fetchTasks() async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      _tasks = await getTasksUseCase();
    } catch (e) {
      _error = e.toString();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> createTask({
    required String title,
    String? description,
    String status = 'todo',
    double amount = 0,
    String? taskDate,
    String? startTime,
    String? endTime,
  }) async {
    try {
      final newTask = await createTaskUseCase(
        title: title,
        description: description,
        status: status,
        amount: amount,
        taskDate: taskDate,
        startTime: startTime,
        endTime: endTime,
      );
      _tasks.insert(0, newTask);
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  Future<void> updateTask({
    required int id,
    String? title,
    String? description,
    String? status,
    double? amount,
    String? taskDate,
    String? startTime,
    String? endTime,
  }) async {
    try {
      final updatedTask = await updateTaskUseCase(
        id: id,
        title: title,
        description: description,
        status: status,
        amount: amount,
        taskDate: taskDate,
        startTime: startTime,
        endTime: endTime,
      );
      final index = _tasks.indexWhere((t) => t.id == id);
      if (index != -1) {
        _tasks[index] = updatedTask;
        notifyListeners();
      }
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  Future<void> deleteTask(int id) async {
    try {
      await deleteTaskUseCase(id);
      _tasks.removeWhere((t) => t.id == id);
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }
}
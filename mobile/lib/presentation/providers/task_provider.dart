import 'package:flutter/material.dart';
import 'package:taskflow_mobile/core/utils/agent_debug_log.dart';
import 'package:taskflow_mobile/domain/entities/task.dart';
import 'package:taskflow_mobile/domain/usecases/task/get_tasks_usecase.dart';
import 'package:taskflow_mobile/domain/usecases/task/get_money_stats_usecase.dart';
import 'package:taskflow_mobile/domain/usecases/task/get_status_stats_usecase.dart';
import 'package:taskflow_mobile/domain/usecases/task/create_task_usecase.dart';
import 'package:taskflow_mobile/domain/usecases/task/update_task_usecase.dart';
import 'package:taskflow_mobile/domain/usecases/task/delete_task_usecase.dart';

class TaskProvider extends ChangeNotifier {
  final GetTasksUseCase getTasksUseCase;
  final GetMoneyStatsUseCase getMoneyStatsUseCase;
  final GetStatusStatsUseCase getStatusStatsUseCase;
  final CreateTaskUseCase createTaskUseCase;
  final UpdateTaskUseCase updateTaskUseCase;
  final DeleteTaskUseCase deleteTaskUseCase;

  List<TaskEntity> _tasks = [];
  double _moneyStats = 0;
  Map<String, int> _statusStats = {'todo': 0, 'in_progress': 0, 'done': 0};
  String _searchQuery = '';
  String _filterStatus = 'all';
  String _moneyPeriod = 'month';
  String _statusPeriod = 'month';
  bool _loading = false;
  String? _error;

  TaskProvider({
    required this.getTasksUseCase,
    required this.getMoneyStatsUseCase,
    required this.getStatusStatsUseCase,
    required this.createTaskUseCase,
    required this.updateTaskUseCase,
    required this.deleteTaskUseCase,
  });

  List<TaskEntity> get tasks => _tasks;
  List<TaskEntity> get filteredTasks {
    return _tasks.where((task) {
      final matchesSearch = _searchQuery.isEmpty ||
          task.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          (task.description ?? '').toLowerCase().contains(_searchQuery.toLowerCase());
      final matchesStatus = _filterStatus == 'all' || task.status == _filterStatus;
      return matchesSearch && matchesStatus;
    }).toList();
  }
  double get moneyStats => _moneyStats;
  Map<String, int> get statusStats => _statusStats;
  String get searchQuery => _searchQuery;
  String get filterStatus => _filterStatus;
  String get moneyPeriod => _moneyPeriod;
  String get statusPeriod => _statusPeriod;
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

  Future<void> fetchMoneyStats({String? period}) async {
    _moneyPeriod = period ?? _moneyPeriod;
    try {
      _moneyStats = await getMoneyStatsUseCase(period: _moneyPeriod);
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  Future<void> fetchStatusStats({String? period}) async {
    _statusPeriod = period ?? _statusPeriod;
    try {
      _statusStats = await getStatusStatsUseCase(period: _statusPeriod);
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  void setSearchQuery(String value) {
    _searchQuery = value;
    notifyListeners();
  }

  void setFilterStatus(String value) {
    _filterStatus = value;
    notifyListeners();
  }

  void setMoneyPeriod(String value) {
    _moneyPeriod = value;
    notifyListeners();
    fetchMoneyStats(period: value);
  }

  void setStatusPeriod(String value) {
    _statusPeriod = value;
    notifyListeners();
    fetchStatusStats(period: value);
  }

  Future<void> refreshStats() async {
    await Future.wait([
      fetchMoneyStats(period: _moneyPeriod),
      fetchStatusStats(period: _statusPeriod),
    ]);
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
      await refreshStats();
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
        await refreshStats();
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
      await refreshStats();
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  void applyRemoteCreate(TaskEntity task) {
    if (_tasks.any((t) => t.id == task.id)) return;
    _tasks.insert(0, task);
    // #region agent log
    agentDebugLog(
      location: 'task_provider.dart:applyRemoteCreate',
      message: 'applied remote task create',
      hypothesisId: 'H',
      runId: 'post-fix',
      data: {'taskId': task.id, 'taskCount': _tasks.length},
    );
    // #endregion
    notifyListeners();
  }

  void applyRemoteUpdate(TaskEntity task) {
    final index = _tasks.indexWhere((t) => t.id == task.id);
    if (index == -1) {
      _tasks.insert(0, task);
    } else {
      _tasks[index] = task;
    }
    // #region agent log
    agentDebugLog(
      location: 'task_provider.dart:applyRemoteUpdate',
      message: 'applied remote task update',
      hypothesisId: 'H',
      data: {'taskId': task.id, 'index': index},
    );
    // #endregion
    notifyListeners();
  }

  void applyRemoteDelete(int id) {
    _tasks.removeWhere((t) => t.id == id);
    // #region agent log
    agentDebugLog(
      location: 'task_provider.dart:applyRemoteDelete',
      message: 'applied remote task delete',
      hypothesisId: 'H',
      data: {'taskId': id, 'taskCount': _tasks.length},
    );
    // #endregion
    notifyListeners();
  }
}

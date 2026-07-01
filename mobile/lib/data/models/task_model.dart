import 'package:taskflow_mobile/core/utils/agent_debug_log.dart';
import 'package:taskflow_mobile/domain/entities/task.dart';

class TaskModel extends TaskEntity {
  TaskModel({
    required super.id,
    required super.title,
    super.description,
    required super.status,
    required super.amount,
    super.taskDate,
    super.startTime,
    super.endTime,
  });

  factory TaskModel.fromJson(Map<String, dynamic> json) {
    // #region agent log
    final rawAmount = json['amount'];
    agentDebugLog(
      location: 'task_model.dart:fromJson',
      message: 'parsing task amount',
      hypothesisId: 'A',
      data: {
        'taskId': json['id'],
        'amountRuntimeType': rawAmount?.runtimeType.toString(),
        'amountValue': rawAmount?.toString(),
      },
    );
    final parsedAmount = _parseAmount(json['amount']);
    // #endregion
    return TaskModel(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      status: json['status'],
      amount: parsedAmount,
      taskDate: json['task_date'],
      startTime: json['start_time'],
      endTime: json['end_time'],
    );
  }

  static double _parseAmount(dynamic value) {
    if (value == null) return 0;
    if (value is num) return value.toDouble();
    if (value is String) return double.tryParse(value) ?? 0;
    return 0;
  }
}
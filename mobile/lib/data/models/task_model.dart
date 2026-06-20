import '../../domain/entities/task.dart';

class TaskModel extends Task {
  TaskModel({
    required super.id,
    required super.title,
    super.description,
    required super.status,
    super.amount,
    super.taskDate,
    super.startTime,
    super.endTime,
    required super.createdAt,
  });

  factory TaskModel.fromJson(Map<String, dynamic> json) {
    return TaskModel(
      id: json['id'],
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      status: json['status'] ?? 'todo',
      amount: (json['amount'] ?? 0).toDouble(),
      taskDate: json['task_date'],
      startTime: json['start_time'],
      endTime: json['end_time'],
      createdAt: json['created_at'] ?? DateTime.now().toIso8601String(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'status': status,
      'amount': amount,
      'task_date': taskDate,
      'start_time': startTime,
      'end_time': endTime,
      'created_at': createdAt,
    };
  }
}
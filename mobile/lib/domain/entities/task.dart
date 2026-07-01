class TaskEntity {
  final int id;
  final String title;
  final String? description;
  final String status;
  final double amount;
  final String? taskDate;
  final String? startTime;
  final String? endTime;

  TaskEntity({
    required this.id,
    required this.title,
    this.description,
    required this.status,
    required this.amount,
    this.taskDate,
    this.startTime,
    this.endTime,
  });
}
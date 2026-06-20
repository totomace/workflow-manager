class Task {
  final int id;
  final String title;
  final String description;
  final String status;
  final double amount;
  final String? taskDate;
  final String? startTime;
  final String? endTime;
  final String createdAt;

  Task({
    required this.id,
    required this.title,
    this.description = '',
    required this.status,
    this.amount = 0.0,
    this.taskDate,
    this.startTime,
    this.endTime,
    required this.createdAt,
  });
}
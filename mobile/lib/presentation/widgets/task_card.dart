// lib/presentation/widgets/task_card.dart
import 'package:flutter/material.dart';
import 'package:taskflow_mobile/core/utils/formatters.dart';
import 'package:taskflow_mobile/domain/entities/task.dart';
import 'package:taskflow_mobile/core/theme/colors.dart';

class TaskCard extends StatelessWidget {
  final TaskEntity task;
  final VoidCallback? onTap;
  final VoidCallback? onDelete;

  const TaskCard({
    super.key,
    required this.task,
    this.onTap,
    this.onDelete,
  });

  Color _getStatusColor() {
    switch (task.status) {
      case 'todo':
        return AppColors.todo;
      case 'in_progress':
        return AppColors.inProgress;
      case 'done':
        return AppColors.done;
      default:
        return AppColors.todo;
    }
  }

  String _getStatusLabel() {
    switch (task.status) {
      case 'todo':
        return 'Cần làm';
      case 'in_progress':
        return 'Đang làm';
      case 'done':
        return 'Hoàn thành';
      default:
        return task.status;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 12,
                    height: 12,
                    decoration: BoxDecoration(shape: BoxShape.circle, color: _getStatusColor()),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      task.title,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600),
                    ),
                  ),
                  if (task.amount > 0)
                    Text(
                      Formatters.currency(task.amount),
                      style: TextStyle(color: AppColors.money, fontWeight: FontWeight.w500, fontSize: 13),
                    ),
                  if (onDelete != null)
                    IconButton(
                      icon: const Icon(Icons.delete_outline, size: 20),
                      onPressed: onDelete,
                      color: Colors.red,
                    ),
                ],
              ),
              if (task.description != null && task.description!.isNotEmpty) ...[
                const SizedBox(height: 8),
                Text(task.description!, style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Colors.grey)),
              ],
              const SizedBox(height: 8),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: _getStatusColor().withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(_getStatusLabel(), style: TextStyle(color: _getStatusColor(), fontSize: 12)),
                  ),
                  const Spacer(),
                  if (task.taskDate != null)
                    Text(Formatters.date(task.taskDate), style: const TextStyle(fontSize: 12, color: Colors.grey)),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
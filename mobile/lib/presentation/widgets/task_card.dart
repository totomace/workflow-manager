import 'package:flutter/material.dart';
import 'package:taskflow_mobile/core/theme/app_colors.dart';
import 'package:taskflow_mobile/core/utils/formatters.dart';
import 'package:taskflow_mobile/domain/entities/task.dart';

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

  Color _statusColor() {
    switch (task.status) {
      case 'in_progress':
        return AppColors.inProgress;
      case 'done':
        return AppColors.done;
      case 'todo':
      default:
        return AppColors.todo;
    }
  }

  LinearGradient _statusGradient() {
    switch (task.status) {
      case 'in_progress':
        return AppColors.inProgressGradient;
      case 'done':
        return AppColors.doneGradient;
      case 'todo':
      default:
        return AppColors.todoGradient;
    }
  }

  String _statusLabel() {
    switch (task.status) {
      case 'in_progress':
        return 'Dang lam';
      case 'done':
        return 'Hoan thanh';
      case 'todo':
      default:
        return 'Can lam';
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final background = isDark ? AppColors.darkCard : AppColors.lightCard;
    final borderColor = isDark ? AppColors.darkCardBorder : AppColors.lightCardBorder;

    return Card(
      margin: EdgeInsets.zero,
      color: background,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(color: borderColor),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      gradient: _statusGradient(),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: const Icon(Icons.task_alt, color: Colors.white, size: 22),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          task.title,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                fontWeight: FontWeight.w700,
                                color: Theme.of(context).colorScheme.onSurface,
                              ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          task.description?.isNotEmpty == true ? task.description! : 'No description',
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                color: isDark ? AppColors.textDarkSecondary : AppColors.textSecondary,
                              ),
                        ),
                      ],
                    ),
                  ),
                  if (task.amount > 0)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppColors.money.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: Text(
                        Formatters.currency(task.amount),
                        style: const TextStyle(
                          color: AppColors.money,
                          fontWeight: FontWeight.w700,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  if (onDelete != null)
                    IconButton(
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints.tightFor(width: 36, height: 36),
                      icon: const Icon(Icons.delete_outline, size: 20),
                      onPressed: onDelete,
                      color: Colors.redAccent,
                    ),
                ],
              ),
              const SizedBox(height: 14),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: _statusColor().withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(999),
                      border: Border.all(color: _statusColor().withValues(alpha: 0.18)),
                    ),
                    child: Text(
                      _statusLabel(),
                      style: TextStyle(
                        color: _statusColor(),
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  if (task.taskDate != null)
                    Text(
                      Formatters.date(task.taskDate),
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: isDark ? AppColors.textDarkSecondary : AppColors.textSecondary,
                          ),
                    ),
                  const Spacer(),
                  if (task.startTime != null || task.endTime != null)
                    Text(
                      [
                        if (task.startTime != null) task.startTime!.substring(0, 5),
                        if (task.startTime != null && task.endTime != null) ' - ',
                        if (task.endTime != null) task.endTime!.substring(0, 5),
                      ].join(),
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: isDark ? AppColors.textDarkSecondary : AppColors.textSecondary,
                          ),
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

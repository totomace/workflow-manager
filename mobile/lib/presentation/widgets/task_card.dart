// lib/presentation/widgets/task_card.dart
import 'package:flutter/material.dart';
import 'package:taskflow_mobile/core/theme/app_colors.dart';
import 'package:taskflow_mobile/core/utils/formatters.dart';
import 'package:taskflow_mobile/domain/entities/task.dart';

class TaskCard extends StatelessWidget {
  final TaskEntity task;
  final VoidCallback? onTap;
  final VoidCallback? onDelete;
  final VoidCallback? onEdit;

  const TaskCard({
    super.key,
    required this.task,
    this.onTap,
    this.onDelete,
    this.onEdit,
  });

  IconData _getStatusIcon() {
    switch (task.status) {
      case 'todo':
        return Icons.radio_button_unchecked_rounded;
      case 'in_progress':
        return Icons.schedule_rounded;
      case 'done':
        return Icons.check_circle_rounded;
      default:
        return Icons.radio_button_unchecked_rounded;
    }
  }

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

  Color _getStatusBgColor(bool isDark) {
    if (isDark) {
      switch (task.status) {
        case 'todo':
          return AppColors.todoBgDark;
        case 'in_progress':
          return AppColors.inProgressBgDark;
        case 'done':
          return AppColors.doneBgDark;
        default:
          return AppColors.todoBgDark;
      }
    } else {
      switch (task.status) {
        case 'todo':
          return AppColors.todoBg;
        case 'in_progress':
          return AppColors.inProgressBg;
        case 'done':
          return AppColors.doneBg;
        default:
          return AppColors.todoBg;
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final statusColor = _getStatusColor();

    return Container(
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCard : AppColors.lightCard,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isDark ? AppColors.darkCardBorder : AppColors.lightCardBorder,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.05 : 0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(20),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Status Icon
                Padding(
                  padding: const EdgeInsets.only(top: 2),
                  child: Icon(
                    _getStatusIcon(),
                    color: statusColor,
                    size: 20,
                  ),
                ),
                const SizedBox(width: 12),
                // Title and Info
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        task.title,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(
                              fontWeight: FontWeight.w600,
                              color: isDark ? AppColors.textLight : AppColors.textPrimary,
                            ),
                      ),
                      if (task.description != null && task.description!.isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text(
                          task.description!,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                color: isDark ? AppColors.textDarkSecondary : AppColors.textSecondary,
                              ),
                        ),
                      ],
                      const SizedBox(height: 8),
                      // Meta details (Date, Start Time, End Time)
                      Wrap(
                        spacing: 8,
                        runSpacing: 4,
                        crossAxisAlignment: WrapCrossAlignment.center,
                        children: [
                          if (task.taskDate != null && task.taskDate!.isNotEmpty)
                            Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  Icons.calendar_today_rounded,
                                  size: 12,
                                  color: isDark ? AppColors.textDarkSecondary : AppColors.textMuted,
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  Formatters.date(task.taskDate),
                                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                        color: isDark ? AppColors.textDarkSecondary : AppColors.textMuted,
                                      ),
                                ),
                              ],
                            ),
                          if (task.startTime != null && task.startTime!.isNotEmpty)
                            Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  Icons.access_time_rounded,
                                  size: 12,
                                  color: isDark ? AppColors.textDarkSecondary : AppColors.textMuted,
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  task.startTime!.substring(0, 5),
                                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                        color: isDark ? AppColors.textDarkSecondary : AppColors.textMuted,
                                      ),
                                ),
                                if (task.endTime != null && task.endTime!.isNotEmpty) ...[
                                  Text(
                                    ' → ',
                                    style: TextStyle(
                                      fontSize: 10,
                                      color: isDark ? AppColors.textDarkSecondary : AppColors.textMuted,
                                    ),
                                  ),
                                  Text(
                                    task.endTime!.substring(0, 5),
                                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                          color: isDark ? AppColors.textDarkSecondary : AppColors.textMuted,
                                        ),
                                  ),
                                ],
                              ],
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                // Actions & Status / Amount
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    if (task.amount > 0)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 6),
                        child: Text(
                          Formatters.currency(task.amount),
                          style: TextStyle(
                            color: isDark ? AppColors.moneyDark : AppColors.money,
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                        ),
                      ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: _getStatusBgColor(isDark),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        _getStatusLabel(),
                        style: TextStyle(
                          color: statusColor,
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        if (onEdit != null)
                          IconButton(
                            icon: const Icon(Icons.edit_outlined, size: 18),
                            padding: EdgeInsets.zero,
                            constraints: const BoxConstraints(),
                            onPressed: onEdit,
                            color: isDark ? AppColors.textDarkSecondary : AppColors.textSecondary,
                            splashRadius: 16,
                          ),
                        if (onEdit != null && onDelete != null) const SizedBox(width: 8),
                        if (onDelete != null)
                          IconButton(
                            icon: const Icon(Icons.delete_outline_rounded, size: 18),
                            padding: EdgeInsets.zero,
                            constraints: const BoxConstraints(),
                            onPressed: onDelete,
                            color: AppColors.error,
                            splashRadius: 16,
                          ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

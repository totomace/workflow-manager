import 'package:flutter/material.dart';
import 'package:taskflow_mobile/domain/entities/task.dart';

class TaskCard extends StatelessWidget {
  final TaskEntity task;
  final VoidCallback onTap;
  final VoidCallback onDelete;

  const TaskCard({
    super.key,
    required this.task,
    required this.onTap,
    required this.onDelete,
  });

  Color _statusColor() {
    switch (task.status) {
      case 'done':
        return Colors.green;
      case 'in_progress':
        return Colors.orange;
      default:
        return Colors.grey;
    }
  }

  String _statusLabel() {
    switch (task.status) {
      case 'done':
        return 'Hoàn thành';
      case 'in_progress':
        return 'Đang làm';
      default:
        return 'Cần làm';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        onTap: onTap,
        title: Text(task.title, style: const TextStyle(fontWeight: FontWeight.w600)),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (task.description != null && task.description!.isNotEmpty)
              Text(task.description!, maxLines: 2, overflow: TextOverflow.ellipsis),
            const SizedBox(height: 4),
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: _statusColor().withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(_statusLabel(), style: TextStyle(fontSize: 12, color: _statusColor())),
                ),
                const SizedBox(width: 8),
                if (task.amount > 0)
                  Text('${task.amount}đ', style: const TextStyle(fontWeight: FontWeight.w600, color: Colors.green)),
              ],
            ),
          ],
        ),
        trailing: IconButton(
          icon: const Icon(Icons.delete, color: Colors.red),
          onPressed: onDelete,
        ),
      ),
    );
  }
}
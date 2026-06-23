// lib/presentation/screens/task_detail/task_detail_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:taskflow_mobile/presentation/providers/task_provider.dart';
import 'package:taskflow_mobile/domain/entities/task.dart';
import 'package:taskflow_mobile/core/theme/colors.dart';

class TaskDetailScreen extends StatefulWidget {
  final TaskEntity? task;

  const TaskDetailScreen({super.key, this.task});

  @override
  State<TaskDetailScreen> createState() => _TaskDetailScreenState();
}

class _TaskDetailScreenState extends State<TaskDetailScreen> {
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _amountController = TextEditingController();
  String _status = 'todo';
  DateTime? _taskDate;
  TimeOfDay? _startTime;
  TimeOfDay? _endTime;

  bool get isEditing => widget.task != null;

  @override
  void initState() {
    super.initState();
    if (isEditing) {
      final task = widget.task!;
      _titleController.text = task.title;
      _descriptionController.text = task.description ?? '';
      _amountController.text = task.amount > 0 ? (task.amount / 1000).toString() : '';
      _status = task.status;
      if (task.taskDate != null) {
        _taskDate = DateTime.tryParse(task.taskDate!);
      }
      if (task.startTime != null) {
        final parts = task.startTime!.split(':');
        _startTime = TimeOfDay(hour: int.parse(parts[0]), minute: int.parse(parts[1]));
      }
      if (task.endTime != null) {
        final parts = task.endTime!.split(':');
        _endTime = TimeOfDay(hour: int.parse(parts[0]), minute: int.parse(parts[1]));
      }
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _amountController.dispose();
    super.dispose();
  }

  Future<void> _saveTask() async {
    final title = _titleController.text.trim();
    if (title.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Vui lòng nhập tiêu đề')));
      return;
    }

    final amount = double.tryParse(_amountController.text.replaceAll(RegExp(r'[^0-9]'), '')) ?? 0;
    final amountMultiplied = amount * 1000;

    final taskProvider = context.read<TaskProvider>();

    if (isEditing) {
      await taskProvider.updateTask(
        id: widget.task!.id,
        title: title,
        description: _descriptionController.text.trim(),
        status: _status,
        amount: amountMultiplied,
        taskDate: _taskDate?.toIso8601String().split('T')[0],
        startTime: _startTime != null ? '${_startTime!.hour.toString().padLeft(2, '0')}:${_startTime!.minute.toString().padLeft(2, '0')}' : null,
        endTime: _endTime != null ? '${_endTime!.hour.toString().padLeft(2, '0')}:${_endTime!.minute.toString().padLeft(2, '0')}' : null,
      );
    } else {
      await taskProvider.createTask(
        title: title,
        description: _descriptionController.text.trim(),
        status: _status,
        amount: amountMultiplied,
        taskDate: _taskDate?.toIso8601String().split('T')[0],
        startTime: _startTime != null ? '${_startTime!.hour.toString().padLeft(2, '0')}:${_startTime!.minute.toString().padLeft(2, '0')}' : null,
        endTime: _endTime != null ? '${_endTime!.hour.toString().padLeft(2, '0')}:${_endTime!.minute.toString().padLeft(2, '0')}' : null,
      );
    }

    if (!mounted) return;
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(isEditing ? 'Chỉnh sửa task' : 'Thêm task mới'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
              controller: _titleController,
              decoration: const InputDecoration(labelText: 'Tiêu đề'),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _descriptionController,
              decoration: const InputDecoration(labelText: 'Mô tả'),
              maxLines: 3,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _amountController,
              decoration: const InputDecoration(labelText: 'Tiền (VNĐ)'),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: InkWell(
                    onTap: () async {
                      final date = await showDatePicker(
                        context: context,
                        initialDate: _taskDate ?? DateTime.now(),
                        firstDate: DateTime(2020),
                        lastDate: DateTime(2030),
                      );
                      if (date != null) setState(() => _taskDate = date);
                    },
                    child: InputDecorator(
                      decoration: const InputDecoration(labelText: 'Ngày làm'),
                      child: Text(_taskDate != null ? '${_taskDate!.day}/${_taskDate!.month}/${_taskDate!.year}' : 'Chọn ngày'),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: InkWell(
                    onTap: () async {
                      final time = await showTimePicker(context: context, initialTime: _startTime ?? TimeOfDay.now());
                      if (time != null) setState(() => _startTime = time);
                    },
                    child: InputDecorator(
                      decoration: const InputDecoration(labelText: 'Giờ bắt đầu'),
                      child: Text(_startTime != null ? '${_startTime!.hour}:${_startTime!.minute.toString().padLeft(2, '0')}' : 'Chọn giờ'),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: InkWell(
                    onTap: () async {
                      final time = await showTimePicker(context: context, initialTime: _endTime ?? TimeOfDay.now());
                      if (time != null) setState(() => _endTime = time);
                    },
                    child: InputDecorator(
                      decoration: const InputDecoration(labelText: 'Giờ kết thúc'),
                      child: Text(_endTime != null ? '${_endTime!.hour}:${_endTime!.minute.toString().padLeft(2, '0')}' : 'Chọn giờ'),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: _status,
              decoration: const InputDecoration(labelText: 'Trạng thái'),
              items: const [
                DropdownMenuItem(value: 'todo', child: Text('Cần làm')),
                DropdownMenuItem(value: 'in_progress', child: Text('Đang làm')),
                DropdownMenuItem(value: 'done', child: Text('Hoàn thành')),
              ],
              onChanged: (value) => setState(() => _status = value!),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _saveTask,
              child: Text(isEditing ? 'Cập nhật' : 'Thêm mới'),
            ),
          ],
        ),
      ),
    );
  }
}
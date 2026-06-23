import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:taskflow_mobile/presentation/providers/task_provider.dart';
import 'package:taskflow_mobile/presentation/widgets/custom_text_field.dart';
import 'package:taskflow_mobile/presentation/widgets/custom_button.dart';
import 'package:taskflow_mobile/domain/entities/task.dart';

class TaskDetailScreen extends StatefulWidget {
  final TaskEntity? task;
  const TaskDetailScreen({super.key, this.task});

  @override
  State<TaskDetailScreen> createState() => _TaskDetailScreenState();
}

class _TaskDetailScreenState extends State<TaskDetailScreen> {
  late final TextEditingController _titleController;
  late final TextEditingController _descController;
  late final TextEditingController _amountController;
  String _status = 'todo';
  final _formKey = GlobalKey<FormState>();

  bool get isEditing => widget.task != null;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController(text: widget.task?.title ?? '');
    _descController = TextEditingController(text: widget.task?.description ?? '');
    _amountController = TextEditingController(
      text: widget.task != null && widget.task!.amount > 0
          ? (widget.task!.amount ~/ 1000).toString()
          : '',
    );
    _status = widget.task?.status ?? 'todo';
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descController.dispose();
    _amountController.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;

    final taskProvider = context.read<TaskProvider>();
    final amount = int.tryParse(_amountController.text) ?? 0;

    if (isEditing) {
      await taskProvider.updateTask(
        id: widget.task!.id,
        title: _titleController.text.trim(),
        description: _descController.text.trim(),
        status: _status,
        amount: (amount * 1000).toDouble(),
      );
    } else {
      await taskProvider.createTask(
        title: _titleController.text.trim(),
        description: _descController.text.trim(),
        status: _status,
        amount: (amount * 1000).toDouble(),
      );
    }

    if (mounted) Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(isEditing ? 'Chỉnh sửa task' : 'Thêm task mới')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              CustomTextField(
                controller: _titleController,
                label: 'Tiêu đề',
                hint: 'Nhập tiêu đề',
                validator: (v) => (v == null || v.isEmpty) ? 'Vui lòng nhập tiêu đề' : null,
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _descController,
                label: 'Mô tả',
                hint: 'Nhập mô tả',
                maxLines: 3,
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _amountController,
                label: 'Tiền (VNĐ)',
                hint: 'Gõ số, tự thêm 000',
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _status,
                decoration: const InputDecoration(
                  labelText: 'Trạng thái',
                  border: OutlineInputBorder(),
                ),
                items: const [
                  DropdownMenuItem(value: 'todo', child: Text('Cần làm')),
                  DropdownMenuItem(value: 'in_progress', child: Text('Đang làm')),
                  DropdownMenuItem(value: 'done', child: Text('Hoàn thành')),
                ],
                onChanged: (v) => setState(() => _status = v!),
              ),
              const SizedBox(height: 24),
              Consumer<TaskProvider>(
                builder: (_, taskProvider, __) {
                  return CustomButton(
                    text: isEditing ? 'Cập nhật' : 'Thêm mới',
                    onPressed: taskProvider.loading ? null : _save,
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
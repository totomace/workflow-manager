// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:taskflow_mobile/core/theme/app_colors.dart';
import 'package:taskflow_mobile/core/utils/formatters.dart';
import 'package:taskflow_mobile/domain/entities/task.dart';
import 'package:taskflow_mobile/presentation/providers/task_provider.dart';

class TaskDetailScreen extends StatefulWidget {
  final TaskEntity? task;

  const TaskDetailScreen({super.key, this.task});

  @override
  State<TaskDetailScreen> createState() => _TaskDetailScreenState();
}

class _TaskDetailScreenState extends State<TaskDetailScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _amountController = TextEditingController();
  final _amountFocusNode = FocusNode();

  String _status = 'todo';
  DateTime? _taskDate;
  TimeOfDay? _startTime;
  TimeOfDay? _endTime;
  String _displayAmount = '';

  bool get isEditing => widget.task != null;

  @override
  void initState() {
    super.initState();
    final task = widget.task;
    if (task != null) {
      _titleController.text = task.title;
      _descriptionController.text = task.description ?? '';
      _status = task.status;
      _taskDate = task.taskDate != null ? DateTime.tryParse(task.taskDate!) : null;
      _startTime = _parseTime(task.startTime);
      _endTime = _parseTime(task.endTime);
      if (task.amount > 0) {
        _setAmount(task.amount);
      }
    }

    _amountFocusNode.addListener(() {
      if (!_amountFocusNode.hasFocus) {
        _syncAmountLabel();
      }
    });
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _amountController.dispose();
    _amountFocusNode.dispose();
    super.dispose();
  }

  TimeOfDay? _parseTime(String? value) {
    if (value == null || value.isEmpty) return null;
    final parts = value.split(':');
    if (parts.length < 2) return null;
    return TimeOfDay(hour: int.tryParse(parts[0]) ?? 0, minute: int.tryParse(parts[1]) ?? 0);
  }

  String _formatTime(TimeOfDay? time) {
    if (time == null) return '';
    return '${time.hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}';
  }

  void _setAmount(double amount) {
    _amountController.text = (amount / 1000).toStringAsFixed(0);
    _displayAmount = Formatters.currency(amount);
  }

  void _syncAmountLabel() {
    final digits = _amountController.text.replaceAll(RegExp(r'[^0-9]'), '');
    final amount = double.tryParse(digits.isEmpty ? '0' : digits) ?? 0;
    _displayAmount = amount > 0 ? Formatters.currency(amount) : '';
    setState(() {});
  }

  Future<void> _saveTask() async {
    if (!_formKey.currentState!.validate()) return;

    final amountValue = double.tryParse(_amountController.text.replaceAll(RegExp(r'[^0-9]'), '')) ?? 0;
    final amount = amountValue * 1000;
    final taskProvider = context.read<TaskProvider>();

    if (isEditing) {
      await taskProvider.updateTask(
        id: widget.task!.id,
        title: _titleController.text.trim(),
        description: _descriptionController.text.trim(),
        status: _status,
        amount: amount,
        taskDate: _taskDate?.toIso8601String().split('T')[0],
        startTime: _formatTime(_startTime),
        endTime: _formatTime(_endTime),
      );
    } else {
      await taskProvider.createTask(
        title: _titleController.text.trim(),
        description: _descriptionController.text.trim(),
        status: _status,
        amount: amount,
        taskDate: _taskDate?.toIso8601String().split('T')[0],
        startTime: _formatTime(_startTime),
        endTime: _formatTime(_endTime),
      );
    }

    if (!mounted) return;
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final surfaceColor = isDark ? AppColors.darkCard : AppColors.lightCard;

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: isDark ? AppColors.backgroundGradientDark : AppColors.backgroundGradient,
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    IconButton(
                      onPressed: () => Navigator.pop(context),
                      icon: const Icon(Icons.arrow_back),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      isEditing ? 'Chinh sua task' : 'Them task moi',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            fontWeight: FontWeight.w800,
                            color: isDark ? AppColors.textLight : AppColors.textPrimary,
                          ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: surfaceColor,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: isDark ? AppColors.darkCardBorder : AppColors.lightCardBorder),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: isDark ? 0.1 : 0.04),
                        blurRadius: 24,
                        offset: const Offset(0, 16),
                      ),
                    ],
                  ),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _SectionTitle(title: 'Thong tin co ban', subtitle: 'Nhap noi dung, so tien va trang thai cong viec.'),
                        const SizedBox(height: 16),
                        TextFormField(
                          controller: _titleController,
                          decoration: const InputDecoration(labelText: 'Tieu de', prefixIcon: Icon(Icons.title_rounded)),
                          validator: (value) => value == null || value.trim().isEmpty ? 'Vui long nhap tieu de' : null,
                        ),
                        const SizedBox(height: 14),
                        TextFormField(
                          controller: _descriptionController,
                          decoration: const InputDecoration(labelText: 'Mo ta', prefixIcon: Icon(Icons.notes_rounded)),
                          maxLines: 3,
                        ),
                        const SizedBox(height: 14),
                        TextFormField(
                          controller: _amountController,
                          focusNode: _amountFocusNode,
                          keyboardType: TextInputType.number,
                          decoration: InputDecoration(
                            labelText: 'Tien (nghin VND)',
                            prefixIcon: const Icon(Icons.payments_rounded),
                            helperText: _displayAmount.isEmpty ? 'Gia tri se duoc nhan voi 1000 khi luu' : _displayAmount,
                          ),
                          onChanged: (value) {
                            final digits = value.replaceAll(RegExp(r'[^0-9]'), '');
                            _amountController.value = TextEditingValue(
                              text: digits,
                              selection: TextSelection.collapsed(offset: digits.length),
                            );
                            setState(() {
                              _displayAmount = digits.isEmpty ? '' : Formatters.currency((int.tryParse(digits) ?? 0) * 1000);
                            });
                          },
                        ),
                        const SizedBox(height: 16),
                        _SectionTitle(title: 'Lich lam viec', subtitle: 'Chon ngay va khung gio phu hop.'),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(
                              child: _DateField(
                                label: 'Ngay lam',
                                value: _taskDate == null ? 'Chon ngay' : Formatters.date(_taskDate!.toIso8601String()),
                                onTap: () async {
                                  final date = await showDatePicker(
                                    context: context,
                                    initialDate: _taskDate ?? DateTime.now(),
                                    firstDate: DateTime(2020),
                                    lastDate: DateTime(2035),
                                  );
                                  if (date != null) {
                                    setState(() => _taskDate = date);
                                  }
                                },
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: _TimeField(
                                label: 'Bat dau',
                                value: _startTime == null ? 'Chon gio' : _formatTime(_startTime),
                                onTap: () async {
                                  final time = await showTimePicker(
                                    context: context,
                                    initialTime: _startTime ?? TimeOfDay.now(),
                                  );
                                  if (time != null) {
                                    setState(() => _startTime = time);
                                  }
                                },
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        _TimeField(
                          label: 'Ket thuc',
                          value: _endTime == null ? 'Chon gio' : _formatTime(_endTime),
                          onTap: () async {
                            final time = await showTimePicker(
                              context: context,
                              initialTime: _endTime ?? TimeOfDay.now(),
                            );
                            if (time != null) {
                              setState(() => _endTime = time);
                            }
                          },
                        ),
                        const SizedBox(height: 16),
                        DropdownButtonFormField<String>(
                          value: _status,
                          decoration: const InputDecoration(labelText: 'Trang thai', prefixIcon: Icon(Icons.flag_outlined)),
                          items: const [
                            DropdownMenuItem(value: 'todo', child: Text('Can lam')),
                            DropdownMenuItem(value: 'in_progress', child: Text('Dang lam')),
                            DropdownMenuItem(value: 'done', child: Text('Hoan thanh')),
                          ],
                          onChanged: (value) => setState(() => _status = value ?? 'todo'),
                        ),
                        const SizedBox(height: 20),
                        Row(
                          children: [
                            Expanded(
                              child: ElevatedButton.icon(
                                onPressed: _saveTask,
                                icon: Icon(isEditing ? Icons.save_outlined : Icons.add_rounded),
                                label: Text(isEditing ? 'Cap nhat' : 'Them moi'),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String title;
  final String subtitle;

  const _SectionTitle({required this.title, required this.subtitle});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
        const SizedBox(height: 2),
        Text(subtitle, style: Theme.of(context).textTheme.bodySmall),
      ],
    );
  }
}

class _DateField extends StatelessWidget {
  final String label;
  final String value;
  final VoidCallback onTap;

  const _DateField({required this.label, required this.value, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: InputDecorator(
        decoration: InputDecoration(labelText: label, prefixIcon: const Icon(Icons.calendar_month_rounded)),
        child: Text(value),
      ),
    );
  }
}

class _TimeField extends StatelessWidget {
  final String label;
  final String value;
  final VoidCallback onTap;

  const _TimeField({required this.label, required this.value, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: InputDecorator(
        decoration: InputDecoration(labelText: label, prefixIcon: const Icon(Icons.schedule_rounded)),
        child: Text(value),
      ),
    );
  }
}


// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables
import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:taskflow_mobile/core/network/socket_service.dart';
import 'package:taskflow_mobile/core/theme/app_colors.dart';
import 'package:taskflow_mobile/core/utils/formatters.dart';
import 'package:taskflow_mobile/domain/entities/task.dart';
import 'package:taskflow_mobile/presentation/providers/auth_provider.dart';
import 'package:taskflow_mobile/presentation/providers/task_provider.dart';
import 'package:taskflow_mobile/presentation/screens/login/login_screen.dart';
import 'package:taskflow_mobile/presentation/screens/profile/profile_screen.dart';
import 'package:taskflow_mobile/presentation/screens/task_detail/task_detail_screen.dart';
import 'package:taskflow_mobile/presentation/widgets/stats_card.dart';
import 'package:taskflow_mobile/presentation/widgets/task_card.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> with WidgetsBindingObserver {
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadData();
      _connectSocket();
    });
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _searchController.dispose();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      _connectSocket();
    }
  }

  Future<void> _loadData() async {
    final taskProvider = context.read<TaskProvider>();
    await Future.wait([
      taskProvider.fetchTasks(),
      taskProvider.fetchMoneyStats(period: 'month'),
      taskProvider.fetchStatusStats(period: 'month'),
    ]);
  }

  void _connectSocket() {
    if (!mounted) return;
    context.read<SocketService>().connect(context.read<TaskProvider>());
  }

  Future<void> _logout() async {
    context.read<SocketService>().disconnect();
    await context.read<AuthProvider>().logout();
    if (!mounted) return;
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const LoginScreen()),
    );
  }

  String _periodLabel(String value) {
    switch (value) {
      case 'week':
        return '7 ngay qua';
      case 'month':
        return '30 ngay qua';
      case 'year':
        return 'Nam nay';
      default:
        return 'Tat ca';
    }
  }

  List<PieChartSectionData> _pieSections(Map<String, int> stats) {
    final sections = <MapEntry<String, int>>[
      MapEntry('todo', stats['todo'] ?? 0),
      MapEntry('in_progress', stats['in_progress'] ?? 0),
      MapEntry('done', stats['done'] ?? 0),
    ];

    return sections.asMap().entries.map((entry) {
      final item = entry.value;
      final color = _statusColor(item.key);
      return PieChartSectionData(
        color: color,
        value: item.value.toDouble(),
        title: item.value == 0 ? '' : '${item.value}',
        radius: 70,
        titleStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Colors.white),
      );
    }).toList();
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'in_progress':
        return AppColors.inProgress;
      case 'done':
        return AppColors.done;
      case 'todo':
      default:
        return AppColors.todo;
    }
  }

  Future<void> _openTask(TaskEntity task) async {
    await Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => TaskDetailScreen(task: task)),
    );
  }

  Future<void> _confirmDelete(TaskEntity task) async {
    final shouldDelete = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Xoa task'),
        content: Text('Ban co muon xoa "${task.title}" khong?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext, false),
            child: const Text('Huy'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(dialogContext, true),
            child: const Text('Xoa', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );

    if (shouldDelete == true && mounted) {
      await context.read<TaskProvider>().deleteTask(task.id);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final taskProvider = context.watch<TaskProvider>();
    final authProvider = context.watch<AuthProvider>();
    final filteredTasks = taskProvider.filteredTasks;

    return Scaffold(
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const TaskDetailScreen()),
          );
        },
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add_rounded),
        label: const Text('Task moi'),
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: isDark ? AppColors.backgroundGradientDark : AppColors.backgroundGradient,
        ),
        child: SafeArea(
          child: RefreshIndicator(
            onRefresh: _loadData,
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'TaskFlow',
                              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                                    fontWeight: FontWeight.w800,
                                    color: isDark ? AppColors.textLight : AppColors.textPrimary,
                                  ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              authProvider.user?.email ?? 'Dang tai thong tin tai khoan',
                              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                    color: isDark ? AppColors.textDarkSecondary : AppColors.textSecondary,
                                  ),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const ProfileScreen()),
                          );
                        },
                        icon: const Icon(Icons.person_outline_rounded),
                      ),
                      IconButton(
                        onPressed: _logout,
                        icon: const Icon(Icons.logout_rounded),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  LayoutBuilder(
                    builder: (context, constraints) {
                      final crossAxisCount = constraints.maxWidth >= 700 ? 3 : 2;
                      return GridView.count(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        crossAxisCount: crossAxisCount,
                        mainAxisSpacing: 12,
                        crossAxisSpacing: 12,
                        childAspectRatio: 1.15,
                        children: [
                          StatsCard(
                            title: 'Tong task',
                            value: '${taskProvider.tasks.length}',
                            icon: Icons.task_alt_rounded,
                            color: AppColors.primary,
                            gradient: AppColors.totalGradient,
                            subtitle: 'Tat ca cac task',
                          ),
                          StatsCard(
                            title: 'Tien',
                            value: Formatters.currency(taskProvider.moneyStats),
                            icon: Icons.payments_rounded,
                            color: AppColors.money,
                            gradient: AppColors.moneyGradient,
                            subtitle: _periodLabel(taskProvider.moneyPeriod),
                          ),
                          StatsCard(
                            title: 'Can lam',
                            value: '${taskProvider.statusStats['todo'] ?? 0}',
                            icon: Icons.radio_button_unchecked_rounded,
                            color: AppColors.todo,
                            gradient: AppColors.todoGradient,
                          ),
                          StatsCard(
                            title: 'Dang lam',
                            value: '${taskProvider.statusStats['in_progress'] ?? 0}',
                            icon: Icons.schedule_rounded,
                            color: AppColors.inProgress,
                            gradient: AppColors.inProgressGradient,
                          ),
                          StatsCard(
                            title: 'Hoan thanh',
                            value: '${taskProvider.statusStats['done'] ?? 0}',
                            icon: Icons.check_circle_rounded,
                            color: AppColors.done,
                            gradient: AppColors.doneGradient,
                          ),
                        ],
                      );
                    },
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.darkCard : AppColors.lightCard,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: isDark ? AppColors.darkCardBorder : AppColors.lightCardBorder),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Thong ke trang thai',
                                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                        fontWeight: FontWeight.w800,
                                        color: isDark ? AppColors.textLight : AppColors.textPrimary,
                                      ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  _periodLabel(taskProvider.statusPeriod),
                                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                        color: isDark ? AppColors.textDarkSecondary : AppColors.textMuted,
                                      ),
                                ),
                              ],
                            ),
                            DropdownButtonHideUnderline(
                              child: DropdownButton<String>(
                                value: taskProvider.statusPeriod,
                                onChanged: (value) {
                                  if (value != null) {
                                    taskProvider.setStatusPeriod(value);
                                  }
                                },
                                items: const [
                                  DropdownMenuItem(value: 'week', child: Text('7 ngay')),
                                  DropdownMenuItem(value: 'month', child: Text('30 ngay')),
                                  DropdownMenuItem(value: 'year', child: Text('Nam nay')),
                                  DropdownMenuItem(value: 'all', child: Text('Tat ca')),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        SizedBox(
                          height: 220,
                          child: taskProvider.statusStats.values.every((value) => value == 0)
                              ? Center(
                                  child: Text(
                                    'Chua co du lieu de hien thi',
                                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                          color: isDark ? AppColors.textDarkSecondary : AppColors.textSecondary,
                                        ),
                                  ),
                                )
                              : Row(
                                  children: [
                                    Expanded(
                                      child: PieChart(
                                        PieChartData(
                                          sectionsSpace: 3,
                                          centerSpaceRadius: 48,
                                          sections: _pieSections(taskProvider.statusStats),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    Column(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        _LegendDot(label: 'Can lam', color: AppColors.todo),
                                        const SizedBox(height: 10),
                                        _LegendDot(label: 'Dang lam', color: AppColors.inProgress),
                                        const SizedBox(height: 10),
                                        _LegendDot(label: 'Hoan thanh', color: AppColors.done),
                                      ],
                                    ),
                                  ],
                                ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.darkCard : AppColors.lightCard,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: isDark ? AppColors.darkCardBorder : AppColors.lightCardBorder),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text(
                                'Danh sach task (${filteredTasks.length})',
                                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                      fontWeight: FontWeight.w800,
                                      color: isDark ? AppColors.textLight : AppColors.textPrimary,
                                    ),
                              ),
                            ),
                            DropdownButtonHideUnderline(
                              child: DropdownButton<String>(
                                value: taskProvider.filterStatus,
                                onChanged: (value) {
                                  if (value != null) {
                                    taskProvider.setFilterStatus(value);
                                  }
                                },
                                items: const [
                                  DropdownMenuItem(value: 'all', child: Text('Tat ca')),
                                  DropdownMenuItem(value: 'todo', child: Text('Can lam')),
                                  DropdownMenuItem(value: 'in_progress', child: Text('Dang lam')),
                                  DropdownMenuItem(value: 'done', child: Text('Hoan thanh')),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        TextField(
                          controller: _searchController,
                          onChanged: taskProvider.setSearchQuery,
                          decoration: const InputDecoration(
                            labelText: 'Tim kiem',
                            prefixIcon: Icon(Icons.search_rounded),
                          ),
                        ),
                        const SizedBox(height: 16),
                        DropdownButtonHideUnderline(
                          child: DropdownButton<String>(
                            value: taskProvider.moneyPeriod,
                            onChanged: (value) {
                              if (value != null) {
                                taskProvider.setMoneyPeriod(value);
                              }
                            },
                            items: const [
                              DropdownMenuItem(value: 'week', child: Text('Tien 7 ngay')),
                              DropdownMenuItem(value: 'month', child: Text('Tien 30 ngay')),
                              DropdownMenuItem(value: 'year', child: Text('Tien nam nay')),
                              DropdownMenuItem(value: 'all', child: Text('Tien tat ca')),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),
                        if (taskProvider.loading && taskProvider.tasks.isEmpty)
                          const Padding(
                            padding: EdgeInsets.symmetric(vertical: 32),
                            child: Center(child: CircularProgressIndicator()),
                          )
                        else if (filteredTasks.isEmpty)
                          Padding(
                            padding: const EdgeInsets.symmetric(vertical: 32),
                            child: Center(
                              child: Text(
                                taskProvider.tasks.isEmpty
                                    ? 'Chua co task nao. Hay tao task dau tien!'
                                    : 'Khong tim thay task phu hop.',
                                textAlign: TextAlign.center,
                                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                      color: isDark ? AppColors.textDarkSecondary : AppColors.textSecondary,
                                    ),
                              ),
                            ),
                          )
                        else
                          ListView.separated(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: filteredTasks.length,
                            separatorBuilder: (_, __) => const SizedBox(height: 12),
                            itemBuilder: (context, index) {
                              final task = filteredTasks[index];
                              return TaskCard(
                                task: task,
                                onTap: () => _openTask(task),
                                onDelete: () => _confirmDelete(task),
                              );
                            },
                          ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 80),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _LegendDot extends StatelessWidget {
  final String label;
  final Color color;

  const _LegendDot({required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(width: 10, height: 10, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
        const SizedBox(width: 8),
        Text(label),
      ],
    );
  }
}


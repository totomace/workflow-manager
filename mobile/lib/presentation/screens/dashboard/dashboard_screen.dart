import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:taskflow_mobile/presentation/providers/auth_provider.dart';
import 'package:taskflow_mobile/presentation/providers/task_provider.dart';
import 'package:taskflow_mobile/presentation/screens/task_detail/task_detail_screen.dart';
import 'package:taskflow_mobile/presentation/screens/profile/profile_screen.dart';
import 'package:taskflow_mobile/presentation/widgets/task_card.dart';
import 'package:taskflow_mobile/presentation/widgets/stats_card.dart';
import 'package:taskflow_mobile/domain/entities/task.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<TaskProvider>().fetchTasks();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('TaskFlow'),
        actions: [
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ProfileScreen())),
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => context.read<AuthProvider>().logout(),
          ),
        ],
      ),
      body: Consumer<TaskProvider>(
        builder: (_, taskProvider, __) {
          if (taskProvider.loading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (taskProvider.error != null) {
            return Center(child: Text(taskProvider.error!));
          }

          final tasks = taskProvider.tasks;

          return RefreshIndicator(
            onRefresh: () => taskProvider.fetchTasks(),
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                // Stats Cards
                Row(
                  children: [
                    Expanded(
                      child: StatsCard(
                        title: 'Tổng task',
                        value: tasks.length.toString(),
                        icon: Icons.task_alt,
                        color: Colors.purple,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: StatsCard(
                        title: 'Hoàn thành',
                        value: tasks.where((t) => t.status == 'done').length.toString(),
                        icon: Icons.check_circle,
                        color: Colors.green,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: StatsCard(
                        title: 'Đang làm',
                        value: tasks.where((t) => t.status == 'in_progress').length.toString(),
                        icon: Icons.hourglass_empty,
                        color: Colors.orange,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: StatsCard(
                        title: 'Cần làm',
                        value: tasks.where((t) => t.status == 'todo').length.toString(),
                        icon: Icons.radio_button_unchecked,
                        color: Colors.grey,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                // Task List Header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Danh sách task (${tasks.length})',
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    IconButton(
                      icon: const Icon(Icons.add_circle, color: Colors.deepPurple),
                      onPressed: () => Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const TaskDetailScreen()),
                      ).then((_) => taskProvider.fetchTasks()),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                // Task List
                if (tasks.isEmpty)
                  const Padding(
                    padding: EdgeInsets.all(32),
                    child: Center(child: Text('Chưa có task nào')),
                  )
                else
                  ...tasks.map(
                    (task) => TaskCard(
                      task: task,
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => TaskDetailScreen(task: task)),
                      ).then((_) => taskProvider.fetchTasks()),
                      onDelete: () async {
                        await taskProvider.deleteTask(task.id);
                      },
                    ),
                  ),
              ],
            ),
          );
        },
      ),
    );
  }
}
// lib/presentation/screens/dashboard/dashboard_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:taskflow_mobile/presentation/providers/task_provider.dart';
import 'package:taskflow_mobile/presentation/providers/auth_provider.dart';
import 'package:taskflow_mobile/presentation/widgets/task_card.dart';
import 'package:taskflow_mobile/presentation/screens/login/login_screen.dart';
import 'package:taskflow_mobile/presentation/screens/task_detail/task_detail_screen.dart';
import 'package:taskflow_mobile/presentation/screens/profile/profile_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  @override
  void initState() {
    super.initState();
    // Tải tasks khi mở màn hình
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
            icon: const Icon(Icons.person_outline),
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const ProfileScreen()));
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await context.read<AuthProvider>().logout();
              if (!mounted) return;
              Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
            },
          ),
        ],
      ),
      body: Consumer<TaskProvider>(
        builder: (context, taskProvider, _) {
          if (taskProvider.loading) {
            return const Center(child: CircularProgressIndicator());
          }
          if (taskProvider.error != null) {
            return Center(child: Text('Lỗi: ${taskProvider.error}'));
          }
          if (taskProvider.tasks.isEmpty) {
            return const Center(child: Text('Chưa có task nào'));
          }
          return RefreshIndicator(
            onRefresh: () => taskProvider.fetchTasks(),
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: taskProvider.tasks.length,
              itemBuilder: (context, index) {
                final task = taskProvider.tasks[index];
                return TaskCard(
                  task: task,
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => TaskDetailScreen(task: task),
                      ),
                    );
                  },
                  onDelete: () {
                    showDialog(
                      context: context,
                      builder: (ctx) => AlertDialog(
                        title: const Text('Xóa task'),
                        content: const Text('Bạn có chắc muốn xóa task này?'),
                        actions: [
                          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Hủy')),
                          TextButton(
                            onPressed: () {
                              taskProvider.deleteTask(task.id);
                              Navigator.pop(ctx);
                            },
                            child: const Text('Xóa', style: TextStyle(color: Colors.red)),
                          ),
                        ],
                      ),
                    );
                  },
                );
              },
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(context, MaterialPageRoute(builder: (_) => const TaskDetailScreen()));
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}
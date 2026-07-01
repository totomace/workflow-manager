// lib/presentation/screens/dashboard/dashboard_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:taskflow_mobile/core/network/socket_service.dart';
import 'package:taskflow_mobile/core/utils/agent_debug_log.dart';
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

class _DashboardScreenState extends State<DashboardScreen>
    with WidgetsBindingObserver {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _connectSocket();
      context.read<TaskProvider>().fetchTasks();
    });
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  /// Được gọi khi trạng thái app lifecycle thay đổi.
  /// Khi app resume từ background, đảm bảo socket vẫn connected.
  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      _connectSocket();
      // #region agent log
      agentDebugLog(
        location: 'dashboard_screen.dart:didChangeAppLifecycleState',
        message: 'app resumed — ensuring socket connection',
        hypothesisId: 'F',
        runId: 'post-fix',
        data: {},
      );
      // #endregion
    }
  }

  /// Kết nối socket với taskProvider hiện tại.
  /// An toàn để gọi nhiều lần — socket_service xử lý trường hợp đã kết nối
  /// và luôn cập nhật _taskProvider reference trước khi kiểm tra.
  void _connectSocket() {
    if (!mounted) return;
    final taskProvider = context.read<TaskProvider>();
    final socketService = context.read<SocketService>();
    socketService.connect(taskProvider);
    // #region agent log
    agentDebugLog(
      location: 'dashboard_screen.dart:_connectSocket',
      message: 'socket connect called',
      hypothesisId: 'F',
      runId: 'post-fix',
      data: {'socketConnected': socketService.isConnected},
    );
    // #endregion
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
              context.read<SocketService>().disconnect();
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
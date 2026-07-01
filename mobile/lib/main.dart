import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:taskflow_mobile/core/network/socket_service.dart';
import 'package:taskflow_mobile/core/theme/app_theme.dart';
import 'package:taskflow_mobile/data/datasources/local/shared_prefs_local_datasource.dart';
import 'package:taskflow_mobile/data/datasources/remote/auth_remote_datasource.dart';
import 'package:taskflow_mobile/data/datasources/remote/task_remote_datasource.dart';
import 'package:taskflow_mobile/data/datasources/remote/user_remote_datasource.dart';
import 'package:taskflow_mobile/data/repositories/auth_repository_impl.dart';
import 'package:taskflow_mobile/data/repositories/task_repository_impl.dart';
import 'package:taskflow_mobile/data/repositories/user_repository_impl.dart';
import 'package:taskflow_mobile/domain/usecases/auth/login_usecase.dart';
import 'package:taskflow_mobile/domain/usecases/auth/register_usecase.dart';
import 'package:taskflow_mobile/domain/usecases/auth/google_login_usecase.dart';
import 'package:taskflow_mobile/domain/usecases/task/get_tasks_usecase.dart';
import 'package:taskflow_mobile/domain/usecases/task/get_money_stats_usecase.dart';
import 'package:taskflow_mobile/domain/usecases/task/get_status_stats_usecase.dart';
import 'package:taskflow_mobile/domain/usecases/task/create_task_usecase.dart';
import 'package:taskflow_mobile/domain/usecases/task/update_task_usecase.dart';
import 'package:taskflow_mobile/domain/usecases/task/delete_task_usecase.dart';
import 'package:taskflow_mobile/domain/usecases/user/get_profile_usecase.dart';
import 'package:taskflow_mobile/domain/usecases/user/update_profile_usecase.dart';
import 'package:taskflow_mobile/domain/usecases/user/change_password_usecase.dart';
import 'package:taskflow_mobile/presentation/providers/auth_provider.dart';
import 'package:taskflow_mobile/presentation/providers/task_provider.dart';
import 'package:taskflow_mobile/presentation/providers/user_provider.dart';
import 'package:taskflow_mobile/presentation/screens/splash/splash_screen.dart';

void main() {
  // Khởi tạo DataSources
  final localDataSource = SharedPrefsLocalDataSource();
  final authRemoteDataSource = AuthRemoteDataSource(localDataSource: localDataSource);
  final taskRemoteDataSource = TaskRemoteDataSource(localDataSource: localDataSource);
  final userRemoteDataSource = UserRemoteDataSource(localDataSource: localDataSource);

  // Khởi tạo Repositories (sửa tham số thành `remote` và `local`)
  final authRepository = AuthRepositoryImpl(remote: authRemoteDataSource, local: localDataSource);
  final taskRepository = TaskRepositoryImpl(remote: taskRemoteDataSource, local: localDataSource);
  final userRepository = UserRepositoryImpl(remote: userRemoteDataSource, local: localDataSource);

  // Khởi tạo UseCases
  final loginUseCase = LoginUseCase(authRepository);
  final registerUseCase = RegisterUseCase(authRepository);
  final googleLoginUseCase = GoogleLoginUseCase(authRepository);
  final getTasksUseCase = GetTasksUseCase(taskRepository);
  final getMoneyStatsUseCase = GetMoneyStatsUseCase(taskRepository);
  final getStatusStatsUseCase = GetStatusStatsUseCase(taskRepository);
  final createTaskUseCase = CreateTaskUseCase(taskRepository);
  final updateTaskUseCase = UpdateTaskUseCase(taskRepository);
  final deleteTaskUseCase = DeleteTaskUseCase(taskRepository);
  final getProfileUseCase = GetProfileUseCase(userRepository);
  final updateProfileUseCase = UpdateProfileUseCase(userRepository);
  final changePasswordUseCase = ChangePasswordUseCase(userRepository);

  final socketService = SocketService();

  runApp(
    MultiProvider(
      providers: [
        Provider<SocketService>.value(value: socketService),
        ChangeNotifierProvider(
          create: (_) => AuthProvider(
            loginUseCase: loginUseCase,
            registerUseCase: registerUseCase,
            googleLoginUseCase: googleLoginUseCase,
          ),
        ),
        ChangeNotifierProvider(
          create: (_) => TaskProvider(
            getTasksUseCase: getTasksUseCase,
            getMoneyStatsUseCase: getMoneyStatsUseCase,
            getStatusStatsUseCase: getStatusStatsUseCase,
            createTaskUseCase: createTaskUseCase,
            updateTaskUseCase: updateTaskUseCase,
            deleteTaskUseCase: deleteTaskUseCase,
          ),
        ),
        ChangeNotifierProvider(
          create: (_) => UserProvider(
            getProfileUseCase: getProfileUseCase,
            updateProfileUseCase: updateProfileUseCase,
            changePasswordUseCase: changePasswordUseCase,
          ),
        ),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TaskFlow',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      home: const SplashScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

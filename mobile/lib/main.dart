import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
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
  // Data Sources
  final authRemoteDS = AuthRemoteDataSource();
  final taskRemoteDS = TaskRemoteDataSource();
  final userRemoteDS = UserRemoteDataSource();
  final localDS = SharedPrefsLocalDataSource();

  // Repositories
  final authRepo = AuthRepositoryImpl(authRemoteDS, localDS);
  final taskRepo = TaskRepositoryImpl(taskRemoteDS);
  final userRepo = UserRepositoryImpl(userRemoteDS);

  // Usecases
  final loginUC = LoginUseCase(authRepo);
  final registerUC = RegisterUseCase(authRepo);
  final googleLoginUC = GoogleLoginUseCase(authRepo);
  final getTasksUC = GetTasksUseCase(taskRepo);
  final createTaskUC = CreateTaskUseCase(taskRepo);
  final updateTaskUC = UpdateTaskUseCase(taskRepo);
  final deleteTaskUC = DeleteTaskUseCase(taskRepo);
  final getProfileUC = GetProfileUseCase(userRepo);
  final updateProfileUC = UpdateProfileUseCase(userRepo);
  final changePasswordUC = ChangePasswordUseCase(userRepo);

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider(
          loginUseCase: loginUC,
          registerUseCase: registerUC,
          googleLoginUseCase: googleLoginUC,
        )),
        ChangeNotifierProvider(create: (_) => TaskProvider(
          getTasksUseCase: getTasksUC,
          createTaskUseCase: createTaskUC,
          updateTaskUseCase: updateTaskUC,
          deleteTaskUseCase: deleteTaskUC,
        )),
        ChangeNotifierProvider(create: (_) => UserProvider(
          getProfileUseCase: getProfileUC,
          updateProfileUseCase: updateProfileUC,
          changePasswordUseCase: changePasswordUC,
        )),
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
      theme: ThemeData(
        primarySwatch: Colors.deepPurple,
        inputDecorationTheme: InputDecorationTheme(
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        ),
      ),
      home: const SplashScreen(),
    );
  }
}
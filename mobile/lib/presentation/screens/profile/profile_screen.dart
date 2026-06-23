import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:taskflow_mobile/presentation/providers/user_provider.dart';
import 'package:taskflow_mobile/presentation/widgets/custom_text_field.dart';
import 'package:taskflow_mobile/presentation/widgets/custom_button.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late final TextEditingController _fullNameController;
  late final TextEditingController _currentPasswordController;
  late final TextEditingController _newPasswordController;

  @override
  void initState() {
    super.initState();
    _fullNameController = TextEditingController();
    _currentPasswordController = TextEditingController();
    _newPasswordController = TextEditingController();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<UserProvider>().fetchProfile();
    });
  }

  @override
  void dispose() {
    _fullNameController.dispose();
    _currentPasswordController.dispose();
    _newPasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Hồ sơ')),
      body: Consumer<UserProvider>(
        builder: (_, userProvider, __) {
          if (userProvider.loading) {
            return const Center(child: CircularProgressIndicator());
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                const Icon(Icons.account_circle, size: 80, color: Colors.deepPurple),
                const SizedBox(height: 16),
                Text(userProvider.user?.email ?? '', style: const TextStyle(fontSize: 16)),
                const SizedBox(height: 24),
                CustomTextField(
                  controller: _fullNameController,
                  label: 'Họ tên',
                  hint: userProvider.user?.fullName ?? 'Nhập họ tên',
                ),
                const SizedBox(height: 16),
                CustomButton(
                  text: 'Cập nhật hồ sơ',
                  onPressed: () => userProvider.updateProfile(_fullNameController.text),
                ),
                const SizedBox(height: 32),
                const Divider(),
                const SizedBox(height: 16),
                const Text('Đổi mật khẩu', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 16),
                CustomTextField(
                  controller: _currentPasswordController,
                  label: 'Mật khẩu hiện tại',
                  obscureText: true,
                ),
                const SizedBox(height: 16),
                CustomTextField(
                  controller: _newPasswordController,
                  label: 'Mật khẩu mới',
                  obscureText: true,
                ),
                const SizedBox(height: 16),
                CustomButton(
                  text: 'Đổi mật khẩu',
                  onPressed: () => userProvider.changePassword(
                    _currentPasswordController.text,
                    _newPasswordController.text,
                  ),
                ),
                if (userProvider.successMessage != null) ...[
                  const SizedBox(height: 16),
                  Text(userProvider.successMessage!, style: const TextStyle(color: Colors.green)),
                ],
                if (userProvider.error != null) ...[
                  const SizedBox(height: 16),
                  Text(userProvider.error!, style: const TextStyle(color: Colors.red)),
                ],
              ],
            ),
          );
        },
      ),
    );
  }
}
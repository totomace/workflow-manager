// lib/presentation/screens/profile/profile_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:taskflow_mobile/presentation/providers/user_provider.dart';
import 'package:taskflow_mobile/core/utils/validators.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _fullNameController = TextEditingController();
  final _currentPasswordController = TextEditingController();
  final _newPasswordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _showPasswordForm = false;

  @override
  void initState() {
    super.initState();
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
        builder: (context, userProvider, _) {
          if (userProvider.loading) {
            return const Center(child: CircularProgressIndicator());
          }
          final user = userProvider.user;
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const CircleAvatar(radius: 40, child: Icon(Icons.person, size: 40)),
                  const SizedBox(height: 16),
                  Text(user?.email ?? '', textAlign: TextAlign.center, style: Theme.of(context).textTheme.bodyLarge),
                  const SizedBox(height: 24),
                  TextFormField(
                    controller: _fullNameController..text = user?.fullName ?? '',
                    decoration: const InputDecoration(labelText: 'Họ tên'),
                    validator: Validators.fullName,
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () async {
                      if (_formKey.currentState!.validate()) {
                        await userProvider.updateProfile(_fullNameController.text.trim());
                        if (!mounted) return;
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Cập nhật thành công!')),
                        );
                      }
                    },
                    child: const Text('Cập nhật hồ sơ'),
                  ),
                  const SizedBox(height: 24),
                  if (!_showPasswordForm)
                    TextButton(
                      onPressed: () => setState(() => _showPasswordForm = true),
                      child: const Text('Đổi mật khẩu'),
                    ),
                  if (_showPasswordForm) ...[
                    TextFormField(
                      controller: _currentPasswordController,
                      decoration: const InputDecoration(labelText: 'Mật khẩu hiện tại'),
                      obscureText: true,
                      validator: Validators.password,
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _newPasswordController,
                      decoration: const InputDecoration(labelText: 'Mật khẩu mới'),
                      obscureText: true,
                      validator: Validators.password,
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () async {
                        if (_formKey.currentState!.validate()) {
                          await userProvider.changePassword(
                            _currentPasswordController.text.trim(),
                            _newPasswordController.text.trim(),
                          );
                          if (!mounted) return;
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Đổi mật khẩu thành công!')),
                          );
                          setState(() => _showPasswordForm = false);
                        }
                      },
                      child: const Text('Đổi mật khẩu'),
                    ),
                  ],
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
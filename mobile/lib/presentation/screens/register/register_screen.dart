import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:taskflow_mobile/presentation/providers/auth_provider.dart';
import 'package:taskflow_mobile/presentation/screens/dashboard/dashboard_screen.dart';
import 'package:taskflow_mobile/presentation/widgets/custom_text_field.dart';
import 'package:taskflow_mobile/presentation/widgets/custom_button.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _fullNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _fullNameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _register() async {
    if (!_formKey.currentState!.validate()) return;

    final authProvider = context.read<AuthProvider>();
    await authProvider.register(
      _emailController.text.trim(),
      _passwordController.text.trim(),
      _fullNameController.text.trim(),
    );

    if (!mounted) return;

    if (authProvider.isLoggedIn) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const DashboardScreen()),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(authProvider.error ?? 'Đăng ký thất bại'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF7C3AED), Color(0xFF4F46E5)],
                      ),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Icon(Icons.task_alt, color: Colors.white, size: 36),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Tạo tài khoản',
                    style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  const Text('Bắt đầu quản lý công việc của bạn', style: TextStyle(color: Colors.grey)),
                  const SizedBox(height: 32),
                  CustomTextField(
                    controller: _fullNameController,
                    label: 'Họ tên',
                    hint: 'Nguyễn Văn A',
                    prefixIcon: Icons.person_outline,
                    validator: (v) => (v == null || v.isEmpty) ? 'Vui lòng nhập họ tên' : null,
                  ),
                  const SizedBox(height: 16),
                  CustomTextField(
                    controller: _emailController,
                    label: 'Email',
                    hint: 'your@email.com',
                    prefixIcon: Icons.email_outlined,
                    validator: (v) => (v == null || v.isEmpty) ? 'Vui lòng nhập email' : null,
                  ),
                  const SizedBox(height: 16),
                  CustomTextField(
                    controller: _passwordController,
                    label: 'Mật khẩu',
                    hint: '••••••••',
                    prefixIcon: Icons.lock_outlined,
                    obscureText: _obscurePassword,
                    suffixIcon: IconButton(
                      icon: Icon(_obscurePassword ? Icons.visibility_off : Icons.visibility),
                      onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                    ),
                    validator: (v) => (v == null || v.isEmpty) ? 'Vui lòng nhập mật khẩu' : null,
                  ),
                  const SizedBox(height: 24),
                  Consumer<AuthProvider>(
                    builder: (_, auth, __) {
                      return CustomButton(
                        text: auth.loading ? 'Đang đăng ký...' : 'Đăng ký',
                        onPressed: auth.loading ? null : _register,
                      );
                    },
                  ),
                  const SizedBox(height: 16),
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Đã có tài khoản? Đăng nhập'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
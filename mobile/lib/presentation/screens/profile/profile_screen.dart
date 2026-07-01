import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:taskflow_mobile/core/theme/app_colors.dart';
import 'package:taskflow_mobile/core/utils/validators.dart';
import 'package:taskflow_mobile/presentation/providers/auth_provider.dart';
import 'package:taskflow_mobile/presentation/providers/user_provider.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _fullNameController = TextEditingController();
  final _currentPasswordController = TextEditingController();
  final _newPasswordController = TextEditingController();
  final _profileFormKey = GlobalKey<FormState>();
  final _passwordFormKey = GlobalKey<FormState>();
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

  Future<void> _logout() async {
    await context.read<AuthProvider>().logout();
    if (!mounted) return;
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: isDark ? AppColors.backgroundGradientDark : AppColors.backgroundGradient,
        ),
        child: SafeArea(
          child: Consumer<UserProvider>(
            builder: (context, userProvider, _) {
              final user = userProvider.user;
              if (user != null && _fullNameController.text.isEmpty) {
                _fullNameController.text = user.fullName;
              }

              if (userProvider.loading && user == null) {
                return const Center(child: CircularProgressIndicator());
              }

              return SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        IconButton(
                          onPressed: () => Navigator.pop(context),
                          icon: const Icon(Icons.arrow_back_rounded),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Ho so cua toi',
                          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                                fontWeight: FontWeight.w800,
                                color: isDark ? AppColors.textLight : AppColors.textPrimary,
                              ),
                        ),
                        const Spacer(),
                        TextButton(
                          onPressed: _logout,
                          child: const Text('Dang xuat'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: isDark ? AppColors.darkCard : AppColors.lightCard,
                        borderRadius: BorderRadius.circular(28),
                        border: Border.all(color: isDark ? AppColors.darkCardBorder : AppColors.lightCardBorder),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 76,
                            height: 76,
                            decoration: const BoxDecoration(
                              gradient: AppColors.avatarGradient,
                              shape: BoxShape.circle,
                            ),
                            child: Center(
                              child: Text(
                                (user?.email.isNotEmpty == true ? user!.email[0] : 'W').toUpperCase(),
                                style: const TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.w800),
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  user?.fullName.isNotEmpty == true ? user!.fullName : 'TaskFlow user',
                                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                        fontWeight: FontWeight.w800,
                                        color: isDark ? AppColors.textLight : AppColors.textPrimary,
                                      ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  user?.email ?? '',
                                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                        color: isDark ? AppColors.textDarkSecondary : AppColors.textSecondary,
                                      ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: isDark ? AppColors.darkCard : AppColors.lightCard,
                        borderRadius: BorderRadius.circular(28),
                        border: Border.all(color: isDark ? AppColors.darkCardBorder : AppColors.lightCardBorder),
                      ),
                      child: Form(
                        key: _profileFormKey,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Thong tin ho so',
                              style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800),
                            ),
                            const SizedBox(height: 16),
                            TextFormField(
                              initialValue: user?.email ?? '',
                              enabled: false,
                              decoration: const InputDecoration(
                                labelText: 'Email',
                                prefixIcon: Icon(Icons.mail_outline_rounded),
                              ),
                            ),
                            const SizedBox(height: 14),
                            TextFormField(
                              controller: _fullNameController,
                              validator: Validators.fullName,
                              decoration: const InputDecoration(
                                labelText: 'Ho va ten',
                                prefixIcon: Icon(Icons.badge_outlined),
                              ),
                            ),
                            const SizedBox(height: 16),
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton.icon(
                                onPressed: userProvider.loading
                                    ? null
                                    : () async {
                                        final messenger = ScaffoldMessenger.of(context);
                                        if (!_profileFormKey.currentState!.validate()) return;
                                        await userProvider.updateProfile(_fullNameController.text.trim());
                                        if (!mounted) return;
                                        messenger.showSnackBar(
                                          const SnackBar(content: Text('Cap nhat ho so thanh cong')),
                                        );
                                      },
                                icon: userProvider.loading
                                    ? const SizedBox(
                                        width: 18,
                                        height: 18,
                                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                                      )
                                    : const Icon(Icons.save_outlined),
                                label: const Text('Cap nhat ho so'),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: isDark ? AppColors.darkCard : AppColors.lightCard,
                        borderRadius: BorderRadius.circular(28),
                        border: Border.all(color: isDark ? AppColors.darkCardBorder : AppColors.lightCardBorder),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                'Doi mat khau',
                                style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800),
                              ),
                              const Spacer(),
                              TextButton(
                                onPressed: () => setState(() => _showPasswordForm = !_showPasswordForm),
                                child: Text(_showPasswordForm ? 'An' : 'Mo rong'),
                              ),
                            ],
                          ),
                          AnimatedCrossFade(
                            firstChild: const SizedBox.shrink(),
                            secondChild: Form(
                              key: _passwordFormKey,
                              child: Column(
                                children: [
                                  TextFormField(
                                    controller: _currentPasswordController,
                                    obscureText: true,
                                    validator: Validators.password,
                                    decoration: const InputDecoration(
                                      labelText: 'Mat khau hien tai',
                                      prefixIcon: Icon(Icons.lock_outline_rounded),
                                    ),
                                  ),
                                  const SizedBox(height: 14),
                                  TextFormField(
                                    controller: _newPasswordController,
                                    obscureText: true,
                                    validator: Validators.password,
                                    decoration: const InputDecoration(
                                      labelText: 'Mat khau moi',
                                      prefixIcon: Icon(Icons.lock_reset_rounded),
                                    ),
                                  ),
                                  const SizedBox(height: 16),
                                  SizedBox(
                                    width: double.infinity,
                                  child: ElevatedButton.icon(
                                      onPressed: userProvider.loading
                                          ? null
                                          : () async {
                                              final messenger = ScaffoldMessenger.of(context);
                                              if (!_passwordFormKey.currentState!.validate()) return;
                                              await userProvider.changePassword(
                                                _currentPasswordController.text.trim(),
                                                _newPasswordController.text.trim(),
                                              );
                                              if (!mounted) return;
                                              _currentPasswordController.clear();
                                              _newPasswordController.clear();
                                              setState(() => _showPasswordForm = false);
                                              messenger.showSnackBar(
                                                const SnackBar(content: Text('Doi mat khau thanh cong')),
                                              );
                                            },
                                      icon: const Icon(Icons.lock_reset_rounded),
                                      label: const Text('Cap nhat mat khau'),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            crossFadeState: _showPasswordForm ? CrossFadeState.showSecond : CrossFadeState.showFirst,
                            duration: const Duration(milliseconds: 250),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}

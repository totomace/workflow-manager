class Validators {
  static String? email(String? value) {
    if (value == null || value.isEmpty) return 'Vui lòng nhập email';
    final emailRegex = RegExp(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
    if (!emailRegex.hasMatch(value)) return 'Email không hợp lệ';
    return null;
  }

  static String? password(String? value) {
    if (value == null || value.isEmpty) return 'Vui lòng nhập mật khẩu';
    if (value.length < 6) return 'Mật khẩu ít nhất 6 ký tự';
    return null;
  }

  static String? fullName(String? value) {
    if (value == null || value.isEmpty) return 'Vui lòng nhập họ tên';
    if (value.length < 2) return 'Họ tên ít nhất 2 ký tự';
    return null;
  }
}
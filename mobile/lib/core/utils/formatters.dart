import 'package:intl/intl.dart';

class Formatters {
  static String currency(double value) {
    final format = NumberFormat('#,##0', 'vi_VN');
    return '${format.format(value)} ₫';
  }

  static String date(String? dateString) {
    if (dateString == null || dateString.isEmpty) return '';
    final date = DateTime.tryParse(dateString);
    if (date == null) return '';
    return DateFormat('dd/MM/yyyy').format(date);
  }
}
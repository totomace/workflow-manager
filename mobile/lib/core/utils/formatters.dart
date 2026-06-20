import 'package:intl/intl.dart';

class Formatters {
  static String currency(double value) {
    return NumberFormat.currency(locale: 'vi_VN', symbol: '₫').format(value);
  }

  static String numberWithCommas(double value) {
    return NumberFormat('#,###', 'vi_VN').format(value);
  }

  static String date(String? dateString) {
    if (dateString == null || dateString.isEmpty) return '';
    final date = DateTime.parse(dateString);
    return DateFormat('dd/MM/yyyy').format(date);
  }

  static String time(String? timeString) {
    if (timeString == null || timeString.isEmpty) return '';
    return timeString.substring(0, 5);
  }
}
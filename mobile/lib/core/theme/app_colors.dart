import 'package:flutter/material.dart';

class AppColors {
  static const Color primary = Color(0xFF7C3AED);
  static const Color primaryLight = Color(0xFFA78BFA);
  static const Color primaryDark = Color(0xFF5B21B6);
  static const Color secondary = Color(0xFF4F46E5);

  static const Color lightBg = Color(0xFFF0F9FF);
  static const Color darkBg = Color(0xFF111827);
  static const Color lightBgStart = Color(0xFFF0F9FF);
  static const Color lightBgMid = Color(0xFFFFFFFF);
  static const Color lightBgEnd = Color(0xFFF5F3FF);
  static const Color darkBgStart = Color(0xFF111827);
  static const Color darkBgMid = Color(0xFF1F2937);
  static const Color darkBgEnd = Color(0xFF111827);

  static const Color blurViolet = Color(0xFFDDD6FE);
  static const Color blurSky = Color(0xFFBAE6FD);
  static const Color blurVioletDark = Color(0xFF4C1D95);
  static const Color blurSkyDark = Color(0xFF075985);

  static const Color lightCard = Color(0xFFFFFFFF);
  static const Color darkCard = Color(0xFF1F2937);
  static const Color lightCardBorder = Color(0xFFE5E7EB);
  static const Color darkCardBorder = Color(0xFF374151);
  static const Color subtleBorder = Color(0xFFF3F4F6);
  static const Color subtleBorderDark = Color(0xFF303949);

  static const Color textPrimary = Color(0xFF111827);
  static const Color textSecondary = Color(0xFF6B7280);
  static const Color textMuted = Color(0xFF9CA3AF);
  static const Color textLight = Color(0xFFF9FAFB);
  static const Color textDarkSecondary = Color(0xFF9CA3AF);

  static const Color todo = Color(0xFF9CA3AF);
  static const Color inProgress = Color(0xFFF59E0B);
  static const Color done = Color(0xFF10B981);

  static const Color todoBg = Color(0xFFF3F4F6);
  static const Color inProgressBg = Color(0xFFFEF3C7);
  static const Color doneBg = Color(0xFFD1FAE5);
  static const Color todoBgDark = Color(0xFF374151);
  static const Color inProgressBgDark = Color(0xFF451A03);
  static const Color doneBgDark = Color(0xFF064E3B);

  static const Color money = Color(0xFF10B981);
  static const Color moneyDark = Color(0xFF34D399);
  static const Color error = Color(0xFFEF4444);

  static const Color inputFill = Color(0xFFF9FAFB);
  static const Color inputFillDark = Color(0xFF374151);
  static const Color inputBorder = Color(0xFFE5E7EB);
  static const Color inputBorderDark = Color(0xFF4B5563);
  static const Color inputFocusBorder = Color(0xFF7C3AED);

  static const LinearGradient backgroundGradient = LinearGradient(
    colors: [lightBgStart, lightBgMid, lightBgEnd],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient backgroundGradientDark = LinearGradient(
    colors: [darkBgStart, darkBgMid, darkBgEnd],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient primaryGradient = LinearGradient(
    colors: [Color(0xFF7C3AED), Color(0xFF4F46E5)],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );

  static const LinearGradient softPrimaryGradient = LinearGradient(
    colors: [Color(0xFFEDE9FE), Color(0xFFE0E7FF)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient avatarGradient = LinearGradient(
    colors: [Color(0xFF8B5CF6), Color(0xFF4F46E5)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient todoGradient = LinearGradient(
    colors: [Color(0xFF9CA3AF), Color(0xFF6B7280)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient inProgressGradient = LinearGradient(
    colors: [Color(0xFFFBBF24), Color(0xFFF97316)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient doneGradient = LinearGradient(
    colors: [Color(0xFF34D399), Color(0xFF10B981)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient moneyGradient = LinearGradient(
    colors: [Color(0xFF34D399), Color(0xFF059669)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient totalGradient = LinearGradient(
    colors: [Color(0xFF8B5CF6), Color(0xFF7C3AED)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient surfaceGradient = LinearGradient(
    colors: [Color(0xFFFFFFFF), Color(0xFFF8FAFC)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );
}

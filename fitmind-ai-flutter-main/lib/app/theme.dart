import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class FitMindColors {
  static const bg = Color(0xFF0B1220);
  static const surface = Color(0xFF0F1A2E);
  static const surface2 = Color(0xFF111F38);

  static const neonGreen = Color(0xFF2DFF8A);
  static const neonBlue = Color(0xFF2DD9FF);

  static const text = Color(0xFFEAF1FF);
  static const textMuted = Color(0xFF9FB2D8);
  static const danger = Color(0xFFFF4D6D);
}

class FitMindTheme {
  static ThemeData dark({required bool useMaterial3}) {
    final base = ThemeData(
      brightness: Brightness.dark,
      useMaterial3: useMaterial3,
      colorScheme: ColorScheme.fromSeed(
        seedColor: FitMindColors.neonBlue,
        brightness: Brightness.dark,
        surface: FitMindColors.surface,
      ).copyWith(
        primary: FitMindColors.neonBlue,
        secondary: FitMindColors.neonGreen,
        surface: FitMindColors.surface,
      ),
      scaffoldBackgroundColor: FitMindColors.bg,
    );

    return base.copyWith(
      textTheme: GoogleFonts.interTextTheme(base.textTheme).apply(
        bodyColor: FitMindColors.text,
        displayColor: FitMindColors.text,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: false,
      ),
      cardTheme: CardThemeData(
        color: FitMindColors.surface.withAlpha((0.55 * 255).round()),
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: FitMindColors.surface2.withAlpha((0.7 * 255).round()),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: Colors.white.withAlpha((0.08 * 255).round())),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: Colors.white.withAlpha((0.08 * 255).round())),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: FitMindColors.neonBlue, width: 1.2),
        ),
        hintStyle: const TextStyle(color: FitMindColors.textMuted),
      ),
    );
  }

  static ThemeData light({required bool useMaterial3}) {
    final base = ThemeData(
      brightness: Brightness.light,
      useMaterial3: useMaterial3,
      colorScheme: ColorScheme.fromSeed(
        seedColor: FitMindColors.neonBlue,
        brightness: Brightness.light,
      ).copyWith(
        primary: FitMindColors.neonBlue,
        secondary: FitMindColors.neonGreen,
      ),
      scaffoldBackgroundColor: const Color(0xFFF6F8FF),
    );

    return base.copyWith(
      textTheme: GoogleFonts.interTextTheme(base.textTheme),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: false,
      ),
      cardTheme: CardThemeData(
        color: Colors.white.withAlpha((0.80 * 255).round()),
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: Colors.black.withAlpha((0.08 * 255).round())),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: Colors.black.withAlpha((0.08 * 255).round())),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: FitMindColors.neonBlue, width: 1.2),
        ),
      ),
    );
  }
}

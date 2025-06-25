import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ThemeProvider extends ChangeNotifier {
  static const String _themeKey = 'theme_mode';
  bool _isDarkMode = false;

  bool get isDarkMode => _isDarkMode;

  ThemeProvider() {
    _loadThemeMode();
  }

  Future<void> _loadThemeMode() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      _isDarkMode = prefs.getBool(_themeKey) ?? false;
      notifyListeners();
    } catch (e) {
      // If shared_preferences is not available, use default light mode
      _isDarkMode = false;
    }
  }

  Future<void> toggleTheme() async {
    _isDarkMode = !_isDarkMode;
    notifyListeners();
    
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool(_themeKey, _isDarkMode);
    } catch (e) {
      // Handle case where shared_preferences is not available
    }
  }

  ThemeData getLightTheme() {
    return ThemeData(
      // Custom color scheme with warm, elegant colors
      colorScheme: ColorScheme.fromSeed(
        seedColor: const Color(0xFF8B4513), // Saddle Brown
        brightness: Brightness.light,
        primary: const Color(0xFF8B4513), // Saddle Brown
        secondary: const Color(0xFFFF8C42), // Dark Orange
        tertiary: const Color(0xFFD2691E), // Chocolate
        surface: const Color(0xFFFDF6E3), // Ivory
        background: const Color(0xFFFEFEFE), // Off White
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: const Color(0xFF2C2C2C), // Dark Gray
        onBackground: const Color(0xFF2C2C2C), // Dark Gray
      ),
      useMaterial3: true,
      
      // Enhanced app bar theme
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(
          color: Color(0xFF2C2C2C),
          fontSize: 20,
          fontWeight: FontWeight.w600,
        ),
        iconTheme: IconThemeData(
          color: Color(0xFF8B4513),
        ),
      ),
      
      // Enhanced card theme
      cardTheme: const CardThemeData(
        elevation: 4,
        shadowColor: Color(0xFF8B4513),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(16)),
        ),
        color: Colors.white,
      ),
      
      // Enhanced elevated button theme
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF8B4513),
          foregroundColor: Colors.white,
          elevation: 2,
          shadowColor: const Color(0xFF8B4513).withOpacity(0.3),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          textStyle: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      
      // Enhanced input decoration theme
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFFE0E0E0)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFFE0E0E0)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFF8B4513), width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Colors.red, width: 2),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        labelStyle: const TextStyle(color: Color(0xFF666666)),
        hintStyle: const TextStyle(color: Color(0xFF999999)),
      ),
      
      // Enhanced scaffold background
      scaffoldBackgroundColor: const Color(0xFFFEFEFE),
    );
  }

  ThemeData getDarkTheme() {
    return ThemeData(
      // Dark color scheme
      colorScheme: ColorScheme.fromSeed(
        seedColor: const Color(0xFF8B4513), // Saddle Brown
        brightness: Brightness.dark,
        primary: const Color(0xFFD2691E), // Chocolate (lighter brown for dark mode)
        secondary: const Color(0xFFFF8C42), // Dark Orange
        tertiary: const Color(0xFFCD853F), // Peru
        surface: const Color(0xFF2C2C2C), // Dark Gray
        background: const Color(0xFF1A1A1A), // Very Dark Gray
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: Colors.white,
        onBackground: Colors.white,
      ),
      useMaterial3: true,
      
      // Enhanced app bar theme for dark mode
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(
          color: Colors.white,
          fontSize: 20,
          fontWeight: FontWeight.w600,
        ),
        iconTheme: IconThemeData(
          color: Color(0xFFD2691E),
        ),
      ),
      
      // Enhanced card theme for dark mode
      cardTheme: const CardThemeData(
        elevation: 4,
        shadowColor: Colors.black26,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(16)),
        ),
        color: Color(0xFF2C2C2C),
      ),
      
      // Enhanced elevated button theme for dark mode
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFFD2691E),
          foregroundColor: Colors.white,
          elevation: 2,
          shadowColor: const Color(0xFFD2691E).withOpacity(0.3),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          textStyle: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      
      // Enhanced input decoration theme for dark mode
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: const Color(0xFF2C2C2C),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFF404040)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFF404040)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFFD2691E), width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Colors.red, width: 2),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        labelStyle: const TextStyle(color: Color(0xFFCCCCCC)),
        hintStyle: const TextStyle(color: Color(0xFF999999)),
      ),
      
      // Enhanced scaffold background for dark mode
      scaffoldBackgroundColor: const Color(0xFF1A1A1A),
    );
  }
} 
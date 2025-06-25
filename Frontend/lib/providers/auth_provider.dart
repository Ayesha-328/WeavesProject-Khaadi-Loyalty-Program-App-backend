import 'package:flutter/material.dart';
// import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';

class AuthProvider extends ChangeNotifier {
  bool _isLoading = false;
  String? _errorMessage;
  String? _token;

  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  String? get token => _token;

  Future<void> login(String phone, BuildContext context) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();
    try {
      final token = await ApiService.login(phone);
      if (token != null) {
        _token = token;
        // Commented out SharedPreferences for UI development
        // final prefs = await SharedPreferences.getInstance();
        // await prefs.setString('token', token);
        Navigator.pushReplacementNamed(context, '/home');
      } else {
        _errorMessage = 'Invalid phone number or login failed.';
      }
    } catch (e) {
      _errorMessage = 'Login failed. Please try again.';
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<void> logout(BuildContext context) async {
    _token = null;
    // Commented out SharedPreferences for UI development
    // final prefs = await SharedPreferences.getInstance();
    // await prefs.remove('token');
    Navigator.pushReplacementNamed(context, '/login');
    notifyListeners();
  }
} 
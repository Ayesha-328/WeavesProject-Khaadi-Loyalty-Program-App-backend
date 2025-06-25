import 'package:flutter/material.dart';
import '../models/user.dart';
import '../services/api_service.dart';

class UserProvider extends ChangeNotifier {
  User? _user;
  bool _isLoading = false;
  String? _errorMessage;

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> fetchUserProfile(String customerId) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();
    try {
      _user = await ApiService.getProfile(customerId);
    } catch (e) {
      _errorMessage = 'Failed to load profile.';
    }
    _isLoading = false;
    notifyListeners();
  }
} 
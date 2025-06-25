import 'package:http/http.dart' as http;
import 'dart:convert';
import '../models/user.dart';
import '../models/transaction.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:5085/api/Customer';
  static const String transactionBaseUrl = 'http://localhost:5085/api/transaction';

  static Future<String?> login(String phone) async {
    final response = await http.post(
      Uri.parse('$baseUrl/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'phoneNumber': phone}),
    );
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      // Return customerId for use in profile/transactions
      return data['customerId']?.toString();
    }
    return null;
  }

  static Future<User?> getProfile(String customerId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/$customerId'),
      headers: {'Content-Type': 'application/json'},
    );
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return User.fromJson(data);
    }
    return null;
  }

  static Future<List<Transaction>> getTransactions(String customerId) async {
    final response = await http.get(
      Uri.parse('$transactionBaseUrl/customer/$customerId'),
      headers: {'Content-Type': 'application/json'},
    );
    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => Transaction.fromJson(json)).toList();
    }
    return [];
  }
} 
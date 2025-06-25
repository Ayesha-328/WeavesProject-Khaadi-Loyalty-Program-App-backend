class User {
  final String id;
  final String name;
  final String phone;
  final int points;
  final String email;
  final String position;
  final String department;

  User({
    required this.id,
    required this.name,
    required this.phone,
    required this.points,
    required this.email,
    required this.position,
    required this.department,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['custId']?.toString() ?? '',
      name: json['fullName'] ?? '',
      phone: json['phoneNumber'] ?? '',
      points: json['credit'] ?? 0,
      email: json['email'] ?? '',
      position: json['position'] ?? '',
      department: json['department'] ?? '',
    );
  }
} 
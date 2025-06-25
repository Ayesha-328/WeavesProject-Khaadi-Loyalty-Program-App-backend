import 'package:flutter/material.dart';
import '../models/transaction.dart';

class TransactionTile extends StatelessWidget {
  final Transaction transaction;
  const TransactionTile({super.key, required this.transaction});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: ListTile(
        leading: Icon(
          transaction.amount >= 0 ? Icons.add_circle : Icons.remove_circle,
          color: transaction.amount >= 0 ? Colors.green : Colors.red,
        ),
        title: Text(transaction.description),
        subtitle: Text('${transaction.date.toLocal()}'.split(' ')[0]),
        trailing: Text(
          (transaction.amount >= 0 ? '+' : '') + transaction.amount.toString(),
          style: TextStyle(
            color: transaction.amount >= 0 ? Colors.green : Colors.red,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
} 
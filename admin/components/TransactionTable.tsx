// components/TransactionTable.tsx
"use client";
import { useEffect, useState } from "react";

// types.ts or inside the same file
export type Transaction = {
  transId: number;
  custId: number;
  customerFullName: string;        // from Customer table (joined in backend)
  type: "Credit" | "Debit";
  amount: number;
  prevBalance: number;
  newBalance: number;
  createdAt: string;       // ISO string format
};

export default function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
console.log(transactions);
  useEffect(() => {
    fetch(`http://localhost:5085/api/Transaction`)
      .then((res) => res.json())
      .then(setTransactions)
      .catch(console.error);
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-blue-200 text-slate-900 text-center border-gray-500">
          <tr>
            <th className="p-3 rounded-l-full">Transaction ID</th>
            <th className="p-3">Customer ID</th>
            <th className="p-3">Customer Name</th>
            <th className="p-3">Type</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Previous Balance</th>
            <th className="p-3">New Balance</th>
            <th className="p-3 rounded-r-full">Date Time</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn.transId} className="text-center border-b-[1px] border-gray-300">
              <td className="p-3">{txn.transId}</td>
              <td className="p-3">{txn.custId}</td>
              <td className="p-3">{txn.customerFullName}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-white text-xs ${
                    txn.type === "Credit" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {txn.type}
                </span>
              </td>
              <td className="p-3">{txn.amount}</td>
              <td className="p-3">{txn.prevBalance}</td>
              <td className="p-3">{txn.newBalance}</td>
              <td className="p-3">{new Date(txn.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

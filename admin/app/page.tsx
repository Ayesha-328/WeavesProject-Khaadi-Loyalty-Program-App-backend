"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [customerCount, setCustomerCount] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);

  useEffect(() => {
    // Fetch customers
    fetch("http://localhost:5085/api/Customer/all")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCustomerCount(data.length);
        }
      })
      .catch((err) => console.error("Error fetching customers:", err));

    // Fetch transactions
    fetch("http://localhost:5085/api/Transaction")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTransactionCount(data.length);
        }
      })
      .catch((err) => console.error("Error fetching transactions:", err));
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold mb-5">Welcome to the Admin Dashboard</h1>

      <div className="flex flex-col cursor-pointer gap-4 mb-6">
        <Link
          href="/debit"
          className="text-center flex flex-col items-center bg-orange-50 rounded-2xl shadow-md p-6 max-w-sm"
        >
          <h3 className="text-xl font-semibold text-gray-700">Scan QR Code</h3>
          <img src="/qrcode.png" className="w-24" alt="" />
        </Link>

        <Link
          href="/customers"
          className="text-center flex flex-col items-center bg-[#f4f4f6] rounded-2xl shadow-md p-6 max-w-sm"
        >
          <h3 className="text-xl font-semibold text-gray-700">Award Credits</h3>
          <img src="/awardCredit.png" className="w-24" alt="" />
        </Link>

        <div className="flex gap-3">
          <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-sm">
            <h3 className="text-xl font-semibold text-gray-700">Total Customers</h3>
            <p className="text-4xl font-bold text-indigo-600">{customerCount}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-sm">
            <h3 className="text-xl font-semibold text-gray-700">Total Transactions</h3>
            <p className="text-4xl font-bold text-indigo-600">{transactionCount}</p>
          </div>
        </div>
      </div>
    </>
  );
}

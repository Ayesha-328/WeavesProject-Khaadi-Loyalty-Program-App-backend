'use client';

import React, { useState } from 'react';
import { MoveLeft, TriangleAlert, CircleCheckBig} from 'lucide-react';

type Customer = {
  custId: string;
  email: string;
  fullName: string;
  credit: number;
    country?: string;
  city?: string;
  department?: string;
  position?: string;
};

const DebitPage = () => {
  const [custId, setCustId] = useState('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleCustIdCheck = async () => {
    try {
      setLoading(true);
      setError('');
      setCustomer(null);
      setMessage('');

      const res = await fetch(`http://localhost:5085/api/Customer/${custId}`);
      if (!res.ok) {
        throw new Error('Invalid QR code: Customer not found');
      }

      const data = await res.json();
      setCustomer(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDebit = async () => {
    if (!customer) return;

    if (amount <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }

    if (amount > customer.credit) {
      setError('Insufficient credits for this transaction.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await fetch(`http://localhost:5085/api/Transaction/create/debit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          custId: customer.custId,
          userId: 1, // hardcoded
          amount,
        }),
      });

      if (!response.ok) {
        throw new Error('Transaction failed.');
      }

      const result = await response.json();
      setMessage(result.message || 'Transaction successful.');
      setCustomer(null);
      setCustId('');
      setAmount(0);
    } catch (err: any) {
      setError(err.message || 'Failed to process transaction.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setCustId('');
    setCustomer(null);
    setAmount(0);
    setMessage('');
    setError('');
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Debit Transaction</h1>

      {!customer && !message && (
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Enter Customer ID:</label>
          <input
            type="text"
            value={custId}
            onChange={(e) => setCustId(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-2"
            placeholder="e.g. CUST123"
          />
          <button
            onClick={handleCustIdCheck}
            disabled={loading || !custId}
            className="bg-orange-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Authenticate'}
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-100 flex gap-2 text-red-700 border border-red-300 p-3 rounded mb-4">
          <TriangleAlert/> {error}
          {/* <div className="mt-2">
            <button
              onClick={reset}
              className="text-sm flex gap-2 text-blue-600 underline hover:text-blue-800"
            >
              <MoveLeft /> Go Back
            </button>
          </div> */}
        </div>
      )}

      {customer && (
        <div className="text-slate-800 border border-gray-300 p-4 rounded shadow mb-6">
          <p><strong>Customer ID:</strong> {customer.custId}</p>
          <p><strong>Name:</strong> {customer.fullName}</p>
          <p><strong>Email:</strong> {customer.email}</p>
          <p><strong>City:</strong> {customer.city}</p>
          <p><strong>Country:</strong> {customer.country}</p>
          <p><strong>Department:</strong> {customer.department}</p>
          <p><strong>Position:</strong> {customer.position}</p>
          <p><strong>Available Credits:</strong> {customer.credit}</p>

          <div className="mt-4">
            <label className="block text-gray-700 mb-2">Enter Amount to Debit:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="e.g. 100"
            />
            <button
              onClick={handleDebit}
              className="mt-4 cursor-pointer bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
              disabled={loading}
            >
              {loading ? 'Applying...' : 'Apply'}
            </button>
          </div>
        </div>
      )}

      {message && (
        <div className="bg-green-100 text-2xl text-green-700 border border-green-300 p-3 rounded mb-4">
          <div className='flex gap-2 items-center'>
            <CircleCheckBig/> {message}
            </div>
          <div className="mt-2">
            <button
              onClick={reset}
              className="flex gap-2 text-sm cursor-pointer text-blue-600 underline hover:text-blue-800"
            >
             <MoveLeft/> Perform Another Transaction
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebitPage;

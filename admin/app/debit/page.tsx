'use client';

import React, { useState } from 'react';
import { MoveLeft, TriangleAlert, CircleCheckBig } from 'lucide-react';
import CryptoJS from 'crypto-js';


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

// ✅ 16-byte key & IV for AES-128
const key = CryptoJS.enc.Utf8.parse('1234567890123456');
const iv = CryptoJS.enc.Utf8.parse('ThisIsAnIV123456');

const decryptAES = (encrypted: string) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    return '';
  }
};

const DebitPage = () => {
  const [qrString, setQrString] = useState('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [qrExpired, setQrExpired] = useState(false);

  const handleQRCheck = async () => {
    try {
      setLoading(true);
      setError('');
      setCustomer(null);
      setMessage('');
      setQrExpired(false);

      const decrypted = decryptAES(qrString);
      if (!decrypted.includes(':')) {
        throw new Error('Invalid QR code format.');
      }

      const [custIdStr, timestampStr] =  decrypted.split(';');
      const custId = parseInt(custIdStr);

      if (!custId || isNaN(custId)) {
        throw new Error('Invalid customer ID in QR.');
      }

      const timestamp = new Date(timestampStr);

      const now = new Date();
      const diffMinutes = (now.getTime() - timestamp.getTime()) / (1000 * 60);
      console.log(diffMinutes); // For debugging
      // For testing/demo: treat QR as expired after 1 minute instead of 5

      // If QR code is older than 5 minutes, show error and do not proceed
      if (diffMinutes > 5) {
        setQrExpired(true);
        throw new Error('QR Code expired. Please scan a new one.');
      }

      // If QR code is from the future (invalid)
      if (diffMinutes < 0) {
        throw new Error('Invalid QR code timestamp.');
      }

      const res = await fetch(`http://localhost:5085/api/Customer/${custId}`);
      if (!res.ok) throw new Error('Customer not found.');

      const data = await res.json();
      setCustomer(data);
    } catch (err: any) {
      setError(err.message || 'Invalid or expired QR code.');
    } finally {
      setLoading(false);
    }
  };

  const handleDebit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customer) return;

    if (amount <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }

    if (amount > customer.credit) {
      setError('Insufficient credits for this transaction.');
      return;
    }

    // Check QR code validity again before transaction
    const decrypted = decryptAES(qrString);
    if (!decrypted.includes(':')) {
      setError('Invalid QR code format.');
      return;
    }
    const [_, timestampStr] = decrypted.split(';');
    const timestamp = new Date(timestampStr);
    const now = new Date();
    const diffMinutes = (now.getTime() - timestamp.getTime()) / (1000 * 60);
    
    if (diffMinutes > 5) {
      setError('QR Code expired. Please scan a new one.');
      setCustomer(null);
      setQrExpired(true);
      return;
    }
    if (diffMinutes < 0) {
      setError('Invalid QR code timestamp.');
      setCustomer(null);
      setQrExpired(true);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch(`http://localhost:5085/api/Transaction/create/debit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          custId: customer.custId,
          userId: user.userId,
          amount,
        }),
      });

      if (!response.ok) throw new Error('Transaction failed.');

      const result = await response.json();
      setMessage(result.message || 'Transaction successful.');
      // Do not reset everything, just clear customer and amount, keep message
      setCustomer(null);
      setAmount(0);
      setQrString('');
    } catch (err: any) {
      setError(err.message || 'Failed to process transaction.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setQrString('');
    setCustomer(null);
    setAmount(0);
    setMessage('');
    setError('');
    setQrExpired(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Debit Transaction</h1>

      {!customer && !message && (
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Paste Encrypted QR Code String:</label>
          <input
            type="text"
            value={qrString}
            onChange={(e) => setQrString(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-2"
            placeholder="e.g. Encrypted string"
            disabled={loading}
          />
          <button
            onClick={handleQRCheck}
            disabled={loading || !qrString}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Authenticate'}
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-100 flex gap-2 text-red-700 border border-red-300 p-3 rounded mb-4">
          <TriangleAlert /> {error}
        </div>
      )}

      {customer && !message && (
        <div className="text-slate-800 border border-gray-300 p-4 rounded shadow mb-6">
          <p><strong>Customer ID:</strong> {customer.custId}</p>
          <p><strong>Name:</strong> {customer.fullName}</p>
          <p><strong>Email:</strong> {customer.email}</p>
          <p><strong>City:</strong> {customer.city}</p>
          <p><strong>Country:</strong> {customer.country}</p>
          <p><strong>Department:</strong> {customer.department}</p>
          <p><strong>Position:</strong> {customer.position}</p>
          <p><strong>Available Credits:</strong> {customer.credit}</p>

          <form onSubmit={handleDebit}>
            <div className="mt-4">
              <label className="block text-gray-700 mb-2">Enter Amount to Debit:</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value))}
                className="w-full border border-gray-300 p-2 rounded"
                placeholder="e.g. 100"
                min={1}
                max={customer.credit}
                disabled={loading}
              />
              <button
                type="submit"
                className="mt-4 bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
                disabled={loading}
              >
                {loading ? 'Applying...' : 'Apply'}
              </button>
            </div>
          </form>
        </div>
      )}

      {message && (
        <div className="bg-green-100 text-2xl text-green-700 border border-green-300 p-3 rounded mb-4">
          <div className="flex gap-2 items-center">
            <CircleCheckBig /> {message}
          </div>
          <div className="mt-2">
            <button
              onClick={reset}
              className="flex gap-2 text-sm text-blue-600 underline hover:text-blue-800"
            >
              <MoveLeft /> Perform Another Transaction
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebitPage;

"use client";

import { useState } from "react";
import { Customer } from "@/app/customers/page";

type Props = {
  customer: Customer;
  onClose: () => void;
  onUpdated: (updatedCustomer: Customer) => void;
};

export default function EditCustomerModal({ customer, onClose, onUpdated }: Props) {
  const [newCredit, setNewCredit] = useState("");
  const [loading, setLoading] = useState(false);
  console.log(customer);

  const handleUpdate = async () => {
    const creditToAdd = parseInt(newCredit);
    if (isNaN(creditToAdd)) return alert("Enter a valid credit amount");

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5085/update/credit`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            custId: customer.custId,
            userId: 1, // hardcoded for now
            credit: creditToAdd,
          }),
        }
      );

      if (!response.ok) throw new Error("Update failed");

      const updatedCustomer: Customer = {
        ...customer,
        credit: customer.credit + creditToAdd,
      };

      onUpdated(updatedCustomer);
    } catch (err) {
      console.error(err);
      alert("Error updating credit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0  backdrop-blur-md flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4 text-center">Update Credit</h3>
        <p className="mb-1 text-sm">Customer ID: <strong>{customer.custId}</strong></p>
        <p className="mb-1 text-sm">Full Name: <strong>{customer.fullName}</strong></p>
        <p className="mb-1 text-sm">Email: <strong>{customer.email}</strong></p>
        <p className="mb-1 text-sm">City, Country: <strong>{customer.city}, {customer.country}</strong></p>
        <p className="mb-1 text-sm">Department: <strong>{customer.department}</strong></p>
        <p className="mb-1 text-sm">Position: <strong>{customer.position}</strong></p>
        <p className="mb-1 text-sm">Available Credits: <strong>{customer.credit}</strong></p>
        <label className="block mb-1 mt-3 text-sm text-blue-500 font-semibold">Credits to Add</label>
        <input
          type="number"
          className="w-full border px-3 py-2 mb-4 rounded"
          placeholder="Enter amount"
          value={newCredit}
          onChange={(e) => setNewCredit(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

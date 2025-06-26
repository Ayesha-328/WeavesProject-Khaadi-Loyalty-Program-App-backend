"use client";

import { useEffect, useState } from "react";
import CustomerTable from "@/components/CustomerTable";
import EditCustomerModal from "@/components/EditCustomerModal";

// Define the Customer type
export type Customer = {
  custId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  credit: number;
  city: string;
  country: string;
  department: string;
  position: string;
  updatedAt: string;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetch(`http://localhost:5085/api/Customer/all`)
      .then((res) => res.json())
      .then(setCustomers)
      .catch(console.error);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Customers</h2>
      <CustomerTable customers={customers} onEdit={setSelectedCustomer} />
      {selectedCustomer && (
        <EditCustomerModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onUpdated={(updatedCustomer: Customer) => {
            setCustomers((prev) =>
              prev.map((c) => (c.custId === updatedCustomer.custId ? updatedCustomer : c))
            );
            setSelectedCustomer(null);
          }}
        />
      )}
    </div>
  );
}

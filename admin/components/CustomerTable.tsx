import { Customer } from "@/app/customers/page";
import { Pencil } from "lucide-react";

type Props = {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
};

export default function CustomerTable({ customers, onEdit }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full  text-sm text-left">
        <thead className="bg-orange-200 text-center ">
          <tr>
            <th className="p-3 rounded-l-3xl">ID</th>
            <th className="p-3">Full Name</th>
            <th className="p-3">Credit</th>
            <th className="p-3">City</th>
            <th className="p-3">Department</th>
            <th className="p-3">Position</th>
            <th className="p-3 rounded-r-3xl">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((cust) => (
            <tr key={cust.custId} className="text-center border-b-[1px] border-gray-400">
              <td className="p-3">{cust.custId}</td>
              <td className="p-3">{cust.fullName}</td>
              <td className="p-3">{cust.credit}</td>
              <td className="p-3">{cust.city}</td>
              <td className="p-3">{cust.department}</td>
              <td className="p-3">{cust.position}</td>
              <td className="p-3">
                <button
                  className="text-blue-600 cursor-pointer hover:text-blue-800"
                  onClick={() => onEdit(cust)}
                >
                  <Pencil size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

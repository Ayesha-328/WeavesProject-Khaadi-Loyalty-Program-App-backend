import TransactionTable from "@/components/TransactionTable";

export default function TransactionsPage() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Transactions</h2>
      <TransactionTable />
    </div>
  );
}

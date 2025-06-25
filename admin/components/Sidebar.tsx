import Link from "next/link";
import { Users ,ArrowLeftRight, FileUp ,ScanQrCode } from 'lucide-react';

const Sidebar = () => (
  <div className="w-50 bg-gray-800 text-white h-full text-center p-4">
    <nav className="space-y-7 my-5">
      <Link href="/customers" className="block hover:text-yellow-400">
      <span className="flex gap-3 "><Users className="text-orange-400"/> Customers</span>
      </Link>
      <Link href="/transactions" className="block hover:text-yellow-400">
      <span className="flex gap-3 "><ArrowLeftRight  className="text-orange-400"/> Transactions</span>
      </Link>
      <Link href="/credit" className="block hover:text-yellow-400">
      <span className="flex gap-3 "><FileUp  className="text-orange-400"/> Upload Credits</span>
      </Link>
      <Link href="/debit" className="block hover:text-yellow-400">
      <span className="flex gap-3 "><ScanQrCode  className="text-orange-400"/> Scan QR code</span>
      </Link>
    </nav>
  </div>
);

export default Sidebar;
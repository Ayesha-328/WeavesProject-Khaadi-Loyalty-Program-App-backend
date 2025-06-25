// components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import LoginIcon from "@/public/avatar-icon.png"; // Make sure image is in /public folder
import { useUser } from "@/context/UserContext";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useUser();

 
 const handleLogout = () => {
  setUser(null);
  localStorage.removeItem("user");
  document.cookie = "token=; path=/; max-age=0"; // clear cookie
  router.push("/login");
};

  return (
    <nav className="bg-white shadow-md px-6 py-1 flex items-center justify-between">
      <h1 className="text-lg font-bold ">
        <Link href="/">
        <div className="flex justify-center items-center">
        <img src="/logo.png" className="w-22 h-22" alt="logo" /><span className="inline">Rewards</span>
        </div>
        </Link>
      </h1>
      <ul className="flex items-center space-x-6">
        
        <li>
          {user && (
        <p className="text-sm text-gray-600">
          Logged in as <strong>{user.username}</strong> ({user.role})
        </p>
      )}
        </li>
        {true ? (
          <li>
            <button
              onClick={handleLogout}
              className="bg-orange-500 hover:bg-orange-600 text-white py-1 px-4 rounded"
            >
              Logout
            </button>
          </li>
        ) : (
          <li>
            <Link href="/login">
              <Image
                src={LoginIcon}
                alt="Login"
                width={28}
                height={28}
                className="hover:opacity-80 cursor-pointer"
              />
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Header;

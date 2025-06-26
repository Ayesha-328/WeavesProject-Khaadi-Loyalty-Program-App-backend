// components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import LoginIcon from "@/public/avatar-icon.png"; // Make sure image is in /public folder
import { useUser } from "@/context/UserContext";
import { useState, useRef, useEffect } from "react";
import { User } from "lucide-react"; // Import User icon from lucide-react

type UserType = {
  username: string;
  email: string;
  role: "super_admin" | "store_admin";
}
const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  // Cast user to UserType if needed
  const { user, setUser } = useUser() as { user: UserType | null, setUser: (user: UserType | null) => void };
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

   const [isLoggedIn, setIsLoggedIn] = useState(false);

   useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(document.cookie.includes("token="));
    }
  }, []);

 
 const handleLogout = () => {
  setUser(null);
  localStorage.removeItem("user");
  document.cookie = "token=; path=/; max-age=0"; // clear cookie
  router.push("/login");
};

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        
      
        
          {user && (
          <div className="relative" ref={dropdownRef}>
            <User 
            className="inline cursor-pointer border-2 rounded-full text-orange-500"
            onClick={() => setDropdownOpen((prev) => !prev)} 
            />
           
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-t-lg">
                  Logged in as <strong>{user.username}</strong>
                  <p>Email: <strong>{user.email}</strong></p>
                
                  <p>
                    Role: <span className="text-gray-600">{user.role=="super_admin"?"Super Admin":"Store Admin"}</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        ) }
    
        {isLoggedIn &&(
          <li>
            <button
              onClick={handleLogout}
              className="bg-orange-500 hover:bg-orange-600 text-white py-1 px-4 rounded"
            >
              Logout
            </button>
          </li>
        ) }
        
      </ul>
    </nav>
  );
};

export default Header;

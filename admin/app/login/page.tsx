"use client"; // ⬅️ VERY IMPORTANT for using hooks like useState/useRouter

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function Login() {
  const [formData, setFormData] = useState({
    Username: "",
    Password: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { setUser } = useUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.Username || !formData.Password) {
      setError("Both fields are required");
      return;
    }

    try {
      setStatus("submitting");
      setError(null);

      const apiUrl = `http://localhost:5085/api/User/login`;

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Invalid username or password");

      const data = await res.json();

      // ✅ Save to localStorage (or global state)
      // Save JWT in cookie
      document.cookie = `token=${data.token}; path=/; max-age=3600`; // 
      // ✅ Save JWT in cookie
      document.cookie = `token=${data.token}; path=/; max-age=3600`;

      // ✅ Save user info in localStorage for persistence
      localStorage.setItem("user", JSON.stringify(data)); // <-- ADD THIS LINE

      // Optionally: also save JWT separately if you need
      localStorage.setItem("jwt", JSON.stringify({ token: data.token }));
      setUser(data);

      router.push("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setStatus("idle");
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Sign in to your account
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="Username"
            placeholder="Username"
            value={formData.Username}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <input
            type="password"
            name="Password"
            placeholder="Password"
            value={formData.Password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition"
          >
            {status === "submitting" ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}

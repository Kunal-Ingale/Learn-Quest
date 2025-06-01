"use client";

import { useAuth } from "@/hooks/AuthContext"; // Adjust path if needed
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

const Header = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = async () => {
    await logout();
    router.push("/signin");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as HTMLElement).contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center relative">
      {/* Left - Logo */}
      <div className="flex-1">
        <h1
          className="text-2xl font-bold text-blue-600 cursor-pointer"
          onClick={() => router.push("/")}
        >
          LearnQuest
        </h1>
      </div>

      {/* Center - Navigation */}
      <nav className="flex-1 flex justify-center gap-8">
        <span
          onClick={() => router.push("/")}
          className="text-gray-700 font-medium cursor-pointer hover:text-blue-600 transition"
        >
          Home
        </span>
        <span
          onClick={() => router.push("/mycourses")}
          className="text-gray-700 font-medium cursor-pointer hover:text-blue-600 transition"
        >
          My Courses
        </span>
      </nav>

      {/* Right - User/Avatar/Login */}
      <div className="flex-1 flex justify-end items-center" ref={dropdownRef}>
        {user ? (
          <>
            <Image
              src={user.photoURL || "/default-avatar.png"}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full cursor-pointer hover:opacity-80"
              onClick={() => setDropdownOpen((prev) => !prev)}
            />
            {dropdownOpen && (
              <div className="absolute top-14 right-6 bg-white shadow-md rounded-md py-2 w-40 z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;

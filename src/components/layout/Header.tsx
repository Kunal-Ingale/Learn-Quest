"use client";

import { useAuth } from "@/hooks/AuthContext"; // Adjust path if needed
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

const DefaultUserIcon = () => (
  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
    <svg
      className="w-6 h-6 text-gray-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  </div>
);

const Header = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile menu
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null); // Ref for mobile menu

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as HTMLElement).contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
      // Close mobile menu when clicking outside
      if (
        mobileMenuRef.current &&
        !(mobileMenuRef.current as HTMLElement).contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when screen size changes (responsive breakpoint)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // Tailwind's 'md' breakpoint
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call initially to set correct state on load

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center relative z-50">
      {/* Left - Logo */}
      <div className="flex-1">
        <h1
          className="text-2xl font-bold text-blue-600 cursor-pointer"
          onClick={() => {
            router.push("/");
            closeMobileMenu(); // Close menu on logo click
          }}
        >
          LearnQuest
        </h1>
      </div>

      {/* Center - Navigation (Desktop) */}
      <nav className="hidden md:flex flex-1 justify-center gap-8">
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

      {/* Right - User/Avatar/Login with Hamburger */}
      <div className="flex-1 flex justify-end items-center gap-4">
        {/* Hamburger Icon (Mobile) */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-700 focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-4 6h4"
              ></path>
            </svg>
          </button>
        </div>

        <div className="relative" ref={dropdownRef}>
          {user ? (
            <>
              <div
                className="cursor-pointer hover:opacity-80"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                {user.photoURL && !imageError ? (
                  <Image
                    src={user.photoURL}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <DefaultUserIcon />
                )}
              </div>
              {dropdownOpen && (
                <div className="absolute top-10 right-0 mt-2 bg-white shadow-md rounded-md py-2 w-40 z-50">
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
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`absolute top-0 left-0 w-full bg-white shadow-md transition-transform duration-300 ease-in-out z-40 \
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} \
          md:hidden`}
        style={{ top: "64px" }} // Position below header
      >
        <nav className="flex flex-col items-center py-4 gap-4">
          <span
            onClick={() => {
              router.push("/");
              closeMobileMenu(); // Close menu on click
            }}
            className="text-gray-700 font-medium cursor-pointer hover:text-blue-600 transition"
          >
            Home
          </span>
          <span
            onClick={() => {
              router.push("/mycourses");
              closeMobileMenu(); // Close menu on click
            }}
            className="text-gray-700 font-medium cursor-pointer hover:text-blue-600 transition"
          >
            My Courses
          </span>
          {/* Optionally add Login/Logout to mobile menu if space allows or desired */}
          {user ? (
            <button
              onClick={() => {
                handleLogout();
                closeMobileMenu(); // Close menu on logout
              }}
              className="w-full text-center px-4 py-2 text-sm hover:bg-gray-100 text-gray-700 font-medium"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                handleLogin();
                closeMobileMenu(); // Close menu on login click
              }}
              className="w-full text-center px-4 py-2 text-sm hover:bg-gray-100 text-gray-700 font-medium"
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

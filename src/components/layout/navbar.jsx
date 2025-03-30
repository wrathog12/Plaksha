"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

const navItems = [
  { 
    name: "Features", 
    href: "#features",
    isSection: true
  },
  { 
    name: "Steps", 
    href: "#steps",
    isSection: true
  },
  { 
    name: "Resources", 
    href: "#resources",
    isSection: true
  },
];

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownTimer, setDropdownTimer] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateToAuth = (isLogin) => {
    router.push(`/authentication?form=${isLogin ? 'login' : 'register'}`);
  };

  // Handle navigation - scroll to section 
  const handleNavigation = (e, item) => {
    e.preventDefault();
    
    // Check if we're on the homepage
    const isHomePage = window.location.pathname === "/";
    
    if (isHomePage) {
      // We're on the homepage, so scroll to the section
      const section = document.querySelector(item.href);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // We're not on the homepage, so navigate to homepage with hash
      router.push(`/${item.href}`);
    }
  };

  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full flex justify-center z-50 mt-6 ">
      <nav className="w-full max-w-6xl px-3 bg-white/30 backdrop-blur-md rounded-3xl shadow-2xl">
        <div className="max-w-7xl mx-auto ml-4 ">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link href="/" className="montserrat-font-medium text-3xl text-white">
              Logo
            </Link>
            <div className="hidden md:flex items-center space-x-12 text-lg montserrat-font-medium">
              {navItems.map((item, index) => (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() => {
                    if (dropdownTimer) clearTimeout(dropdownTimer);
                    setOpenDropdown(index);
                  }}
                  onMouseLeave={() => {
                    const timer = setTimeout(() => {
                      setOpenDropdown(null);
                    }, 100);
                    setDropdownTimer(timer);
                  }}
                >
                  <Link 
                    href={item.href}
                    onClick={(e) => handleNavigation(e, item)}
                    className="text-white hover:text-blue-200 transition duration-150 ease-in-out flex items-center"
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-4 montserrat-font-medium">
              <button 
                onClick={() => navigateToAuth(true)}
                className="px-4 py-2 text-md text-white bg-blue-600 border border-blue-600 rounded-xl hover:bg-blue-700 cursor-pointer montserrat-font-medium"
              >
                Login
              </button>
              <button 
                onClick={() => navigateToAuth(false)}
                className="px-4 py-2 text-md text-white bg-blue-600 border border-blue-600 rounded-xl hover:bg-blue-700 cursor-pointer montserrat-font-medium"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
"use client";
import { Calendar1, HandHeart, House, Phone, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navbarItems = [
  { label: "Home", href: "/", icon: <House width={20} /> },
  { label: "Events", href: "/events", icon: <Calendar1 width={20} /> },
  { label: "Interest", href: "/interest", icon: <Star width={20} /> },
  { label: "Contact Us", href: "/contact-us", icon: <Phone width={20} /> },
  { label: "Volunteer", href: "/volunteer", icon: <HandHeart width={20} /> },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow">
      <Image
        src="/assets/images/logo.png"
        alt="Eventura Logo"
        width={60}
        height={60}
      />

      {/* Navbar Links */}
      <div className="hidden md:flex items-center space-x-6">
        {navbarItems.map(({ label, href, icon }) => (
          <Link key={href} href={href} className="flex items-center space-x-2">
            <div>{icon}</div>
            <div className="hover:underline">{label}</div>
          </Link>
        ))}
      </div>

      {/* Hamburger Button for Mobile */}
      <button
        className="md:hidden flex items-center space-x-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className={`w-6 h-1 bg-gray-600 transition-all ${
            isOpen ? "rotate-45" : ""
          }`}
        ></div>
        <div
          className={`w-6 h-1 bg-gray-600 transition-all ${
            isOpen ? "opacity-0" : ""
          }`}
        ></div>
        <div
          className={`w-6 h-1 bg-gray-600 transition-all ${
            isOpen ? "-rotate-45" : ""
          }`}
        ></div>
      </button>

      {/* Mobile Menu */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } z-10 absolute top-16 left-0 right-0 bg-gray-100 shadow-md md:hidden flex flex-col items-start px-4 space-y-4 py-4`}
      >
        <a href="#" className="hover:underline">
          Home
        </a>
        <a href="#" className="hover:underline">
          Events
        </a>
        <a href="#" className="hover:underline">
          Interest
        </a>
        <a href="#" className="hover:underline">
          Contact Us
        </a>
        <a href="#" className="hover:underline">
          Volunteer
        </a>
      </div>

      {/* Desktop Login/Registration Buttons */}
      <div className="hidden md:flex items-center space-x-4">
        <div className="w-fit h-fit p-1 bg-gradient-to-r from-yellow-400 to-red-400 rounded-md">
          <button className="px-4 py-1 bg-white rounded text-sm font-semibold">
            Log In
          </button>
        </div>

        <div className="w-fit p-1">
          <button className="px-4 py-2 text-white text-sm font-semibold bg-gradient-to-r from-yellow-400 to-red-400 rounded-md">
            Register
          </button>
        </div>

        <div className="w-5"></div>
      </div>

      {/* Mobile Login/Registration Buttons */}
      <div className="md:hidden flex items-center space-x-4">
        <div className="w-fit h-fit p-1 bg-gradient-to-r from-yellow-400 to-red-400 rounded">
          <button className="px-4 py-1 bg-white rounded text-sm font-semibold">
            Log In
          </button>
        </div>

        <div className="w-fit p-1">
          <button className="px-4 py-2 text-white text-sm font-semibold bg-gradient-to-r from-yellow-400 to-red-400 rounded">
            Register
          </button>
        </div>
      </div>
    </nav>
  );
}

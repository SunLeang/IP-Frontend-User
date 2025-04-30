import React from 'react';
import { Home, Layers, Heart, Calendar, Bell, HelpCircle } from 'lucide-react';

interface HeaderLinkProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const HeaderLink: React.FC<HeaderLinkProps> = ({ icon, label, active = false }) => (
  <a 
    href="#" 
    className={`flex items-center text-sm font-medium ${
      active ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'
    }`}
  >
    <span className="mr-2">{icon}</span>
    {label}
  </a>
);

const navLinks = [
  { icon: <Home size={18} />, label: "Home" },
  { icon: <Layers size={18} />, label: "Events" },
  { icon: <Heart size={18} />, label: "Saved" },
  { icon: <Calendar size={18} />, label: "Create event" }
];

export const Header: React.FC = () => (
  <header className="bg-white shadow-sm py-3 px-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center">
        <div className="mr-8">
          <span className="font-bold text-lg text-indigo-600">eventura</span>
        </div>
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link, index) => (
            <HeaderLink key={index} {...link} />
          ))}
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-500 hover:text-gray-700 p-1">
          <Bell size={20} />
        </button>
        <button className="text-gray-500 hover:text-gray-700 p-1">
          <HelpCircle size={20} />
        </button>
        <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
          <img 
            src="https://randomuser.me/api/portraits/women/44.jpg" 
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  </header>
);
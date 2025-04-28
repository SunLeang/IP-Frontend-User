import { useState } from "react";
import { PanelRight, X } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative z-50">
      {/* Open Button */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="p-1 text-white bg-primaryblue fixed top-5 right-5 z-10 rounded-lg hover:bg-gray-500"
        >
          <PanelRight />
        </button>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}

      {/* Sidebar */}
      <div
        className={`transform transition-transform ease-in-out duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } px-4 fixed top-0 right-0 w-96 h-full bg-primaryblue text-white shadow-lg z-40`}
      >
        {/* Close Button */}
        <div className="flex items-center justify-between p-4">
          <div className="text-2xl">Switch Role</div>
          <button
            onClick={closeSidebar}
            className="p-1 hover:bg-gray-500 hover:rounded-lg"
          >
            <X width={25} height={25} />
          </button>
        </div>

        {/* Sidebar Items */}
        <ul className="flex flex-col p-5 mt-16 space-y-2">
          <li className="mb-4">
            <button className="flex w-full px-6 py-3 bg-blue-600 text-start text-white rounded-lg hover:bg-blue-700 transition">
              Attendee
            </button>
          </li>
          <li className="mb-4">
            <button className="flex w-full px-6 py-3 bg-white text-start text-black rounded-lg hover:bg-gray-300 transition">
              Volunteer
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

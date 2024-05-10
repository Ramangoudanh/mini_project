import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ profilePic, name, isAdmin, isOpen, toggleSidebar }) => {
  let menuItems = [];

  if (isAdmin) {
    // Menu items for admin
    menuItems = [
      { label: "Analytics", path: "/complaints" },
      { label: "View Complaints", path: "/my-complaints" }
    ];
  } else {
    // Menu items for non-admin
    menuItems = [
      { label: "Add Complaint", path: "/complaints" },
      { label: "My Complaints", path: "/my-complaints" }
    ];
  }

  return (
    <div className={`fixed inset-y-0 left-0 w-64 z-50 bg-gray-800 text-white transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition duration-300 ease-in-out`}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center border-b border-black pb-2">
          <img
            className="w-16 h-16 rounded-full object-cover"
            src={profilePic}
            alt="Profile"
          />
          <span className="ml-2 block">{name}</span>
        </div>
        <button 
          className="text-white"
          onClick={toggleSidebar}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-col mt-4">
        {menuItems.map((item, index) => (
          <Link key={index} to={item.path} className="px-4 py-2 cursor-pointer hover:bg-gray-700">
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;


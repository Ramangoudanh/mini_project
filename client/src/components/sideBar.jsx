import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ profilePic, name, isAdmin, isOpen, toggleSidebar }) => {
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [openCategories, setOpenCategories] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://mini-project-fo4m.onrender.com/api/complaint/getAllIssueCategories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error("Failed to fetch categories:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (showCategories) {
      fetchCategories();
    }
  }, [showCategories]);

  const toggleStatuses = (category) => {
    setOpenCategories(prevOpenCategories => {
      const updatedOpenCategories = { ...prevOpenCategories };
      updatedOpenCategories[category] = !updatedOpenCategories[category];
      return updatedOpenCategories;
    });
  };

  return (
    <div className={`fixed inset-y-0 left-0 w-64 z-50 bg-gray-800 text-white transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition duration-300 ease-in-out`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-black">
          <div className="flex items-center">
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
        <div className="overflow-y-auto flex-1">
          <div className="flex flex-col mt-4">
            {/* Menu items */}
            {!isAdmin ? (
              <>
                <Link to="/complaints" className="px-4 py-2 cursor-pointer hover:bg-gray-700">
                  Add Complaint
                </Link>
                <Link to="/my-complaints" className="px-4 py-2 cursor-pointer hover:bg-gray-700">
                  My Complaints
                </Link>
              </>
            ) : (
              <Link to="/complaints" className="px-4 py-2 cursor-pointer hover:bg-gray-700">
                analyticc
              </Link>
            )}
            {/* View Complaints */}
        {isAdmin &&   <div className="relative">
              <button 
                className="px-4 py-2 cursor-pointer hover:bg-gray-700 w-full text-left flex items-center justify-between"
                onClick={() => setShowCategories(!showCategories)}
              >
             <span>View Complaints</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 ${showCategories ? 'transform rotate-180' : ''}`} 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10 15l-7-7h14l-7 7z" clipRule="evenodd" />
                </svg>
              </button>
              {/* Categories dropdown */}
              {showCategories && (
                <ul className="pl-4 mt-2">
                  {categories.map((category, index) => (
                    <li key={index} className="relative">
                      <button 
                        className="px-4 py-2 cursor-pointer hover:bg-gray-700 w-full text-left flex items-center justify-between"
                        onClick={() => toggleStatuses(category)}
                      >
                        <span>{category}</span>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-4 w-4 ${openCategories[category] ? 'transform rotate-180' : ''}`} 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M10 15l-7-7h14l
7z" clipRule="evenodd" />
</svg>
</button>
<ul className={`pl-4 ${openCategories[category] ? '' : 'hidden'}`}>
<li>
  <Link to={`/my-complaints/${category}/resolved`} className="px-4 py-2 hover:bg-gray-700 block">Resolved</Link>
</li>
<li>
  <Link to={`/my-complaints/${category}/pending`} className="px-4 py-2 hover:bg-gray-700 block">Pending</Link>
</li>
<li>
  <Link to={`/my-complaints/${category}/closed`} className="px-4 py-2 hover:bg-gray-700 block">Closed</Link>
</li>
<li>
  <Link to={`/my-complaints/${category}/`} className="px-4 py-2 hover:bg-gray-700 block">Default</Link>
</li>
</ul>
</li>
))}
</ul>
)}
</div>}
</div>
</div>
</div>
</div>
);
};

export default Sidebar;

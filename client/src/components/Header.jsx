import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "./sideBar";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser && currentUser.username === 'ramangoudanh';
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const location = useLocation();

  useEffect(() => {
    // Close the sidebar for sign-in and sign-up paths
    if (location.pathname === '/sign-in' || location.pathname === '/sign-up'||location.pathname === '/' ||location.pathname === '/choose') {
      setSidebarOpen(false);
    }else  setSidebarOpen(true);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
   
  return (
    <>
      <div className='bg-gray-900'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
          <div className="flex items-center">
            <button 
              className="text-white mr-4"
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
                  d="M4 6h16M4 12h16m-7 6h7" 
                />
              </svg>
            </button>
          </div>
          <div className="flex-grow text-center">
            <Link to='/' className='text-white text-2xl font-bold'>
              Complaint App
            </Link>
          </div>
          <ul className='flex gap-4 text-white'>
            <li>
              {currentUser ? (
                <Link to='/home' className='hover:text-gray-300'>
                  Home
                </Link>
              ) : (
                <Link to='/' className='hover:text-gray-300'>
                  Home
                </Link>
              )}
            </li>
            <li>
              <Link to='/about' className='hover:text-gray-300'>
                About
              </Link>
            </li>
            <li>
              <Link to='/profile' className='hover:text-gray-300'>
                {currentUser ? (
                  <img
                    src={currentUser.profilePicture}
                    alt='profile'
                    className='h-7 w-7 rounded-full object-cover'
                  />
                ) : (
                  'Sign In'
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <Sidebar
        profilePic={currentUser ? currentUser.profilePicture : ""}
        name={currentUser ? currentUser.username : ""}
        menuItems={["Menu Item 1", "Menu Item 2", "Menu Item 3"]} // Add your menu items here
        isOpen={sidebarOpen}
        isAdmin={isAdmin}
        toggleSidebar={toggleSidebar}
        className="z-1000 relative" 
      />
    </>
  );
};

export default Header;

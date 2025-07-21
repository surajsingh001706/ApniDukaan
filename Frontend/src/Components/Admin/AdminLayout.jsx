import React, { useState } from 'react';
import { FaBars } from "react-icons/fa";
import AdminSidebar from './AdminSidebar';
import AdminHomePage from '../../Pages/AdminHomePage';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className='min-h-screen flex flex-col md:flex-row relative'>
      {/* Mobile Toggle Button */}
      <div className='flex md:hidden items-center p-4 bg-gray-900 text-white z-20'>
        <button onClick={toggleSidebar}>
          <FaBars />
        </button>
        <h1 className='text-xl font-medium ml-5'>Admin Dashboard</h1>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden'
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`bg-gray-900 w-64 min-h-screen text-white 
        absolute md:relative transform transition-transform duration-300 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static z-20`}
      >
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className='flex-grow p-6 overflow-auto'>
        <Outlet/>
      </div>

    </div>
  );
};

export default AdminLayout;

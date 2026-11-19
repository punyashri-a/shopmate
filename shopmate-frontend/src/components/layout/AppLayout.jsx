import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Toast from '../common/Toast';
import ProductDetailsModal from '../products/ProductDetailsModal';

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-ivory-100/60 dark:bg-charcoal-900 text-charcoal-800 dark:text-charcoal-100 flex flex-col transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Global Product Details Modal */}
      <ProductDetailsModal />

      {/* Toast Notification Container */}
      <Toast />
    </div>
  );
};

export default AppLayout;

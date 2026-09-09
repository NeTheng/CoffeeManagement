import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/products', label: 'Products', icon: '☕' },
  { path: '/orders', label: 'Orders', icon: '📦' },
  { path: '/customers', label: 'Customers', icon: '👥' },
  { path: '/inventory', label: 'Inventory', icon: '📦' },
  { path: '/notes', label: 'Notes', icon: '📝' },
  { path: '/reports', label: 'Reports', icon: '📈' },
];

export const Sidebar = () => {
  const location = useLocation();
  const { role } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  // Admin-only items
  const adminItems = [
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const allItems = role === 'Admin' ? [...menuItems, ...adminItems] : menuItems;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-20 left-4 z-50 p-2 bg-amber-600 text-white rounded-lg"
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`fixed md:relative md:block transition-all duration-300 ${
        isOpen ? 'w-64' : '-translate-x-full md:translate-x-0 md:w-20'
      } h-screen bg-gradient-to-br from-amber-50 to-orange-50 border-r-2 border-amber-100 pt-6 pb-4 overflow-y-auto z-30`}>
        
        {/* Logo on Sidebar */}
        {isOpen && (
          <div className="px-4 mb-8">
            <h2 className="text-2xl font-bold text-amber-900">Menu</h2>
            <p className="text-xs text-amber-700">Navigation</p>
          </div>
        )}

        {/* Menu Items */}
        <nav className="space-y-2 px-4">
          {allItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                location.pathname === item.path
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'text-slate-700 hover:bg-amber-100 hover:text-amber-900'
              }`}
              title={!isOpen ? item.label : ''}
            >
              <span className="text-2xl">{item.icon}</span>
              {isOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Toggle Button for Desktop */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full py-2 px-4 bg-amber-200 text-amber-900 rounded-lg hover:bg-amber-300 transition font-semibold text-sm"
          >
            {isOpen ? '◀ Collapse' : '▶ Expand'}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

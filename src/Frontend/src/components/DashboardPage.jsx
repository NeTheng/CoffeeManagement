import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const DashboardPage = () => {
  const { username, role } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 45,
    totalCustomers: 230,
    totalRevenue: 5200,
    totalProducts: 892,
  });

  const recentOrders = [
    { id: '001', customer: 'John Doe', amount: '$45.50', time: '2 hours ago', status: 'Completed' },
    { id: '002', customer: 'Jane Smith', amount: '$32.00', time: '4 hours ago', status: 'Processing' },
    { id: '003', customer: 'Bob Wilson', amount: '$67.99', time: '6 hours ago', status: 'Completed' },
    { id: '004', customer: 'Alice Brown', amount: '$28.50', time: '8 hours ago', status: 'Completed' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {username}! 👋</h1>
        <p className="text-amber-100">You have {stats.totalOrders} pending orders today. Great day for sales!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Orders */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalOrders}</p>
              <p className="text-xs text-green-600 mt-1">↑ 12% from last month</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Customers</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalCustomers}</p>
              <p className="text-xs text-green-600 mt-1">↑ 8% from last month</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">${stats.totalRevenue}K</p>
              <p className="text-xs text-green-600 mt-1">↑ 24% from last month</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Products</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalProducts}</p>
              <p className="text-xs text-orange-600 mt-1">↓ 2% from last month</p>
            </div>
            <div className="text-4xl">☕</div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-semibold text-amber-600">#{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{order.customer}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">{order.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{order.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition shadow-md">
                ➕ New Order
              </button>
              <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-lg transition shadow-md">
                ➕ Add Customer
              </button>
              <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition shadow-md">
                📊 View Report
              </button>
              {role === 'Admin' && (
                <button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition shadow-md">
                  ⚙️ Settings
                </button>
              )}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 mt-6 border border-amber-200">
            <h3 className="font-semibold text-amber-900 mb-4">📈 Key Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-amber-800">Avg Order Value</span>
                <span className="font-bold text-amber-900">$115.56</span>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-amber-800">Conversion Rate</span>
                <span className="font-bold text-amber-900">3.2%</span>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-amber-800">Satisfaction</span>
                <span className="font-bold text-amber-900">4.8/5 ⭐</span>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

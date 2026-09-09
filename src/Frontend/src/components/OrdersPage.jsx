import React, { useState } from 'react';

const orders = [
  { id: '001', customer: 'John Doe', items: 2, total: 45.50, date: '2024-09-09', status: 'Completed' },
  { id: '002', customer: 'Jane Smith', items: 1, total: 32.00, date: '2024-09-09', status: 'Processing' },
  { id: '003', customer: 'Bob Wilson', items: 3, total: 67.99, date: '2024-09-08', status: 'Completed' },
  { id: '004', customer: 'Alice Brown', items: 1, total: 28.50, date: '2024-09-08', status: 'Delivered' },
  { id: '005', customer: 'Charlie Davis', items: 4, total: 89.99, date: '2024-09-07', status: 'Completed' },
];

export const OrdersPage = () => {
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredOrders = filterStatus === 'All' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Delivered': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">📦 Orders</h1>
          <p className="text-gray-600">Manage customer orders</p>
        </div>
        <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition">
          ➕ New Order
        </button>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex gap-2 flex-wrap">
          {['All', 'Processing', 'Completed', 'Delivered'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterStatus === status
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-green-50 to-green-100 border-b-2 border-green-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Order ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Customer</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Items</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Total</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-semibold text-green-600">#{order.id}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{order.customer}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{order.items}</td>
                <td className="px-6 py-4 text-sm font-semibold text-amber-600">${order.total.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{order.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 font-semibold transition">👁 View</button>
                  <button className="text-red-600 hover:text-red-800 font-semibold transition">🗑 Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <p className="text-gray-600 text-sm">Total Orders</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">{orders.length}</p>
          <p className="text-xs text-blue-700 mt-1">All time</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <p className="text-gray-600 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold text-green-900 mt-2">${orders.reduce((a, b) => a + b.total, 0).toFixed(2)}</p>
          <p className="text-xs text-green-700 mt-1">From all orders</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <p className="text-gray-600 text-sm">Avg Order Value</p>
          <p className="text-3xl font-bold text-purple-900 mt-2">${(orders.reduce((a, b) => a + b.total, 0) / orders.length).toFixed(2)}</p>
          <p className="text-xs text-purple-700 mt-1">Average</p>
        </div>
      </div>
    </div>
  );
};

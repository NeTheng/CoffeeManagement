import React from 'react';

const customers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-0101', city: 'New York', spent: '$450.50' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '555-0102', city: 'Los Angeles', spent: '$320.00' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', phone: '555-0103', city: 'Chicago', spent: '$679.99' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '555-0104', city: 'Houston', spent: '$285.50' },
];

export const CustomersPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">👥 Customers</h1>
          <p className="text-gray-600">Manage customer relationships</p>
        </div>
        <button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition">
          ➕ Add Customer
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <input
          type="text"
          placeholder="Search customers..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-purple-50 to-purple-100 border-b-2 border-purple-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">City</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Total Spent</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{customer.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{customer.email}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{customer.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{customer.city}</td>
                <td className="px-6 py-4 text-sm font-semibold text-purple-600">{customer.spent}</td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 font-semibold transition">✏️ Edit</button>
                  <button className="text-red-600 hover:text-red-800 font-semibold transition">🗑 Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

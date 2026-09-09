import React, { useState } from 'react';

const products = [
  { id: 1, name: 'Espresso', price: 3.50, stock: 250, category: 'Coffee', sales: 1250 },
  { id: 2, name: 'Latte', price: 4.50, stock: 180, category: 'Coffee', sales: 890 },
  { id: 3, name: 'Cappuccino', price: 4.50, stock: 150, category: 'Coffee', sales: 756 },
  { id: 4, name: 'Americano', price: 3.00, stock: 320, category: 'Coffee', sales: 1050 },
  { id: 5, name: 'Macchiato', price: 4.00, stock: 200, category: 'Coffee', sales: 650 },
];

export const ProductsPage = () => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">☕ Products</h1>
          <p className="text-gray-600">Manage your coffee products</p>
        </div>
        <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition">
          ➕ Add Product
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-amber-100 text-amber-900 rounded-lg hover:bg-amber-200 transition font-semibold">
            🔄 Filter
          </button>
          <button className="px-4 py-2 bg-green-100 text-green-900 rounded-lg hover:bg-green-200 transition font-semibold">
            📥 Export
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Product Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Price</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Stock</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Sales</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-semibold text-blue-600">#{product.id.toString().padStart(3, '0')}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{product.name}</td>
                <td className="px-6 py-4 text-sm font-semibold text-amber-600">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    product.stock > 200
                      ? 'bg-green-100 text-green-800'
                      : product.stock > 100
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock} units
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{product.category}</td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-900">{product.sales}</td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 font-semibold transition">✏️ Edit</button>
                  <button className="text-red-600 hover:text-red-800 font-semibold transition">🗑 Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <p className="text-gray-600 text-sm">Total Products</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">{products.length}</p>
          <p className="text-xs text-blue-700 mt-1">Active listings</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <p className="text-gray-600 text-sm">Average Price</p>
          <p className="text-3xl font-bold text-green-900 mt-2">${(products.reduce((a, b) => a + b.price, 0) / products.length).toFixed(2)}</p>
          <p className="text-xs text-green-700 mt-1">Per product</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <p className="text-gray-600 text-sm">Total Stock</p>
          <p className="text-3xl font-bold text-purple-900 mt-2">{products.reduce((a, b) => a + b.stock, 0)}</p>
          <p className="text-xs text-purple-700 mt-1">Units in inventory</p>
        </div>
      </div>
    </div>
  );
};

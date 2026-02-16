import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('adminUser') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <span className="text-xl font-bold">⚙️</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-xs text-blue-600">Dani Konveksi</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-gray-600 capitalize">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex">
          <aside className="w-64 bg-white rounded-xl shadow-md p-4 mr-6">
            <nav className="space-y-2">
              <Link
                to="/admin"
                className="block px-4 py-3 rounded-lg hover:bg-blue-50 text-blue-600 font-medium"
              >
                📊 Dashboard
              </Link>
              <Link
                to="/admin/orders"
                className="block px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600"
              >
                📦 Orders
              </Link>
              <Link
                to="/admin/products"
                className="block px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600"
              >
                👕 Products
              </Link>
              <Link
                to="/admin/users"
                className="block px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600"
              >
                👥 Users
              </Link>
              <Link
                to="/admin/reports"
                className="block px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600"
              >
                📈 Reports
              </Link>
            </nav>
          </aside>

          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    base_price: '',
    is_custom: true,
    min_order: 12
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/products');
      setProducts(response.data.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct._id}`, formData);
        setEditingProduct(null);
      } else {
        await api.post('/admin/products', formData);
      }
      
      fetchProducts();
      setFormData({
        name: '',
        description: '',
        category: '',
        base_price: '',
        is_custom: true,
        min_order: 12
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category._id,
      base_price: product.base_price,
      is_custom: product.is_custom,
      min_order: product.min_order
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/admin/products/${id}`);
        fetchProducts();
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Products</h2>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Product Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                <option value="1">Kaos Panjang</option>
                <option value="2">Model Rompi 1</option>
                <option value="3">Model Rompi 2</option>
                <option value="4">Model Rompi 3</option>
                <option value="5">Kaos Olahraga</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Price (Rp)</label>
              <input
                type="number"
                value={formData.base_price}
                onChange={(e) => setFormData({...formData, base_price: e.target.value})}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Minimum Order</label>
              <input
                type="number"
                value={formData.min_order}
                onChange={(e) => setFormData({...formData, min_order: e.target.value})}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-end">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_custom"
                  checked={formData.is_custom}
                  onChange={(e) => setFormData({...formData, is_custom: e.target.checked})}
                  className="h-5 w-5 text-blue-600 rounded"
                />
                <label htmlFor="is_custom" className="ml-2 text-gray-700">
                  Custom Design
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors w-full md:w-auto"
            >
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
            
            {editingProduct && (
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setFormData({
                    name: '',
                    description: '',
                    category: '',
                    base_price: '',
                    is_custom: true,
                    min_order: 12
                  });
                }}
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors w-full md:w-auto"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Order</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Custom</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-600">{product.description}</div>
                  </td>
                  <td className="px-4 py-3">
                    {product.category?.name || 'N/A'}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    Rp {product.base_price.toLocaleString('id-ID')}
                  </td>
                  <td className="px-4 py-3">
                    {product.min_order}
                  </td>
                  <td className="px-4 py-3">
                    {product.is_custom ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Yes</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;
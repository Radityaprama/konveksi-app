import React from 'react';
import CartItem from './CartItem';

const CartTable = ({ items }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-blue-50">
          <tr>
            <th className="p-4 text-left font-medium text-gray-700">Produk</th>
            <th className="p-4 text-left font-medium text-gray-700">Harga</th>
            <th className="p-4 text-left font-medium text-gray-700">Jumlah</th>
            <th className="p-4 text-left font-medium text-gray-700">Total</th>
            <th className="p-4"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CartTable;
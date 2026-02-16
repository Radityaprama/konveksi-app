import React from 'react';
import { useCart } from '../../hooks/useCart';
import kaosPanjang from '../../assets/images/kaos-panjang.jpg';
import modelRompi1 from '../../assets/images/model-rompi1.jpg';
import modelRompi2 from '../../assets/images/model-rompi2.jpg';
import modelRompi3 from '../../assets/images/model-rompi3.jpg';
import kaosOlahraga from '../../assets/images/kaos-olahraga.jpg';

const productImages = {
  'Kaos Panjang': kaosPanjang,
  'Model Rompi 1': modelRompi1,
  'Model Rompi 2': modelRompi2,
  'Model Rompi 3': modelRompi3,
  'Kaos Olahraga': kaosOlahraga,
};

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const itemImage = item.image || productImages[item.name];

  const handleIncrement = () => {
    updateQuantity(item.id || item._id, item.quantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(item.id || item._id, item.quantity - 1);
  };

  const handleRemove = () => {
    if (window.confirm('Hapus item dari keranjang?')) {
      removeFromCart(item.id || item._id);
    }
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-4 flex items-center space-x-4">
        {itemImage ? (
          <img
            src={itemImage}
            alt={item.name}
            className="w-16 h-16 object-cover rounded"
          />
        ) : (
          <div className="w-16 h-16 bg-blue-100 rounded flex items-center justify-center text-blue-500 text-xl">
            🛍️
          </div>
        )}
        <span className="font-medium">{item.name}</span>
      </td>
      <td className="p-4">Rp {item.price.toLocaleString('id-ID')}</td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDecrement}
            className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors"
          >
            -
          </button>
          <span className="w-6 text-center font-medium">{item.quantity}</span>
          <button
            onClick={handleIncrement}
            className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors"
          >
            +
          </button>
        </div>
      </td>
      <td className="p-4 font-bold">
        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
      </td>
      <td className="p-4">
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 transition-colors"
          title="Hapus"
        >
          ✕
        </button>
      </td>
    </tr>
  );
};

export default CartItem;
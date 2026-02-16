import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/CartProvider';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import OrderSuccess from './pages/OrderSuccess';
import OrderFailed from './pages/OrderFailed';
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminProducts from './pages/admin/Products';
import AdminLogin from './pages/admin/Login';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 font-sans">
          <Routes>
            <Route path="/" element={
              <>
                <Header />
                <Home />
                <Footer />
              </>
            } />

            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/order-failed" element={<OrderFailed />} />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/products" element={<AdminProducts />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
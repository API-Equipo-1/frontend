import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Cart from './Cart';
import '../styles/Cart.css';

const CartPage = () => {
  const { carrito } = useCart();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        marginBottom: '2rem'
      }}>
        <h1 style={{ margin: 0 }}>Mi Carrito</h1>
        <button
          onClick={() => navigate('/catalog')}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          ← Seguir Comprando
        </button>
      </header>

      {/* Cart Content */}
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '0 2rem'
      }}>
        {carrito.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h2>Tu carrito está vacío</h2>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              Explora nuestro catálogo y agrega productos a tu carrito
            </p>
            <button
              onClick={() => navigate('/catalog')}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '0.75rem 1.5rem',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Explorar Productos
            </button>
          </div>
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <Cart />
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
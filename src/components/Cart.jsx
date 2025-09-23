import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/Cart.css';

const Cart = () => {
  const { 
    carrito, 
    eliminarDelCarrito, 
    vaciarCarrito, 
    actualizarCantidad, 
    productosOriginales,
    totalPrecio,
    cantidadTotalItems 
  } = useCart();
  const navigate = useNavigate();

  const handleEliminarItem = (id) => {
    eliminarDelCarrito(id);
  };

  const handleVaciarCarrito = () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      vaciarCarrito();
    }
  };

  const handleCambiarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      handleEliminarItem(id);
    } else {
      // Validate stock before updating
      const productoOriginal = productosOriginales?.find(p => p.id === id);
      if (productoOriginal && nuevaCantidad <= productoOriginal.stock) {
        actualizarCantidad(id, nuevaCantidad);
      } else {
        alert(`Stock insuficiente. Stock máximo disponible: ${productoOriginal?.stock || 0}`);
      }
    }
  };

  const handleIrAlCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart-container-fixed">
      {/* Panel del carrito siempre visible */}
      <div className="cart-panel-fixed">
        <div className="cart-header">
          <img src="/shopping_cart.png" alt="Carrito" className="cart-header-icon" />
          <h3> Tu Carrito ({cantidadTotalItems})</h3>
        </div>

        <div className="cart-content">
          {carrito.length === 0 ? (
            <div className="cart-empty">
              <p>Tu carrito está vacío</p>
              <p>Agrega productos desde la tienda</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {carrito.map(item => (
                  <div key={item.id} className="cart-item">
                    <img 
                      src={item.imagen} 
                      alt={item.nombre}
                      className="cart-item-image"
                    />
                    <div className="cart-item-info">
                      <h4>{item.nombre}</h4>
                      <p className="cart-item-price">${item.precio}</p>
                      <div className="quantity-controls">
                        <button 
                          onClick={() => handleCambiarCantidad(item.id, item.cantidad - 1)}
                          className="quantity-btn"
                          type="button"
                        >
                          −
                        </button>
                        <span className="quantity">{item.cantidad}</span>
                        <button 
                          onClick={() => handleCambiarCantidad(item.id, item.cantidad + 1)}
                          className={`quantity-btn ${(() => {
                            const productoOriginal = productosOriginales?.find(p => p.id === item.id);
                            return productoOriginal && item.cantidad >= productoOriginal.stock ? 'disabled' : '';
                          })()}`}
                          disabled={(() => {
                            const productoOriginal = productosOriginales?.find(p => p.id === item.id);
                            return productoOriginal && item.cantidad >= productoOriginal.stock;
                          })()}
                          type="button"
                          title={(() => {
                            const productoOriginal = productosOriginales?.find(p => p.id === item.id);
                            return productoOriginal && item.cantidad >= productoOriginal.stock 
                              ? `Stock máximo alcanzado (${productoOriginal.stock})` 
                              : 'Aumentar cantidad';
                          })()}
                        >
                          +
                        </button>
                      </div>
                      <p className="stock-info">
                        Stock máximo: {productosOriginales?.find(p => p.id === item.id)?.stock || 0}
                      </p>
                      <p className="subtotal">
                        Subtotal: ${(item.precio * item.cantidad).toFixed(2)}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleEliminarItem(item.id)}
                      className="remove-item"
                      title="Eliminar producto"
                      type="button"
                    >
                      <img src="/trash-icon.svg" alt="Eliminar" className="trash-icon" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-total">
                  <h3>Total: ${totalPrecio.toFixed(2)}</h3>
                </div>
                <div className="cart-actions">
                  <button 
                    onClick={handleVaciarCarrito}
                    className="clear-cart-btn"
                    type="button"
                  >
                    Vaciar Carrito
                  </button>
                  <button 
                    onClick={handleIrAlCheckout}
                    className="checkout-btn"
                    type="button"
                  >
                    Proceder al Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
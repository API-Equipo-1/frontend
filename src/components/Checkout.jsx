import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import { productService } from '../services/productService';
import '../styles/Checkout.css';

const Checkout = () => {
  const { carrito, vaciarCarrito, totalPrecio } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [datosCliente, setDatosCliente] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigoPostal: ''
  });

  const [errores, setErrores] = useState({});
  const [procesandoPedido, setProcesandoPedido] = useState(false);
  const [stockErrors, setStockErrors] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDatosCliente(prev => ({
      ...prev,
      [name]: value
    }));

    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!datosCliente.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    }
    if (!datosCliente.apellido.trim()) {
      nuevosErrores.apellido = 'El apellido es requerido';
    }
    if (!datosCliente.email.trim()) {
      nuevosErrores.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(datosCliente.email)) {
      nuevosErrores.email = 'El email no es válido';
    }
    if (!datosCliente.telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es requerido';
    }
    if (!datosCliente.direccion.trim()) {
      nuevosErrores.direccion = 'La dirección es requerida';
    }
    if (!datosCliente.ciudad.trim()) {
      nuevosErrores.ciudad = 'La ciudad es requerida';
    }
    if (!datosCliente.codigoPostal.trim()) {
      nuevosErrores.codigoPostal = 'El código postal es requerido';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Debes iniciar sesión para confirmar tu pedido');
      navigate('/login?redirect=/checkout');
      return;
    }
    
    if (!validarFormulario()) {
      return;
    }

    setProcesandoPedido(true);
    setStockErrors([]);

    try {
      // validar stock
      const stockValidation = await productService.validateCartStock(carrito);
      
      if (!stockValidation.isValid) {
        setStockErrors(stockValidation.invalidItems);
        alert('Algunos productos no tienen suficiente stock disponible. Por favor revisa tu carrito.');
        setProcesandoPedido(false);
        return;
      }

      // si hay stock, actualizar stock en el inventario
      await productService.updateMultipleProductsStock(carrito);
      await new Promise(resolve => setTimeout(resolve, 2000));

      const pedido = {
        id: Date.now(),
        cliente: datosCliente,
        productos: carrito,
        total: totalPrecio,
        fecha: new Date().toISOString(),
        estado: 'confirmado'
      };

      // simular guardar el pedido 
      console.log('Pedido procesado:', pedido);
      
      alert(`¡Pedido confirmado! \nTotal: $${totalPrecio.toFixed(2)} \nNúmero de pedido: ${pedido.id}`);
      
      vaciarCarrito();
      navigate('/catalog');
    } catch (error) {
      console.error('Error al procesar pedido:', error);
      if (error.message.includes('Insufficient stock')) {
        alert(`Error de stock: ${error.message}`);
      } else if (error.message.includes('Stock update failed')) {
        alert('Error al actualizar el inventario. Por favor intenta nuevamente.');
      } else {
        alert('Hubo un error al procesar tu pedido. Por favor intenta nuevamente.');
      }
    } finally {
      setProcesandoPedido(false);
    }
  };

  const handleVolver = () => {
    navigate('/catalog');
  };

  if (carrito.length === 0) {
    return (
      <div className="checkout-container">
        <div className="checkout-empty">
          <h2>El carrito está vacío</h2>
          <p>Agrega algunos productos antes de hacer el checkout</p>
          <button onClick={handleVolver} className="volver-btn">
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h2>Finalizar Compra</h2>
        <button onClick={handleVolver} className="volver-btn">
          ← Volver al catálogo
        </button>
      </div>

      <div className="checkout-content">
        {/* Stock errors display */}
        {stockErrors.length > 0 && (
          <div className="stock-errors">
            <h3>⚠️ Problemas de Stock</h3>
            {stockErrors.map(error => (
              <div key={error.productId} className="stock-error-item">
                <span className="error-product">{error.productName}</span>
                <span className="error-details">
                  Solicitado: {error.requestedQuantity} | Disponible: {error.availableStock}
                </span>
              </div>
            ))}
            <p className="stock-error-message">
              Por favor ajusta las cantidades en tu carrito antes de continuar.
            </p>
          </div>
        )}

        {/* Resumen del Pedido */}
        <div className="order-summary">
          <h3>Resumen del Pedido</h3>
          <div className="order-items">
            {carrito.map(item => (
              <div key={item.id} className="order-item">
                <img src={item.imagen} alt={item.nombre} />
                <div className="item-details">
                  <span className="item-name">{item.nombre}</span>
                  <span className="item-quantity">Cantidad: {item.cantidad}</span>
                  <span className="item-price">${(item.precio * item.cantidad).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="order-total">
            <h3>Total: ${totalPrecio.toFixed(2)}</h3>
          </div>
        </div>

        {/* formulario de envio*/}
        <div className="customer-form">
          <h3>Datos de Envío</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre">Nombre *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={datosCliente.nombre}
                  onChange={handleInputChange}
                  className={errores.nombre ? 'error' : ''}
                />
                {errores.nombre && <span className="error-message">{errores.nombre}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="apellido">Apellido *</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={datosCliente.apellido}
                  onChange={handleInputChange}
                  className={errores.apellido ? 'error' : ''}
                />
                {errores.apellido && <span className="error-message">{errores.apellido}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={datosCliente.email}
                onChange={handleInputChange}
                className={errores.email ? 'error' : ''}
              />
              {errores.email && <span className="error-message">{errores.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono *</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={datosCliente.telefono}
                onChange={handleInputChange}
                className={errores.telefono ? 'error' : ''}
              />
              {errores.telefono && <span className="error-message">{errores.telefono}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="direccion">Dirección *</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={datosCliente.direccion}
                onChange={handleInputChange}
                className={errores.direccion ? 'error' : ''}
              />
              {errores.direccion && <span className="error-message">{errores.direccion}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ciudad">Ciudad *</label>
                <input
                  type="text"
                  id="ciudad"
                  name="ciudad"
                  value={datosCliente.ciudad}
                  onChange={handleInputChange}
                  className={errores.ciudad ? 'error' : ''}
                />
                {errores.ciudad && <span className="error-message">{errores.ciudad}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="codigoPostal">Código Postal *</label>
                <input
                  type="text"
                  id="codigoPostal"
                  name="codigoPostal"
                  value={datosCliente.codigoPostal}
                  onChange={handleInputChange}
                  className={errores.codigoPostal ? 'error' : ''}
                />
                {errores.codigoPostal && <span className="error-message">{errores.codigoPostal}</span>}
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-order-btn"
              disabled={procesandoPedido}
            >
              {procesandoPedido 
                ? 'Procesando...' 
                : user 
                  ? `Confirmar Pedido - $${totalPrecio.toFixed(2)}`
                  : 'Iniciar Sesión para Confirmar Pedido'
              }
            </button>
            
            {!user && (
              <p className="auth-warning">
                ⚠️ Necesitas iniciar sesión para confirmar tu pedido
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
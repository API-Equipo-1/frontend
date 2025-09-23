import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import { FormInput } from './FormInput';
import { FormRow } from './FormRow';
import { productService } from '../services/productService';
import { validateCheckoutForm } from '../utils/validation';
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
    const validation = validateCheckoutForm(datosCliente);
    setErrores(validation.errors);
    return validation.isValid;
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
            <FormRow>
              <FormInput
                label="Nombre"
                name="nombre"
                value={datosCliente.nombre}
                onChange={handleInputChange}
                error={errores.nombre}
                placeholder="Ej: Juan"
                required
              />
              <FormInput
                label="Apellido"
                name="apellido"
                value={datosCliente.apellido}
                onChange={handleInputChange}
                error={errores.apellido}
                placeholder="Ej: Pérez"
                required
              />
            </FormRow>

            <FormInput
              label="Email"
              name="email"
              type="email"
              value={datosCliente.email}
              onChange={handleInputChange}
              error={errores.email}
              placeholder="juan@ejemplo.com"
              required
            />

            <FormInput
              label="Teléfono"
              name="telefono"
              type="tel"
              value={datosCliente.telefono}
              onChange={handleInputChange}
              error={errores.telefono}
              placeholder="Ej: +54 11 1234-5678"
              required
            />

            <FormInput
              label="Dirección"
              name="direccion"
              value={datosCliente.direccion}
              onChange={handleInputChange}
              error={errores.direccion}
              placeholder="Ej: Av. Corrientes 1234"
              required
            />

            <FormRow>
              <FormInput
                label="Ciudad"
                name="ciudad"
                value={datosCliente.ciudad}
                onChange={handleInputChange}
                error={errores.ciudad}
                placeholder="Ej: Buenos Aires"
                required
              />
              <FormInput
                label="Código Postal"
                name="codigoPostal"
                value={datosCliente.codigoPostal}
                onChange={handleInputChange}
                error={errores.codigoPostal}
                placeholder="Ej: 1234"
                required
              />
            </FormRow>

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
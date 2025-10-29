import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);
  const [productosOriginales, setProductosOriginales] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      try {
        setCarrito(JSON.parse(carritoGuardado));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  // Function to map product fields from backend API to Spanish expected by cart components
  const mapProductToCartFormat = useCallback((product) => ({
    id: product.id,
    nombre: product.name || product.nombre,
    descripcion: product.description || product.descripcion,
    precio: product.price || product.precio,
    stock: product.stock,
    imagen: product.image || product.imagen || 'https://via.placeholder.com/300x200?text=No+Image',
    // Keep original for reference
    _original: product
  }), []);

  // Function to add products to cart
  const agregarAlCarrito = useCallback((producto) => {
    // Map the product to the expected format if needed
    const mappedProducto = producto.nombre ? producto : mapProductToCartFormat(producto);
    
    setCarrito(carritoAnterior => {
      const productoExistente = carritoAnterior.find(item => item.id === mappedProducto.id);
      
      if (productoExistente) {
        // If product exists, increase quantity
        return carritoAnterior.map(item =>
          item.id === mappedProducto.id 
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        // If it's a new product, add it with quantity 1
        return [...carritoAnterior, { ...mappedProducto, cantidad: 1 }];
      }
    });
  }, [mapProductToCartFormat]);

  // Function to remove products from cart
  const eliminarDelCarrito = useCallback((id) => {
    setCarrito(carritoAnterior => 
      carritoAnterior.filter(item => item.id !== id)
    );
  }, []);

  // Function to empty cart completely
  const vaciarCarrito = useCallback(() => {
    setCarrito([]);
  }, []);

  // Function to update quantity of a product
  const actualizarCantidad = useCallback((id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(id);
    } else {
      // Validate against original stock
      const productoOriginal = productosOriginales.find(p => p.id === id);
      if (productoOriginal && nuevaCantidad <= productoOriginal.stock) {
        setCarrito(carritoAnterior =>
          carritoAnterior.map(item =>
            item.id === id 
              ? { ...item, cantidad: nuevaCantidad }
              : item
          )
        );
      } else {
        // Show message if trying to exceed stock
        alert(`Stock insuficiente. Stock disponible: ${productoOriginal?.stock || 0}`);
      }
    }
  }, [eliminarDelCarrito, productosOriginales]);

  // Function to set original products for stock validation
  const setProductosOriginalesFromAPI = useCallback((products) => {
    // Map products to expected format and store both versions
    const mappedProducts = products.map(mapProductToCartFormat);
    setProductosOriginales(mappedProducts);
  }, [mapProductToCartFormat]);

  // Calculate total items in cart
  const cantidadTotalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  // Calculate total price
  const totalPrecio = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  const value = {
    carrito,
    productosOriginales,
    agregarAlCarrito,
    eliminarDelCarrito,
    vaciarCarrito,
    actualizarCantidad,
    setProductosOriginalesFromAPI,
    cantidadTotalItems,
    totalPrecio,
    mapProductToCartFormat
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
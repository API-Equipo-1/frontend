import { useState, useEffect } from "react";
import "..sstyles/ProductList.css";

const ProductList = ({
  onAgregarAlCarrito,
  carrito,
  onProductosOriginales,
}) => {
  const [productos, setProductos] = useState([]);
  const [productosOriginales, setProductosOriginales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect para consumir datos desde JSON-Server
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3001/productos");
        if (!response.ok) {
          throw new Error("Error al cargar productos");
        }
        const data = await response.json();
        setProductos(data);
        setProductosOriginales(data); // Guardar los datos originales
        if (onProductosOriginales) {
          onProductosOriginales(data); // Pasar al componente padre
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching productos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // useEffect para sincronizar stock con el carrito
  useEffect(() => {
    if (productosOriginales.length > 0) {
      const productosActualizados = productosOriginales.map((producto) => {
        const itemEnCarrito = carrito.find((item) => item.id === producto.id);
        const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;
        return {
          ...producto,
          stock: producto.stock - cantidadEnCarrito,
        };
      });
      setProductos(productosActualizados);
    }
  }, [carrito, productosOriginales]);

  const handleAgregarAlCarrito = (producto) => {
    const stockDisponible =
      productos.find((p) => p.id === producto.id)?.stock || 0;
    if (stockDisponible > 0) {
      onAgregarAlCarrito(producto);
    }
  };

  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="product-list">
      <h2>Productos Disponibles</h2>
      <div className="products-grid">
        {productos.map((producto) => (
          <div key={producto.id} className="product-card">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="product-image"
            />
            <div className="product-info">
              <h3 className="product-name">{producto.nombre}</h3>
              <p className="product-description">{producto.descripcion}</p>
              <div className="product-details">
                <span className="price">${producto.precio}</span>
                <span className="stock">Stock: {producto.stock}</span>
              </div>
              <button
                onClick={() => handleAgregarAlCarrito(producto)}
                disabled={producto.stock === 0}
                className={`add-to-cart-btn ${
                  producto.stock === 0 ? "disabled" : ""
                }`}
              >
                {producto.stock === 0 ? "Sin Stock" : "Agregar al Carrito"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export const ProductCard = (product) => {
  const { agregarAlCarrito, carrito, productosOriginales } = useCart();
  const [stock, setStock] = useState(product.stock);

  // Update stock based on cart contents
  useEffect(() => {
    const itemInCart = carrito.find(item => item.id === product.id);
    const quantityInCart = itemInCart ? itemInCart.cantidad : 0;
    setStock(product.stock - quantityInCart);
  }, [carrito, product.stock, product.id]);

  const handleAddToCart = () => {
    if (stock > 0) {
      agregarAlCarrito(product);
      console.log(`Agregando ${product.name} al carrito`);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <div key={product.id} className="product-info">
          <img
            className="product-image"
            src={product.image}
            alt={product.description}
          />
          <div>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Precio: ${product.price}</p>
            <p>Stock: {stock}</p>
          </div>
        </div>
      </Link>
      <button onClick={handleAddToCart} disabled={stock === 0}>
        {stock === 0 ? "Sin stock" : "Agregar al carrito"}
      </button>
    </div>
  );
};

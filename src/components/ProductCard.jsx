import { useState } from "react";
import { redirect } from "react-router-dom";
import { Link } from "react-router";

export const ProductCard = (product) => {
  const [stock, setStock] = useState(product.stock);

  const handleAddToCart = () => {
    if (stock > 0) {
      setStock(stock - 1);
      console.log(`Agregando ${product.name} al carrito`);
      console.log(`Stock restante de ${product.name}: ${stock - 1}`);
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

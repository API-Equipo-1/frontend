import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { productService } from "../services/productService";
import "../styles/Product.css";

export const Product = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito, carrito } = useCart();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stock, setStock] = useState(0);

  useEffect(() => {
    productService.getProductById(id)
      .then((foundProduct) => {
        setSelectedProduct(foundProduct);
        // Calculate available stock based on cart contents
        const itemInCart = carrito.find(item => item.id === foundProduct.id);
        const quantityInCart = itemInCart ? itemInCart.cantidad : 0;
        setStock(foundProduct.stock - quantityInCart);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });
  }, [id, carrito]);

  const handleAddToCart = () => {
    if (stock > 0 && selectedProduct) {
      agregarAlCarrito(selectedProduct);
      console.log(`Agregando ${selectedProduct.name} al carrito`);
    }
  };

  const handleBackToCatalog = () => {
    navigate('/catalog');
  };

  return (
    <div>
      {selectedProduct ? (
        <div>
          <h1>Producto: {selectedProduct.name}</h1>
          <div className="detalle-producto">
            <img src={selectedProduct.image} alt={selectedProduct.name} />
            <div>
              <p>{selectedProduct.extendedDescription}</p>
              <p>Precio: ${selectedProduct.price}</p>
              <p>Stock: {stock}</p>
              <div className="buttons">
                <button
                  className="boton-detalle"
                  onClick={handleAddToCart}
                  disabled={stock === 0}
                >
                  {stock === 0 ? "Sin stock" : "Agregar al carrito"}
                </button>
                <button className="boton-detalle" onClick={handleBackToCatalog}>
                  Volver al catálogo
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

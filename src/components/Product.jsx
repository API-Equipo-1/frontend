import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { productService } from "../services/productService";
import "../styles/Product.css";

export const Product = () => {
  let { id } = useParams();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stock, setStock] = useState(0);

  useEffect(() => {
    productService.getProductById(id)
      .then((foundProduct) => {
        setSelectedProduct(foundProduct);
        setStock(foundProduct.stock);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (stock > 0) {
      setStock(stock - 1);
      console.log(`Agregando ${selectedProduct.name} al carrito`);
      console.log(`Stock restante de ${selectedProduct.name}: ${stock - 1}`);
    }
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
                <button className="boton-detalle">
                  <a href="/">Volver al catálogo</a>
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

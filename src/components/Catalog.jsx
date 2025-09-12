import { useState, useEffect } from "react";
import "./Catalog.css";
import { ProductCard } from "./ProductCard";

export const Catalog = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/products.json")
      .then((response) => response.json())
      .then((data) =>
        setProducts(data.sort((a, b) => a.name.localeCompare(b.name)))
      )
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <div>
      <h1>Cátalogo de productos</h1>
      <div className="product-list">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
};

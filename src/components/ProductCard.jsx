import { useState } from "react";

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
        <div key={product.id} className="product-item">
            <img className="product-image" src={product.image} alt={product.description} />
            <div>
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <p>Precio: ${product.price}</p>
                <p>Stock: {stock}</p>
            </div>
            <button
                onClick={handleAddToCart}
                disabled={stock === 0}
            >
                {stock === 0 ? "Sin stock" : "Agregar al carrito"}
            </button>
        </div>
    );
}
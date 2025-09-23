import { useState, useEffect, use } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { productService } from '../../services/productService';
import '../../styles/ProductManagement.css';

export const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user)
    loadProducts();
  }, [user]);

  const loadProducts = () => {
    setLoading(true);
    productService.getAllProducts()
      .then((data) => {
        // Filter products to show only those created by the current user
        // Handle both string and null user IDs
        const userProducts = data.filter(product => {
          // Ensure both values are compared as strings for consistency
          const productCreatedBy = product.createdBy ? String(product.createdBy) : null;
          const currentUserId = user.id ? String(user.id) : null;
          
          return productCreatedBy && currentUserId && productCreatedBy === currentUserId;
        });
        setProducts(userProducts);
        setLoading(false);
      })
      .catch((error) => {
        setError('Error al cargar los productos: ' + error.message);
        setLoading(false);
      });
  };

  const handleEdit = (productId) => {
    navigate(`/product-stats/${productId}`);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await productService.deleteProduct(productId);
        loadProducts(); // Reload the products after deletion
      } catch (error) {
        setError('Error al eliminar el producto: ' + error.message);
      }
    }
  };

  //if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-management">
      <div className="header">
        <h2>Gestión de Productos</h2>
        {user && (
            <p style={{ 
              margin: '0.5rem 0 0 0', 
              color: '#6b7280', 
              fontSize: '0.875rem' 
            }}>
              Bienvenido/a, {user.firstName} {user.lastName}
            </p>
          )}
        <div className="header-buttons">
          <button 
            onClick={() => navigate('/catalog')}
            className="btn-secondary"
          >
            ← Volver al Catálogo
          </button>
          <button 
            onClick={() => navigate('/product-form')}
            className="btn-primary"
          >
            Agregar Nuevo Producto
          </button>
        </div>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>${product.price}</td>
              <td>{product.stock}</td>
              <td>
                <button 
                  onClick={() => handleEdit(product.id)}
                  className="btn-edit"
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="btn-delete"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

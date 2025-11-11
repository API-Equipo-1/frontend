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
    if (user) {
      loadProducts();
    }
  }, [user]);

  const loadProducts = () => {
    setLoading(true);
    // Si es ADMIN, mostrar todos los productos, si no, solo los del usuario
    const fetchProducts = user.role === 'ADMIN' 
      ? productService.getAllProducts() 
      : productService.getProductsByUserId(user.id);
    
    fetchProducts
      .then((data) => {
        setProducts(data);
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
        alert('Producto eliminado exitosamente');
      } catch (error) {
        console.error('Error al eliminar:', error);
        // Mostrar el mensaje específico del servidor
        if (error.message.includes('asociado a uno o más pedidos')) {
          alert('❌ No se puede eliminar este producto\n\n' + 
                'El producto está asociado a uno o más pedidos realizados.\n' +
                'Por motivos de integridad del historial de ventas, no es posible eliminarlo.\n\n' +
                'Si el producto ya no está disponible, se recomienda modificar su stock a 0 para que no pueda ser comprado.');
        } else {
          alert('Error al eliminar el producto:\n' + error.message);
        }
        setError(null); // Limpiar el error después de mostrarlo
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

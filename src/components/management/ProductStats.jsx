import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { productService } from '../../services/productService';
import '../../styles/ProductManagement.css';

export const ProductStats = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    image: ''
  });

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    try {
      const product = await productService.getProductById(parseInt(productId));
      
      // Verify if the product belongs to the current user
      if (product.createdBy !== user.id) {
        setError('No tienes permiso para editar este producto');
        return;
      }

      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock.toString(),
        image: product.image
      });
    } catch (error) {
      setError('Error al cargar el producto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const updatedProduct = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        createdBy: user.id
      };

      await productService.updateProduct(parseInt(productId), updatedProduct);
      navigate('/product-management');
    } catch (error) {
      setError('Error al actualizar el producto: ' + error.message);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-form-container">
      <h2>Editar Producto</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre del Producto</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Categoría</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Precio</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="stock">Stock</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">URL de la Imagen</label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
          />
        </div>

        <div className="button-group">
          <button type="submit" className="btn-primary">
            Guardar Cambios
          </button>
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => navigate('/product-management')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

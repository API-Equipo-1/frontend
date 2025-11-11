import { apiClient } from './apiClient';

// Función auxiliar para mapear producto del backend al formato frontend
const mapProductToFrontend = (product) => ({
  id: product.id,
  name: product.nombre,
  description: product.descripcion,
  price: product.precio,
  stock: product.stock,
  category: product.categorias && product.categorias.length > 0 ? product.categorias[0].nombre : 'Sin categoría',
  image: product.imagen || 'https://via.placeholder.com/300x200?text=No+Image',
  _original: product
});

// Función auxiliar para mapear producto del frontend al formato backend
const mapProductToBackend = (product) => {
  const backendProduct = {
    nombre: product.name,
    descripcion: product.description,
    precio: product.price,
    stock: product.stock
  };
  
  // Solo agregar imagen si existe
  if (product.image) {
    backendProduct.imagen = product.image;
  }
  
  return backendProduct;
};

export const productService = {
  async getAllProducts() {
    const products = await apiClient.get('/productos');
    return products.map(mapProductToFrontend);
  },

  async getProductById(id) {
    try {
      const product = await apiClient.get(`/productos/${id}`);
      return mapProductToFrontend(product);
    } catch (error) {
      console.error('Error fetching product by id:', error);
      throw error;
    }
  },

  async getProductsByCategory(category) {
    try {
      const products = await this.getAllProducts();
      return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  async searchProducts(searchTerm) {
    try {
      const products = await this.getAllProducts();
      return products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  async getProductsInStock() {
    try {
      const products = await this.getAllProducts();
      return products.filter(p => p.stock > 0);
    } catch (error) {
      console.error('Error fetching products in stock:', error);
      throw error;
    }
  },

  async getProductsByPriceRange(minPrice, maxPrice) {
    try {
      const products = await this.getAllProducts();
      return products.filter(p => p.price >= minPrice && p.price <= maxPrice);
    } catch (error) {
      console.error('Error fetching products by price range:', error);
      throw error;
    }
  },

  async createProduct(newProduct) {
    try {
      const backendProduct = mapProductToBackend(newProduct);
      const createdProduct = await apiClient.post('/productos', backendProduct, true);
      return mapProductToFrontend(createdProduct);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  async updateProduct(id, updatedFields) {
    try {
      // Primero obtener el producto original para preservar las categorías
      const originalProduct = await apiClient.get(`/productos/${id}`);
      
      // Mapear los campos del frontend al formato del backend
      const backendUpdate = {};
      
      if (updatedFields.name !== undefined) backendUpdate.nombre = updatedFields.name;
      if (updatedFields.description !== undefined) backendUpdate.descripcion = updatedFields.description;
      if (updatedFields.price !== undefined) backendUpdate.precio = updatedFields.price;
      if (updatedFields.stock !== undefined) backendUpdate.stock = updatedFields.stock;
      if (updatedFields.image !== undefined) backendUpdate.imagen = updatedFields.image;
      
      // Si se proporciona category, buscar o crear la categoría
      if (updatedFields.category !== undefined && updatedFields.category !== '') {
        backendUpdate.categorias = [{
          nombre: updatedFields.category
        }];
      } else {
        // Preservar las categorías originales si no se proporciona nueva categoría
        backendUpdate.categorias = originalProduct.categorias;
      }
      
      const updatedProduct = await apiClient.put(`/productos/${id}`, backendUpdate, true);
      
      return {
        id: id,
        price: updatedProduct.precio,
        stock: updatedProduct.stock
      };
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async deleteProduct(id) {
    try {
      return await apiClient.delete(`/productos/${id}`, true);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  async updateProductStock(productId, newStock) {
    try {
      return await this.updateProduct(productId, { stock: newStock });
    } catch (error) {
      console.error('Error updating product stock:', error);
      throw error;
    }
  },

  async decrementProductStock(productId, quantity) {
    try {
      const product = await this.getProductById(productId);
      if (product.stock < quantity) {
        throw new Error(`Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${quantity}`);
      }
      const newStock = product.stock - quantity;
      return await this.updateProductStock(productId, newStock);
    } catch (error) {
      console.error('Error decrementing product stock:', error);
      throw error;
    }
  },

  async updateMultipleProductsStock(cartItems) {
    try {
      const updatePromises = cartItems.map(item => 
        this.decrementProductStock(item.id, item.cantidad)
      );
      
      const results = await Promise.allSettled(updatePromises);
      
      const failures = results.filter(result => result.status === 'rejected');
      if (failures.length > 0) {
        throw new Error(`Stock update failed for ${failures.length} products`);
      }
      
      return { success: true, updated: results.length };
    } catch (error) {
      console.error('Error updating multiple products stock:', error);
      throw error;
    }
  },

  async validateCartStock(cartItems) {
    try {
      const validationPromises = cartItems.map(async (item) => {
        const product = await this.getProductById(item.id);
        return {
          productId: item.id,
          productName: product.name,
          requestedQuantity: item.cantidad,
          availableStock: product.stock,
          isValid: product.stock >= item.cantidad
        };
      });
      
      const validations = await Promise.all(validationPromises);
      const invalidItems = validations.filter(v => !v.isValid);
      
      return {
        isValid: invalidItems.length === 0,
        invalidItems,
        validations
      };
    } catch (error) {
      console.error('Error validating cart stock:', error);
      throw error;
    }
  }
};
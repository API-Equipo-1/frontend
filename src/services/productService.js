const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to get JWT token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('jwt-token');
};

// Helper function to create headers with JWT
const getHeaders = (includeAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

export const api = {
  async get(endpoint, requiresAuth = false) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: getHeaders(requiresAuth),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API GET error:', error);
      throw error;
    }
  },

  async post(endpoint, data, requiresAuth = false) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(requiresAuth),
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Handle text response for login endpoint
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return await response.text();
    } catch (error) {
      console.error('API POST error:', error);
      throw error;
    }
  },

  async put(endpoint, data, requiresAuth = false) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: getHeaders(requiresAuth),
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API PUT error:', error);
      throw error;
    }
  },

  async delete(endpoint, requiresAuth = false) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getHeaders(requiresAuth),
      });
      
      // Handle 204 No Content response
      if (response.status === 204) {
        return { success: true };
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Try to parse JSON if there's content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return { success: true };
    } catch (error) {
      console.error('API DELETE error:', error);
      throw error;
    }
  }
};

export const productService = {
  
  async getAllProducts() {
    // Map backend response to frontend expected format
    const products = await api.get('/productos');
    return products.map(p => ({
      id: p.id,
      name: p.nombre,
      description: p.descripcion,
      price: p.precio,
      stock: p.stock,
      category: p.categorias && p.categorias.length > 0 ? p.categorias[0].nombre : 'Sin categoría',
      image: p.imagen || 'https://via.placeholder.com/300x200?text=No+Image',
      // Keep original data for reference
      _original: p
    }));
  },

  async getProductById(id) {
    try {
      const product = await api.get(`/productos/${id}`);
      // Map backend response to frontend expected format
      return {
        id: product.id,
        name: product.nombre,
        description: product.descripcion,
        price: product.precio,
        stock: product.stock,
        category: product.categorias && product.categorias.length > 0 ? product.categorias[0].nombre : 'Sin categoría',
        image: product.imagen || 'https://via.placeholder.com/300x200?text=No+Image',
        _original: product
      };
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
      // Map frontend format to backend expected format
      const backendProduct = {
        nombre: newProduct.name,
        descripcion: newProduct.description,
        precio: newProduct.price,
        stock: newProduct.stock,
        categorias: newProduct.category ? [{ nombre: newProduct.category }] : []
      };
      
      const createdProduct = await api.post('/productos', backendProduct, true); // requires auth
      
      // Map response back to frontend format
      return {
        id: createdProduct.id,
        name: createdProduct.nombre,
        description: createdProduct.descripcion,
        price: createdProduct.precio,
        stock: createdProduct.stock,
        category: createdProduct.categorias && createdProduct.categorias.length > 0 ? createdProduct.categorias[0].nombre : 'Sin categoría',
        image: 'https://via.placeholder.com/300x200?text=No+Image',
        _original: createdProduct
      };
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  async deleteProduct(id) {
    try {
      const response = await api.delete(`/productos/${id}`, true); // requires auth
      return response;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  async updateProduct(id, updatedFields) {
    try {
      // Backend only accepts precio and stock for updates
      const backendUpdate = {
        precio: updatedFields.price !== undefined ? updatedFields.price : undefined,
        stock: updatedFields.stock !== undefined ? updatedFields.stock : undefined
      };
      
      // Remove undefined values
      Object.keys(backendUpdate).forEach(key => 
        backendUpdate[key] === undefined && delete backendUpdate[key]
      );
      
      const updatedProduct = await api.put(`/productos/${id}`, backendUpdate, true); // requires auth
      
      // Map response back to frontend format
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
      
      // Check if any updates failed
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
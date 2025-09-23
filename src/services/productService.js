const API_BASE_URL = 'http://localhost:3001';

export const api = {
  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API GET error:', error);
      throw error;
    }
  },

  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API POST error:', error);
      throw error;
    }
  },

  async put(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
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

  async delete(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API DELETE error:', error);
      throw error;
    }
  }
};

export const productService = {
  
  async getAllProducts() {
    return await api.get('/products');
  },

  async getProductById(id) {
    try {
      const products = await this.getAllProducts();
      const product = products.find(p => String(p.id) === String(id));
      if (!product) {
        throw new Error(`Product with id ${id} not found`);
      }
      return product;
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
      // Don't manually assign ID - let JSON Server handle it
      // JSON Server will automatically assign the next available ID
      return await api.post('/products', newProduct);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  async deleteProduct(id) {
    try {
      // Ensure we're using the ID as-is, whether it's string or number
      const response = await api.delete(`/products/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  async updateProduct(id, updatedFields) {
    try {
      const products = await this.getAllProducts();
      const productIndex = products.findIndex(p => String(p.id) === String(id));
      if (productIndex === -1) {
        throw new Error(`Product with id ${id} not found`);
      }
      const updatedProduct = { ...products[productIndex], ...updatedFields };
      return await api.put(`/products/${id}`, updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async updateProductStock(productId, newStock) {
    try {
      const product = await this.getProductById(productId);
      const updatedProduct = { ...product, stock: newStock };
      return await api.put(`/products/${productId}`, updatedProduct);
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
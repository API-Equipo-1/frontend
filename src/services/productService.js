export const productService = {
  
  async getAllProducts() {
    try {
      const response = await fetch('/src/front-end-db/products.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async getProductById(id) {
    try {
      const products = await this.getAllProducts();
      const product = products.find(p => p.id === parseInt(id));
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

  // This is just for simulation purposes
  updateProductStock(productId, newStock) {
    console.log(`Updating stock for product ${productId} to ${newStock}`);
    return Promise.resolve({ success: true });
  }
};
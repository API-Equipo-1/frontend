/**
 * API service for interacting with JSON Server
 */

const API_BASE_URL = 'http://localhost:3001';

/**
 * Generic API utility functions
 */
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

/**
 * User-specific API functions
 */
export const userService = {
  /**
   * Get all users
   */
  async getAllUsers() {
    return await api.get('/users');
  },

  /**
   * Get user by ID
   */
  async getUserById(id) {
    return await api.get(`/users/${id}`);
  },

  /**
   * Create a new user
   */
  async createUser(userData) {
    return await api.post('/users', userData);
  },

  /**
   * Update user
   */
  async updateUser(id, userData) {
    return await api.put(`/users/${id}`, userData);
  },

  /**
   * Delete user
   */
  async deleteUser(id) {
    return await api.delete(`/users/${id}`);
  },

  /**
   * Check if username exists
   */
  async checkUsernameExists(username) {
    try {
      const users = await api.get(`/users?username=${username.toLowerCase()}`);
      return users.length > 0;
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  },

  /**
   * Check if email exists
   */
  async checkEmailExists(email) {
    try {
      const users = await api.get(`/users?email=${email.toLowerCase()}`);
      return users.length > 0;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  },

  /**
   * Login user (find by email and password)
   */
  async loginUser(email, password) {
    try {
      const users = await api.get(`/users?email=${email.toLowerCase()}&password=${password}`);
      if (users.length > 0) {
        return { success: true, user: users[0] };
      } else {
        return { success: false, message: 'Credenciales inválidas' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Error del servidor' };
    }
  },

  /**
   * Validate user registration data against existing users
   */
  async validateRegistration(userData) {
    const errors = {};

    // Check if username exists
    if (await this.checkUsernameExists(userData.username)) {
      errors.username = 'Este nombre de usuario ya está en uso';
    }

    // Check if email exists
    if (await this.checkEmailExists(userData.email)) {
      errors.email = 'Este email ya está registrado';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  /**
   * Clear all users (for testing purposes)
   */
  async clearAllUsers() {
    try {
      const users = await this.getAllUsers();
      await Promise.all(users.map(user => this.deleteUser(user.id)));
      return { success: true };
    } catch (error) {
      console.error('Error clearing users:', error);
      return { success: false, error: error.message };
    }
  }
};
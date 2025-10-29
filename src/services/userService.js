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


export const userService = {

  async getAllUsers() {
    const users = await api.get('/usuarios', true); // requires auth
    // Map backend response to frontend format
    return users.map(u => ({
      id: u.usuario_id,
      username: u.email.split('@')[0], // Generate username from email
      email: u.email,
      firstName: u.nombre,
      lastName: u.apellido,
      _original: u
    }));
  },

  async getUserById(id) {
    const user = await api.get(`/usuarios/${id}`, true); // requires auth
    // Map backend response to frontend format
    return {
      id: user.usuario_id,
      username: user.email.split('@')[0],
      email: user.email,
      firstName: user.nombre,
      lastName: user.apellido,
      _original: user
    };
  },

  async createUser(userData) {
    // Map frontend format to backend format
    const backendUser = {
      nombre: userData.firstName,
      apellido: userData.lastName,
      email: userData.email,
      password: userData.password
    };
    
    try {
      const response = await api.post('/auth/register', backendUser);
      // Response is a success message string
      return { success: true, message: response };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async updateUser(id, userData) {
    // Note: Backend doesn't have a specific update user endpoint
    // You might need to implement this in your backend
    console.warn('Update user endpoint not implemented in backend');
    throw new Error('Update user functionality not available');
  },

  async deleteUser(id) {
    return await api.delete(`/usuarios?id=${id}`, true); // requires auth
  },

  async checkUsernameExists(username) {
    try {
      // Since backend uses email, we'll check email instead
      // This might need adjustment based on your requirements
      return false; // Username check not directly supported
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  },

  async checkEmailExists(email) {
    try {
      const users = await this.getAllUsers();
      return users.some(u => u.email.toLowerCase() === email.toLowerCase());
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  },

  async loginUser(email, password) {
    try {
      const credentials = { email, password };
      const token = await api.post('/auth/login', credentials);
      
      if (token) {
        // Store the JWT token
        localStorage.setItem('jwt-token', token);
        
        // Get user data - we'll need to fetch it or decode from token
        // For now, create a basic user object
        const user = {
          email: email,
          username: email.split('@')[0],
          firstName: email.split('@')[0], // Placeholder
          lastName: '' // Placeholder
        };
        
        return { success: true, user, token };
      } else {
        return { success: false, message: 'Credenciales inválidas' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Error del servidor' };
    }
  },

  async validateRegistration(userData) {
    const errors = {};

    // Check if email exists
    if (await this.checkEmailExists(userData.email)) {
      errors.email = 'Este email ya está registrado';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  async clearAllUsers() {
    console.warn('Clear all users not supported by backend');
    return { success: false, error: 'Operation not supported' };
  }
};
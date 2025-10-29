import { apiClient } from './apiClient';

export const authService = {
  async register(userData) {
    try {
      // Map frontend format to backend format
      const backendUser = {
        nombre: userData.firstName,
        apellido: userData.lastName,
        email: userData.email,
        password: userData.password
      };
      
      const response = await apiClient.post('/auth/register', backendUser);
      return { success: true, message: response };
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  async login(email, password) {
    try {
      const credentials = { email, password };
      const token = await apiClient.post('/auth/login', credentials);
      
      if (token) {
        // Store the JWT token
        localStorage.setItem('jwt-token', token);
        
        // Create basic user object from email
        const user = {
          email: email,
          username: email.split('@')[0],
          firstName: email.split('@')[0],
          lastName: ''
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

  logout() {
    localStorage.removeItem('jwt-token');
    localStorage.removeItem('currentUser');
  },

  getToken() {
    return localStorage.getItem('jwt-token');
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};

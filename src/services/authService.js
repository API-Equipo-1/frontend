import { apiClient } from './apiClient';

export const authService = {
  async register(userData) {
    try {
      // Mapear formato frontend a formato backend
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
      const response = await apiClient.post('/auth/login', credentials);
      
      if (response && response.token) {
        // Guardar el token JWT
        localStorage.setItem('jwt-token', response.token);
        
        // Usar los datos del usuario que vienen del backend
        const user = {
          id: response.usuario.id,
          email: response.usuario.email,
          firstName: response.usuario.nombre,
          lastName: response.usuario.apellido,
          role: response.usuario.role,
          username: response.usuario.email.split('@')[0]
        };
        
        return { success: true, user, token: response.token };
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

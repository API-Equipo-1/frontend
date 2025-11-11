import { apiClient } from './apiClient';

// Función auxiliar para mapear usuario del backend al formato frontend
const mapUserToFrontend = (user) => ({
  id: user.usuario_id,
  username: user.email.split('@')[0],
  email: user.email,
  firstName: user.nombre,
  lastName: user.apellido,
  _original: user
});

export const userService = {
  async getAllUsers() {
    const users = await apiClient.get('/usuarios', true);
    return users.map(mapUserToFrontend);
  },

  async getUserById(id) {
    const user = await apiClient.get(`/usuarios/${id}`, true);
    return mapUserToFrontend(user);
  },

  async createUser(userData) {
    // Para crear usuarios, usar authService.register en su lugar
    console.warn('Use authService.register() for user registration');
    throw new Error('Use authService.register() for user registration');
  },

  async updateUser(id, userData) {
    // Nota: El backend no tiene un endpoint específico para actualizar usuarios
    console.warn('Update user endpoint not implemented in backend');
    throw new Error('Update user functionality not available');
  },

  async deleteUser(id) {
    return await apiClient.delete(`/usuarios?id=${id}`, true);
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

  async validateRegistration(userData) {
    const errors = {};

    // Verificar si el email ya existe
    if (await this.checkEmailExists(userData.email)) {
      errors.email = 'Este email ya está registrado';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};
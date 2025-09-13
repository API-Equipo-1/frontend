
export const validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password) => {
    // At least 8 characters, one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },

  username: (username) => {
    // At least 3 characters, alphanumeric and underscore allowed
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    return usernameRegex.test(username);
  },

  name: (name) => {
    // At least 2 characters, only letters and spaces
    const nameRegex = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{2,}$/;
    return nameRegex.test(name.trim());
  }
};

export const errorMessages = {
  username: {
    required: 'El nombre de usuario es requerido',
    invalid: 'El nombre de usuario debe tener al menos 3 caracteres y solo puede contener letras, números y guiones bajos'
  },
  email: {
    required: 'El email es requerido',
    invalid: 'Ingresa un email válido'
  },
  password: {
    required: 'La contraseña es requerida',
    invalid: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número'
  },
  firstName: {
    required: 'El nombre es requerido',
    invalid: 'El nombre debe tener al menos 2 caracteres y solo puede contener letras'
  },
  lastName: {
    required: 'El apellido es requerido',
    invalid: 'El apellido debe tener al menos 2 caracteres y solo puede contener letras'
  }
};

// User storage utilities
export const userStorage = {
  save: (userData) => {
    try {
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const newUser = {
        id: Date.now(),
        ...userData,
        registeredAt: new Date().toISOString()
      };
      
      existingUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Error saving user:', error);
      return { success: false, error: 'Error al guardar los datos del usuario' };
    }
  },

  getAll: () => {
    try {
      return JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    } catch (error) {
      console.error('Error retrieving users:', error);
      return [];
    }
  },

  checkEmailExists: (email) => {
    const users = userStorage.getAll();
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
  },

  checkUsernameExists: (username) => {
    const users = userStorage.getAll();
    return users.some(user => user.username.toLowerCase() === username.toLowerCase());
  }
};

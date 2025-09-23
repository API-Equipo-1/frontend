
export const validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },

  username: (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    return usernameRegex.test(username);
  },

  name: (name) => {
    const nameRegex = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{2,}$/;
    return nameRegex.test(name.trim());
  },

  phone: (phone) => {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{8,}$/;
    return phoneRegex.test(phone.trim());
  },

  address: (address) => {
    return address.trim().length >= 5;
  },

  city: (city) => {
    const cityRegex = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s\-\.]{2,}$/;
    return cityRegex.test(city.trim());
  },

  postalCode: (code) => {
    const postalRegex = /^[a-zA-Z0-9\s\-]{3,10}$/;
    return postalRegex.test(code.trim());
  }
};

export const errorMessages = {
  username: {
    required: 'El nombre de usuario es requerido',
    invalid: 'El nombre de usuario debe tener al menos 3 caracteres y solo puede contener letras, números y guiones bajos'
  },
  email: {
    required: 'El email es requerido',
    invalid: 'El email no es válido'
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
  },
  nombre: {
    required: 'El nombre es requerido',
    invalid: 'El nombre debe tener al menos 2 caracteres y solo puede contener letras'
  },
  apellido: {
    required: 'El apellido es requerido',
    invalid: 'El apellido debe tener al menos 2 caracteres y solo puede contener letras'
  },
  telefono: {
    required: 'El teléfono es requerido',
    invalid: 'Ingresa un número de teléfono válido'
  },
  direccion: {
    required: 'La dirección es requerida',
    invalid: 'La dirección debe tener al menos 5 caracteres'
  },
  ciudad: {
    required: 'La ciudad es requerida',
    invalid: 'Ingresa un nombre de ciudad válido'
  },
  codigoPostal: {
    required: 'El código postal es requerido',
    invalid: 'Ingresa un código postal válido'
  }
};

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

export const validateField = (fieldName, value) => {
  if (!value || !value.toString().trim()) {
    return errorMessages[fieldName]?.required || `${fieldName} es requerido`;
  }

  let isValid = false;
  switch (fieldName) {
    case 'email':
      isValid = validators.email(value);
      break;
    case 'nombre':
    case 'apellido':
    case 'firstName':
    case 'lastName':
      isValid = validators.name(value);
      break;
    case 'telefono':
      isValid = validators.phone(value);
      break;
    case 'direccion':
      isValid = validators.address(value);
      break;
    case 'ciudad':
      isValid = validators.city(value);
      break;
    case 'codigoPostal':
      isValid = validators.postalCode(value);
      break;
    case 'username':
      isValid = validators.username(value);
      break;
    case 'password':
      isValid = validators.password(value);
      break;
    default:
      isValid = true;
  }

  return isValid ? null : (errorMessages[fieldName]?.invalid || `${fieldName} no es válido`);
};

export const validateCheckoutForm = (datosCliente) => {
  const errors = {};
  const fields = ['nombre', 'apellido', 'email', 'telefono', 'direccion', 'ciudad', 'codigoPostal'];
  
  fields.forEach(field => {
    const error = validateField(field, datosCliente[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

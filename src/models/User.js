
export class User {
  constructor(userData) {
    this.id = userData.id || null; // Will be assigned by JSON Server
    this.username = userData.username;
    this.email = userData.email.toLowerCase();
    this.password = userData.password; //no security measures for demo purposes
    this.firstName = userData.firstName;
    this.lastName = userData.lastName;
    this.registeredAt = userData.registeredAt || new Date().toISOString();
    this.isActive = userData.isActive !== undefined ? userData.isActive : true;
  }

  static fromFormData(formData) {
    return new User({
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim()
    });
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }


//Get user data for API requests (excluding sensitive info when needed)
  toJSON(includeSensitive = true) {
    const userData = {
      id: this.id,
      username: this.username,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      registeredAt: this.registeredAt,
      isActive: this.isActive
    };

    if (includeSensitive) {
      userData.password = this.password;
    }

    return userData;
  }


//Get safe user data for client-side display (no password)

  toPublicJSON() {
    return this.toJSON(false);
  }

  static validate(userData) {
    const errors = {};

    // Username validation
    if (!userData.username || userData.username.trim().length < 3) {
      errors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    } else if (!/^[a-zA-Z0-9_]{3,}$/.test(userData.username.trim())) {
      errors.username = 'El nombre de usuario solo puede contener letras, números y guiones bajos';
    }

    // Email validation
    if (!userData.email || !userData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email.trim())) {
      errors.email = 'Ingresa un email válido';
    }

    // Password validation
    if (!userData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(userData.password)) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número';
    }

    // First name validation
    if (!userData.firstName || userData.firstName.trim().length < 2) {
      errors.firstName = 'El nombre debe tener al menos 2 caracteres';
    } else if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{2,}$/.test(userData.firstName.trim())) {
      errors.firstName = 'El nombre solo puede contener letras';
    }

    // Last name validation
    if (!userData.lastName || userData.lastName.trim().length < 2) {
      errors.lastName = 'El apellido debe tener al menos 2 caracteres';
    } else if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{2,}$/.test(userData.lastName.trim())) {
      errors.lastName = 'El apellido solo puede contener letras';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}
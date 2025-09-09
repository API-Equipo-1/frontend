import { useState } from 'react';
import { validators, errorMessages, userStorage } from '../utils/validation';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = errorMessages.username.required;
    } else if (!validators.username(formData.username)) {
      newErrors.username = errorMessages.username.invalid;
    } else if (userStorage.checkUsernameExists(formData.username)) {
      newErrors.username = 'Este nombre de usuario ya está en uso';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = errorMessages.email.required;
    } else if (!validators.email(formData.email)) {
      newErrors.email = errorMessages.email.invalid;
    } else if (userStorage.checkEmailExists(formData.email)) {
      newErrors.email = 'Este email ya está registrado';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = errorMessages.password.required;
    } else if (!validators.password(formData.password)) {
      newErrors.password = errorMessages.password.invalid;
    }

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = errorMessages.firstName.required;
    } else if (!validators.name(formData.firstName)) {
      newErrors.firstName = errorMessages.firstName.invalid;
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = errorMessages.lastName.required;
    } else if (!validators.name(formData.lastName)) {
      newErrors.lastName = errorMessages.lastName.invalid;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save user data using utility
      const result = userStorage.save({
        username: formData.username,
        email: formData.email,
        password: formData.password, // In real app, this should be hashed
        firstName: formData.firstName,
        lastName: formData.lastName
      });

      if (result.success) {
        alert('¡Registro exitoso! Usuario creado correctamente.');
        
        // Reset form
        setFormData({
          username: '',
          email: '',
          password: '',
          firstName: '',
          lastName: ''
        });
      } else {
        alert(result.error || 'Error al registrar usuario. Inténtalo de nuevo.');
      }

    } catch (error) {
      console.error('Error al registrar usuario:', error);
      alert('Error al registrar usuario. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">Crear Cuenta</h1>
        <p className="register-subtitle">Únete a nuestra tienda</p>
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Nombre de Usuario
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`form-input ${errors.username ? 'error' : ''}`}
              placeholder="Ej: juan_perez"
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                Nombre
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`form-input ${errors.firstName ? 'error' : ''}`}
                placeholder="Juan"
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                Apellido
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`form-input ${errors.lastName ? 'error' : ''}`}
                placeholder="Pérez"
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="juan@ejemplo.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Mínimo 8 caracteres"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button 
            type="submit" 
            className={`submit-button ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className="login-link">
          ¿Ya tienes cuenta? <a href="#login">Inicia Sesión</a>
        </p>
      </div>
    </div>
  );
};

export default Register;

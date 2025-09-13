import { useState } from 'react';
import { User } from '../models/User';
import { userService } from '../services/userService';
import '../styles/Register.css';

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

  const validateForm = async () => {
    // First, validate the form data using the User class
    const validation = User.validate(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return false;
    }

    // Then check for duplicates via API
    try {
      const apiValidation = await userService.validateRegistration(formData);
      if (!apiValidation.isValid) {
        setErrors(apiValidation.errors);
        return false;
      }
    } catch (error) {
      console.error('Error validating registration:', error);
      setErrors({ general: 'Error de conexión. Inténtalo de nuevo.' });
      return false;
    }

    return true;
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
    
    if (!(await validateForm())) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create User instance from form data
      const newUser = User.fromFormData(formData);
      
      // Save to JSON Server
      await userService.createUser(newUser.toJSON());

      alert('¡Registro exitoso! Usuario creado correctamente.');
      
      // Reset form
      setFormData({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: ''
      });

      // Clear any existing errors
      setErrors({});

    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setErrors({ 
        general: 'Error al registrar usuario. Verifica que el servidor esté funcionando.' 
      });
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
          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}
          
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

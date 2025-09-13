import { useState } from 'react';
import { userService } from '../services/userService';
import '../styles/Register.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
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
      // Attempt login using userService
      const loginResult = await userService.loginUser(formData.email, formData.password);

      if (loginResult.success) {
        alert(`¡Bienvenido/a ${loginResult.user.firstName}! Has iniciado sesión correctamente.`);
        
        // Here you would typically:
        // - Store user data in localStorage/sessionStorage
        // - Update global state (Context/Redux)
        // - Redirect to dashboard/home page
        
        // For now, just reset the form
        setFormData({
          email: '',
          password: ''
        });

        // Clear any existing errors
        setErrors({});

      } else {
        setErrors({ 
          general: loginResult.message || 'Credenciales inválidas. Verifica tu email y contraseña.' 
        });
      }

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setErrors({ 
        general: 'Error al iniciar sesión. Verifica que el servidor esté funcionando.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">Iniciar Sesión</h1>
        <p className="register-subtitle">Accede a tu cuenta</p>
        
        <form onSubmit={handleSubmit} className="register-form">
          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}
          
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
              placeholder="Ingresa tu contraseña"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button 
            type="submit" 
            className={`submit-button ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="login-link">
          ¿No tienes cuenta? <a href="#register">Regístrate</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
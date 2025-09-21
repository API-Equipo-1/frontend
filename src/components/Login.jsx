import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { userService } from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import '../styles/Register.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  
  const redirectTo = searchParams.get('redirect') || '/catalog';

  const validateForm = () => {
    const newErrors = {};

    // validacion de email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido';
    }

    // validacion de contraseña
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

    // Limpiar error cuando el usuario comienza a escribir
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
      // Intentar iniciar sesión usando userService
      const loginResult = await userService.loginUser(formData.email, formData.password);

      if (loginResult.success) {
        // Almacenar datos del usuario en el contexto de autenticación
        login(loginResult.user);
        navigate(redirectTo);
        
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
        <p className="register-subtitle">
          {redirectTo === '/checkout' 
            ? 'Para finalizar tu compra, necesitas iniciar sesión' 
            : 'Accede a tu cuenta'
          }
        </p>
        
        {redirectTo === '/checkout' && (
          <div className="checkout-info" style={{
            backgroundColor: '#e3f2fd',
            padding: '0.75rem',
            borderRadius: '4px',
            marginBottom: '1rem',
            border: '1px solid #bbdefb'
          }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#1565c0' }}>
              🛒 Tu carrito se mantendrá guardado mientras inicias sesión
            </p>
          </div>
        )}
        
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
          ¿No tienes cuenta? <Link to={`/register${redirectTo !== '/catalog' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}>Regístrate</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
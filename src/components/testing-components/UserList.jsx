import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import '../../styles/UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    if (!showList) return;
    
    setLoading(true);
    setError('');
    
    try {
      const registeredUsers = await userService.getAllUsers();
      setUsers(registeredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error al cargar usuarios. Verifica que el servidor esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [showList]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearAllUsers = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todos los usuarios registrados?')) {
      setLoading(true);
      try {
        await userService.clearAllUsers();
        setUsers([]);
        alert('Todos los usuarios han sido eliminados.');
      } catch (error) {
        console.error('Error clearing users:', error);
        setError('Error al eliminar usuarios.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleList = () => {
    setShowList(!showList);
    if (!showList) {
      setError(''); // Clear any previous errors when opening
    }
  };

  return (
    <div className="user-list-container">
      <button 
        className="toggle-button"
        onClick={handleToggleList}
      >
        {showList ? 'Ocultar' : 'Ver'} Usuarios Registrados ({users.length})
      </button>

      {showList && (
        <div className="user-list">
          <div className="user-list-header">
            <h3>Usuarios Registrados</h3>
            {users.length > 0 && !loading && (
              <button 
                className="clear-button"
                onClick={clearAllUsers}
                disabled={loading}
              >
                Limpiar Todo
              </button>
            )}
          </div>

          {loading && (
            <div className="loading-message">
              Cargando usuarios...
            </div>
          )}

          {error && (
            <div className="error-message-list">
              {error}
            </div>
          )}

          {!loading && !error && users.length === 0 && (
            <p className="no-users">No hay usuarios registrados</p>
          )}

          {!loading && !error && users.length > 0 && (
            <div className="users-grid">
              {users.map((user) => (
                <div key={user.id} className="user-card">
                  <h4>{user.firstName} {user.lastName}</h4>
                  <p><strong>Usuario:</strong> {user.username}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p className="register-date">
                    Registrado: {new Date(user.registeredAt).toLocaleDateString('es-ES')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserList;

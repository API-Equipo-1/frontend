import { useState } from 'react'
import Register from './components/Register'
import Login from './components/Login'
import UserList from './components/testing-components/UserList'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('register'); // 'register' or 'login'

  return (
    <div className="App">
      {/* Simple navigation for testing */}
      <div style={{ 
        position: 'fixed', 
        top: '20px', 
        left: '20px', 
        zIndex: 1000,
        display: 'flex',
        gap: '10px'
      }}>
        <button 
          onClick={() => setCurrentView('register')}
          style={{
            padding: '8px 16px',
            backgroundColor: currentView === 'register' ? '#374151' : '#e5e7eb',
            color: currentView === 'register' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Register
        </button>
        <button 
          onClick={() => setCurrentView('login')}
          style={{
            padding: '8px 16px',
            backgroundColor: currentView === 'login' ? '#374151' : '#e5e7eb',
            color: currentView === 'login' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
      </div>

      {/* Render current view */}
      {currentView === 'register' && <Register />}
      {currentView === 'login' && <Login />}
      
      {/* User list for testing */}
      <UserList />
    </div>
  )
}

export default App

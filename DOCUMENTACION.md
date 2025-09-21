# 🛍️ E-Commerce Project - Documentación Técnica

## 📋 Índice
1. [Arquitectura General](#arquitectura-general)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Workflows Principales](#workflows-principales)
4. [Contextos y State Management](#contextos-y-state-management)
5. [Hooks Personalizados](#hooks-personalizados)
6. [Componentes](#componentes)
7. [Routing y Navegación](#routing-y-navegación)
8. [Gestión de Estilos](#gestión-de-estilos)
9. [Features Implementadas](#features-implementadas)
10. [Persistencia de Datos](#persistencia-de-datos)

---

## 🏗️ Arquitectura General

### Stack Tecnológico
- **Frontend**: React 18 + Vite
- **Routing**: React Router DOM
- **Backend**: JSON Server (simulación)
- **Styling**: CSS Modules
- **State Management**: Context API + hooks

### Patrón Arquitectónico
- **Component-Based Architecture**: Separación clara de responsabilidades
- **Context Pattern**: Manejo global de estado
- **Custom Hooks**: Lógica reutilizable
- **Protected Routes**: Control de acceso

---

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── management/      # Gestión de productos
│   └── testing-components/
├── context/             # Contextos globales
├── hooks/               # Hooks personalizados
├── routes/              # Configuración de rutas
├── services/            # Servicios API
├── styles/              # Estilos CSS
├── utils/               # Utilidades
└── front-end-db/        # Base de datos simulada
```

### Modularidad
- **Separación por funcionalidad**: Cada feature en su carpeta
- **Componentes reutilizables**: ProductCard, Cart, etc.
- **Servicios centralizados**: productService, userService
- **Estilos modulares**: Un CSS por componente

---

## 🔄 Workflows Principales

### 1. **Autenticación**
```
Login → Validación → Context Update → Redirect → Protected Routes
```

### 2. **Gestión de Productos**
```
Catalog → ProductCard → Add to Cart → CartContext → LocalStorage
```

### 3. **Proceso de Compra**
```
Cart → Checkout → Form Validation → Order Processing → Confirmation
```

### 4. **Administración**
```
Product Management → CRUD Operations → API Calls → State Update
```

---

## 🎯 Contextos y State Management

### AuthContext
**Propósito**: Gestión de autenticación global
```javascript
// Estado gestionado
{
  user: null | UserObject,
  isAuthenticated: boolean,
  login: function,
  logout: function
}
```

### CartContext
**Propósito**: Gestión del carrito de compras
```javascript
// Estado gestionado
{
  carrito: [],
  productosOriginales: [],
  agregarAlCarrito: function,
  eliminarDelCarrito: function,
  actualizarCantidad: function,
  vaciarCarrito: function
}
```

**Features Especiales**:
- **Persistencia**: LocalStorage automático
- **Stock Validation**: Previene sobrecompra
- **Field Mapping**: Compatibilidad API inglés ↔ español

---

## 🪝 Hooks Personalizados

### useAuth
**Ubicación**: `src/hooks/useAuth.js`
**Propósito**: Simplificar acceso al AuthContext
```javascript
const { user, login, logout, isAuthenticated } = useAuth();
```

### useCart
**Ubicación**: `src/context/CartContext.jsx`
**Propósito**: Acceso completo a funcionalidades del carrito
```javascript
const { 
  carrito, 
  agregarAlCarrito, 
  cantidadTotalItems 
} = useCart();
```

---

## 🧩 Componentes

### Componentes de Layout
- **App.jsx**: Wrapper principal con providers
- **AppRoutes.jsx**: Configuración de rutas

### Componentes de Autenticación
- **Login.jsx**: Formulario de inicio de sesión
- **Register.jsx**: Registro de usuarios
- **ProtectedRoute.jsx**: HOC para rutas protegidas

### Componentes de Productos
- **Catalog.jsx**: Vista principal con productos + carrito lateral
- **ProductCard.jsx**: Tarjeta individual de producto
- **Product.jsx**: Vista detallada de producto
- **ProductList.jsx**: Lista de productos (legacy)

### Componentes de Carrito
- **Cart.jsx**: Componente de carrito reutilizable
- **CartPage.jsx**: Página completa del carrito
- **Checkout.jsx**: Proceso de compra

### Componentes de Gestión
- **ProductTable.jsx**: Tabla de productos del usuario
- **ProductForm.jsx**: Formulario CRUD de productos
- **ProductStats.jsx**: Estadísticas de productos

---

## 🛣️ Routing y Navegación

### Rutas Públicas
```javascript
/login          // Inicio de sesión
/register       // Registro
```

### Rutas Protegidas
```javascript
/catalog        // Catálogo principal
/product/:id    // Detalle de producto
/cart          // Página del carrito
/checkout      // Proceso de compra
```

### Rutas de Gestión
```javascript
/product-management    // Gestión de productos
/product-form         // Formulario de productos
/product-stats/:id    // Estadísticas
```

---

## 🎨 Gestión de Estilos

### Organización
- **Un CSS por componente**: `Component.jsx` → `Component.css`
- **Estilos globales**: `App.css`, `index.css`
- **Responsive design**: Mobile-first approach

### Componentes Estilizados
```
App.css           # Estilos generales
Catalog.css       # Vista catálogo
Cart.css          # Carrito de compras
Checkout.css      # Proceso de compra
Product.css       # Vista de producto
ProductList.css   # Lista de productos
Register.css      # Formulario registro
```

---

## ✨ Features Implementadas

### 🔐 Autenticación
- Login/Logout con persistencia
- Rutas protegidas
- Gestión de sesión

### 🛒 Carrito de Compras
- **Add to Cart**: Desde catálogo y detalle
- **Real-time Stock**: Validación dinámica
- **Quantity Management**: Incrementar/decrementar
- **Persistence**: LocalStorage automático
- **Visual Feedback**: Badge con cantidad

### 🛍️ Catálogo
- **Grid responsivo** de productos
- **Carrito lateral** cuando tiene items
- **Navegación** a detalle de producto
- **Stock en tiempo real**

### 📦 Gestión de Productos
- **CRUD completo**: Crear, leer, actualizar, eliminar
- **Validación de formularios**
- **Estadísticas básicas**

### 💳 Checkout
- **Formulario completo** de datos de envío
- **Validación client-side**
- **Resumen de pedido**
- **Simulación de procesamiento**

---

## 💾 Persistencia de Datos

### Frontend (Simulación)
```javascript
// JSON Server en puerto 3001
/products       // Productos
/users         // Usuarios
```

### LocalStorage
```javascript
// Carrito persistente
localStorage.setItem('carrito', JSON.stringify(carrito));

// Recuperación automática
const carritoGuardado = localStorage.getItem('carrito');
```

### API Integration
- **RESTful calls**: GET, POST, PUT, DELETE
- **Error handling**: Try-catch con feedback
- **Loading states**: Indicadores de carga

---

## 🔄 Data Flow

### Flujo de Datos Típico
```
User Action → Component → Context → API Service → State Update → UI Re-render
```

### Ejemplo: Agregar al Carrito
```
ProductCard.onClick → 
agregarAlCarrito() → 
CartContext.setState → 
LocalStorage.save → 
UI.update
```

---

## 🚀 Próximas Implementaciones

### Pendientes
- **Payment Gateway**: Integración de pagos
- **User Profiles**: Perfiles de usuario completos
- **Order History**: Historial de pedidos
- **Product Reviews**: Sistema de reseñas
- **Search & Filters**: Búsqueda avanzada
- **Admin Dashboard**: Panel administrativo completo

---

## 📈 Métricas del Proyecto

- **Componentes**: ~15 componentes React
- **Rutas**: 8 rutas configuradas
- **Contextos**: 2 contextos globales
- **Hooks**: 2 hooks personalizados
- **Servicios**: 2 servicios API
- **Estilos**: 8 archivos CSS modulares

---

*Proyecto desarrollado con React + Vite para el curso universitario de Desarrollo Web*
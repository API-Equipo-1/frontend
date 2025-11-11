import apiClient from './apiClient';

/**
 * Servicio para gestionar pedidos
 */
const orderService = {
  /**
   * Crear un nuevo pedido desde el checkout
   * @param {Object} pedidoData - Datos del pedido
   * @param {number} pedidoData.usuarioId - ID del usuario
   * @param {Array} pedidoData.detalles - Lista de productos con cantidad y precio
   * @param {Object} pedidoData.direccion - Dirección de envío
   * @param {string} pedidoData.nombre - Nombre del cliente
   * @param {string} pedidoData.apellido - Apellido del cliente
   * @param {string} pedidoData.email - Email del cliente
   * @param {string} pedidoData.telefono - Teléfono del cliente
   * @returns {Promise<Object>} Pedido creado con su ID y detalles
   */
  async createPedido(pedidoData) {
    try {
      const response = await apiClient.post('/pedidos/checkout', pedidoData);
      return response.data;
    } catch (error) {
      console.error('Error al crear pedido:', error);
      throw error;
    }
  },

  /**
   * Obtener todos los pedidos
   * @returns {Promise<Array>} Lista de pedidos
   */
  async getAllPedidos() {
    try {
      const response = await apiClient.get('/pedidos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      throw error;
    }
  },

  /**
   * Obtener un pedido por ID
   * @param {number} id - ID del pedido
   * @returns {Promise<Object>} Pedido encontrado
   */
  async getPedidoById(id) {
    try {
      const response = await apiClient.get(`/pedidos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener pedido:', error);
      throw error;
    }
  },

  /**
   * Convertir carrito a formato de detalles de pedido
   * @param {Array} carrito - Items del carrito
   * @returns {Array} Detalles formateados para el pedido
   */
  formatCartToOrderDetails(carrito) {
    return carrito.map(item => ({
      productoId: item.id,
      cantidad: item.cantidad,
      precioUnitario: item.precio,
      subtotal: item.cantidad * item.precio
    }));
  }
};

export default orderService;

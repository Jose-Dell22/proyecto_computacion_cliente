import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { APP_CONFIG } from '../config/constants';
import { apiFetch } from '../api/client';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de un AppProvider');
  }
  return context;
};

function toId(doc) {
  const raw = doc?._id ?? doc?.id;
  if (raw == null) return null;
  return typeof raw === 'object' && raw?.toString ? raw.toString() : String(raw);
}

export function normalizeProduct(p) {
  if (!p) return null;
  const id = toId(p);
  return { ...p, id };
}

function mapProfileToAdmin(u) {
  return {
    id: toId({ _id: u.userId ?? u.id }) ?? u.userId,
    nombre: u.name,
    apellido: u.lastName || '',
    email: u.email,
    telefono: u.phone || '',
    rol: u.role === 'admin' ? 'Administrador' : u.role,
    fechaIngreso: u.createdAt || new Date().toISOString(),
  };
}

function mapReservationFromApi(r) {
  if (!r) return null;
  const c = r.customer || {};
  return {
    id: toId(r),
    nombre: c.name || '',
    apellido: c.lastName || '',
    email: c.email || '',
    telefono: c.phone || '',
    fecha: r.date || '',
    hora: r.time || '',
    personas: r.people ?? 2,
    mesa: '',
    termino: r.preferences?.cooking || '',
    notas: r.note || '',
  };
}

function reservationFlatToApiBody(f) {
  return {
    customer: {
      name: f.nombre,
      lastName: f.apellido,
      email: f.email || '',
      phone: f.telefono,
    },
    date: f.fecha,
    time: f.hora,
    people: f.personas,
    preferences: {
      cut: '',
      cooking: f.termino || '',
      portions: f.personas,
    },
    note: [f.mesa && `Mesa: ${f.mesa}`, f.notas].filter(Boolean).join('\n') || undefined,
  };
}

function mapContactToSuggestion(c) {
  return {
    id: toId(c),
    nombre: c.name,
    email: c.email,
    mensaje: c.message,
    fecha: c.createdAt,
  };
}

function mapWorkerRow(u) {
  if (!u || u.role !== 'worker') return null;
  return {
    id: toId(u),
    nombre: u.name,
    apellido: u.lastName || '',
    email: u.email,
    telefono: u.phone || '',
    rol: u.role,
  };
}

function mapOrderFromApi(order) {
  if (!order) return null;
  const customer = order.customer || {};
  const delivery = order.delivery || {};
  return {
    id: toId(order),
    customerName: customer.name || '',
    customerPhone: customer.phone || '',
    customerEmail: customer.email || '',
    deliveryAddress: delivery.address || '',
    deliveryReference: delivery.reference || '',
    items: order.items || [],
    total: order.total || 0,
    status: order.status || 'pending',
    createdAt: order.createdAt || new Date().toISOString(),
  };
}

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  
  // Inicializar carrito desde localStorage
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });
  const [contactForm, setContactForm] = useState({
    data: { nombre: '', email: '', mensaje: '' },
    errors: {},
    isSubmitting: false,
    successMessage: '',
  });
  const [suggestions, setSuggestions] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [adminUser, setAdminUser] = useState(null);

  const fetchReservations = useCallback(async () => {
    try {
      const res = await apiFetch('/api/objects/reservations');
      if (!res.ok) return;
      const data = await res.json();
      setReservations(data.map(mapReservationFromApi).filter(Boolean));
    } catch (e) {
      console.error('Error fetching reservations:', e);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await apiFetch('/api/objects/orders');
      if (!res.ok) return;
      const data = await res.json();
      setOrders(data.map(mapOrderFromApi).filter(Boolean));
    } catch (e) {
      console.error('Error fetching orders:', e);
    }
  }, []);

  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    try {
      const res = await apiFetch(`/api/objects/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!res.ok) throw new Error('Error al actualizar estado');
      
      // Actualizar el estado local
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      return true;
    } catch (e) {
      console.error('Error updating order status:', e);
      throw e;
    }
  }, []);

  const fetchContactsAsSuggestions = useCallback(async () => {
    try {
      const res = await apiFetch('/api/objects/contacts');
      if (!res.ok) return;
      const data = await res.json();
      setSuggestions(data.map(mapContactToSuggestion));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchWorkers = useCallback(async () => {
    try {
      const res = await apiFetch('/api/objects/users');
      if (!res.ok) return;
      const data = await res.json();
      setWorkers(data.map(mapWorkerRow).filter(Boolean));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      setProductsLoading(true);
      const res = await apiFetch('/api/objects/products');
      if (!res.ok) throw new Error('Error al cargar productos');
      const data = await res.json();
      setProducts(data.map(normalizeProduct).filter(Boolean));
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), APP_CONFIG.APP.loadingTime);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch('/api/profile');
        if (!res.ok) return;
        const u = await res.json();
        if (u.role === 'admin') {
          setAdminUser(mapProfileToAdmin(u));
        }
      } catch (_) {
        /* sin sesión */
      }
    })();
  }, []);

  useEffect(() => {
    if (!adminUser) return;
    fetchReservations();
    fetchContactsAsSuggestions();
    fetchWorkers();
    fetchOrders();
  }, [adminUser, fetchReservations, fetchContactsAsSuggestions, fetchWorkers, fetchOrders]);

  // Persistir carrito en localStorage cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  const addToCart = (item) => {
    const pid = item.id ?? item._id;
    setCart((prev) => {
      const existingItemIndex = prev.findIndex(
        (cartItem) => (cartItem.id ?? cartItem._id) === pid
      );
      if (existingItemIndex !== -1) {
        const updatedCart = [...prev];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: (updatedCart[existingItemIndex].quantity || 1) + 1,
        };
        return updatedCart;
      }
      return [...prev, { ...normalizeProduct(item), quantity: 1 }];
    });
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((item, itemIndex) => itemIndex !== index));
  };

  const decreaseQuantity = (index) => {
    setCart((prev) => {
      const updatedCart = [...prev];
      const item = updatedCart[index];
      if (item.quantity > 1) {
        updatedCart[index] = { ...item, quantity: item.quantity - 1 };
      } else {
        updatedCart.splice(index, 1);
      }
      return updatedCart;
    });
  };

  const increaseQuantity = (index) => {
    setCart((prev) => {
      const updatedCart = [...prev];
      updatedCart[index] = {
        ...updatedCart[index],
        quantity: (updatedCart[index].quantity || 1) + 1,
      };
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () =>
    cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0);

  const getCartItemsCount = () =>
    cart.reduce((total, item) => total + (item.quantity || 1), 0);

  const updateContactForm = (updates) => {
    setContactForm((prev) => ({ ...prev, ...updates }));
  };

  const resetContactForm = () => {
    setContactForm({
      data: { nombre: '', email: '', mensaje: '' },
      errors: {},
      isSubmitting: false,
      successMessage: '',
    });
  };

  const submitContactMessage = async ({ nombre, email, mensaje }) => {
    const res = await apiFetch('/api/objects/contacts', {
      method: 'POST',
      body: JSON.stringify({ name: nombre, email, message: mensaje }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al enviar el mensaje');
    }
  };

  const deleteSuggestion = async (id) => {
    const res = await apiFetch(`/api/objects/contacts/${id}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 204) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al eliminar');
    }
    setSuggestions((prev) => prev.filter((s) => String(s.id) !== String(id)));
  };

  const addReservation = async (reservation) => {
    const totalQty = reservation.cortesDetalle?.reduce(
      (s, r) => s + (parseInt(r.qty, 10) || 0),
      0
    ) ?? 0;
    const body = {
      customer: {
        name: reservation.nombre,
        lastName: reservation.apellido,
        email: reservation.email || '',
        phone: reservation.telefono,
      },
      date: reservation.fecha,
      time: reservation.hora,
      people: reservation.personas,
      preferences: {
        cut: (reservation.cortesDetalle || []).map((r) => r.corte).filter(Boolean).join(', '),
        cooking: reservation.termino || '',
        portions: totalQty,
      },
      vip: false,
      note:
        [reservation.mesa && `Mesa: ${reservation.mesa}`, reservation.notas]
          .filter(Boolean)
          .join('\n') || undefined,
    };
    const res = await apiFetch('/api/objects/reservations', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al guardar la reserva');
    }
    const saved = await res.json();
    setReservations((prev) => [mapReservationFromApi(saved), ...prev]);
  };

  const updateReservation = async (id, updatedReservation) => {
    const res = await apiFetch(`/api/objects/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reservationFlatToApiBody(updatedReservation)),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al actualizar');
    }
    const saved = await res.json();
    setReservations((prev) =>
      prev.map((r) => (String(r.id) === String(id) ? mapReservationFromApi(saved) : r))
    );
  };

  const deleteReservation = async (id) => {
    const res = await apiFetch(`/api/objects/reservations/${id}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 204) return;
    setReservations((prev) => prev.filter((r) => String(r.id) !== String(id)));
  };

  const addProduct = async (product) => {
    const res = await apiFetch('/api/objects/products', {
      method: 'POST',
      body: JSON.stringify({
        title: product.title,
        description: product.description || '',
        price: Number(product.price),
        image: product.image,
        category: product.category || 'food',
        available: true,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al crear producto');
    }
    const saved = await res.json();
    setProducts((prev) => [normalizeProduct(saved), ...prev]);
  };

  const updateProduct = async (id, updatedProduct) => {
    const res = await apiFetch(`/api/objects/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: updatedProduct.title,
        description: updatedProduct.description || '',
        price: Number(updatedProduct.price),
        image: updatedProduct.image,
        category: updatedProduct.category || 'food',
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al actualizar producto');
    }
    const saved = await res.json();
    setProducts((prev) =>
      prev.map((p) => (String(p.id) === String(id) ? normalizeProduct(saved) : p))
    );
  };

  const deleteProduct = async (id) => {
    const res = await apiFetch(`/api/objects/products/${id}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 204) return;
    setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
  };

  const loginAdmin = async (email, password) => {
    const res = await apiFetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Error al iniciar sesión');
    
    // Permitir acceso a admin y workers
    if (data.role !== 'admin' && data.role !== 'worker') {
      throw new Error('No tienes permisos de administrador o trabajador');
    }
    
    setAdminUser({
      id: toId({ _id: data.id }) ?? data.id,
      nombre: data.name,
      apellido: data.lastName || '',
      email: data.email,
      telefono: data.phone || '',
      rol: data.role === 'admin' ? 'Administrador' : 'Trabajador',
      fechaIngreso: new Date().toISOString(),
    });
    
    // Cargar datos según el rol
    if (data.role === 'admin') {
      await fetchReservations();
      await fetchContactsAsSuggestions();
      await fetchWorkers();
      await loadProducts();
    }
    
    // Cargar pedidos para ambos roles
    await fetchOrders();
  };

  const logoutAdmin = async () => {
    await apiFetch('/api/logout', { method: 'POST' });
    setAdminUser(null);
    setSuggestions([]);
    setReservations([]);
    setWorkers([]);
  };

  const createWorker = async (payload) => {
    const { name, lastName, email, password, phone } = payload;
    const res = await apiFetch('/api/workers', {
      method: 'POST',
      body: JSON.stringify({
        name,
        lastName: lastName || '',
        email,
        password,
        phone: phone || undefined,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al crear trabajador');
    }
    await fetchWorkers();
  };

  const value = {
    loading,
    products,
    productsLoading,
    cart,
    contactForm,
    suggestions,
    reservations,
    orders,
    workers,
    adminUser,
    config: APP_CONFIG,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    updateContactForm,
    resetContactForm,
    submitContactMessage,
    loadSuggestions: fetchContactsAsSuggestions,
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    deleteSuggestion,
    addReservation,
    updateReservation,
    deleteReservation,
    fetchOrders,
    updateOrderStatus,
    loginAdmin,
    logoutAdmin,
    createWorker,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Configuración global de la aplicación
export const APP_CONFIG = {
  // Información del restaurante
  RESTAURANT: {
    name: 'Carnes al Barril',
    location: 'Neiva',
    address: 'Cra. 1 # 23-45, Neiva, Huila, Colombia',
    neighborhood: 'Barrio Centro',
    phone: '+57 318 123 4567',
    email: 'contacto@carnesalbarril.com',
    social: {
      instagram: 'https://www.instagram.com/tu_restaurante',
      facebook: 'https://www.facebook.com/tu_restaurante',
      whatsapp: 'https://wa.me/573181234567',
    },
    schedules: [
      { day: 'Lun – Jue', hours: '12:00 m – 10:00 p. m.' },
      { day: 'Vie – Sáb', hours: '12:00 m – 11:30 p. m.' },
      { day: 'Dom', hours: '12:00 m – 9:00 p. m.' },
    ],
    maps: {
      embedUrl: 'https://www.google.com/maps?q=Carnes%20al%20Barril%20Neiva%20Huila&z=15&output=embed',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Carnes%20al%20Barril%20Neiva%20Huila',
    },
  },

  // Configuración de la aplicación
  APP: {
    loadingTime: 1500,
    messageTimeout: 1500,
    productsPerPage: 4,
  },

  // APIs (rutas relativas al mismo origen; Vite proxy → backend en :4000)
  API: {
    basePath: '/api',
  },

  // Colores del tema
  COLORS: {
    primary: '#ff7b00',
    secondary: '#ff4500',
    background: '#000',
    text: '#fff',
    cardBackground: 'linear-gradient(145deg, #fff5e1, #ffe4b3)',
    navbarBackground: '#111',
    accent: '#f46a1f',
  },

  // Rutas de la aplicación
  ROUTES: {
    HOME: '/',
    PRODUCTS: '/products',
    CONTACT: '/contacto',
    ABOUT: '/about',
    MENU_COMPONENT: '/MenuComponent',
    RESERVATION: "/reservar",
    ADMIN: "/admin",
  },
};

// Configuración de validación de formularios
export const VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 2,
    message: 'Ingresa tu nombre.',
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
    message: 'Correo no válido.',
  },
  message: {
    required: true,
    minLength: 10,
    message: 'Cuéntanos un poco más (≥ 10 caracteres).',
  },
};

// Configuración de mensajes
export const MESSAGES = {
  loading: 'Cargando Carnes al Barril...',
  loadingProducts: 'Cargando productos...',
  contactSuccess: '¡Gracias! Recibimos tu mensaje y te contactaremos pronto.',
  contactError: 'Ocurrió un error al enviar. Intenta de nuevo.',
  productAdded: 'fue agregado al carrito 🛒',
  privacy: 'Nos importa tu privacidad: la información del formulario solo se usa para responder tu solicitud.',
};

// Configuración de iconos
export const ICONS = {
  phone: 'phone',
  email: 'mail',
  map: 'map marker alternate',
  clock: 'clock outline',
  direction: 'direction',
  send: 'send',
  check: 'check circle',
  warning: 'warning circle',
  shield: 'shield alternate',
  instagram: 'instagram',
  facebook: 'facebook',
  whatsapp: 'whatsapp',
  plus: 'plus',
  cart: 'shopping cart',
  arrowDown: 'arrow down',
};

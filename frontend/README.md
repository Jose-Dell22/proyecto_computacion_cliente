Cambios realizados:
Backend (backend/src/routes/task.routes.js)
Rutas públicas (sin JWT) para que el sitio funcione sin login:
GET /api/objects/products y GET /api/objects/products/:id — catálogo
POST /api/objects/contacts, POST /api/objects/reservations, POST /api/objects/orders — formularios y pedidos
El resto de GET/POST/PUT/DELETE sobre /api/objects/... sigue exigiendo cookie de sesión (panel admin).
Frontend
src/api/client.js: apiUrl + apiFetch con credentials: 'include' para las cookies httpOnly del login.
vite.config.js: proxy /api → http://localhost:4000 sin quitar el prefijo /api (antes el rewrite rompía las rutas).
.env: VITE_API_URL vacío en desarrollo (peticiones relativas al proxy). En producción, pon la URL absoluta del backend.
config/constants.js: eliminado FakeStore; la API base es /api.
AppContext.jsx: productos, contactos (sugerencias), reservas y CRUD de productos contra el backend; sesión admin con GET /api/profile al cargar; loginAdmin / logoutAdmin; productsLoading.
Home / Products: datos desde el contexto (Mongo).
Contacto: POST a contactos reales; corrección del submit del formulario (handleSubmit(onSubmit) + preventDefault).
Reservas: envío al esquema anidado del backend (customer, date, time, etc.).
AdminDashboard: pantalla de login si no hay sesión; operaciones async contra la API.
Cómo probarlo
MongoDB en marcha y node backend (puerto 4000).
Frontend: npm run dev en la carpeta frontend (puerto 5173).
Usuario administrador: registrar uno con rol admin, por ejemplo con POST http://localhost:4000/api/register y cuerpo JSON que incluya "role": "admin" (además de name, email, password, etc., según tu schema).
Entrar en /admin con ese email y contraseña.
Si despliegas el build del frontend en otro dominio, define VITE_API_URL con la URL del API y ajusta cors en backend/src/index.js para ese origen.
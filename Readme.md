# Carnes al Barril — Proyecto final

Sitio web para un restaurante de parrilla (**Neiva, Huila**): catálogo desde **MongoDB**, carrito en el navegador, **contacto** y **reservas** persistidas, e **panel de administración** con gestión de **productos**, **mensajes**, **reservas** y **trabajadores** (rol `worker`). Backend en **Node.js (Express 5)** + **Mongoose**; frontend en **React 18** + **Vite**.

---

## Inicio rápido

1. Tener **MongoDB** en marcha (por defecto `mongodb://localhost:27017/`).
2. Instalar dependencias en **raíz**, **`backend/`** y **`frontend/`** (`npm install` en cada uno).
3. Copiar variables de entorno (ver [Variables de entorno](#variables-de-entorno)).
4. Desde la **raíz del proyecto**:

```bash
npm run dev
```

También puedes usar `npm start` (equivale al mismo comando).

Abre **`http://localhost:5173`**. Para el panel admin usa las [cuentas de prueba](#usuarios-de-prueba-y-roles) o un usuario `admin` existente.

> Las contraseñas de demostración son solo para desarrollo; cámbialas en entornos reales.

---

## Tabla de contenidos

1. [Qué hace la aplicación](#qué-hace-la-aplicación)
2. [Estructura del repositorio](#estructura-del-repositorio)
3. [Arquitectura y flujo de datos](#arquitectura-y-flujo-de-datos)
4. [Arranque del backend](#arranque-del-backend)
5. [Rutas del frontend](#rutas-del-frontend)
6. [Casos de uso (pantalla por pantalla)](#casos-de-uso-pantalla-por-pantalla)
7. [Panel de administración](#panel-de-administración)
8. [API del backend](#api-del-backend)
9. [Catálogo inicial de productos](#catálogo-inicial-de-productos)
10. [Usuarios de prueba y roles](#usuarios-de-prueba-y-roles)
11. [Instalación detallada](#instalación-detallada)
12. [Variables de entorno](#variables-de-entorno)
13. [Producción](#producción)
14. [Problemas frecuentes](#problemas-frecuentes)

---

## Qué hace la aplicación

| Capa | Tecnología | Función |
|------|------------|---------|
| **Frontend** | React 18, Vite, React Router, Semantic UI React, i18next (es / en / zh) | Sitio público, carrito en memoria, panel `/admin` |
| **Backend** | Express 5, Mongoose, JWT en cookie **httpOnly**, Zod, **dotenv**, **cors** | API REST, seeds, reglas por rol |
| **Datos** | MongoDB | Usuarios (`admin`, `customer`, `worker`), productos, contactos, reservas, pedidos |

- **Visitante:** navega, ve productos del API, usa carrito local, envía contacto y reservas.
- **Cliente (`customer`):** puede registrarse con `POST /api/register` (rol fijo `customer`); no accede al panel.
- **Administrador (`admin`):** panel completo y CRUD protegido bajo `/api/objects/...`.
- **Trabajador (`worker`):** lo crea **solo** un admin (`POST /api/workers` o pestaña *Trabajadores*); puede iniciar sesión y consultar perfil, pero **no** entra al panel ni al CRUD genérico de objetos.

---

## Estructura del repositorio

```
proyecto final/
├── package.json          # Scripts raíz: npm run dev / npm start (concurrently)
├── backend/
│   ├── src/
│   │   ├── index.js      # CORS, rutas /api, arranque async (DB + seeds + listen)
│   │   ├── db.js         # Conexión MongoDB
│   │   ├── config.js     # Secreto JWT (mejor mover a .env en producción)
│   │   ├── routes/       # Auth.routes.js, task.routes.js
│   │   ├── controllers/
│   │   ├── middlewares/  # validateToken (JWT), adminRequired, validador Zod
│   │   ├── models/
│   │   ├── schema/       # Esquemas Zod (register, login, worker)
│   │   └── seed/         # seedProducts.js, seedUsers.js
│   └── .env              # PORT, FRONTEND_URL (no subir secretos reales al repo)
├── frontend/
│   ├── src/
│   │   ├── api/client.js # fetch con credentials para cookies
│   │   ├── context/AppContext.jsx
│   │   ├── components/
│   │   ├── config/constants.js
│   │   └── local/        # Traducciones es, en, zh
│   ├── vite.config.js    # Proxy /api → backend (p. ej. puerto 4000)
│   └── .env              # VITE_API_URL (vacío en dev con proxy)
```

---

## Arquitectura y flujo de datos

### Desarrollo

1. **Vite** sirve la SPA en **`http://localhost:5173`**.
2. El cliente llama a **`/api/...`** en el mismo host; el **proxy** reenvía a **`http://localhost:4000`** manteniendo el prefijo **`/api`**.
3. **`frontend/src/api/client.js`** usa `fetch` con **`credentials: 'include'`** para enviar la cookie **`token`** tras el login.

### Estado global (`AppContext`)

- Productos públicos (`GET /api/objects/products`).
- Carrito (solo memoria del navegador).
- Tras login como **admin:** reservas, contactos (sugerencias), trabajadores (`worker`), CRUD de productos.
- Comprueba sesión con **`GET /api/profile`** al cargar (si no hay cookie → **401**, esperado).

---

## Arranque del backend

En **`backend/src/index.js`** el orden es:

1. `await connectDB()`
2. `await seedProductsIfEmpty()` — si no hay productos, inserta **8** de ejemplo
3. `await seedTestUsersIfMissing()` — crea admin y cliente de prueba si sus emails no existen
4. `app.listen(PORT)` — mensaje en consola: *Abre la aplicación en: …* (según `FRONTEND_URL` o `localhost:5173`)

Si la conexión a MongoDB falla, el proceso termina con error.

---

## Rutas del frontend

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio, destacados desde API |
| `/MenuComponent` | Menú estático traducido (+ carrito) |
| `/products` | Catálogo desde MongoDB |
| `/contacto` | Formulario → `POST /api/objects/contacts` |
| `/about` | Sobre nosotros |
| `/reservar` | Reservas → `POST /api/objects/reservations` |
| `/admin` | Login solo **admin**; pestañas productos, trabajadores, sugerencias, reservas |
| `*` | 404 |

---

## Casos de uso (pantalla por pantalla)

### Inicio (`/`)

Hero, enlaces y **productos destacados** (`GET /api/objects/products`). Si la colección estaba vacía, el seed ya pobló el catálogo.

### Menú estático (`/MenuComponent`)

Platos definidos en traducciones e imágenes bajo `public/`; **no** usa el API para el listado. Ítems se pueden añadir al carrito.

### Productos (`/products`)

Listado con búsqueda y “cargar más”; mismos datos que el inicio.

### Contacto (`/contacto`)

Envío `{ name, email, message }` al API. Si hay carrito, muestra resumen para coordinar por teléfono/WhatsApp. La ruta **`POST /api/objects/orders`** existe en el backend pero **no** está enlazada en la UI por defecto.

### Sobre nosotros (`/about`)

Información del restaurante y enlace a reservas.

### Reservar (`/reservar`)

Formulario mapeado al esquema de reserva en MongoDB (`customer`, `date`, `time`, `people`, `preferences`, `note`, …).

### Carrito flotante

Estado en React; botón para ir a **contacto**. No se guarda en servidor.

### Idioma

Navbar: **es / en / zh**. Los textos de BD (títulos de productos) no se traducen automáticamente.

---

## Panel de administración

**Ruta:** `/admin`

### Acceso

1. Usuario con rol **`admin`** (incluidas las cuentas del [seed](#usuarios-de-prueba-y-roles) si aún no existían en BD).
2. **`POST /api/register`** siempre crea **`customer`**; no se puede asignar `admin` ni `worker` por registro público.
3. El frontend solo deja pasar al dashboard si **`POST /api/login`** devuelve **`role: "admin"`**. Hay un aviso con emails de prueba en la pantalla de login.

### Pestañas

| Pestaña | Contenido | API relevante |
|---------|-----------|---------------|
| **Productos** | CRUD | `GET/POST /api/objects/products`, `PUT/DELETE .../:id` (solo admin) |
| **Trabajadores** | Formulario alta rol `worker`; tabla listada vía usuarios | `POST /api/workers`, `GET /api/objects/users` (filtrado `worker` en cliente) |
| **Sugerencias** | Mensajes de contacto | `GET/DELETE /api/objects/contacts` |
| **Reservas** | CRUD reservas | `GET/POST /api/objects/reservations`, `PUT/DELETE .../:id` |

**Cerrar sesión:** `POST /api/logout`.

---

## API del backend

**Prefijo:** `/api`.

### Autenticación

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/register` | No | Registro → siempre rol **`customer`** (Zod) |
| POST | `/api/login` | No | Cookie **`token`** (JWT) |
| POST | `/api/logout` | No | Limpia cookie |
| GET | `/api/profile` | Cookie JWT | Perfil; **401** sin sesión |
| POST | `/api/workers` | Cookie JWT + **admin** | Crea usuario **`worker`** |

### Objetos (modelos: `products`, `contacts`, `reservations`, `orders`, `users`)

**Sin token (público):**

| Método | Ruta |
|--------|------|
| GET | `/api/objects/products` |
| GET | `/api/objects/products/:id` |
| POST | `/api/objects/contacts` |
| POST | `/api/objects/reservations` |
| POST | `/api/objects/orders` |

Las rutas fijas usan el middleware que rellena `req.params.resource` para el controlador.

**Cookie JWT + rol administrador** (`authRequired` + `adminRequired`):

| Método | Ruta |
|--------|------|
| GET | `/api/objects/:resource` |
| GET | `/api/objects/:resource/:id` |
| POST | `/api/objects/:resource` |
| PUT | `/api/objects/:resource/:id` |
| DELETE | `/api/objects/:resource/:id` |

Usuarios **`customer`** o **`worker`** autenticados reciben **403** aquí.

**Raíz del servidor:** `GET http://localhost:4000/` → mensaje de comprobación del API (no es el frontend).

---

## Catálogo inicial de productos

Archivo: `backend/src/seed/seedProducts.js`.

Si **`Product.countDocuments()` === 0**, se insertan **8** productos de ejemplo (parrilla, COP, imágenes externas). Si ya hay datos, **no** duplica.

---

## Usuarios de prueba y roles

Archivo: `backend/src/seed/seedUsers.js`. Por cada fila, si el **email** no existe en BD, se crea el usuario:

| Email | Contraseña | Rol |
|--------|------------|-----|
| `admin@carnesalbarril.com` | `admin123` | `admin` |
| `cliente@carnesalbarril.com` | `cliente123` | `customer` |

**Resumen de roles**

| Rol | Panel `/admin` | CRUD `/api/objects/...` (protegido) | Cómo se crea |
|-----|----------------|--------------------------------------|--------------|
| `admin` | Sí | Sí | Seed o manual en BD |
| `customer` | No | No | Registro público o seed cliente |
| `worker` | No | No | `POST /api/workers` o pestaña *Trabajadores* |

---

## Instalación detallada

### Requisitos

- Node.js (LTS), npm, MongoDB activo.

### Dependencias (primera vez)

```bash
# Raíz (concurrently)
npm install

cd backend && npm install

cd ../frontend && npm install
```

### Ejecución

**Recomendado — raíz:**

```bash
npm run dev
# o
npm start
```

**Por separado**

- Backend: `cd backend && npm run dev` (nodemon).
- Frontend: `cd frontend && npm run dev`.

URLs habituales: web **`http://localhost:5173`**, API **`http://localhost:4000`** (ajustable con `PORT`).

---

## Variables de entorno

### `backend/.env` (ejemplo)

```env
PORT=4000
FRONTEND_URL=http://localhost:5173
```

- **`FRONTEND_URL`:** orígenes para CORS (varios separados por coma). También define el mensaje “Abre la aplicación en…”.

### `frontend/.env`

```env
VITE_API_URL=
```

- Vacío: peticiones relativas **`/api`** + proxy de Vite.
- Producción: p. ej. `https://api.tudominio.com` (sin barra final).

---

## Producción

1. `cd frontend && npm run build` → `frontend/dist/`.
2. Servir `dist/` con tu hosting estático.
3. Build con **`VITE_API_URL`** apuntando al API público.
4. Backend con **`FRONTEND_URL`** = origen real del frontend (HTTPS si aplica).

---

## Problemas frecuentes

| Síntoma | Qué revisar |
|---------|-------------|
| 404 en `GET /api/objects/products` | Backend actualizado; rutas públicas con `withResource` en `task.routes.js`. |
| 401 en `/api/profile` al abrir el sitio | Normal **sin sesión**; con admin logueado debe ser 200. |
| 403 en panel o CRUD | Sesión no es **admin** o cookie no se envía (CORS / `credentials`). |
| Sin productos o sin usuarios seed | MongoDB conectado; reiniciar backend; comprobar que no haya error en consola al arrancar. |
| CORS / login | Coincidencia exacta de origen en `FRONTEND_URL` (puerto, `http`/`https`). |
| Proxy | `VITE_API_URL` vacío en dev; `vite.config.js` apuntando al puerto del backend. |

---

## Enlaces útiles

- `backend/README.md` — documentación detallada solo del servidor (API, modelos, middlewares, seeds).
- `frontend/README.md` — notas del paquete frontend si están disponibles.

---

*Proyecto académico — Computación en el cliente.*

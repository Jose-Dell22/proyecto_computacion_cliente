import express from "express";
import morgan from "morgan";
import { connectDB } from "./db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/Auth.routes.js";
import taskRoute from "./routes/task.routes.js";
import { seedProductsIfEmpty } from "./seed/seedProducts.js";
import { seedTestUsersIfMissing } from "./seed/seedUsers.js";

const app = express();
dotenv.config();

const defaultOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const envOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

/** Primera URL de FRONTEND_URL (o Vite por defecto) para el mensaje al iniciar */
const FRONTEND_APP_URL = envOrigins[0] || defaultOrigins[0];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requests sin origin (herramientas de servidor/curl)
      if (!origin) {
        return callback(null, true);
      }
      
      // En desarrollo, permite explícitamente localhost:5173
      const isDevelopment = process.env.NODE_ENV !== 'production';
      if (isDevelopment && (origin === 'http://localhost:5173' || origin === 'http://127.0.0.1:5173')) {
        return callback(null, true);
      }
      
      // Permite orígenes configurados en .env
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      console.log("CORS bloqueado - Origen no permitido:", origin);
      console.log("Orígenes permitidos:", allowedOrigins);
      return callback(new Error("Origen no permitido por CORS"));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Rutas de la API
app.use("/api", authRoutes);
app.use("/api", taskRoute);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// Puerto
const PORT = Number(process.env.PORT) || 4000;

async function start() {
  await connectDB();
  await seedProductsIfEmpty();
  await seedTestUsersIfMissing();
  app.listen(PORT, () => {
    console.log(`Abre la aplicación en: ${FRONTEND_APP_URL}`);
  });
}

start().catch((err) => {
  console.error("No se pudo iniciar el servidor:", err);
  process.exit(1);
});
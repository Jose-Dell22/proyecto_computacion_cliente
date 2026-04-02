import express from "express";
import morgan from "morgan";
import { connectDB } from "./db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/Auth.routes.js";
import taskRoute from "./routes/task.routes.js";

const app = express();
dotenv.config();

const defaultOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const envOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requests sin origin (herramientas de servidor/curl)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origen no permitido por CORS"));
    },
    credentials: true,
  })
);

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Conexión a la base de datos
connectDB();

// Rutas de la API
app.use("/api", authRoutes);
app.use("/api", taskRoute);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// Puerto
const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
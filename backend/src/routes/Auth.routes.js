import { Router } from "express";
import {
  register,
  login,
  logout,
  profile,
  createWorker,
} from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { adminRequired } from "../middlewares/adminRequired.js";
import { validateSchema } from "../middlewares/validator.middlewares.js";
import { registerSchema, loginSchema, workerCreateSchema } from "../schema/schema.js";

const router = Router();
// Se usa el post para guardar datos
// Registrar (siempre rol customer; no permite auto-asignarse admin)
router.post("/register", validateSchema(registerSchema), register);
// Login
router.post("/login", validateSchema(loginSchema), login);
// Logout
router.post("/logout", logout);
// Profile, se usa el metod GET para obtener el perfil
// authRequired -> Para la autenticacion de la persona.
router.get("/profile", authRequired, profile);

// Solo administrador: crear cuenta con rol trabajador
router.post(
  "/workers",
  authRequired,
  adminRequired,
  validateSchema(workerCreateSchema),
  createWorker
);

export default router;
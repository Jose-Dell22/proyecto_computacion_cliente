import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { adminRequired } from "../middlewares/adminRequired.js";
import {
  getResource,
  getResources,
  createResource,
  deleteResource,
  updateResource,
} from "../controllers/taskcontroller.js";

const router = Router();

/** Las rutas fijas no rellenan :resource; el controlador lo necesita en req.params.resource */
const withResource =
  (resource) =>
  (req, _res, next) => {
    req.params.resource = resource;
    next();
  };

// Catálogo público (sin token)
router.get("/objects/products", withResource("products"), getResources);
router.get("/objects/products/:id", withResource("products"), getResource);

// Formularios y pedidos desde el sitio (sin token)
router.post("/objects/contacts", withResource("contacts"), createResource);
// Buzón de sugerencias (solo lectura pública)
router.get("/objects/contacts", withResource("contacts"), getResources);
router.get("/objects/contacts/:id", withResource("contacts"), getResource);
router.post("/objects/reservations", withResource("reservations"), createResource);
router.post("/objects/orders", withResource("orders"), createResource);

// CRUD de recursos: solo administrador (cliente/trabajador autenticado no pueden usar estas rutas)
router.get("/objects/:resource", authRequired, adminRequired, getResources);
router.get("/objects/:resource/:id", authRequired, adminRequired, getResource);
router.post("/objects/:resource", authRequired, adminRequired, createResource);
router.put("/objects/:resource/:id", authRequired, adminRequired, updateResource);
router.delete("/objects/:resource/:id", authRequired, adminRequired, deleteResource);

export default router;
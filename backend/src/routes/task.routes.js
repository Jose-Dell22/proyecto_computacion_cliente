import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getResource,
  getResources,
  createResource,
  deleteResource,
  updateResource,
} from "../controllers/taskcontroller.js";

const router = Router();

// Catálogo público (sin token)
router.get("/objects/products", getResources);
router.get("/objects/products/:id", getResource);

// Formularios y pedidos desde el sitio (sin token)
router.post("/objects/contacts", createResource);
router.post("/objects/reservations", createResource);
router.post("/objects/orders", createResource);

// Resto de recursos: solo con sesión (panel admin)
router.get("/objects/:resource", authRequired, getResources);
router.get("/objects/:resource/:id", authRequired, getResource);
router.post("/objects/:resource", authRequired, createResource);
router.put("/objects/:resource/:id", authRequired, updateResource);
router.delete("/objects/:resource/:id", authRequired, deleteResource);

export default router;
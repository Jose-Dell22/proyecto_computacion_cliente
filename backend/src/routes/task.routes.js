import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { adminRequired } from "../middlewares/adminRequired.js";
import { orderAccessRequired } from "../middlewares/orderAccessRequired.js";
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
router.get("/objects/products", (req, res, next) => {
  console.log("--- PETICIÓN RECIBIDA ---", req.method, req.url, "ROL:", req.user?.role || 'No auth');
  next();
}, withResource("products"), getResources);
router.get("/objects/products/:id", (req, res, next) => {
  console.log("--- PETICIÓN RECIBIDA ---", req.method, req.url, "ROL:", req.user?.role || 'No auth');
  next();
}, withResource("products"), getResource);

// Formularios y pedidos desde el sitio (sin token)
router.post("/objects/contacts", (req, res, next) => {
  console.log("--- PETICIÓN RECIBIDA ---", req.method, req.url, "ROL:", req.user?.role || 'No auth');
  next();
}, withResource("contacts"), createResource);
// Buzón de sugerencias (solo lectura pública)
router.get("/objects/contacts", (req, res, next) => {
  console.log("--- PETICIÓN RECIBIDA ---", req.method, req.url, "ROL:", req.user?.role || 'No auth');
  next();
}, withResource("contacts"), getResources);
router.get("/objects/contacts/:id", (req, res, next) => {
  console.log("--- PETICIÓN RECIBIDA ---", req.method, req.url, "ROL:", req.user?.role || 'No auth');
  next();
}, withResource("contacts"), getResource);
router.post("/objects/reservations", (req, res, next) => {
  console.log("--- PETICIÓN RECIBIDA ---", req.method, req.url, "ROL:", req.user?.role || 'No auth');
  next();
}, withResource("reservations"), createResource);
router.post("/objects/orders", (req, res, next) => {
  console.log("--- PETICIÓN RECIBIDA ---", req.method, req.url, "ROL:", req.user?.role || 'No auth');
  next();
}, withResource("orders"), createResource);

// Actualización de pedidos: admin y worker pueden modificar
router.put("/objects/orders/:id", (req, res, next) => {
  console.log("--- PETICIÓN RECIBIDA ---", req.method, req.url, "ROL:", req.user?.role || 'No auth');
  next();
}, withResource("orders"), authRequired, orderAccessRequired, updateResource);

// Rutas de lectura: admin y worker pueden ver
router.get("/objects/orders", (req, res, next) => {
  console.log("--- PETICIÓN RECIBIDA ---", req.method, req.url, "ROL:", req.user?.role || 'No auth');
  next();
}, withResource("orders"), authRequired, orderAccessRequired, getResources);
router.get("/objects/reservations", (req, res, next) => {
  console.log("--- PETICIÓN RECIBIDA ---", req.method, req.url, "ROL:", req.user?.role || 'No auth');
  next();
}, withResource("reservations"), authRequired, orderAccessRequired, getResources);
router.get("/objects/orders/:id", (req, res, next) => {
  console.log("--- PETICIÓN RECIBIDA ---", req.method, req.url, "ROL:", req.user?.role || 'No auth');
  next();
}, withResource("orders"), authRequired, orderAccessRequired, getResource);
router.get("/objects/reservations/:id", (req, res, next) => {
  console.log("--- PETICIÓN RECIBIDA ---", req.method, req.url, "ROL:", req.user?.role || 'No auth');
  next();
}, withResource("reservations"), authRequired, orderAccessRequired, getResource);

// CRUD de recursos: solo administrador (cliente/trabajador autenticado no pueden usar estas rutas)
router.get("/objects/:resource", authRequired, adminRequired, getResources);
router.get("/objects/:resource/:id", authRequired, adminRequired, getResource);
router.post("/objects/:resource", authRequired, adminRequired, createResource);
router.put("/objects/:resource/:id", authRequired, adminRequired, updateResource);
router.delete("/objects/:resource/:id", authRequired, adminRequired, deleteResource);

export default router;
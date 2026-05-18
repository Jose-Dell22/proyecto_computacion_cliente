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
import Order from "../models/Order.js";



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

router.get("/objects/specialties", (req, res, next) => {

  console.log("--- PETICIÓN RECIBIDA ---", req.method, req.url, "ROL:", req.user?.role || 'No auth');

  next();

}, withResource("specialties"), getResources);

router.get("/objects/specialties/:id", (req, res, next) => {

  console.log("--- PETICIÓN RECIBIDA ---", req.method, req.url, "ROL:", req.user?.role || 'No auth');

  next();

}, withResource("specialties"), getResource);



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

}, authRequired, orderAccessRequired, withResource("orders"), updateResource);



// Rutas de lectura: admin y worker pueden ver

router.get("/objects/orders", (req, res, next) => {

  console.log("--- PETICIÓN RECIBIDA ---", req.method, req.url, "ROL:", req.user?.role || 'No auth');

  req.params.resource = 'orders';

  next();

}, authRequired, orderAccessRequired, getResources);

router.get("/objects/reservations", (req, res, next) => {

  console.log("--- PETICIÓN RECIBIDA ---", req.method, req.url, "ROL:", req.user?.role || 'No auth');

  req.params.resource = 'reservations';

  next();

}, authRequired, orderAccessRequired, getResources);

router.get("/objects/orders/:id", (req, res, next) => {

  console.log("--- PETICIÓN RECIBIDA ---", req.method, req.url, "ROL:", req.user?.role || 'No auth');

  req.params.resource = 'orders';

  next();

}, authRequired, orderAccessRequired, getResource);

router.get("/objects/reservations/:id", (req, res, next) => {

  console.log("--- PETICIÓN RECIBIDA ---", req.method, req.url, "ROL:", req.user?.role || 'No auth');

  next();

}, authRequired, orderAccessRequired, getResource);



// CRUD de recursos: solo administrador (cliente/trabajador autenticado no pueden usar estas rutas)

router.get("/objects/:resource", authRequired, adminRequired, getResources);

router.get("/objects/:resource/:id", authRequired, adminRequired, getResource);

router.post("/objects/:resource", authRequired, adminRequired, createResource);

router.put("/objects/:resource/:id", authRequired, adminRequired, updateResource);

router.delete("/objects/:resource/:id", authRequired, adminRequired, deleteResource);



// Actualización pública del método de pago (no requiere autenticación)
router.put("/objects/orders/:id/payment", async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    if (!["cash", "card"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Método de pago inválido. Use 'cash' o 'card'." });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentMethod },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    res.json(order);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: `ID de pedido inválido` });
    }
    return res.status(500).json({ message: error.message });
  }
});

export default router;
import { User, Product, Order, Contact, Reservation } from "../models/index.js";
import bcrypt from "bcryptjs";

const modelRegistry = {
  users: User,
  products: Product,
  orders: Order,
  contacts: Contact,
  reservations: Reservation
};

// Función de normalización para manejar desajustes entre "orders" y "Order"
const normalizeResourceName = (name) => {
  console.log("Normalizando recurso:", name);
  return name === 'orders' ? 'orders' : name;
};

const resolveModel = (resource) => {
  const normalizedResource = normalizeResourceName(resource);
  console.log("Resolviendo modelo para:", normalizedResource);
  const model = modelRegistry[normalizedResource];
  console.log("Modelo encontrado:", model?.modelName || model?.collection?.collectionName || 'Unknown');
  return model;
};

const queryFor = (Model) => (Model === User ? Model.find().select("-password") : Model.find());

export const getResources = async (req, res) => {
  try {
    console.log("=== GET RESOURCES DEBUG ===");
    console.log("req.params.resource:", req.params.resource);
    
    const Model = resolveModel(req.params.resource);
    if (!Model) return res.status(404).json({ message: "Resource not found" });

    const items = await queryFor(Model);
    console.log("Enviando lista de pedidos. Total encontrados:", items.length);
    console.log("Items:", items);
    
    res.json(items);
  } catch (error) {
    console.log("Error en getResources:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const createResource = async (req, res) => {
  try {
    const Model = resolveModel(req.params.resource);
    if (!Model) return res.status(404).json({ message: "Resource not found" });

    const payload = { ...req.body };
    if (Model === User && payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }

    const newItem = new Model(payload);
    const savedItem = await newItem.save();

    if (Model === User) {
      const { password, ...safeUser } = savedItem.toObject();
      return res.status(201).json(safeUser);
    }

    res.status(201).json(savedItem);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getResource = async (req, res) => {
  try {
    const Model = resolveModel(req.params.resource);
    if (!Model) return res.status(404).json({ message: "Resource not found" });

    const item = Model === User
      ? await Model.findById(req.params.id).select("-password")
      : await Model.findById(req.params.id);

    if (!item) return res.status(404).json({ message: "Record not found" });
    res.json(item);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateResource = async (req, res) => {
  try {
    console.log("=== UPDATE RESOURCE DEBUG ===");
    console.log("req.params.resource:", req.params.resource);
    console.log("req.params.id:", req.params.id);
    console.log("req.body:", req.body);
    
    // Normalización del nombre del modelo
    const modelName = req.params.resource === 'orders' ? 'orders' : req.params.resource;
    const Model = resolveModel(modelName);
    console.log("Model resolved:", Model?.modelName || Model?.collection?.collectionName || 'Unknown');
    
    if (!Model) {
      console.log("❌ Model not found for resource:", req.params.resource);
      return res.status(404).json({ message: "Resource not found" });
    }

    const payload = { ...req.body };
    if (Model === User && payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }

    console.log("Attempting to find and update document with ID:", req.params.id);
    const item = await Model.findByIdAndUpdate(req.params.id, payload, { new: true });
    console.log("Update result:", item);
    
    if (!item) {
      console.log("❌ Document not found with ID:", req.params.id);
      return res.status(404).json({ message: "Record not found" });
    }

    if (Model === User) {
      const { password, ...safeUser } = item.toObject();
      return res.json(safeUser);
    }

    console.log("✅ Update successful");
    res.json(item);
  } catch (error) {
    console.log("❌ Error in updateResource:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const Model = resolveModel(req.params.resource);
    if (!Model) return res.status(404).json({ message: "Resource not found" });

    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Record not found" });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
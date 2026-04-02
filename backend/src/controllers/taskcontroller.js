import { User, Product, Order, Contact, Reservation } from "../models/index.js";
import bcrypt from "bcryptjs";

const modelRegistry = {
  users: User,
  products: Product,
  orders: Order,
  contacts: Contact,
  reservations: Reservation
};

const resolveModel = (resource) => modelRegistry[resource];

const queryFor = (Model) => (Model === User ? Model.find().select("-password") : Model.find());

export const getResources = async (req, res) => {
  try {
    const Model = resolveModel(req.params.resource);
    if (!Model) return res.status(404).json({ message: "Resource not found" });

    const items = await queryFor(Model);
    res.json(items);
  } catch (error) {
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
    const Model = resolveModel(req.params.resource);
    if (!Model) return res.status(404).json({ message: "Resource not found" });

    const payload = { ...req.body };
    if (Model === User && payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }

    const item = await Model.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!item) return res.status(404).json({ message: "Record not found" });

    if (Model === User) {
      const { password, ...safeUser } = item.toObject();
      return res.json(safeUser);
    }

    res.json(item);
  } catch (error) {
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
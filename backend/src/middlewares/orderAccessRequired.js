import User from "../models/User.js";

/** Debe ir después de authRequired (req.user.id). 
 * Permite acceso a admin y workers para gestión de pedidos */
export const orderAccessRequired = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("role");
    if (!user || (user.role !== "admin" && user.role !== "worker")) {
      return res.status(403).json({
        message: "Solo un administrador o trabajador puede realizar esta acción",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

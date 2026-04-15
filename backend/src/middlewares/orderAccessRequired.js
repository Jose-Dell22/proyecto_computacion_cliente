import User from "../models/User.js";

/** Debe ir después de authRequired (req.user.id). 
 * Permite acceso a admin y workers para gestión de pedidos */
export const orderAccessRequired = async (req, res, next) => {
  try {
    console.log("Usuario intentando acceder:", req.user);
    const user = await User.findById(req.user.id).select("role");
    console.log("Usuario encontrado en DB:", user);
    
    if (!user || (user.role !== "admin" && user.role !== "worker")) {
      console.log("Acceso denegado. Rol:", user?.role);
      return res.status(403).json({
        message: "Solo un administrador o trabajador puede realizar esta acción",
      });
    }
    console.log("Acceso permitido. Rol:", user.role);
    next();
  } catch (error) {
    console.log("Error en orderAccessRequired:", error);
    return res.status(500).json({ message: error.message });
  }
};

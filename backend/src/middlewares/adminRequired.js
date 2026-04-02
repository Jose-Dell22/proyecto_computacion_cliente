import User from "../models/User.js";

/** Debe ir después de authRequired (req.user.id). */
export const adminRequired = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("role");
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Solo un administrador puede realizar esta acción",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

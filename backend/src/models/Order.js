import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customer: {
    name: {
      type: String,
      required: [true, "El nombre del cliente es obligatorio"],
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "El teléfono es obligatorio"],
      match: [/^\d{7,15}$/, "El teléfono debe tener entre 7 y 15 dígitos"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El correo es obligatorio"],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i, "Formato de correo inválido"],
      trim: true,
      lowercase: true,
    },
  },
  delivery: {
    address: {
      type: String,
      required: [true, "La dirección de entrega es obligatoria"],
      minlength: [5, "La dirección debe tener al menos 5 caracteres"],
      trim: true,
    },
    reference: {
      type: String,
      trim: true,
      default: "",
    },
  },
  items: {
    type: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, "El ID del producto es obligatorio"],
        },
        title: {
          type: String,
          required: [true, "El título del producto es obligatorio"],
          trim: true,
        },
        price: {
          type: Number,
          required: [true, "El precio del producto es obligatorio"],
          min: [0, "El precio no puede ser negativo"],
        },
        quantity: {
          type: Number,
          required: [true, "La cantidad es obligatoria"],
          min: [1, "La cantidad mínima es 1"],
        },
      },
    ],
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: "El pedido debe tener al menos un producto",
    },
  },
  total: {
    type: Number,
    required: [true, "El total es obligatorio"],
    min: [0, "El total no puede ser negativo"],
  },
  status: {
    type: String,
    enum: ["pending", "preparing", "sent", "delivered"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["pending", "cash", "card"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customer: {
    name: String,
    phone: String,
    email: String
  },
  delivery: {
    address: String,
    reference: String
  },
  items: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      title: String,
      price: Number,
      quantity: Number
    }
  ],
  total: Number,
  status: {
    type: String,
    enum: ["pending", "preparing", "sent", "delivered"],
    default: "pending"
  },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
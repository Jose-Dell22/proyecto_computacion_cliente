import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  customer: {
    name: String,
    lastName: String,
    email: String,
    phone: String
  },
  date: String,
  time: String,
  people: Number,
  preferences: {
    cut: String,
    cooking: String,
    portions: Number
  },
  vip: Boolean,
  note: String,
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending"
  },
  createdAt: { type: Date, default: Date.now }
});

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;
import mongoose from "mongoose";

const specialtySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const Specialty = mongoose.model("Specialty", specialtySchema);

export default Specialty;

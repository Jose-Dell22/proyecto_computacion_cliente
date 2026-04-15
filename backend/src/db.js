import mongoose from "mongoose"

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/carnes_al_barril_db")
    console.log("Database connected to: carnes_al_barril_db")
  } catch (error) {
    console.log(error)
    throw error
  }
}
import mongoose from "mongoose";
import { seedProducts } from "./seedProducts.js";
import { seedSpecialties } from "./seedSpecialties.js";
import { seedTestUsers } from "./seedUsers.js";

/** Elimina la BD conectada y la rellena con los seeds actuales. */
export async function resetAndSeedDatabase() {
  const dbName = mongoose.connection.name;
  console.log(`Reiniciando base de datos "${dbName}"...`);

  await mongoose.connection.dropDatabase();
  console.log("Base de datos eliminada.");

  await seedProducts();
  await seedSpecialties();
  await seedTestUsers();

  console.log("Base de datos rellenada con datos iniciales actualizados.");
}

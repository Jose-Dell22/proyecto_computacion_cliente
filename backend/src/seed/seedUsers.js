import bcrypt from "bcryptjs";
import User from "../models/User.js";

const TEST_ACCOUNTS = [
  {
    email: "admin@carnesalbarril.com",
    plainPassword: "admin123",
    name: "Administrador",
    lastName: "Prueba",
    phone: "+57 300 0000001",
    role: "admin",
  },
  {
    email: "cliente@carnesalbarril.com",
    plainPassword: "cliente123",
    name: "Usuario",
    lastName: "Cliente",
    phone: "+57 300 0000002",
    role: "customer",
  },
];

export async function seedTestUsersIfMissing() {
  for (const acc of TEST_ACCOUNTS) {
    const exists = await User.findOne({ email: acc.email });
    if (exists) continue;

    const passwordHash = await bcrypt.hash(acc.plainPassword, 10);
    await User.create({
      email: acc.email,
      password: passwordHash,
      name: acc.name,
      lastName: acc.lastName,
      phone: acc.phone,
      role: acc.role,
    });

    console.log(`Usuario de prueba creado: ${acc.email} (rol: ${acc.role})`);
  }
}

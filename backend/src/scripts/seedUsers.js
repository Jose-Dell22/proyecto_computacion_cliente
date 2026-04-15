import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedTestUsersIfMissing } from '../seed/seedUsers.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/carnes-al-barril';

async function runSeed() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Conectado a MongoDB');

    console.log('Ejecutando seed de usuarios...');
    await seedTestUsersIfMissing();
    console.log('Seed de usuarios completado');

    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error en seed:', error);
    process.exit(1);
  }
}

runSeed();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { resetAndSeedDatabase } from '../seed/resetDatabase.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/carnes_al_barril_db';

async function runSeed() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Conectado a MongoDB');

    await resetAndSeedDatabase();

    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error en seed:', error);
    process.exit(1);
  }
}

runSeed();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { resetAndSeedDatabase } from '../seed/resetDatabase.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/carnes_al_barril_db';

async function runAllSeeds() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Conectado a MongoDB');

    await resetAndSeedDatabase();

    const Product = mongoose.model('Product');
    const Specialty = mongoose.model('Specialty');
    const User = mongoose.model('User');

    const productCount = await Product.countDocuments();
    const specialtyCount = await Specialty.countDocuments();
    const userCount = await User.countDocuments();

    console.log(`\n📊 RESUMEN:`);
    console.log(`✅ Productos: ${productCount}`);
    console.log(`✅ Especialidades: ${specialtyCount}`);
    console.log(`✅ Usuarios: ${userCount}`);

    await mongoose.disconnect();
    console.log('\nDesconectado de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error en seed:', error);
    process.exit(1);
  }
}

runAllSeeds();

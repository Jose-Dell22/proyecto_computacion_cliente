import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedProductsIfEmpty } from '../seed/seedProducts.js';
import { seedTestUsersIfMissing } from '../seed/seedUsers.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/carnes_al_barril_db';

async function runAllSeeds() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Conectado a MongoDB');

    console.log('\n=== EJECUTANDO SEED DE PRODUCTOS ===');
    await seedProductsIfEmpty();
    
    console.log('\n=== EJECUTANDO SEED DE USUARIOS ===');
    await seedTestUsersIfMissing();
    
    console.log('\n=== SEED COMPLETADO ===');
    
    // Contar documentos creados
    const Product = mongoose.model('Product');
    const User = mongoose.model('User');
    
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments();
    
    console.log(`\n📊 RESUMEN:`);
    console.log(`✅ Productos creados: ${productCount}`);
    console.log(`✅ Usuarios creados: ${userCount}`);
    
    await mongoose.disconnect();
    console.log('\nDesconectado de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error en seed:', error);
    process.exit(1);
  }
}

runAllSeeds();

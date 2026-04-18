import Product from "../models/Product.js";

/** Catálogo inicial (Neiva / parrilla). Solo se inserta si la colección está vacía. */
const BASE_PRODUCTS = [
  {
    _id: "507f1f77bcf86cd799439011",
    title: "Carnes al Barril (especialidad)",
    description:
      "Selección de cortes premium a la parrilla con guarnición y chimichurri de la casa.",
    price: 48000,
    category: "parrilla",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    available: true,
  },
  {
    _id: "507f1f77bcf86cd799439012",
    title: "Picanha (punta de anca)",
    description: "Corte jugoso en su punto, ideal para compartir.",
    price: 42000,
    category: "parrilla",
    image:
      "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80",
    available: true,
  },
  {
    _id: "507f1f77bcf86cd799439013",
    title: "Costillas BBQ",
    description: "Costillas glaseadas con salsa BBQ ahumada, tiernas al horno y parrilla.",
    price: 38000,
    category: "parrilla",
    image:
      "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80",
    available: true,
  },
  {
    _id: "507f1f77bcf86cd799439014",
    title: "Chorizo parrillero",
    description: "Chorizo artesanal dorado a la parrilla con arepa o papas.",
    price: 25000,
    category: "parrilla",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    available: true,
  },
  {
    _id: "507f1f77bcf86cd799439015",
    title: "Hamburguesa a la parrilla",
    description: "Jugosa hamburguesa de carne premium a la parrilla, servida con lechuga, tomate, queso y nuestra salsa especial.",
    price: 45000,
    category: "parrilla",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    available: true,
  },
  {
    _id: "507f1f77bcf86cd799439016",
    title: "Pechuga a la parrilla",
    description: "Pechuga marinada, jugosa y con notas ahumadas.",
    price: 30000,
    category: "parrilla",
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
    available: true,
  },
  {
    _id: "507f1f77bcf86cd799439017",
    title: "Trilogía parrillera",
    description: "Tres cortes en un solo plato: mezcla de sabores de la casa.",
    price: 52000,
    category: "parrilla",
    image:
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=800&q=80",
    available: true,
  },
  {
    _id: "507f1f77bcf86cd799439018",
    title: "Churrasco",
    description: "Lomo fino a la parrilla, acompañado de ensalada y papa.",
    price: 39000,
    category: "parrilla",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    available: true,
  },
];

export async function seedProductsIfEmpty() {
  const count = await Product.countDocuments();
  if (count > 0) return;

  await Product.insertMany(BASE_PRODUCTS);
  console.log(`Catálogo inicial: ${BASE_PRODUCTS.length} productos cargados en la base de datos.`);
}

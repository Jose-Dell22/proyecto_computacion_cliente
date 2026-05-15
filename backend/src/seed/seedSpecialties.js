import Specialty from "../models/Specialty.js";

/** Especialidades de la parrilla. */
const BASE_SPECIALTIES = [
  {
    _id: "607f1f77bcf86cd799439021",
    title: "Carnes al Barril",
    description:
      "Selección de cortes premium a la parrilla con guarnición y chimichurri de la casa.",
    price: 35000,
    image: "/img/carnesAlBarril.jpg",
    available: true,
  },
  {
    _id: "607f1f77bcf86cd799439022",
    title: "Costillas BBQ",
    description: "Costillas glaseadas con salsa BBQ ahumada, tiernas al horno y parrilla.",
    price: 38000,
    image: "/img/costillasBBQ.jpg",
    available: true,
  },
  {
    _id: "607f1f77bcf86cd799439023",
    title: "Chorizo parrillero",
    description: "Chorizo artesanal dorado a la parrilla con arepa o papas.",
    price: 25000,
    image: "/img/chorizoParrillero.jpeg",
    available: true,
  },
  {
    _id: "607f1f77bcf86cd799439024",
    title: "Picanha (punta de anca)",
    description: "Corte jugoso en su punto, ideal para compartir.",
    price: 42000,
    image: "/img/puntadeAnca.jpg",
    available: true,
  },
  {
    _id: "607f1f77bcf86cd799439025",
    title: "Pechuga a la parrilla",
    description: "Pechuga marinada, jugosa y con notas ahumadas.",
    price: 30000,
    image: "/img/PechugaParrilla.jpg",
    available: true,
  },
  {
    _id: "607f1f77bcf86cd799439026",
    title: "Trilogía parrillera",
    description: "Tres cortes en un solo plato: mezcla de sabores de la casa.",
    price: 52000,
    image: "/img/TrilogíaParrillera.jpg",
    available: true,
  },
];

export async function seedSpecialties() {
  await Specialty.insertMany(BASE_SPECIALTIES);
  console.log(
    `Especialidades: ${BASE_SPECIALTIES.length} registros cargados en la base de datos.`
  );
}

const DRINK_CATEGORIES = new Set(["drink", "bebida", "bebidas"]);
const FOOD_CATEGORIES = new Set(["food", "comida", "parrilla"]);

export function isDrinkProduct(product) {
  const cat = (product?.category || "").toLowerCase().trim();
  return DRINK_CATEGORIES.has(cat);
}

export function isFoodProduct(product) {
  const cat = (product?.category || "").toLowerCase().trim();
  if (!cat) return true;
  if (DRINK_CATEGORIES.has(cat)) return false;
  return FOOD_CATEGORIES.has(cat) || !DRINK_CATEGORIES.has(cat);
}

export function matchesCategoryFilter(product, filter) {
  if (filter === "all") return true;
  if (filter === "drink") return isDrinkProduct(product);
  if (filter === "food") return isFoodProduct(product);
  return true;
}

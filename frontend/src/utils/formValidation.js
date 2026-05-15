/** Patrones reutilizables en formularios */
export const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
  /** Letras de cualquier idioma (español, chino, etc.), espacios y apóstrofe */
  name: /^[\p{L}\s'.-]+$/u,
  phone: /^\d{7,15}$/,
  url: /^https?:\/\/.+/i,
  price: /^\d+(\.\d{1,2})?$/,
};

export function sanitizePhoneInput(value) {
  return String(value ?? "").replace(/\D/g, "").slice(0, 15);
}

export function sanitizeNameInput(value) {
  return String(value ?? "").replace(/[^\p{L}\s'.-]/gu, "");
}

export function sanitizePriceInput(value) {
  const cleaned = String(value ?? "").replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length <= 1) return parts[0];
  return `${parts[0]}.${parts.slice(1).join("")}`;
}

export function validateField(value, rule = {}) {
  if (rule.type === "checkbox") {
    if (rule.required && !value) {
      return rule.message || "Debes aceptar para continuar.";
    }
    return null;
  }

  const str = typeof value === "string" ? value.trim() : value;
  const isEmpty = str === undefined || str === null || str === "";

  if (rule.required && isEmpty) {
    return rule.requiredMessage || rule.message || "Este campo es obligatorio.";
  }

  if (isEmpty) return null;

  if (rule.minLength && String(str).length < rule.minLength) {
    return (
      rule.minLengthMessage ||
      rule.message ||
      `Mínimo ${rule.minLength} caracteres.`
    );
  }

  if (rule.pattern && !rule.pattern.test(String(str))) {
    return rule.patternMessage || rule.message || "Formato inválido.";
  }

  if (rule.custom) {
    const customError = rule.custom(value);
    if (customError) return customError;
  }

  return null;
}

export function validateForm(values, rules) {
  const errors = {};
  Object.entries(rules).forEach(([field, rule]) => {
    const error = validateField(values[field], rule);
    if (error) errors[field] = error;
  });
  return errors;
}

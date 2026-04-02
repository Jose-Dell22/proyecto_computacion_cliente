import { useState } from 'react';
import { VALIDATION_RULES } from '../config/constants';

export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e, { name, value } = {}) => {
    const fieldName = name || e.target.name;
    const fieldValue = value !== undefined ? value : e.target.value;
    
    setValues(prev => ({
      ...prev,
      [fieldName]: fieldValue,
    }));

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: undefined,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const rules = { ...VALIDATION_RULES, ...validationRules };

    Object.keys(values).forEach(field => {
      const rule = rules[field];
      const value = values[field];

      if (rule) {
        if (rule.required && (!value || value.trim() === '')) {
          newErrors[field] = rule.message || `El campo ${field} es requerido`;
        } else if (rule.minLength && value && value.length < rule.minLength) {
          newErrors[field] = rule.message || `Mínimo ${rule.minLength} caracteres`;
        } else if (rule.pattern && value && !rule.pattern.test(value)) {
          newErrors[field] = rule.message || 'Formato inválido';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (onSubmit) => {
    if (!validate()) return false;
    
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      return true;
    } catch (error) {
      setErrors({ general: 'Ocurrió un error al procesar el formulario' });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  };

  const setFieldError = (field, error) => {
    setErrors(prev => ({
      ...prev,
      [field]: error,
    }));
  };

  const setFieldValue = (field, value) => {
    setValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    validate,
    handleSubmit,
    reset,
    setFieldError,
    setFieldValue,
  };
};

import { useState } from 'react';
import { validateForm } from '../utils/formValidation';

export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e, data = {}) => {
    const fieldName = data.name || e?.target?.name;
    if (!fieldName) return;

    let fieldValue =
      data.value !== undefined
        ? data.value
        : data.checked !== undefined
          ? data.checked
          : e?.target?.value;

    const rule = validationRules[fieldName];
    if (rule?.sanitize && typeof fieldValue === 'string') {
      fieldValue = rule.sanitize(fieldValue);
    }

    setValues((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));

    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: undefined,
      }));
    }
  };

  const validate = () => {
    const newErrors = validateForm(values, validationRules);
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
      setErrors({
        general:
          error?.message || 'Ocurrió un error al procesar el formulario',
      });
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
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const setFieldValue = (field, value) => {
    setValues((prev) => ({
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

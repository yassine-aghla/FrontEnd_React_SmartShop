export const validateProductForm = (data: any): string[] => {
  const errors: string[] = [];

  if (!data.nom || data.nom.trim().length < 3) {
    errors.push('Le nom doit contenir au moins 3 caractères');
  }

  if (!data.prix || data.prix <= 0) {
    errors.push('Le prix doit être supérieur à 0');
  }

  if (data.stock === undefined || data.stock < 0) {
    errors.push('Le stock ne peut pas être négatif');
  }

  if (data.description && data.description.length > 500) {
    errors.push('La description ne peut pas dépasser 500 caractères');
  }

  return errors;
};
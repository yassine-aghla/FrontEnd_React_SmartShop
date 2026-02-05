// src/components/users/UserForm.tsx
import React, { useState, useEffect } from 'react';
import type { UserDTO } from '../../types/user';

// Définir les rôles disponibles comme tableau constant
const USER_ROLES = ['ADMIN', 'CLIENT'] as const;
type UserRole = typeof USER_ROLES[number];

interface UserFormProps {
  initialData?: UserDTO;
  onSubmit: (data: UserDTO) => Promise<void>;
  isLoading: boolean;
  isEdit?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ initialData, onSubmit, isLoading, isEdit = false }) => {
  const [formData, setFormData] = useState<UserDTO>({
    username: '',
    password: '',
    role: 'CLIENT', // Utiliser la string directement
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (isEdit && initialData) {
      setFormData(initialData);
    }
  }, [isEdit, initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Le username est requis';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Le username doit contenir au moins 3 caractères';
    }

    if (!isEdit && !formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (!isEdit && formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (!formData.role) {
      newErrors.role = 'Le rôle est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFormData(prev => ({ ...prev, password }));
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 50) return 'bg-red-500';
    if (strength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      {/* Username */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Username *
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.username ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Entrez le username"
          disabled={isEdit}
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username}</p>
        )}
      </div>

      {/* Password (seulement pour la création) */}
      {!isEdit && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handlePasswordChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Entrez le mot de passe"
          />
          
          {/* Password Strength Meter */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Force du mot de passe:</span>
                <span>{passwordStrength}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getPasswordStrengthColor(passwordStrength)} transition-all duration-300`}
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {passwordStrength < 50 && 'Faible'}
                {passwordStrength >= 50 && passwordStrength < 75 && 'Moyen'}
                {passwordStrength >= 75 && 'Fort'}
              </p>
            </div>
          )}
          
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Minimum 6 caractères, inclure majuscules, chiffres et caractères spéciaux
          </p>
        </div>
      )}

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rôle *
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.role ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Sélectionnez un rôle</option>
          {USER_ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-red-600">{errors.role}</p>
        )}
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full px-4 py-2 text-white font-medium rounded-md ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? (
            <>
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
              Enregistrement...
            </>
          ) : (
            isEdit ? 'Mettre à jour' : 'Créer l\'utilisateur'
          )}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
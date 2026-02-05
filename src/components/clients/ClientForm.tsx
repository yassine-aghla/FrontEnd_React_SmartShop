// src/components/clients/ClientForm.tsx
import React, { useState, useEffect } from 'react';
import type { ClientDTO } from '../../types/client';
import { CUSTOMER_TIERS, CustomerTierLabels } from '../../constants/client';

interface ClientFormProps {
  initialData?: ClientDTO;
  onSubmit: (data: ClientDTO) => Promise<void>;
  isLoading: boolean;
  isEdit?: boolean;
  availableUsers?: Array<{ id: number; username: string }>;
}

const ClientForm: React.FC<ClientFormProps> = ({ 
  initialData, 
  onSubmit, 
  isLoading, 
  isEdit = false,
  availableUsers = []
}) => {
  const [formData, setFormData] = useState<ClientDTO>({
    nom: '',
    email: '',
    customerTier: 'BASIC',
    isActive: true,
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailValid, setEmailValid] = useState(true);

  useEffect(() => {
    if (isEdit && initialData) {
      setFormData(initialData);
    }
  }, [isEdit, initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    } else if (formData.nom.length < 3) {
      newErrors.nom = 'Le nom doit contenir au moins 3 caractères';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }

    if (!isEdit && !formData.userId && availableUsers.length > 0) {
      newErrors.userId = 'Veuillez sélectionner un utilisateur';
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
    const { name, value, type } = e.target;
    
    const newValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked
      : name === 'userId' 
        ? (value === '' ? undefined : Number(value))
        : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Valider l'email en temps réel
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailValid(emailRegex.test(value));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* Nom */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nom complet *
        </label>
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.nom ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Entrez le nom complet du client"
        />
        {errors.nom && (
          <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.email ? 'border-red-500' : 
            !emailValid && formData.email ? 'border-yellow-500' : 'border-gray-300'
          }`}
          placeholder="client@example.com"
        />
        {errors.email ? (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        ) : !emailValid && formData.email ? (
          <p className="mt-1 text-sm text-yellow-600">Veuillez entrer un email valide</p>
        ) : null}
      </div>

      {/* Customer Tier */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Niveau de fidélité
        </label>
        <select
          name="customerTier"
          value={formData.customerTier}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {CUSTOMER_TIERS.map((tier) => (
            <option key={tier} value={tier}>
              {CustomerTierLabels[tier]}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Le niveau sera recalculé automatiquement en fonction des achats
        </p>
      </div>

      {/* Statut (seulement en édition) */}
      {isEdit && (
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
            Client actif
          </label>
        </div>
      )}

      {/* Sélection de l'utilisateur (seulement pour la création) */}
      {!isEdit && availableUsers.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Associer à un utilisateur *
          </label>
          <select
            name="userId"
            value={formData.userId || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.userId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Sélectionnez un utilisateur</option>
            {availableUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
          {errors.userId && (
            <p className="mt-1 text-sm text-red-600">{errors.userId}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Sélectionnez l'utilisateur existant à associer à ce client
          </p>
        </div>
      )}

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
            isEdit ? 'Mettre à jour le client' : 'Créer le client'
          )}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;
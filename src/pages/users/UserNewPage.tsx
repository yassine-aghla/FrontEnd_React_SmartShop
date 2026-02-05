// src/pages/users/UserNewPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import type { UserDTO } from '../../types/user';
import UserForm from '../../components/users/UserForm';

const UserNewPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (userData: UserDTO) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await userService.createUser(userData);
      alert('Utilisateur créé avec succès !');
      navigate('/users');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erreur lors de la création de l\'utilisateur';
      setError(errorMessage);
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/users')}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à la liste
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Créer un nouvel utilisateur
      </h1>
      <p className="text-gray-600 mb-6">
        Remplissez le formulaire pour créer un nouvel utilisateur dans le système
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <UserForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isEdit={false}
        />
      </div>
    </div>
  );
};

export default UserNewPage;
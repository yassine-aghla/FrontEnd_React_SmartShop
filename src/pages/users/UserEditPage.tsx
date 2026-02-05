// src/pages/users/UserEditPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import type { User, UserDTO } from '../../types/user';
import UserForm from '../../components/users/UserForm';

const UserEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      
      setIsLoadingData(true);
      try {
        const data = await userService.getUserById(parseInt(id));
        setUser(data);
      } catch (err: any) {
        setError('Utilisateur non trouvé');
        console.error('Erreur:', err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (userData: UserDTO) => {
    if (!id || !user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Pour l'édition, on ne modifie pas le password s'il est vide
      const dataToSend: UserDTO = {
        username: userData.username,
        password: userData.password || user.password || '', // Garder l'ancien si non modifié
        role: userData.role
      };
      
      await userService.updateUser(parseInt(id), dataToSend);
      alert('Utilisateur modifié avec succès !');
      navigate('/users');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erreur lors de la modification';
      setError(errorMessage);
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Chargement de l'utilisateur...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error || 'Utilisateur non trouvé'}
          </div>
        </div>
        <button
          onClick={() => navigate('/users')}
          className="mt-4 text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à la liste
        </button>
      </div>
    );
  }

  const initialData: UserDTO = {
    username: user.username,
    password: '', // Laisser vide pour l'édition
    role: user.role
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
        Modifier l'utilisateur
      </h1>
      <p className="text-gray-600 mb-2">ID: {user.id}</p>
      <p className="text-gray-600 mb-6">Créé le: {new Date(user.createdAt).toLocaleDateString('fr-FR')}</p>

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
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700 text-sm">
            <span className="font-semibold">Note:</span> Pour modifier le mot de passe, entrez un nouveau mot de passe. 
            Laissez le champ vide pour conserver le mot de passe actuel.
          </p>
        </div>
        
        <UserForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isEdit={true}
        />
      </div>
    </div>
  );
};

export default UserEditPage;
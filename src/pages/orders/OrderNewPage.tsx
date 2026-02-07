
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { clientService } from '../../services/clientService';
import { productService } from '../../services/productService';
import type { CreateOrderDTO, CreateOrderItemDTO } from '../../types/order';
import type { Client } from '../../types/client';
import type { Product } from '../../types/product';

const OrderNewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Récupérer le clientId depuis l'URL si présent
  const queryParams = new URLSearchParams(location.search);
  const initialClientId = queryParams.get('clientId');
  
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>(initialClientId || '');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [orderItems, setOrderItems] = useState<CreateOrderItemDTO[]>([
    { productId: 0, quantite: 1 }
  ]);
  const [promoCode, setPromoCode] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stockErrors, setStockErrors] = useState<Record<number, string>>({});
  const [orderSummary, setOrderSummary] = useState<any>(null);

  // Charger clients et produits
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [clientsData, productsData] = await Promise.all([
          clientService.getActiveClients(),
          productService.getAllProducts()
        ]);
        
        setClients(clientsData);
        setProducts(productsData.filter(p => !p.deleted && p.stock > 0));
        
        // Si un clientId est fourni, sélectionner le client
        if (initialClientId) {
          const client = clientsData.find(c => c.id === parseInt(initialClientId));
          if (client) {
            setSelectedClient(client);
          }
        }
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error('Erreur:', err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [initialClientId]);

  // Mettre à jour le client sélectionné
  useEffect(() => {
    if (selectedClientId) {
      const client = clients.find(c => c.id === parseInt(selectedClientId));
      setSelectedClient(client || null);
    } else {
      setSelectedClient(null);
    }
  }, [selectedClientId, clients]);

  // Vérifier les stocks
  const checkStock = async () => {
    const errors: Record<number, string> = {};
    
    for (const item of orderItems) {
      if (item.productId && item.quantite > 0) {
        try {
          const product = products.find(p => p.id === item.productId);
          if (product && product.stock < item.quantite) {
            errors[item.productId] = `Stock insuffisant (${product.stock} disponible)`;
          }
        } catch (err) {
          errors[item.productId] = 'Erreur de vérification';
        }
      }
    }
    
    setStockErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Ajouter un article
  const addOrderItem = () => {
    setOrderItems([...orderItems, { productId: 0, quantite: 1 }]);
  };

  // Supprimer un article
  const removeOrderItem = (index: number) => {
    if (orderItems.length > 1) {
      const newItems = [...orderItems];
      newItems.splice(index, 1);
      setOrderItems(newItems);
    }
  };

  // Mettre à jour un article
  const updateOrderItem = (index: number, field: keyof CreateOrderItemDTO, value: any) => {
    const newItems = [...orderItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setOrderItems(newItems);
  };

  // Valider le formulaire
  const validateForm = (): boolean => {
    if (!selectedClientId) {
      alert('Veuillez sélectionner un client');
      return false;
    }

    if (orderItems.length === 0 || orderItems.every(item => !item.productId || item.quantite <= 0)) {
      alert('Veuillez ajouter au moins un article');
      return false;
    }

    const validItems = orderItems.filter(item => item.productId && item.quantite > 0);
    if (validItems.length === 0) {
      alert('Tous les articles doivent avoir un produit sélectionné et une quantité valide');
      return false;
    }

    return true;
  };

  // Soumettre la commande
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    // Vérifier les stocks
    const stockValid = await checkStock();
    if (!stockValid) {
      alert('Certains produits n\'ont pas assez de stock. Veuillez ajuster les quantités.');
      return;
    }

    // Filtrer les articles valides
    const validItems = orderItems.filter(item => item.productId && item.quantite > 0);

    const orderData: CreateOrderDTO = {
      clientId: parseInt(selectedClientId),
      items: validItems,
      notes: notes.trim() || undefined,
      promoCode: promoCode.trim() || undefined
    };

    setLoading(true);
    setError(null);

    try {
      const createdOrder = await orderService.createOrder(orderData);
      alert(`Commande créée avec succès ! Référence: ${createdOrder.reference}`);
      navigate(`/orders/${createdOrder.id}`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erreur lors de la création de la commande';
      setError(errorMessage);
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculer le récapitulatif (simulation)
  const calculateSummary = () => {
    let sousTotal = 0;
    const items = orderItems.filter(item => item.productId && item.quantite > 0);
    
    items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        sousTotal += product.prix * item.quantite;
      }
    });

    // Calculer les remises (simplifié)
    const remiseFidelite = selectedClient?.customerTier === 'GOLD' ? sousTotal * 0.1 : 0;
    const remisePromo = promoCode.startsWith('PROMO-') ? sousTotal * 0.05 : 0;
    const remiseTotale = remiseFidelite + remisePromo;
    const montantHT = sousTotal - remiseTotale;
    const montantTVA = montantHT * 0.2;
    const totalTTC = montantHT + montantTVA;

    setOrderSummary({
      sousTotal,
      remiseFidelite,
      remisePromo,
      remiseTotale,
      montantHT,
      montantTVA,
      totalTTC
    });
  };

  // Calculer le récapitulatif lorsque les données changent
  useEffect(() => {
    if (orderItems.length > 0 && products.length > 0) {
      calculateSummary();
    }
  }, [orderItems, selectedClient, promoCode, products]);

  if (loadingData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Chargement des données...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/orders')}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à la liste
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Créer une nouvelle commande
      </h1>
      <p className="text-gray-600 mb-6">
        Remplissez le formulaire pour créer une nouvelle commande
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire de commande */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Informations de la commande</h2>
            
            {/* Sélection du client */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client *
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionnez un client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.nom} - {client.email} (Tier: {client.customerTier})
                  </option>
                ))}
              </select>
              {selectedClient && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Niveau de fidélité:</span> {selectedClient.customerTier}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Commandes précédentes:</span> {selectedClient.totalOrders}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Total dépensé:</span> {selectedClient.totalSpent} DH
                  </p>
                </div>
              )}
            </div>

            {/* Articles de la commande */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Articles</h3>
                <button
                  type="button"
                  onClick={addOrderItem}
                  className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded text-sm"
                >
                  + Ajouter un article
                </button>
              </div>
              
              {orderItems.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4 p-4 border rounded-lg">
                  <div className="md:col-span-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Produit *
                    </label>
                    <select
                      value={item.productId}
                      onChange={(e) => updateOrderItem(index, 'productId', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value={0}>Sélectionnez un produit</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.nom} - {product.prix} DH (Stock: {product.stock})
                        </option>
                      ))}
                    </select>
                    {stockErrors[item.productId] && (
                      <p className="mt-1 text-sm text-red-600">{stockErrors[item.productId]}</p>
                    )}
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantité *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantite}
                      onChange={(e) => updateOrderItem(index, 'quantite', parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="md:col-span-2 flex items-end">
                    <button
                      type="button"
                      onClick={() => removeOrderItem(index)}
                      disabled={orderItems.length === 1}
                      className="w-full px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Code promo et notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code promo (optionnel)
                </label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="PROMO-XXXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optionnel)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Instructions spéciales..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Récapitulatif */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Récapitulatif</h2>
            
            {orderSummary ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total:</span>
                  <span className="font-medium">{orderSummary.sousTotal.toFixed(2)} DH</span>
                </div>
                
                {orderSummary.remiseFidelite > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remise fidélité:</span>
                    <span className="font-medium text-green-600">
                      -{orderSummary.remiseFidelite.toFixed(2)} DH
                    </span>
                  </div>
                )}
                
                {orderSummary.remisePromo > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remise promo:</span>
                    <span className="font-medium text-green-600">
                      -{orderSummary.remisePromo.toFixed(2)} DH
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-600">HT après remise:</span>
                  <span className="font-medium">{orderSummary.montantHT.toFixed(2)} DH</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">TVA (20%):</span>
                  <span className="font-medium">{orderSummary.montantTVA.toFixed(2)} DH</span>
                </div>
                
                <div className="flex justify-between border-t pt-3 font-semibold text-lg">
                  <span className="text-gray-800">Total TTC:</span>
                  <span className="text-blue-600">{orderSummary.totalTTC.toFixed(2)} DH</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Ajoutez des articles pour voir le récapitulatif</p>
            )}
            
            <button
              onClick={handleSubmit}
              disabled={loading || !selectedClientId || orderItems.every(item => !item.productId)}
              className={`w-full mt-6 px-4 py-3 rounded-md text-white font-medium ${
                loading || !selectedClientId || orderItems.every(item => !item.productId)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                  Création en cours...
                </>
              ) : (
                'Créer la commande'
              )}
            </button>
            
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">Note:</span> Les remises seront calculées automatiquement lors de la création de la commande.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderNewPage;
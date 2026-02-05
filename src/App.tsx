// src/App.tsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ProductListPage from './pages/products/ProductListPage'
import ProductNewPage from './pages/products/ProductNewPage'
import ProductEditPage from './pages/products/ProductEditPage'
import UserListPage from './pages/users/UserListPage'
import UserNewPage from './pages/users/UserNewPage'
import UserEditPage from './pages/users/UserEditPage'
// import ClientDetailPage from './pages/clients/ClientDetailPage'
// import ClientEditPage from './pages/clients/ClientEditPage' 
// import ClientListPage from './pages/clients/ClientListPage'
// import ClientNewPage from './pages/clients/ClientNewPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation améliorée */}
        <nav className="bg-white shadow-lg border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <a href="/" className="text-2xl font-bold text-blue-600 flex items-center">
                🛒 <span className="ml-2">SmartShop</span>
              </a>
              <div className="flex space-x-6">
                <a href="/products" className="text-gray-700 hover:text-blue-600 font-medium flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Produits
                </a>
                <a href="/users" className="text-gray-700 hover:text-blue-600 font-medium flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 1.196a6 6 0 00-9-5.197" />
                  </svg>
                  Utilisateurs
                </a>
                <a href="/clients" className="text-gray-700 hover:text-blue-600 font-medium flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Clients
                </a>
                <a href="/orders" className="text-gray-700 hover:text-blue-600 font-medium flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Commandes
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Contenu principal */}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            
            {/* Routes Produits */}
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/new" element={<ProductNewPage />} />
            <Route path="/products/:id/edit" element={<ProductEditPage />} />
            
            {/* Routes Utilisateurs */}
            <Route path="/users" element={<UserListPage />} />
            <Route path="/users/new" element={<UserNewPage />} />
            <Route path="/users/:id/edit" element={<UserEditPage />} />

    
            {/* <Route path="/clients" element={<ClientListPage />} />
           <Route path="/clients/new" element={<ClientNewPage />} />
             <Route path="/clients/:id" element={<ClientDetailPage />} />
              <Route path="/clients/:id/edit" element={<ClientEditPage />} /> */}
            
            {/* Pages à implémenter */}
            <Route path="/clients" element={
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Clients</h2>
                <p className="text-gray-600">À implémenter</p>
              </div>
            } />
            <Route path="/orders" element={
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Commandes</h2>
                <p className="text-gray-600">À implémenter</p>
              </div>
            } />
          </Routes>
        </main>

        {/* Pied de page */}
        <footer className="bg-gray-800 text-white py-6 mt-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold">SmartShop</h3>
                <p className="text-gray-400 text-sm mt-1">Système de gestion de stock et utilisateurs</p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-sm">© 2024 SmartShop - Tous droits réservés</p>
                <p className="text-gray-400 text-xs mt-1">Développé avec React, TypeScript et Spring Boot</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { savedProductService } from '../services/savedProductService';
import { DEFAULT_CUSTOMER_ID } from '../services/api';

const DEFAULT_SETTINGS = {
  currency: 'INR',
  currencySymbol: '₹',
  defaultBudget: 75000,
  theme: 'system',
};

const ShoppingContext = createContext();

export const ShoppingProvider = ({ children }) => {
  // Customer & Session Identifier
  const [customerId] = useState(() => {
    return localStorage.getItem('shopmate_customer_id') || DEFAULT_CUSTOMER_ID;
  });

  // Backend connection status
  const [backendStatus, setBackendStatus] = useState('connecting'); // 'connecting' | 'connected' | 'offline'

  // Saved products (loaded from real backend database)
  const [savedProducts, setSavedProducts] = useState([]);
  
  // Shopping history
  const [history, setHistory] = useState([]);
  
  // User settings
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('shopmate_settings');
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Modal product preview (active full-screen view)
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);

  // Global toast notification
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  // Check backend health & load initial customer data
  const refreshBackendData = useCallback(async () => {
    setBackendStatus('connecting');
    try {
      const saved = await savedProductService.getSavedProducts(customerId);
      setSavedProducts(Array.isArray(saved) ? saved : []);
      setBackendStatus('connected');
    } catch (err) {
      console.warn('Backend connection status:', err.message);
      setBackendStatus('offline');
      // Empty state - zero dummy sets
      setSavedProducts([]);
    }
  }, [customerId]);

  useEffect(() => {
    refreshBackendData();
  }, [refreshBackendData]);

  // Save settings when changed
  useEffect(() => {
    try {
      localStorage.setItem('shopmate_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  }, [settings]);

  // Saved products management
  const toggleSaveProduct = useCallback(async (product) => {
    if (!product || !product.id) return;
    const isSaved = savedProducts.some((p) => p.id === product.id);

    try {
      if (isSaved) {
        await savedProductService.removeSavedProduct(product.id, customerId);
        setSavedProducts((prev) => prev.filter((p) => p.id !== product.id));
        showToast(`Removed ${product.name} from saved items`, 'info');
      } else {
        await savedProductService.saveProduct(product, customerId);
        setSavedProducts((prev) => [...prev, product]);
        showToast(`Saved ${product.name} to your database collection`, 'success');
      }
    } catch (err) {
      console.error('Error toggling save product:', err);
      // Fallback local update if backend is still spinning up
      if (isSaved) {
        setSavedProducts((prev) => prev.filter((p) => p.id !== product.id));
      } else {
        setSavedProducts((prev) => [...prev, product]);
      }
      showToast(
        isSaved ? 'Removed from saved items' : `Saved ${product.name}`,
        'info'
      );
    }
  }, [savedProducts, customerId, showToast]);

  const isProductSaved = useCallback((productId) => {
    return savedProducts.some((p) => p.id === productId);
  }, [savedProducts]);

  // Modal Preview
  const openProductModal = useCallback((product) => {
    setSelectedProductForModal(product);
  }, []);

  const closeProductModal = useCallback(() => {
    setSelectedProductForModal(null);
  }, []);

  // Update Settings
  const updateSettings = useCallback((newSettings) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
    showToast('Preferences updated', 'success');
  }, [showToast]);

  return (
    <ShoppingContext.Provider
      value={{
        customerId,
        backendStatus,
        refreshBackendData,
        savedProducts,
        history,
        settings,
        selectedProductForModal,
        toast,
        toggleSaveProduct,
        isProductSaved,
        openProductModal,
        closeProductModal,
        updateSettings,
        showToast,
      }}
    >
      {children}
    </ShoppingContext.Provider>
  );
};

export const useShopping = () => {
  const context = useContext(ShoppingContext);
  if (!context) {
    throw new Error('useShopping must be used within a ShoppingProvider');
  }
  return context;
};

export default ShoppingContext;

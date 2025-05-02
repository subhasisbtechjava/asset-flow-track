
// This file contains API endpoint definitions for the store management system
// These would be implemented on a Node.js backend

import axios from 'axios';
import { Store, Asset, StoreAsset } from '@/types';

//const API_URL = process.env.API_URL || 'http://localhost:3000/api';

const API_URL = import.meta.env.VITE_API_URL // ADDED ON 30-04-2025//////

// Store related endpoints
export const storeAPI = {
  // Get all stores
  getAllStores: async () => {
    try {
      //const response = await axios.get(`${API_URL}/stores`);
      const response = await axios.get(`${API_URL}/stores`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Add auth token
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching stores:', error);
      throw error;
    }
  },

  // Get store by ID
  getStoreById: async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/stores/${id}`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Add auth token
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching store ${id}:`, error);
      throw error;
    }
  },

  // Create new store
  createStore: async (storeData:Store) => {
    try {
      const response = await axios.post(`${API_URL}/stores`, storeData,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Add auth token
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating store:', error);
      throw error;
    }
  },

  // Update store
  updateStore: async (id: string, storeData: Partial<Store>) => {
    try {
      const response = await axios.put(`${API_URL}/stores/${id}`, storeData,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Add auth token
        }
      });
      console.log(storeData);
      console.log('==============');
      console.log(id);
      return response.data;
    } catch (error) {
      console.error(`Error updating store ${id}:`, error);
      throw error;
    }
  },

  // Delete store
  deleteStore: async (id: string) => {
    try {
      const response = await axios.delete(`${API_URL}/stores/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting store ${id}:`, error);
      throw error;
    }
  }
};

// Asset related endpoints
export const assetAPI = {
  // Get all assets
  getAllAssets: async () => {
    try {
      const response = await axios.get(`${API_URL}/assets`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assets:', error);
      throw error;
    }
  },

  // Get asset by ID
  getAssetById: async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/assets/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching asset ${id}:`, error);
      throw error;
    }
  },

  // Create new asset
  
  createAsset: async (assetData: Omit<Asset, 'id'>) => {
    try {
      const response = await axios.post(`${API_URL}/assets`, assetData,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Add auth token
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating asset:', error);
      throw error;
    }
  },

  // Update asset
  updateAsset: async (id: string, assetData: Partial<Asset>) => {
    try {
      const response = await axios.put(`${API_URL}/assets/${id}`, assetData);
      return response.data;
    } catch (error) {
      console.error(`Error updating asset ${id}:`, error);
      throw error;
    }
  },

  // Delete asset
  deleteAsset: async (id: string) => {
    try {
      const response = await axios.delete(`${API_URL}/assets/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting asset ${id}:`, error);
      throw error;
    }
  }
};

// Store assets related endpoints
export const storeAssetAPI = {
  // Get store assets by store ID
  getAssetsByStoreId: async (storeId: string) => {
    try {
      const response = await axios.get(`${API_URL}/stores/${storeId}/assets`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching assets for store ${storeId}:`, error);
      throw error;
    }
  },

  // Add assets to store
  addAssetsToStore: async (storeId: string, assets: {assetId: string, quantity: number}[]) => {
    try {
      const response = await axios.post(`${API_URL}/stores/${storeId}/assets`, { assets });
      return response.data;
    } catch (error) {
      console.error(`Error adding assets to store ${storeId}:`, error);
      throw error;
    }
  },

  // Update store asset
  updateStoreAsset: async (storeId: string, storeAssetId: string, updates: Partial<StoreAsset>) => {
    try {
      const response = await axios.put(
        `${API_URL}/stores/${storeId}/assets/${storeAssetId}`, 
        updates
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating store asset ${storeAssetId}:`, error);
      throw error;
    }
  },

  // Update document for store asset
  updateDocument: async (
    storeId: string, 
    storeAssetId: string, 
    documentType: 'po' | 'invoice' | 'grn', 
    documentNumber: string
  ) => {
    try {
      const response = await axios.put(
        `${API_URL}/stores/${storeId}/assets/${storeAssetId}/documents`,
        { documentType, documentNumber }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating document for store asset ${storeAssetId}:`, error);
      throw error;
    }
  },
  
  // Update status for store asset
  updateStatus: async (
    storeId: string,
    storeAssetId: string,
    statusField: string,
    value: boolean
  ) => {
    try {
      const response = await axios.put(
        `${API_URL}/stores/${storeId}/assets/${storeAssetId}/status`,
        { statusField, value }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating status for store asset ${storeAssetId}:`, error);
      throw error;
    }
  }
};

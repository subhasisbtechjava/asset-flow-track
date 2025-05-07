
import { Store, Asset, StoreAsset, Changepass } from '@/types';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getToken = () => {
  return localStorage.getItem('token') || '';
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Main storeAPI object
export const storeAPI = {
  getAllStores: async (): Promise<Store[]> => {
    try {
      // Use mock data in development
      const { mockStoresOffline } = await import('../data/mockData');
      return mockStoresOffline;
    } catch (error) {
      console.error('Error fetching stores:', error);
      throw error;
    }
  },

  getStoreById: async (id: string): Promise<Store> => {
    try {
      // Use mock data in development
      const { getStoreById } = await import('../data/mockData');
      return getStoreById(id);
    } catch (error) {
      console.error(`Error fetching store with ID ${id}:`, error);
      throw error;
    }
  },

  createStore: async (storeData: Store): Promise<Store> => {
    try {
      const response = await axiosInstance.post<Store>('/stores', storeData);
      return response.data;
    } catch (error) {
      console.error('Error creating store:', error);
      throw error;
    }
  },

  updateStore: async (id: string, storeData: Store): Promise<Store> => {
    try {
      const response = await axiosInstance.put<Store>(`/stores/${id}`, storeData);
      return response.data;
    } catch (error) {
      console.error(`Error updating store with ID ${id}:`, error);
      throw error;
    }
  },

  deleteStore: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/stores/${id}`);
    } catch (error) {
      console.error(`Error deleting store with ID ${id}:`, error);
      throw error;
    }
  },

  getStoreDetailsAssetsByStoreId: async (storeId: string): Promise<StoreAsset[]> => {
    try {
      // Use mock data in development
      const { getStoreAssetsByStoreId } = await import('../data/mockData');
      return getStoreAssetsByStoreId(storeId);
    } catch (error) {
      console.error(`Error fetching store details assets with store ID ${storeId}:`, error);
      throw error;
    }
  },

  addStoreAsset: async (storeId: string, assetId: string, quantity: number): Promise<StoreAsset> => {
     try {
      const response = await axiosInstance.post<StoreAsset>(`/stores/${storeId}/assets`, {
        assetId,
        quantity,
      });
      return response.data;
    } catch (error) {
      console.error(`Error adding asset ${assetId} to store ${storeId}:`, error);
      throw error;
    }
  },

  updateStoreAsset: async (storeId: string, assetId: string, quantity: number): Promise<StoreAsset> => {
    try {
      const response = await axiosInstance.put<StoreAsset>(`/stores/${storeId}/assets/${assetId}`, {
        quantity,
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating asset ${assetId} in store ${storeId}:`, error);
      throw error;
    }
  },

  deleteStoreAsset: async (storeId: string, assetId: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/stores/${storeId}/assets/${assetId}`);
    } catch (error) {
      console.error(`Error deleting asset ${assetId} from store ${storeId}:`, error);
      throw error;
    }
  },
  
  storeAssetTrackingStatusUpdate: async (assetId: string, updateParam: string, body: any) => {
    try {
      const response = await axiosInstance.put(`/assets/${assetId}/tracking/${updateParam}`, body);
      return response.data;
    } catch (error) {
      console.error(`Error updating asset tracking status for asset ID ${assetId}:`, error);
      throw error;
    }
  },
  
  changePass: async (passData: Changepass): Promise<Changepass> => {
    try {
      const response = await axiosInstance.post<Changepass>('/change-password', passData);
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },
  
  // Methods needed by StoreAddAssets.tsx
  fetchStoreWiseAssetsList: async (storeId: string): Promise<any[]> => {
    try {
      // Use mock data in development
      const { getStoreAssetsByStoreId } = await import('../data/mockData');
      return getStoreAssetsByStoreId(storeId);
    } catch (error) {
      console.error(`Error fetching store wise assets list for store ID ${storeId}:`, error);
      throw error;
    }
  },
  
  assignAssetToStore: async (storeId: string, assetId: string, quantity: number, price: number): Promise<any> => {
    try {
      console.log('Assigning asset to store:', { storeId, assetId, quantity, price });
      return { success: true, message: 'Asset assigned successfully' };
    } catch (error) {
      console.error(`Error assigning asset ${assetId} to store ${storeId}:`, error);
      throw error;
    }
  },
  
  updateAssignedAssets: async (assetId: string, quantity: number, price: number): Promise<any> => {
    try {
      console.log('Updating assigned asset:', { assetId, quantity, price });
      return { success: true, message: 'Asset updated successfully' };
    } catch (error) {
      console.error(`Error updating asset ${assetId}:`, error);
      throw error;
    }
  },
  
  // Methods for Dashboard.tsx
  storeMarkAsComplete: async (storeId: string): Promise<any> => {
    try {
      console.log('Marking store as complete:', storeId);
      return { success: true, message: 'Store marked as complete' };
    } catch (error) {
      console.error(`Error marking store ${storeId} as complete:`, error);
      throw error;
    }
  },
  
  // Document management methods
  getStoreDocuments: async (storeId: string, assetId: string, documentType: 'po' | 'invoice' | 'grn') => {
    // For demonstration purposes, we'll use mock data
    const { getMockDocuments } = await import('../data/mockData');
    return getMockDocuments(storeId, assetId, documentType);
  },
  
  addStoreDocument: async (storeId: string, assetId: string, documentType: 'po' | 'invoice' | 'grn', documentData: any) => {
    console.log('Adding document:', { storeId, assetId, documentType, documentData });
    // In a real app, this would make an API call
    // For now, just return a success message
    return { success: true, message: 'Document added successfully' };
  },
  
  deleteStoreDocument: async (storeId: string, assetId: string, documentType: 'po' | 'invoice' | 'grn', documentId: string) => {
    console.log('Deleting document:', { storeId, assetId, documentType, documentId });
    // In a real app, this would make an API call
    // For now, just return a success message
    return { success: true, message: 'Document deleted successfully' };
  }
};

// Separate assetAPI object
export const assetAPI = {
  getAllAssets: async (): Promise<Asset[]> => {
    try {
      // Use mock data in development
      const { mockAssets } = await import('../data/mockData');
      return mockAssets;
    } catch (error) {
      console.error('Error fetching assets:', error);
      throw error;
    }
  },

  getAssetById: async (id: string): Promise<Asset> => {
    try {
      // Use mock data in development
      const { getAssetById } = await import('../data/mockData');
      return getAssetById(id);
    } catch (error) {
      console.error(`Error fetching asset with ID ${id}:`, error);
      throw error;
    }
  },

  createAsset: async (assetData: Asset): Promise<Asset> => {
    try {
      console.log('Creating asset:', assetData);
      return { success: true, ...assetData } as unknown as Asset;
    } catch (error) {
      console.error('Error creating asset:', error);
      throw error;
    }
  },

  updateAsset: async (id: string, assetData: Asset): Promise<Asset> => {
    try {
      console.log('Updating asset:', { id, assetData });
      return { success: true, ...assetData } as unknown as Asset;
    } catch (error) {
      console.error(`Error updating asset with ID ${id}:`, error);
      throw error;
    }
  },

  deleteAsset: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/assets/${id}`);
    } catch (error) {
      console.error(`Error deleting asset with ID ${id}:`, error);
      throw error;
    }
  }
};

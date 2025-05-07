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

export const storeAPI = {
  getAllStores: async (): Promise<Store[]> => {
    try {
      const response = await axiosInstance.get<Store[]>('/stores');
      return response.data;
    } catch (error) {
      console.error('Error fetching stores:', error);
      throw error;
    }
  },

  getStoreById: async (id: string): Promise<Store> => {
    try {
      const response = await axiosInstance.get<Store>(`/stores/${id}`);
      return response.data;
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

  getAllAssets: async (): Promise<Asset[]> => {
    try {
      const response = await axiosInstance.get<Asset[]>('/assets');
      return response.data;
    } catch (error) {
      console.error('Error fetching assets:', error);
      throw error;
    }
  },

  getAssetById: async (id: string): Promise<Asset> => {
    try {
      const response = await axiosInstance.get<Asset>(`/assets/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching asset with ID ${id}:`, error);
      throw error;
    }
  },

  createAsset: async (assetData: Asset): Promise<Asset> => {
    try {
      const response = await axiosInstance.post<Asset>('/assets', assetData);
      return response.data;
    } catch (error) {
      console.error('Error creating asset:', error);
      throw error;
    }
  },

  updateAsset: async (id: string, assetData: Asset): Promise<Asset> => {
    try {
      const response = await axiosInstance.put<Asset>(`/assets/${id}`, assetData);
      return response.data;
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

  getStoreDetailsAssetsByStoreId: async (storeId: string): Promise<StoreAsset[]> => {
    try {
      const response = await axiosInstance.get<StoreAsset[]>(`/stores/${storeId}/assets`);
      return response.data;
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
  // New methods for document management
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
  },
  
  
  
  // Add mock implementations for other API methods used in the app
  getAllStores: async () => {
    // Import the mock stores from mockData
    const { mockStoresOffline } = await import('../data/mockData');
    return mockStoresOffline;
  },
  
  getStoreById: async (id: string) => {
    const { getStoreById } = await import('../data/mockData');
    return getStoreById(id);
  },
  
  getAssetById: async (id: string) => {
    const { getAssetById } = await import('../data/mockData');
    return getAssetById(id);
  },
  
  getStoreDetailsAssetsByStoreId: async (storeId: string) => {
    const { getStoreAssetsByStoreId } = await import('../data/mockData');
    return getStoreAssetsByStoreId(storeId);
  },
  
  createAsset: async (assetData: any) => {
    console.log('Creating asset:', assetData);
    return { success: true, ...assetData };
  },
  
  updateAsset: async (id: string, assetData: any) => {
    console.log('Updating asset:', { id, assetData });
    return { success: true, ...assetData };
  }
};

// This file contains API endpoint definitions for the store management system
// These would be implemented on a Node.js backend

import axios from "axios";
import { Store, Asset, StoreAsset,Brand } from "@/types";

//const API_URL = process.env.API_URL || 'http://localhost:3000/api';

const API_URL = import.meta.env.VITE_API_URL; // ADDED ON 30-04-2025//////

// Store related endpoints
export const storeAPI = {

  getStoreDetailsAssetsByStoreId: async (storeId: string) => {
    try {
      const response = await axios.get(`${API_URL}/storeassets/${storeId}`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add auth token
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching assets for store ${storeId}:`, error);
      throw error;
    }
  },
  assignAssetToStore: async (
    storeId: string,
    assetId: string,
    quantity: number,
    price?: number
  ) => {
    try {
      const body = {
        assets: [{ assetId, quantity, price }],
      };
      const response = await axios.post(
        `${API_URL}/stores/${storeId}/assets`,
        body,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add auth token
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error assigning asset to store:", error);
      throw error;
    }
  },
  fetchStoreWiseAssetsList: async (storeId: string) => {
    try {
      const response = await axios.get(`${API_URL}/stores/${storeId}/assets`,  {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add auth token
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching asset for store:", error);
      throw error;
    }
  },
  updateAssignedAssets: async (id:string, quantity:number,price:number ) => {
    try {
    const body=   {
      "quantity":quantity,
      "price":price
    };
      const response = await axios.post(`${API_URL}/assets/update_qty_price/${id}`,  body,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add auth token
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching asset for store:", error);
      throw error;
    }
  },

  // Get all stores
  getAllStores: async () => {
    try {
      //const response = await axios.get(`${API_URL}/stores`);
      const response = await axios.get(`${API_URL}/stores`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add auth token
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching stores:", error);
      throw error;
    }
  },
  storeMarkAsComplete: async (storeId:string) => {
    try {
      //const response = await axios.get(`${API_URL}/stores`);
      const response = await axios.get(`${API_URL}/stores/markcomplete/${storeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add auth token
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching stores:", error);
      throw error;
    }
  },




  // Get store by ID
  getStoreById: async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/stores/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add auth token
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching store ${id}:`, error);
      throw error;
    }
  },
  storeAssetTrackingStatusUpdate: async (id: string,updateParam:string,body) => {
    try {
      const response = await axios.post(`${API_URL}/assets/update/store_tracking_details/${updateParam}/${id}`,body, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add auth token
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching store ${id}:`, error);
      throw error;
    }
  },
  storeAssetTrackingStatusUpdateWithFormData: async (id: string,updateParam:string,body:FormData) => {
    try {
      const response = await axios.post(`${API_URL}/assets/update/store_tracking_details/po_invoice/${updateParam}/${id}`,body, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add auth token
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching store ${id}:`, error);
      throw error;
    }
  },

  // Create new store
  createStore: async (storeData: Store) => {
    try {
      const response = await axios.post(`${API_URL}/stores`, storeData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add auth token
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating store:", error);
      throw error;
    }
  },

  // Update store
  updateStore: async (id: string, storeData: Partial<Store>) => {
    try {
      const response = await axios.put(`${API_URL}/stores/${id}`, storeData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add auth token
        },
      });
      console.log(storeData);
      console.log("==============");
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
  },
};

// Asset related endpoints
export const assetAPI = {
  // Get all assets
  getAllAssets: async () => {
    try {
      const response = await axios.get(`${API_URL}/assets`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add auth token
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching assets:", error);
      throw error;
    }
  },

  // Get asset by ID
  getAssetById: async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/editassets/${id}`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Add auth token
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching asset ${id}:`, error);
      throw error;
    }
  },

  // Create new asset

  createAsset: async (assetData: Omit<Asset, "id">) => {
    try {
      const response = await axios.post(`${API_URL}/assets`, assetData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add auth token
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating asset:", error);
      throw error;
    }
  },

  // Update asset
  updateAsset: async (id: string, assetData: Partial<Asset>) => {
    console.log(assetData);
    try {
      const response = await axios.post(`${API_URL}/assets/update/${id}`, assetData,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Add auth token
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating asset ${id}:`, error);
      throw error;
    }
  },

  // Delete asset
  deleteAsset: async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/delete/assets/${id}`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Add auth token
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting asset ${id}:`, error);
      throw error;
    }
  },
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
  assignAssetsToStore: async (
    storeId: string,
    assets: { assetId: string; quantity: number; price?: number }[]
  ) => {
    try {
      const response = await axios.post(`${API_URL}/stores/${storeId}/assets`, {
        assets,
      });
      return response.data;
    } catch (error) {
      console.error(`Error assigning assets to store ${storeId}:`, error);
      throw error;
    }
  },

  // Update store asset
  updateStoreAsset: async (
    storeId: string,
    storeAssetId: string,
    updates: Partial<StoreAsset>
  ) => {
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
    documentType: "po" | "invoice" | "grn",
    documentNumber: string,
    additionalDetails?: {
      date?: Date;
      amount?: number;
      files?: File[];
    }
  ) => {
    try {
      // For file uploads, we need to use FormData
      if (additionalDetails?.files && additionalDetails.files.length > 0) {
        const formData = new FormData();
        formData.append("documentType", documentType);
        formData.append("documentNumber", documentNumber);

        if (additionalDetails.date) {
          formData.append("date", additionalDetails.date.toISOString());
        }

        if (additionalDetails.amount !== undefined) {
          formData.append("amount", additionalDetails.amount.toString());
        }

        additionalDetails.files.forEach((file, index) => {
          formData.append(`files`, file);
        });

        const response = await axios.put(
          `${API_URL}/stores/${storeId}/assets/${storeAssetId}/documents/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data;
      } else {
        // Regular JSON request for text fields only
        const response = await axios.put(
          `${API_URL}/stores/${storeId}/assets/${storeAssetId}/documents`,
          {
            documentType,
            documentNumber,
            ...additionalDetails,
          }
        );
        return response.data;
      }
    } catch (error) {
      console.error(
        `Error updating document for store asset ${storeAssetId}:`,
        error
      );
      throw error;
    }
  },

  // Get document files for a store asset
  getDocumentFiles: async (
    storeId: string,
    storeAssetId: string,
    documentType: "po" | "invoice" | "grn"
  ) => {
    try {
      const response = await axios.get(
        `${API_URL}/stores/${storeId}/assets/${storeAssetId}/documents/${documentType}/files`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching document files for store asset ${storeAssetId}:`,
        error
      );
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
      console.error(
        `Error updating status for store asset ${storeAssetId}:`,
        error
      );
      throw error;
    }
  },
};

export const brandAPI = {
  // Get all assets

  createBrand: async (brandData: FormData) => {
    try {
      console.log('+++++++++++++++++++++++');
      console.log(brandData);
      const response = await axios.post(`${API_URL}/barnd/insert`, brandData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add auth token
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating asset:", error);
      throw error;
    }
  },


  getAllBrands: async () => {
    try {
      const response = await axios.get(`${API_URL}/barnd/list`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add auth token
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching assets:", error);
      throw error;
    }
  },

  getBrandById: async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/editbrand/${id}`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Add auth token
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching brand ${id}:`, error);
      throw error;
    }
  },

  updateBrand: async (id:string, brandData: FormData) => {
    try {
      console.log('+++++++++++++++++++++++');
      console.log(brandData);
      const response = await axios.post(`${API_URL}/brand/update/${id}`, brandData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add auth token
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating brand:", error);
      throw error;
    }
  },

  deleteBrand: async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/delete/brand/${id}`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Add auth token
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting asset ${id}:`, error);
      throw error;
    }
  },

  getStoreBrands: async () => {
    try {
      const response = await axios.get(`${API_URL}/storebarnd/list`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add auth token
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching assets:", error);
      throw error;
    }
  },


};
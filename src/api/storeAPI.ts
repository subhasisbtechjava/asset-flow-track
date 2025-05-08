
import { Store, Asset, StoreAsset, Changepass } from '@/types';
import axios from 'axios';
import { mockAssets, mockStoresOffline, getStoreById, getAssetById, getStoreAssetsByStoreId } from '../data/mockData';

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

// Mock documents data
const mockPoDocuments = {
  "store-001": {
    "asset-001": [
      {
        id: "po-001",
        documentNumber: "PO-2025-5678",
        documentDate: new Date(2025, 3, 15),
        attachmentUrl: "https://example.com/documents/po-001.pdf",
        attachmentName: "purchase_order_5678.pdf"
      },
      {
        id: "po-002",
        documentNumber: "PO-2025-5679",
        documentDate: new Date(2025, 3, 20),
        attachmentUrl: "https://example.com/documents/po-002.pdf",
        attachmentName: "purchase_order_5679.pdf"
      }
    ],
    "asset-002": [
      {
        id: "po-003",
        documentNumber: "PO-2025-6001",
        documentDate: new Date(2025, 4, 1),
        attachmentUrl: "https://example.com/documents/po-003.pdf",
        attachmentName: "po_kitchen_equipment.pdf"
      }
    ]
  },
  "store-002": {
    "asset-001": [
      {
        id: "po-004",
        documentNumber: "PO-2025-7123",
        documentDate: new Date(2025, 4, 5),
        attachmentUrl: "https://example.com/documents/po-004.pdf",
        attachmentName: "furniture_order.pdf"
      }
    ]
  }
};

const mockInvoiceDocuments = {
  "store-001": {
    "asset-001": [
      {
        id: "inv-001",
        documentNumber: "INV-2025-1234",
        documentDate: new Date(2025, 3, 20),
        documentAmount: "52500",
        attachmentUrl: "https://example.com/documents/inv-001.pdf",
        attachmentName: "invoice_1234.pdf"
      },
      {
        id: "inv-002",
        documentNumber: "INV-2025-1235",
        documentDate: new Date(2025, 3, 25),
        documentAmount: "12000",
        attachmentUrl: "https://example.com/documents/inv-002.pdf",
        attachmentName: "invoice_1235.pdf"
      },
      {
        id: "inv-003",
        documentNumber: "INV-2025-1236",
        documentDate: new Date(2025, 4, 2),
        documentAmount: "8500",
        attachmentUrl: "https://example.com/documents/inv-003.pdf",
        attachmentName: "invoice_additional.pdf"
      }
    ],
    "asset-002": [
      {
        id: "inv-004",
        documentNumber: "INV-2025-2345",
        documentDate: new Date(2025, 4, 8),
        documentAmount: "120000",
        attachmentUrl: "https://example.com/documents/inv-004.pdf",
        attachmentName: "kitchen_invoice.pdf"
      }
    ]
  },
  "store-002": {
    "asset-001": [
      {
        id: "inv-005",
        documentNumber: "INV-2025-3456",
        documentDate: new Date(2025, 4, 10),
        documentAmount: "84000",
        attachmentUrl: "https://example.com/documents/inv-005.pdf",
        attachmentName: "furniture_invoice.pdf"
      },
      {
        id: "inv-006",
        documentNumber: "INV-2025-3457",
        documentDate: new Date(2025, 4, 12),
        documentAmount: "16000",
        attachmentUrl: "https://example.com/documents/inv-006.pdf",
        attachmentName: "furniture_delivery_invoice.pdf"
      }
    ]
  }
};

const mockGrnDocuments = {
  "store-001": {
    "asset-001": [
      {
        id: "grn-001",
        documentNumber: "GRN-2025-0987",
        documentDate: new Date(2025, 3, 30),
        attachmentUrl: "https://example.com/documents/grn-001.pdf",
        attachmentName: "goods_receipt_0987.pdf"
      }
    ],
    "asset-002": [
      {
        id: "grn-002",
        documentNumber: "GRN-2025-0988",
        documentDate: new Date(2025, 4, 15),
        attachmentUrl: "https://example.com/documents/grn-002.pdf",
        attachmentName: "receipt_kitchen_equipment.pdf"
      },
      {
        id: "grn-003",
        documentNumber: "GRN-2025-0989",
        documentDate: new Date(2025, 4, 16),
        attachmentUrl: "https://example.com/documents/grn-003.pdf",
        attachmentName: "receipt_additional_items.pdf"
      }
    ]
  },
  "store-002": {
    "asset-001": [
      {
        id: "grn-004",
        documentNumber: "GRN-2025-1234",
        documentDate: new Date(2025, 4, 18),
        attachmentUrl: "https://example.com/documents/grn-004.pdf",
        attachmentName: "furniture_receipt.pdf"
      }
    ]
  }
};

// Function to get mock documents based on document type
const getMockDocuments = (storeId, assetId, documentType) => {
  console.log(`Getting ${documentType} documents for store ${storeId}, asset ${assetId}`);
  let documents = [];
  
  switch (documentType) {
    case 'po':
      documents = mockPoDocuments[storeId]?.[assetId] || [];
      break;
    case 'invoice':
      documents = mockInvoiceDocuments[storeId]?.[assetId] || [];
      break;
    case 'grn':
      documents = mockGrnDocuments[storeId]?.[assetId] || [];
      break;
    default:
      documents = [];
  }
  
  console.log(`Found ${documents.length} ${documentType} documents`);
  return documents;
};

// Main storeAPI object
export const storeAPI = {
  getAllStores: async (): Promise<Store[]> => {
    try {
      console.log("Getting all stores");
      return mockStoresOffline;
    } catch (error) {
      console.error('Error fetching stores:', error);
      throw error;
    }
  },

  getStoreById: async (id: string): Promise<Store> => {
    try {
      console.log(`Getting store by ID: ${id}`);
      const store = mockStoresOffline.find(s => s.id === id);
      if (!store) {
        throw new Error(`Store with ID ${id} not found`);
      }
      return store;
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
      console.log(`Getting assets for store ID: ${storeId}`);
      const assets = getStoreAssetsByStoreId(storeId);
      
      // Enrich assets with document counts
      return assets.map(asset => {
        const poCount = mockPoDocuments[storeId]?.[asset.id]?.length || 0;
        const invoiceCount = mockInvoiceDocuments[storeId]?.[asset.id]?.length || 0;
        const grnCount = mockGrnDocuments[storeId]?.[asset.id]?.length || 0;
        
        return {
          ...asset,
          poCount,
          invoiceCount,
          grnCount,
          po_attachment_url: poCount > 0 ? mockPoDocuments[storeId][asset.id][0].attachmentUrl : null,
          invoice_attachment_url: invoiceCount > 0 ? mockInvoiceDocuments[storeId][asset.id][0].attachmentUrl : null,
          grn_attachment_url: grnCount > 0 ? mockGrnDocuments[storeId][asset.id][0].attachmentUrl : null,
          po_number: poCount > 0 ? mockPoDocuments[storeId][asset.id][0].documentNumber : null,
          invoice_number: invoiceCount > 0 ? mockInvoiceDocuments[storeId][asset.id][0].documentNumber : null,
          invoice_amount: invoiceCount > 0 ? mockInvoiceDocuments[storeId][asset.id][0].documentAmount : null,
          invoice_date: invoiceCount > 0 ? mockInvoiceDocuments[storeId][asset.id][0].documentDate : null,
          grn_number: grnCount > 0 ? mockGrnDocuments[storeId][asset.id][0].documentNumber : null,
        };
      });
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
      console.log(`Updating tracking status for asset ${assetId}, param: ${updateParam}`, body);
      // Mock successful update - in a real app this would call the API
      const storeId = Object.keys(mockPoDocuments).find(storeId => 
        Object.keys(mockPoDocuments[storeId] || {}).includes(assetId) ||
        Object.keys(mockInvoiceDocuments[storeId] || {}).includes(assetId) ||
        Object.keys(mockGrnDocuments[storeId] || {}).includes(assetId)
      );

      // Add document to the mock data if it's a document type update
      if (updateParam === 'po' && body.po_number) {
        if (!mockPoDocuments[storeId]) mockPoDocuments[storeId] = {};
        if (!mockPoDocuments[storeId][assetId]) mockPoDocuments[storeId][assetId] = [];
        
        mockPoDocuments[storeId][assetId].push({
          id: `po-${Date.now()}`,
          documentNumber: body.po_number,
          documentDate: new Date(),
          attachmentUrl: "https://example.com/documents/new-po.pdf",
          attachmentName: body.po_attachment_name || "new_purchase_order.pdf"
        });
      }
      
      if (updateParam === 'invoice' && body.invoice_no) {
        if (!mockInvoiceDocuments[storeId]) mockInvoiceDocuments[storeId] = {};
        if (!mockInvoiceDocuments[storeId][assetId]) mockInvoiceDocuments[storeId][assetId] = [];
        
        mockInvoiceDocuments[storeId][assetId].push({
          id: `inv-${Date.now()}`,
          documentNumber: body.invoice_no,
          documentDate: body.invoice_date ? new Date(body.invoice_date) : new Date(),
          documentAmount: body.invoice_amount || "0",
          attachmentUrl: "https://example.com/documents/new-invoice.pdf",
          attachmentName: body.invoice_attachment_name || "new_invoice.pdf"
        });
      }
      
      if (updateParam === 'grn' && body.grn_val) {
        if (!mockGrnDocuments[storeId]) mockGrnDocuments[storeId] = {};
        if (!mockGrnDocuments[storeId][assetId]) mockGrnDocuments[storeId][assetId] = [];
        
        mockGrnDocuments[storeId][assetId].push({
          id: `grn-${Date.now()}`,
          documentNumber: body.grn_val,
          documentDate: new Date(),
          attachmentUrl: "https://example.com/documents/new-grn.pdf",
          attachmentName: "new_goods_receipt.pdf"
        });
      }
      
      return { success: true, message: 'Status updated successfully' };
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
      console.log(`Fetching assets for store ID: ${storeId}`);
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
    console.log(`Getting ${documentType} documents for store ${storeId}, asset ${assetId}`);
    return getMockDocuments(storeId, assetId, documentType);
  },
  
  addStoreDocument: async (storeId: string, assetId: string, documentType: 'po' | 'invoice' | 'grn', documentData: any) => {
    console.log('Adding document:', { storeId, assetId, documentType, documentData });
    
    // Add the document to our mock data
    const newDoc = {
      id: `${documentType}-${Date.now()}`,
      documentNumber: documentData[`${documentType}_number`] || documentData.documentNumber,
      attachmentName: documentData[`${documentType}_attachment_name`],
      attachmentUrl: `https://example.com/documents/${documentData[`${documentType}_attachment_name`]}`,
    };
    
    // Add additional fields for invoice
    if (documentType === 'invoice') {
      newDoc.documentDate = documentData.invoice_date ? new Date(documentData.invoice_date) : new Date();
      newDoc.documentAmount = documentData.invoice_amount || '0';
    } else {
      newDoc.documentDate = new Date();
    }
    
    // Update the appropriate mock document store
    let mockDocStore;
    switch (documentType) {
      case 'po':
        mockDocStore = mockPoDocuments;
        break;
      case 'invoice':
        mockDocStore = mockInvoiceDocuments;
        break;
      case 'grn':
        mockDocStore = mockGrnDocuments;
        break;
    }
    
    if (!mockDocStore[storeId]) mockDocStore[storeId] = {};
    if (!mockDocStore[storeId][assetId]) mockDocStore[storeId][assetId] = [];
    
    mockDocStore[storeId][assetId].push(newDoc);
    console.log(`Added new ${documentType} document:`, newDoc);
    
    return { success: true, message: 'Document added successfully', document: newDoc };
  },
  
  deleteStoreDocument: async (storeId: string, assetId: string, documentType: 'po' | 'invoice' | 'grn', documentId: string) => {
    console.log('Deleting document:', { storeId, assetId, documentType, documentId });
    
    // Select the right document store
    let mockDocStore;
    switch (documentType) {
      case 'po':
        mockDocStore = mockPoDocuments;
        break;
      case 'invoice':
        mockDocStore = mockInvoiceDocuments;
        break;
      case 'grn':
        mockDocStore = mockGrnDocuments;
        break;
    }
    
    // Delete the document if it exists
    if (mockDocStore[storeId] && mockDocStore[storeId][assetId]) {
      const initialLength = mockDocStore[storeId][assetId].length;
      mockDocStore[storeId][assetId] = mockDocStore[storeId][assetId].filter(doc => doc.id !== documentId);
      
      const wasDeleted = initialLength > mockDocStore[storeId][assetId].length;
      console.log(`Document deleted: ${wasDeleted}`);
    }
    
    return { success: true, message: 'Document deleted successfully' };
  }
};

// Separate assetAPI object
export const assetAPI = {
  getAllAssets: async (): Promise<Asset[]> => {
    try {
      console.log("Getting all assets");
      return mockAssets;
    } catch (error) {
      console.error('Error fetching assets:', error);
      throw error;
    }
  },

  getAssetById: async (id: string): Promise<Asset> => {
    try {
      console.log(`Getting asset by ID: ${id}`);
      const asset = mockAssets.find(a => a.id === id);
      if (!asset) {
        throw new Error(`Asset with ID ${id} not found`);
      }
      return asset;
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


import { Store, Asset, StoreAsset } from '@/types';
import { storeAPI } from '../api/storeAPI';  // ADDED ON 30-04-2025//////

// Generate random percentage between min and max
const randomPercentage = (min: number, max: number) => 
  Math.floor(Math.random() * (max - min + 1) + min);


 const allstores = await storeAPI.getAllStores();

 let data=[];

for (let i = 0; i < allstores.length; i++) { 
  data.push({
    id:allstores[i].id,
    code:allstores[i].code,
    name:allstores[i].name,
    brand:allstores[i].brand,
    city: allstores[i].city,
    grnCompletionPercentage:  randomPercentage(50, 100), // THIS LINE WILL BE CHNAGED AFTER DISCUSSION
    financeBookingPercentage: randomPercentage(50, 90), // THIS LINE WILL BE CHNAGED AFTER DISCUSSION
  });
}

export const mockStores: Store[] = data;

// console.log('===========');
// console.log(allstores);
 //console.log(data);

// Mock Stores Data
/*
export const mockStores: Store[] = [
  {
    id: '1',
    name: 'Acropolis',
    code: 'KOL246',
    brand: 'Wow! Kulfi',
    city: 'Kolkata',
    grnCompletionPercentage: randomPercentage(50, 100),
    financeBookingPercentage: randomPercentage(30, 90)
  },
  {
    id: '2',
    name: 'Avishikta',
    code: 'KOL214',
    brand: 'Wow! Momo',
    city: 'Kolkata',
    grnCompletionPercentage: randomPercentage(50, 100),
    financeBookingPercentage: randomPercentage(30, 90)
  }  
];
*/


// Mock Assets Data
export const mockAssets: Asset[] = [
  {
    id: '1',
    code: 'EQ-001',
    name: 'Commercial Deep Fryer',
    category: 'Kitchen Equipment',
    unit_of_measurement: 'pcs',
    price_per_unit: 2500
  },
  {
    id: '857933f0-1bb9-43da-b621-5d8ada99c6ef',
    code: 'EQ-002',
    name: 'Industrial Refrigerator',
    category: 'Kitchen Equipment',
    unit_of_measurement: 'pcs',
    price_per_unit: 4200
  },
  {
    id: '3',
    code: 'EQ-003',
    name: 'POS System Terminal',
    category: 'Technology',
    unit_of_measurement: 'pcs',
    price_per_unit: 1800
  },
  {
    id: '4',
    code: 'EQ-004',
    name: 'Kitchen Countertop',
    category: 'Furniture',
    unit_of_measurement: 'sq ft',
    price_per_unit: 65
  },
  {
    id: '5',
    code: 'EQ-005',
    name: 'Customer Seating Set',
    category: 'Furniture',
    unit_of_measurement: 'set',
    price_per_unit: 850
  },
  {
    id: '6',
    code: 'EQ-006',
    name: 'Food Warmer Display',
    category: 'Kitchen Equipment',
    unit_of_measurement: 'pcs',
    price_per_unit: 1200
  },
  {
    id: '7',
    code: 'EQ-007',
    name: 'Digital Menu Board',
    category: 'Technology',
    unit_of_measurement: 'pcs',
    price_per_unit: 950
  },
];

// Mock StoreAssets Data
export const mockStoreAssets: StoreAsset[] = [
  {
    id: '1',
    storeId: '1',
    assetId: '1',
    quantity: 2,
    poNumber: 'PO-2023-001',
    poAttachment: 'po_attachment_1.pdf',
    invoiceNumber: 'INV-2023-001',
    invoiceAttachment: 'invoice_attachment_1.pdf',
    grnNumber: 'GRN-2023-001',
    isGrnDone: true,
    isTaggingDone: true,
    isProjectHeadApproved: true,
    isAuditDone: true,
    isFinanceBooked: false,
  },
  {
    id: '2',
    storeId: '1',
    assetId: '2',
    quantity: 1,
    poNumber: 'PO-2023-002',
    poAttachment: 'po_attachment_2.pdf',
    invoiceNumber: 'INV-2023-002',
    invoiceAttachment: 'invoice_attachment_2.pdf',
    grnNumber: 'GRN-2023-002',
    isGrnDone: true,
    isTaggingDone: false,
    isProjectHeadApproved: null,
    isAuditDone: false,
    isFinanceBooked: false,
  },
  {
    id: '3',
    storeId: '1',
    assetId: '3',
    quantity: 3,
    poNumber: 'PO-2023-003',
    poAttachment: undefined,
    invoiceNumber: undefined,
    invoiceAttachment: undefined,
    grnNumber: undefined,
    isGrnDone: false,
    isTaggingDone: false,
    isProjectHeadApproved: null,
    isAuditDone: false,
    isFinanceBooked: false,
  },
  {
    id: '4',
    storeId: '2',
    assetId: '1',
    quantity: 2,
    poNumber: 'PO-2023-004',
    poAttachment: 'po_attachment_4.pdf',
    invoiceNumber: 'INV-2023-004',
    invoiceAttachment: 'invoice_attachment_4.pdf',
    grnNumber: 'GRN-2023-004',
    isGrnDone: true,
    isTaggingDone: true,
    isProjectHeadApproved: true,
    isAuditDone: true,
    isFinanceBooked: true,
  }
];

// Function to get a store by ID
export const getStoreById = (id: string): Store | undefined => {
  return mockStores.find(store => store.id === id);
};

// Function to get an asset by ID
export const getAssetById = (id: string): Asset | undefined => {
  return mockAssets.find(asset => asset.id === id);
};

// Function to get store assets by store ID
export const getStoreAssetsByStoreId = (storeId: string): StoreAsset[] => {
  return mockStoreAssets
    .filter(storeAsset => storeAsset.storeId === storeId)
    .map(storeAsset => ({
      ...storeAsset,
      asset: getAssetById(storeAsset.assetId)
    }));
};

// Function to get store assets with asset details
export const getStoreAssetsWithDetails = (): StoreAsset[] => {
  return mockStoreAssets.map(storeAsset => ({
    ...storeAsset,
    asset: getAssetById(storeAsset.assetId)
  }));
};

// Generate unique ID for new items
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

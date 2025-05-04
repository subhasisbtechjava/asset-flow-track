
import { Store, Asset, StoreAsset } from '@/types';
import { storeAPI } from '../api/storeAPI';  // ADDED ON 30-04-2025//////

// Generate random percentage between min and max
const randomPercentage = (min: number, max: number) => 
  Math.floor(Math.random() * (max - min + 1) + min);


//  const allstores = await storeAPI.getAllStores();

 const data=[];

// for (let i = 0; i < allstores.length; i++) { 
//   data.push({
//     id:allstores[i].id,
//     code:allstores[i].code,
//     name:allstores[i].name,
//     brand:allstores[i].brand,
//     city: allstores[i].city,
//     grnCompletionPercentage:  randomPercentage(50, 100), // THIS LINE WILL BE CHNAGED AFTER DISCUSSION
//     financeBookingPercentage: randomPercentage(50, 90), // THIS LINE WILL BE CHNAGED AFTER DISCUSSION
//   });
// }

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
    unitOfMeasurement: 'pcs',
    pricePerUnit: 2500
  },
  {
    id: '2',
    code: 'EQ-002',
    name: 'Industrial Refrigerator',
    category: 'Kitchen Equipment',
    unitOfMeasurement: 'pcs',
    pricePerUnit: 4200
  },
  {
    id: '3',
    code: 'EQ-003',
    name: 'POS System Terminal',
    category: 'Technology',
    unitOfMeasurement: 'pcs',
    pricePerUnit: 1800
  },
  {
    id: '4',
    code: 'EQ-004',
    name: 'Kitchen Countertop',
    category: 'Furniture',
    unitOfMeasurement: 'sq ft',
    pricePerUnit: 65
  },
  {
    id: '5',
    code: 'EQ-005',
    name: 'Customer Seating Set',
    category: 'Furniture',
    unitOfMeasurement: 'set',
    pricePerUnit: 850
  },
  {
    id: '6',
    code: 'EQ-006',
    name: 'Food Warmer Display',
    category: 'Kitchen Equipment',
    unitOfMeasurement: 'pcs',
    pricePerUnit: 1200
  },
  {
    id: '7',
    code: 'EQ-007',
    name: 'Digital Menu Board',
    category: 'Technology',
    unitOfMeasurement: 'pcs',
    pricePerUnit: 950
  },
];

// Mock StoreAssets Data
export const mockStoreAssets: StoreAsset[] = [
  
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

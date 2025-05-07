
import { Store, Asset, StoreAsset } from '@/types';
import { storeAPI } from '../api/storeAPI';  // ADDED ON 30-04-2025//////

// Generate random percentage between min and max
const randomPercentage = (min: number, max: number) => 
  Math.floor(Math.random() * (max - min + 1) + min);

const id = localStorage.getItem('id') || '';

// pending developer sk ismile 
const allstores = id ? await storeAPI.getAllStores() : [];

const data = [];

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

// Mock Stores Data (uncomment for testing without API)
export const mockStoresOffline: Store[] = [
  {
    id: '1',
    name: 'Acropolis',
    code: 'KOL246',
    brand: 'Wow! Kulfi',
    city: 'Kolkata',
    status: 'active',
    grnCompletionPercentage: randomPercentage(50, 100),
    financeBookingPercentage: randomPercentage(30, 90),
    grn_progress: 75,
    erp_progress: 60,
    total_assets_cnt: 12
  },
  {
    id: '2',
    name: 'Avishikta',
    code: 'KOL214',
    brand: 'Wow! Momo',
    city: 'Kolkata',
    status: 'active',
    grnCompletionPercentage: randomPercentage(50, 100),
    financeBookingPercentage: randomPercentage(30, 90),
    grn_progress: 82,
    erp_progress: 78,
    total_assets_cnt: 8
  }  
];

// Mock Assets Data
export const mockAssets: Asset[] = [
  {
    id: '1',
    code: 'EQ-001',
    name: 'Commercial Deep Fryer',
    category: 'Kitchen Equipment',
    unit_of_measurement: 'pcs',
    unitOfMeasurement: 'pcs',
    pricePerUnit: 2500,
    price_per_unit: 2500,
    created_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-01-15T10:30:00Z'
  },
  {
    id: '857933f0-1bb9-43da-b621-5d8ada99c6ef',
    code: 'EQ-002',
    name: 'Industrial Refrigerator',
    category: 'Kitchen Equipment',
    unit_of_measurement: 'pcs',
    unitOfMeasurement: 'pcs',
    pricePerUnit: 4200,
    price_per_unit: 4200,
    created_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-01-15T10:30:00Z'
  },
  {
    id: '3',
    code: 'EQ-003',
    name: 'POS System Terminal',
    category: 'Technology',
    unit_of_measurement: 'pcs',
    unitOfMeasurement: 'pcs',
    pricePerUnit: 1800,
    price_per_unit: 1800,
    created_at: '2025-01-16T10:30:00Z',
    updated_at: '2025-01-16T10:30:00Z'
  },
  {
    id: '4',
    code: 'EQ-004',
    name: 'Kitchen Countertop',
    category: 'Furniture',
    unit_of_measurement: 'sq ft',
    unitOfMeasurement: 'sq ft',
    pricePerUnit: 65,
    price_per_unit: 65,
    created_at: '2025-01-17T10:30:00Z',
    updated_at: '2025-01-17T10:30:00Z'
  },
  {
    id: '5',
    code: 'EQ-005',
    name: 'Customer Seating Set',
    category: 'Furniture',
    unit_of_measurement: 'set',
    unitOfMeasurement: 'set',
    pricePerUnit: 850,
    price_per_unit: 850,
    created_at: '2025-01-18T10:30:00Z',
    updated_at: '2025-01-18T10:30:00Z'
  },
  {
    id: '6',
    code: 'EQ-006',
    name: 'Food Warmer Display',
    category: 'Kitchen Equipment',
    unit_of_measurement: 'pcs',
    unitOfMeasurement: 'pcs',
    pricePerUnit: 1200,
    price_per_unit: 1200,
    created_at: '2025-01-19T10:30:00Z',
    updated_at: '2025-01-19T10:30:00Z'
  },
  {
    id: '7',
    code: 'EQ-007',
    name: 'Digital Menu Board',
    category: 'Technology',
    unit_of_measurement: 'pcs',
    unitOfMeasurement: 'pcs',
    pricePerUnit: 950,
    price_per_unit: 950,
    created_at: '2025-01-20T10:30:00Z',
    updated_at: '2025-01-20T10:30:00Z'
  },
];

// Mock StoreAssets Data with multiple documents for each type
export const mockStoreAssets: StoreAsset[] = [
  {
    id: '101',
    storeId: '1',
    assetId: '1',
    quantity: 2,
    po_number: 'PO-2025-001',
    poNumber: 'PO-2025-001',
    po_attachment_url: 'https://example.com/docs/po_2025_001.pdf',
    invoice_number: 'INV-2025-1001',
    invoiceNumber: 'INV-2025-1001',
    invoice_date: '2025-02-15',
    invoice_attachment_url: 'https://example.com/docs/inv_2025_1001.pdf',
    invoice_amount: '5250',
    grn_number: 'GRN-2025-001',
    grnNumber: 'GRN-2025-001',
    isGrnDone: true,
    is_tagging_done: true,
    isTaggingDone: true,
    is_project_head_approved: true,
    isProjectHeadApproved: true,
    is_audit_done: true,
    isAuditDone: true,
    is_finance_booked: true,
    isFinanceBooked: true,
    grn_progress: 100,
    erp_progress: 100,
    assets_name: 'Commercial Deep Fryer'
  },
  {
    id: '102',
    storeId: '1',
    assetId: '2',
    quantity: 1,
    po_number: 'PO-2025-002',
    poNumber: 'PO-2025-002',
    po_attachment_url: 'https://example.com/docs/po_2025_002.pdf',
    invoice_number: 'INV-2025-1002',
    invoiceNumber: 'INV-2025-1002',
    invoice_date: '2025-02-20',
    invoice_attachment_url: 'https://example.com/docs/inv_2025_1002.pdf',
    invoice_amount: '4500',
    grn_number: 'GRN-2025-002',
    grnNumber: 'GRN-2025-002',
    isGrnDone: true,
    is_tagging_done: true,
    isTaggingDone: true,
    is_project_head_approved: true,
    isProjectHeadApproved: true,
    is_audit_done: true,
    isAuditDone: true,
    is_finance_booked: false,
    isFinanceBooked: false,
    grn_progress: 100,
    erp_progress: 75,
    assets_name: 'Industrial Refrigerator'
  },
  {
    id: '103',
    storeId: '1',
    assetId: '3',
    quantity: 3,
    po_number: 'PO-2025-003',
    poNumber: 'PO-2025-003',
    po_attachment_url: 'https://example.com/docs/po_2025_003.pdf',
    invoice_number: 'INV-2025-1003',
    invoiceNumber: 'INV-2025-1003',
    invoice_date: '2025-03-05',
    invoice_attachment_url: null,
    invoice_amount: '5400',
    grn_number: null,
    grnNumber: null,
    isGrnDone: false,
    is_tagging_done: false,
    isTaggingDone: false,
    is_project_head_approved: null,
    isProjectHeadApproved: null,
    is_audit_done: false,
    isAuditDone: false,
    is_finance_booked: false,
    isFinanceBooked: false,
    grn_progress: 50,
    erp_progress: 25,
    assets_name: 'POS System Terminal'
  },
  {
    id: '104',
    storeId: '2',
    assetId: '4',
    quantity: 20,
    po_number: 'PO-2025-004',
    poNumber: 'PO-2025-004',
    po_attachment_url: 'https://example.com/docs/po_2025_004.pdf',
    invoice_number: null,
    invoiceNumber: null,
    invoice_date: null,
    invoice_attachment_url: null,
    invoice_amount: null,
    grn_number: null,
    grnNumber: null,
    isGrnDone: false,
    is_tagging_done: false,
    isTaggingDone: false,
    is_project_head_approved: null,
    isProjectHeadApproved: null,
    is_audit_done: false,
    isAuditDone: false,
    is_finance_booked: false,
    isFinanceBooked: false,
    grn_progress: 25,
    erp_progress: 0,
    assets_name: 'Kitchen Countertop'
  },
  {
    id: '105',
    storeId: '2',
    assetId: '5',
    quantity: 5,
    po_number: null,
    poNumber: null,
    po_attachment_url: null,
    invoice_number: null,
    invoiceNumber: null,
    invoice_date: null,
    invoice_attachment_url: null,
    invoice_amount: null,
    grn_number: null,
    grnNumber: null,
    isGrnDone: false,
    is_tagging_done: false,
    isTaggingDone: false,
    is_project_head_approved: null,
    isProjectHeadApproved: null,
    is_audit_done: false,
    isAuditDone: false,
    is_finance_booked: false,
    isFinanceBooked: false,
    grn_progress: 0,
    erp_progress: 0,
    assets_name: 'Customer Seating Set'
  }
];

// Function to get a store by ID
export const getStoreById = (id: string): Store | undefined => {
  return mockStores.find(store => store.id === id) || mockStoresOffline.find(store => store.id === id);
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

// Mock function to simulate API for document management
export const getMockDocuments = (storeId: string, assetId: string, docType: 'po' | 'invoice' | 'grn') => {
  // For demo purposes, we'll generate a few documents based on the asset ID
  const baseDocuments = [
    {
      id: `${docType}-${assetId}-1`,
      documentNumber: `${docType.toUpperCase()}-2025-${assetId}01`,
      documentDate: new Date('2025-02-15'),
      documentAmount: docType === 'invoice' ? '1250' : undefined,
      attachmentUrl: `https://example.com/docs/${docType}_${assetId}_1.pdf`,
      attachmentName: `${docType}_document_1.pdf`
    }
  ];
  
  // For some assets, add multiple documents
  if (['101', '102'].includes(assetId)) {
    baseDocuments.push({
      id: `${docType}-${assetId}-2`,
      documentNumber: `${docType.toUpperCase()}-2025-${assetId}02`,
      documentDate: new Date('2025-03-10'),
      documentAmount: docType === 'invoice' ? '2500' : undefined,
      attachmentUrl: `https://example.com/docs/${docType}_${assetId}_2.pdf`,
      attachmentName: `${docType}_document_2.pdf`
    });
  }
  
  return baseDocuments;
};

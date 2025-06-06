
import { Store, Asset, StoreAsset } from '@/types';
import { storeAPI } from '../api/storeAPI';

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

// Enhanced Mock Stores Data with more realistic values
export const mockStoresOffline: Store[] = [
  {
    id: '1',
    name: 'Acropolis Mall',
    code: 'KOL246',
    brand: 'Wow! Kulfi',
    city: 'Kolkata',
    status: 'active',
    grnCompletionPercentage: 75,
    financeBookingPercentage: 60,
    grn_progress: 75,
    erp_progress: 60,
    total_assets_cnt: 12
  },
  {
    id: '2',
    name: 'Avishikta Complex',
    code: 'KOL214',
    brand: 'Wow! Momo',
    city: 'Kolkata',
    status: 'active',
    grnCompletionPercentage: 82,
    financeBookingPercentage: 78,
    grn_progress: 82,
    erp_progress: 78,
    total_assets_cnt: 8
  },
  {
    id: '3',
    name: 'South City Mall',
    code: 'KOL321',
    brand: 'Wow! China',
    city: 'Kolkata',
    status: 'pending',
    grnCompletionPercentage: 45,
    financeBookingPercentage: 20,
    grn_progress: 45,
    erp_progress: 20,
    total_assets_cnt: 15
  },
  {
    id: '4',
    name: 'DLF Cyber City',
    code: 'GUR101',
    brand: 'Wow! Momo',
    city: 'Gurugram',
    status: 'active',
    grnCompletionPercentage: 95,
    financeBookingPercentage: 90,
    grn_progress: 95,
    erp_progress: 90,
    total_assets_cnt: 10
  },
  {
    id: '5',
    name: 'Phoenix Marketcity',
    code: 'BLR425',
    brand: 'Wow! Kulfi',
    city: 'Bangalore',
    status: 'active',
    grnCompletionPercentage: 88,
    financeBookingPercentage: 82,
    grn_progress: 88,
    erp_progress: 82,
    total_assets_cnt: 7
  },
  {
    id: '6',
    name: 'Oberoi Mall',
    code: 'MUM512',
    brand: 'Wow! China',
    city: 'Mumbai',
    status: 'pending',
    grnCompletionPercentage: 30,
    financeBookingPercentage: 15,
    grn_progress: 30,
    erp_progress: 15,
    total_assets_cnt: 18
  },
];

// Enhanced Mock Assets Data with more variety
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
  {
    id: '8',
    code: 'EQ-008',
    name: 'Stainless Steel Prep Table',
    category: 'Kitchen Equipment',
    unit_of_measurement: 'pcs',
    unitOfMeasurement: 'pcs',
    pricePerUnit: 750,
    price_per_unit: 750,
    created_at: '2025-02-05T10:30:00Z',
    updated_at: '2025-02-05T10:30:00Z'
  },
  {
    id: '9',
    code: 'EQ-009',
    name: 'Commercial Blender',
    category: 'Kitchen Equipment',
    unit_of_measurement: 'pcs',
    unitOfMeasurement: 'pcs',
    pricePerUnit: 320,
    price_per_unit: 320,
    created_at: '2025-02-10T10:30:00Z',
    updated_at: '2025-02-10T10:30:00Z'
  },
  {
    id: '10',
    code: 'EQ-010',
    name: 'Indoor Dining Chairs',
    category: 'Furniture',
    unit_of_measurement: 'pcs',
    unitOfMeasurement: 'pcs',
    pricePerUnit: 95,
    price_per_unit: 95,
    created_at: '2025-02-15T10:30:00Z',
    updated_at: '2025-02-15T10:30:00Z'
  },
];

// Enhanced Mock StoreAssets Data with more entries and varied statuses
export const mockStoreAssets: StoreAsset[] = [
  // Store 1 Assets (Acropolis Mall)
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
    storeId: '1',
    assetId: '8',
    quantity: 2,
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
    assets_name: 'Stainless Steel Prep Table'
  },
  
  // Store 2 Assets (Avishikta Complex)
  {
    id: '201',
    storeId: '2',
    assetId: '4',
    quantity: 20,
    po_number: 'PO-2025-101',
    poNumber: 'PO-2025-101',
    po_attachment_url: 'https://example.com/docs/po_2025_101.pdf',
    invoice_number: 'INV-2025-2001',
    invoiceNumber: 'INV-2025-2001',
    invoice_date: '2025-02-22',
    invoice_attachment_url: 'https://example.com/docs/inv_2025_2001.pdf',
    invoice_amount: '1300',
    grn_number: 'GRN-2025-101',
    grnNumber: 'GRN-2025-101',
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
    assets_name: 'Kitchen Countertop'
  },
  {
    id: '202',
    storeId: '2',
    assetId: '5',
    quantity: 5,
    po_number: 'PO-2025-102',
    poNumber: 'PO-2025-102',
    po_attachment_url: 'https://example.com/docs/po_2025_102.pdf',
    invoice_number: 'INV-2025-2002',
    invoiceNumber: 'INV-2025-2002',
    invoice_date: '2025-02-25',
    invoice_attachment_url: 'https://example.com/docs/inv_2025_2002.pdf',
    invoice_amount: '4250',
    grn_number: 'GRN-2025-102',
    grnNumber: 'GRN-2025-102',
    isGrnDone: true,
    is_tagging_done: true,
    isTaggingDone: true,
    is_project_head_approved: true,
    isProjectHeadApproved: true,
    is_audit_done: false,
    isAuditDone: false,
    is_finance_booked: false,
    isFinanceBooked: false,
    grn_progress: 75,
    erp_progress: 50,
    assets_name: 'Customer Seating Set'
  },
  
  // Store 3 Assets (South City Mall)
  {
    id: '301',
    storeId: '3',
    assetId: '6',
    quantity: 3,
    po_number: 'PO-2025-201',
    poNumber: 'PO-2025-201',
    po_attachment_url: 'https://example.com/docs/po_2025_201.pdf',
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
    assets_name: 'Food Warmer Display'
  },
  {
    id: '302',
    storeId: '3',
    assetId: '7',
    quantity: 2,
    po_number: 'PO-2025-202',
    poNumber: 'PO-2025-202',
    po_attachment_url: 'https://example.com/docs/po_2025_202.pdf',
    invoice_number: 'INV-2025-3001',
    invoiceNumber: 'INV-2025-3001',
    invoice_date: '2025-03-10',
    invoice_attachment_url: 'https://example.com/docs/inv_2025_3001.pdf',
    invoice_amount: '1900',
    grn_number: 'GRN-2025-201',
    grnNumber: 'GRN-2025-201',
    isGrnDone: true,
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
    assets_name: 'Digital Menu Board'
  },
  {
    id: '303',
    storeId: '3',
    assetId: '9',
    quantity: 4,
    po_number: 'PO-2025-203',
    poNumber: 'PO-2025-203',
    po_attachment_url: 'https://example.com/docs/po_2025_203.pdf',
    invoice_number: 'INV-2025-3002',
    invoiceNumber: 'INV-2025-3002',
    invoice_date: '2025-03-15',
    invoice_attachment_url: 'https://example.com/docs/inv_2025_3002.pdf',
    invoice_amount: '1280',
    grn_number: null,
    grnNumber: null,
    isGrnDone: false,
    is_tagging_done: false,
    isTaggingDone: false,
    is_project_head_approved: false,
    isProjectHeadApproved: false,
    is_audit_done: false,
    isAuditDone: false,
    is_finance_booked: false,
    isFinanceBooked: false,
    grn_progress: 50,
    erp_progress: 25,
    assets_name: 'Commercial Blender'
  },
  
  // Store 4 Assets (DLF Cyber City)
  {
    id: '401',
    storeId: '4',
    assetId: '10',
    quantity: 24,
    po_number: 'PO-2025-301',
    poNumber: 'PO-2025-301',
    po_attachment_url: 'https://example.com/docs/po_2025_301.pdf',
    invoice_number: 'INV-2025-4001',
    invoiceNumber: 'INV-2025-4001',
    invoice_date: '2025-03-20',
    invoice_attachment_url: 'https://example.com/docs/inv_2025_4001.pdf',
    invoice_amount: '2280',
    grn_number: 'GRN-2025-301',
    grnNumber: 'GRN-2025-301',
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
    assets_name: 'Indoor Dining Chairs'
  },
  
  // More assets for Store 1 to demonstrate variety
  {
    id: '105',
    storeId: '1',
    assetId: '9',
    quantity: 2,
    po_number: 'PO-2025-005',
    poNumber: 'PO-2025-005',
    po_attachment_url: 'https://example.com/docs/po_2025_005.pdf',
    invoice_number: 'INV-2025-1004',
    invoiceNumber: 'INV-2025-1004',
    invoice_date: '2025-03-25',
    invoice_attachment_url: 'https://example.com/docs/inv_2025_1004.pdf',
    invoice_amount: '640',
    grn_number: 'GRN-2025-005',
    grnNumber: 'GRN-2025-005',
    isGrnDone: true,
    is_tagging_done: true,
    isTaggingDone: true,
    is_project_head_approved: false,
    isProjectHeadApproved: false,
    is_audit_done: false,
    isAuditDone: false,
    is_finance_booked: false,
    isFinanceBooked: false,
    grn_progress: 60,
    erp_progress: 30,
    assets_name: 'Commercial Blender'
  },
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
  // For demo purposes, we'll generate documents based on the store and asset ID
  const baseDocuments = [];
  
  // Get the specific store asset to create realistic documents
  const storeAsset = mockStoreAssets.find(sa => sa.storeId === storeId && sa.assetId === assetId);
  
  if (storeAsset) {
    if (docType === 'po' && storeAsset.po_number) {
      baseDocuments.push({
        id: `${docType}-${assetId}-1`,
        documentNumber: storeAsset.po_number,
        documentDate: new Date('2025-02-15'),
        attachmentUrl: storeAsset.po_attachment_url || `https://example.com/docs/${docType}_${assetId}_1.pdf`,
        attachmentName: `${storeAsset.po_number}.pdf`
      });
      
      // Add a second PO document for some assets
      if (['101', '201', '401'].includes(storeAsset.id)) {
        baseDocuments.push({
          id: `${docType}-${assetId}-2`,
          documentNumber: `${storeAsset.po_number}-Rev1`,
          documentDate: new Date('2025-02-20'),
          attachmentUrl: `https://example.com/docs/${docType}_${assetId}_2.pdf`,
          attachmentName: `${storeAsset.po_number}_revision.pdf`
        });
      }
    }
    
    if (docType === 'invoice' && storeAsset.invoice_number) {
      baseDocuments.push({
        id: `${docType}-${assetId}-1`,
        documentNumber: storeAsset.invoice_number,
        documentDate: storeAsset.invoice_date ? new Date(storeAsset.invoice_date) : new Date('2025-03-05'),
        documentAmount: storeAsset.invoice_amount,
        attachmentUrl: storeAsset.invoice_attachment_url || `https://example.com/docs/${docType}_${assetId}_1.pdf`,
        attachmentName: `${storeAsset.invoice_number}.pdf`
      });
      
      // Add a second invoice for some assets (e.g. split invoices)
      if (['102', '202', '302'].includes(storeAsset.id)) {
        baseDocuments.push({
          id: `${docType}-${assetId}-2`,
          documentNumber: `${storeAsset.invoice_number}-B`,
          documentDate: new Date('2025-03-10'),
          documentAmount: (Number(storeAsset.invoice_amount) * 0.2).toString(), // 20% of the original amount
          attachmentUrl: `https://example.com/docs/${docType}_${assetId}_2.pdf`,
          attachmentName: `${storeAsset.invoice_number}_part2.pdf`
        });
      }
    }
    
    if (docType === 'grn' && storeAsset.grn_number) {
      baseDocuments.push({
        id: `${docType}-${assetId}-1`,
        documentNumber: storeAsset.grn_number,
        documentDate: new Date('2025-03-15'),
        attachmentUrl: `https://example.com/docs/${docType}_${assetId}_1.pdf`,
        attachmentName: `${storeAsset.grn_number}.pdf`
      });
      
      // Add a second GRN for some assets (e.g. partial delivery)
      if (['101', '201', '401'].includes(storeAsset.id)) {
        baseDocuments.push({
          id: `${docType}-${assetId}-2`,
          documentNumber: `${storeAsset.grn_number}-P2`,
          documentDate: new Date('2025-03-25'),
          attachmentUrl: `https://example.com/docs/${docType}_${assetId}_2.pdf`,
          attachmentName: `${storeAsset.grn_number}_part2.pdf`
        });
      }
    }
  }
  
  return baseDocuments;
};

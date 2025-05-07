
export type UserRole = 'admin' | 'procurement' | 'projectHead' | 'finance';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Store {
  id: string;
  name: string;
  code: string;
  status: string;
  brand: string;
  city: string;
  grn_progress: number;
  erp_progress: number;
  grnCompletionPercentage: number;
  financeBookingPercentage: number;
  total_assets_cnt?: number;
}

export interface Asset {
  id: string;
  code: string;
  name: string;
  category: string;
  unitOfMeasurement: string;
  unit_of_measurement: string;
  pricePerUnit: number;
  price_per_unit?: number;
  created_at?: string;  // Added this property
  updated_at?: string;  // Added this property
}

export interface Changepass { 
  currentpass: string;
  newpass: string;
  confirmmpass: string;
}

export interface StoreAsset {
  id: string;
  storeId: string;
  assetId: string;
  quantity: number;
  po_number?: string;
  po_attachment_url?: string;
  invoice_number?: string;
  invoice_date?:string
  invoice_attachment_url?: string;
  invoice_amount?: string;
  grn_number?: string;
  isGrnDone: boolean;
  is_tagging_done: boolean;
  is_project_head_approved: boolean | null;
  is_audit_done: boolean;
  is_finance_booked: boolean;
  assets_name:string;
  // Add these for compatibility with existing code
  poNumber?: string;
  invoiceNumber?: string;
  grnNumber?: string;
  isTaggingDone?: boolean;
  isProjectHeadApproved?: boolean | null;
  isAuditDone?: boolean;
  isFinanceBooked?: boolean;
  grn_progress?: number;
  erp_progress?: number;
  asset?: Asset;
}

export type WorkflowStage = 
  | 'po_generation' 
  | 'invoice_generation' 
  | 'grn_generation' 
  | 'tagging' 
  | 'project_head_approval' 
  | 'audit' 
  | 'finance_booking';

export interface WorkflowStatus {
  stage: WorkflowStage;
  isCompleted: boolean;
  completedBy?: string;
  completedAt?: Date;
  attachmentUrl?: string;
}

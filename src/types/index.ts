
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
}

export interface Asset {
  id: string;
  code: string;
  name: string;
  category: string;
  unitOfMeasurement: string;
  unit_of_measurement: string;
  pricePerUnit: number;
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
  poNumber?: string;
  poAttachment?: string;
  invoiceNumber?: string;
  invoiceAttachment?: string;
  grnNumber?: string;
  isGrnDone: boolean;
  isTaggingDone: boolean;
  isProjectHeadApproved: boolean | null;
  isAuditDone: boolean;
  isFinanceBooked: boolean;
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

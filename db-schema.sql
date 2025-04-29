
-- PostgreSQL Database Schema for Asset Management System

-- Users Table: Stores all system users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'procurement', 'projectHead', 'finance')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Stores Table: Information about store locations
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Assets Table: Master list of assets/equipment
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    unit_of_measurement VARCHAR(20) NOT NULL,
    price_per_unit DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Store Assets Table: Relationship between stores and their assets
CREATE TABLE store_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    po_number VARCHAR(50),
    po_attachment_url VARCHAR(255),
    invoice_number VARCHAR(50),
    invoice_attachment_url VARCHAR(255),
    grn_number VARCHAR(50),
    is_grn_done BOOLEAN DEFAULT FALSE,
    is_tagging_done BOOLEAN DEFAULT FALSE,
    is_project_head_approved BOOLEAN DEFAULT NULL,
    is_audit_done BOOLEAN DEFAULT FALSE,
    is_finance_booked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (store_id, asset_id)
);

-- Document Uploads Table: Stores file uploads
CREATE TABLE document_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_asset_id UUID NOT NULL REFERENCES store_assets(id) ON DELETE CASCADE,
    document_type VARCHAR(20) NOT NULL CHECK (document_type IN ('po', 'invoice', 'grn')),
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Workflow History Table: Audit trail of status changes
CREATE TABLE workflow_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_asset_id UUID NOT NULL REFERENCES store_assets(id) ON DELETE CASCADE,
    status_field VARCHAR(50) NOT NULL,
    old_value BOOLEAN,
    new_value BOOLEAN,
    changed_by UUID REFERENCES users(id),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Create functions for automatically updating timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamps
CREATE TRIGGER update_users_modtime
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_stores_modtime
BEFORE UPDATE ON stores
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_assets_modtime
BEFORE UPDATE ON assets
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_store_assets_modtime
BEFORE UPDATE ON store_assets
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Views for reporting
CREATE VIEW store_progress_view AS
SELECT 
    s.id as store_id,
    s.name as store_name,
    s.code as store_code,
    s.brand,
    s.city,
    COUNT(sa.id) as total_assets,
    ROUND(
        (SUM(CASE WHEN sa.is_grn_done THEN 1 ELSE 0 END)::FLOAT / NULLIF(COUNT(sa.id), 0)) * 100
    ) as grn_completion_percentage,
    ROUND(
        (SUM(CASE WHEN sa.is_finance_booked THEN 1 ELSE 0 END)::FLOAT / NULLIF(COUNT(sa.id), 0)) * 100
    ) as finance_booking_percentage
FROM 
    stores s
LEFT JOIN 
    store_assets sa ON s.id = sa.store_id
GROUP BY 
    s.id, s.name, s.code, s.brand, s.city;

-- Indexes for performance
CREATE INDEX idx_store_assets_store_id ON store_assets(store_id);
CREATE INDEX idx_store_assets_asset_id ON store_assets(asset_id);
CREATE INDEX idx_document_uploads_store_asset_id ON document_uploads(store_asset_id);
CREATE INDEX idx_workflow_history_store_asset_id ON workflow_history(store_asset_id);

-- Seed data so the team can log in and demo immediately.
-- Runs automatically on startup because spring.sql.init.mode is NOT restricted here;
-- Hibernate creates tables first (ddl-auto=update), then this file seeds rows.

INSERT INTO users (name, email, password, role, department_id, status) VALUES
('Admin User', 'admin@assetflow.io', 'admin123', 'ADMIN', NULL, 'ACTIVE'),
('Asha Manager', 'manager@assetflow.io', 'manager123', 'ASSET_MANAGER', NULL, 'ACTIVE'),
('Priya Nair', 'priya@assetflow.io', 'employee123', 'EMPLOYEE', NULL, 'ACTIVE');

INSERT INTO departments (name, status) VALUES
('Engineering', 'ACTIVE'),
('Design', 'ACTIVE'),
('Operations', 'ACTIVE');

INSERT INTO asset_categories (name) VALUES ('Electronics'), ('Furniture'), ('Vehicles');

INSERT INTO locations (name) VALUES ('HQ - Floor 1'), ('HQ - Floor 2'), ('Warehouse A');

INSERT INTO assets (asset_tag, name, category_id, serial_number, condition, location_id, status, bookable) VALUES
('AF-0001', 'Dell Latitop 5440', 1, 'SN-1001', 'Good', 1, 'AVAILABLE', false),
('AF-0002', 'Conference Room B2', 2, NULL, 'Good', 2, 'AVAILABLE', true),
('AF-0003', 'Projector Epson EB', 1, 'SN-2002', 'Good', 1, 'AVAILABLE', true);

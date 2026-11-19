-- ===================================================================
-- ShopMate Database Schema (PostgreSQL) - shopmate_db
-- ===================================================================

-- 1. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    category VARCHAR(64) NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    original_price DECIMAL(12, 2),
    discount_percent INT DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 4.5,
    review_count INT DEFAULT 0,
    availability VARCHAR(128) DEFAULT 'In Stock (Delivers in 2 business days)',
    external_url VARCHAR(512),
    retailer VARCHAR(128) DEFAULT 'Verified Seller',
    image VARCHAR(512) NOT NULL,
    badge VARCHAR(128),
    match_score INT DEFAULT 95,
    has_dedicated_gpu BOOLEAN DEFAULT FALSE,
    gpu_model VARCHAR(255),
    ai_reasoning TEXT,
    advantages JSONB,
    disadvantages JSONB,
    specs JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Saved Products (Favorites) Table
CREATE TABLE IF NOT EXISTS saved_products (
    id BIGSERIAL PRIMARY KEY,
    customer_id VARCHAR(64) NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_customer_product UNIQUE (customer_id, product_id)
);

-- Indexes for Query Performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_has_dedicated_gpu ON products(has_dedicated_gpu);
CREATE INDEX IF NOT EXISTS idx_saved_products_customer ON saved_products(customer_id);

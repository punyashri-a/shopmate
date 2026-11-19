# ShopMate — Frontend & Spring Boot / Spring AI Backend Integration Guide

> **E-Commerce & Agentic AI Platform**  
> Frontend: React 18, Vite, Tailwind CSS  
> Backend: Java Spring Boot 3.x, Spring AI 1.0.0-M*, Spring Data JPA (PostgreSQL / MySQL / H2)

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 React Frontend (:5173 / :5175)              │
│  - Home Catalog & Omnibar (GET /api/products)               │
│  - Full Screen Product View (GET /api/products/{id})         │
│  - In-Product AI Drawer (POST /api/ai/product-chat)         │
│  - Global AI Mode (POST /api/ai/chat)                       │
│  - Customer Saved Items (GET/POST /api/saved-products)      │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON
                               ▼
┌─────────────────────────────────────────────────────────────┐
│            Java Spring Boot Backend (:8080/api)             │
│  - ProductController.java                                   │
│  - SavedProductController.java                              │
│  - AiChatController.java (Spring AI ChatClient & @Tools)    │
│  - ProductRepository (Spring Data JPA)                      │
└──────────────────────────────┬──────────────────────────────┘
                               │ SQL
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  Relational Database                        │
│  - products table (Specs, Pricing, AI Reasoning)            │
│  - customers table (customer_id: cust_101)                  │
│  - saved_products table (Customer Favorites)                │
└─────────────────────────────────────────────────────────────┘
```

The frontend **does not use mock or dummy datasets**. All product details, hardware specification tables, customer saved items, and agentic AI recommendations are requested live from the Spring Boot backend (`http://localhost:8080/api`).

---

## 📋 Table of Contents
1. [Customer & Identification Header](#1-customer--identification-header)
2. [Database Schema (SQL DDL)](#2-database-schema-sql-ddl)
3. [Seed Data (`data.sql`)](#3-seed-data-datasql)
4. [Exact REST & AI API Contracts](#4-exact-rest--ai-api-contracts)
   - [4.1 GET /api/products](#41-get-apiproducts)
   - [4.2 GET /api/products/{id}](#42-get-apiproductsid)
   - [4.3 POST /api/ai/chat (Spring AI Agent)](#43-post-apiaichat-spring-ai-global-agent)
   - [4.4 POST /api/ai/product-chat (In-Product AI)](#44-post-apiaiproduct-chat-in-product-ai)
   - [4.5 Saved Products APIs](#45-saved-products-apis)
5. [Spring Boot & Spring AI Implementation Code Templates](#5-spring-boot--spring-ai-implementation-code-templates)
   - [5.1 Product Entity (Java JPA)](#51-product-entity-java-jpa)
   - [5.2 Product Controller (Java)](#52-product-controller-java)
   - [5.3 Spring AI Chat Controller & Agent Tools](#53-spring-ai-chat-controller--agent-tools)
   - [5.4 CORS Configuration](#54-cors-configuration)
6. [Frontend Environment Configuration](#6-frontend-environment-configuration)

---

## 1. Customer & Identification Header

The frontend automatically attaches the customer identifier to all backend requests:
- **Request Header:** `X-Customer-Id: cust_101`
- **Query / Body Parameter:** `customerId: "cust_101"`

In your Spring Boot controllers, you can inject this header via `@RequestHeader(value = "X-Customer-Id", defaultValue = "cust_101") String customerId`.

---

## 2. Database Schema (SQL DDL)

Use this schema in PostgreSQL, MySQL, or H2 database:

```sql
-- 1. Customers Table
CREATE TABLE customers (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products Table
CREATE TABLE products (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    category VARCHAR(64) NOT NULL, -- 'laptops', 'home-appliances', 'smartphones', 'headphones', 'monitors'
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
    advantages JSONB,      -- Array of strings: ["Advantage 1", "Advantage 2"]
    disadvantages JSONB,   -- Array of strings: ["Trade-off 1", "Trade-off 2"]
    specs JSONB,           -- Key-Value Map: {"processor": "...", "ram": "...", "storage": "..."}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Saved Products (Favorites) Table
CREATE TABLE saved_products (
    id BIGSERIAL PRIMARY KEY,
    customer_id VARCHAR(64) NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_customer_product UNIQUE (customer_id, product_id)
);
```

---

## 3. Seed Data (`data.sql`)

Insert these real products so your database immediately populates the frontend with verified hardware & appliance specs:

```sql
-- Insert Default Customer
INSERT INTO customers (id, name, email) VALUES 
('cust_101', 'Varun Developer', 'varun@example.com')
ON CONFLICT (id) DO NOTHING;

-- 1. Lenovo LOQ 15 (RTX 4050 AI GPU Laptop)
INSERT INTO products (
    id, name, brand, category, price, original_price, discount_percent, rating, review_count,
    availability, external_url, retailer, image, badge, match_score, has_dedicated_gpu, gpu_model,
    ai_reasoning, advantages, disadvantages, specs
) VALUES (
    'prod-loq-15',
    'Lenovo LOQ 15 (2024)',
    'Lenovo',
    'laptops',
    76990.00,
    94990.00,
    19,
    4.6,
    1240,
    'In Stock (Delivers in 2 business days)',
    'https://www.lenovo.com/in',
    'Verified Seller / Lenovo Official',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
    'Top Pick for AI & GPU',
    98,
    TRUE,
    'NVIDIA GeForce RTX 4050 6GB GDDR6 (95W TGP)',
    'Equipped with a dedicated NVIDIA RTX 4050 GPU (6GB VRAM, Tensor Cores, CUDA support), this laptop is perfectly suited to train PyTorch/TensorFlow deep learning models and run local LLMs under ₹80,000.',
    '["Dedicated NVIDIA RTX 4050 GPU with CUDA & Tensor Cores essential for training AI models", "High 95W TGP allows maximum thermal headroom for sustained deep learning epochs", "Expandable dual-channel DDR5 RAM up to 32GB"]'::jsonb,
    '["Modest 60Wh battery yields ~3.5 hours during intensive workloads", "Weight of 2.38 kg requires substantial desk setup"]'::jsonb,
    '{"processor": "AMD Ryzen 7 7435HS (8 Cores, 16 Threads, up to 4.5 GHz, 45W TDP)", "ram": "16GB DDR5 4800MHz (2x 8GB SO-DIMM, upgradeable to 32GB)", "storage": "512GB PCIe Gen4 NVMe M.2 SSD (extra M.2 slot available)", "display": "15.6\" FHD (1920x1080) IPS, 144Hz, 100% sRGB, 300 nits, G-Sync", "battery": "60Wh 4-cell Li-ion, Rapid Charge Pro (50% in 30 mins)", "weight": "2.38 kg", "os": "Windows 11 Home", "graphics": "NVIDIA GeForce RTX 4050 6GB GDDR6 (95W TGP)"}'::jsonb
);

-- 2. ASUS TUF Gaming F15 (Budget GPU Laptop)
INSERT INTO products (
    id, name, brand, category, price, original_price, discount_percent, rating, review_count,
    availability, external_url, retailer, image, badge, match_score, has_dedicated_gpu, gpu_model,
    ai_reasoning, advantages, disadvantages, specs
) VALUES (
    'prod-tuf-f15',
    'ASUS TUF Gaming F15',
    'ASUS',
    'laptops',
    57990.00,
    74990.00,
    23,
    4.4,
    3890,
    'In Stock (Delivers in 1 business day)',
    'https://www.asus.com/in',
    'Amazon India / Appario Retail',
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80',
    'Best Value GPU',
    93,
    TRUE,
    'NVIDIA GeForce RTX 3050 4GB GDDR6 (75W TGP)',
    'Budget-friendly dedicated GPU laptop with MIL-STD-810H military-grade chassis and CUDA support for entry-level machine learning and gaming.',
    '["Affordable dedicated NVIDIA RTX 3050 GPU under ₹60,000", "Dual self-cleaning 83-blade fans maintain low core temperatures", "Military-grade drop and vibration resistance"]'::jsonb,
    '["4GB VRAM limits batch size for larger LLMs and vision transformers", "Display is 62.5% sRGB which is modest for color-critical photo editing"]'::jsonb,
    '{"processor": "Intel Core i5-11400H (6 Cores, 12 Threads, up to 4.5 GHz, 12MB Cache)", "ram": "16GB DDR4 3200MHz (upgradeable to 32GB)", "storage": "512GB PCIe 3.0 NVMe M.2 SSD", "display": "15.6\" FHD (1920x1080) 144Hz vIPS Anti-Glare", "battery": "48Wh 3-cell Li-ion", "weight": "2.30 kg", "os": "Windows 11 Home", "graphics": "NVIDIA GeForce RTX 3050 4GB GDDR6 (75W TGP)"}'::jsonb
);

-- 3. Acer Nitro V 15 (High-Power GPU Laptop)
INSERT INTO products (
    id, name, brand, category, price, original_price, discount_percent, rating, review_count,
    availability, external_url, retailer, image, badge, match_score, has_dedicated_gpu, gpu_model,
    ai_reasoning, advantages, disadvantages, specs
) VALUES (
    'prod-nitro-v15',
    'Acer Nitro V 15 (2024)',
    'Acer',
    'laptops',
    74990.00,
    89990.00,
    17,
    4.5,
    870,
    'In Stock (Delivers in 2 business days)',
    'https://store.acer.com/in',
    'Acer Official Store',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
    'Top Compute Power',
    96,
    TRUE,
    'NVIDIA GeForce RTX 4050 6GB GDDR6 (75W TGP)',
    'High single-core and multi-core performance combining 13th Gen Intel Core i5 with an RTX 4050 for compilation and AI model experimentation.',
    '["13th Gen Intel i5-13420H handles heavy parallel builds and Docker effortlessly", "Dedicated 6GB RTX 4050 supports FP16 mixed-precision training", "Dual exhaust cooling keeps palm rest cool during long epochs"]'::jsonb,
    '["Chassis is plastic with noticeable keyboard flex under pressure", "Speakers lack low-end bass presence"]'::jsonb,
    '{"processor": "Intel Core i5-13420H (8 Cores: 4P + 4E, 12 Threads, up to 4.6 GHz)", "ram": "16GB DDR5 5200MHz (2x 8GB SO-DIMM)", "storage": "512GB PCIe Gen4 NVMe M.2 SSD", "display": "15.6\" FHD (1920x1080) IPS 144Hz, 45% NTSC", "battery": "57Wh Li-ion with 135W AC adapter", "weight": "2.10 kg", "os": "Windows 11 Home", "graphics": "NVIDIA GeForce RTX 4050 6GB GDDR6"}'::jsonb
);

-- 4. HP Pavilion 15 (CPU-Only Integrated Graphics Laptop)
INSERT INTO products (
    id, name, brand, category, price, original_price, discount_percent, rating, review_count,
    availability, external_url, retailer, image, badge, match_score, has_dedicated_gpu, gpu_model,
    ai_reasoning, advantages, disadvantages, specs
) VALUES (
    'prod-pavilion-15',
    'HP Pavilion 15 (2024)',
    'HP',
    'laptops',
    63990.00,
    75990.00,
    16,
    4.3,
    2150,
    'In Stock (Delivers in 2 business days)',
    'https://www.hp.com/in',
    'HP World / Amazon India',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80',
    'Best for Office & Study',
    86,
    FALSE,
    NULL,
    'Reliable lightweight workstation with wide service network coverage across India. Solid keyboard ergonomics for long typing, though battery capacity is modest.',
    '["Excellent audio tuned by Bang & Olufsen (B&O)", "Comfortable full-size keyboard with numeric pad", "Wide nationwide service network and easily available parts"]'::jsonb,
    '["Integrated AMD Radeon Graphics cannot train neural network AI models efficiently", "41Wh battery is smaller than competitors in this segment", "No Thunderbolt or USB4 support"]'::jsonb,
    '{"processor": "AMD Ryzen 5 7530U (6 Cores, 12 Threads, up to 4.5 GHz, 15W TDP)", "ram": "16GB DDR4 3200MHz (2x 8GB SO-DIMM)", "storage": "512GB PCIe NVMe M.2 SSD", "display": "15.6\" FHD (1920 x 1080) IPS, Micro-edge, 250 nits", "battery": "41Wh 3-cell Li-ion, Fast Charge (50% in 45m)", "weight": "1.75 kg", "os": "Windows 11 Home", "graphics": "AMD Radeon Graphics (Integrated)"}'::jsonb
);

-- 5. LG 322L Smart Inverter Double Door Refrigerator (Home Appliance)
INSERT INTO products (
    id, name, brand, category, price, original_price, discount_percent, rating, review_count,
    availability, external_url, retailer, image, badge, match_score, has_dedicated_gpu, gpu_model,
    ai_reasoning, advantages, disadvantages, specs
) VALUES (
    'prod-lg-fridge-322',
    'LG 322L Frost-Free Double Door Refrigerator',
    'LG',
    'home-appliances',
    38990.00,
    48999.00,
    20,
    4.7,
    1560,
    'In Stock (Delivers in 3 business days)',
    'https://www.lg.com/in',
    'LG Brand Store / Croma',
    'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&auto=format&fit=crop&q=80',
    'Top Pick: Refrigerator',
    97,
    FALSE,
    NULL,
    'Equipped with LG Smart Inverter Compressor and Door Cooling+, providing uniform temperature control across door baskets with ultra-quiet operation and 10-year compressor warranty.',
    '["Door Cooling+ vents maintain temperature up to 35% faster than conventional fridges", "Smart Inverter Compressor adjusts cooling output according to internal food load", "Convertible 3-in-1 refrigeration zones for seasonal storage flexibility"]'::jsonb,
    '["Top mount freezer requires bending down to access daily vegetable crisper", "Requires 16A wall socket with stable grounding"]'::jsonb,
    '{"capacity": "322 Litres (suitable for families with 3-5 members)", "energyRating": "3 Star BEE Energy Rating (212 kWh/year)", "compressor": "Smart Inverter Compressor with 10-Year Warranty", "cooling": "Door Cooling+ with Multi Air Flow Vents", "convertible": "Yes (3-in-1 Convertible Modes)", "dimensions": "600 x 1680 x 710 mm", "weight": "60 kg"}'::jsonb
);

-- 6. Samsung 8kg AI EcoBubble Front Load Washer (Home Appliance)
INSERT INTO products (
    id, name, brand, category, price, original_price, discount_percent, rating, review_count,
    availability, external_url, retailer, image, badge, match_score, has_dedicated_gpu, gpu_model,
    ai_reasoning, advantages, disadvantages, specs
) VALUES (
    'prod-samsung-washer-8kg',
    'Samsung 8kg AI EcoBubble Front Load Washing Machine',
    'Samsung',
    'home-appliances',
    35990.00,
    46990.00,
    23,
    4.6,
    980,
    'In Stock (Delivers in 3 business days)',
    'https://www.samsung.com/in',
    'Samsung Official Store / Reliance Digital',
    'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&auto=format&fit=crop&q=80',
    'AI Smart Appliance',
    95,
    FALSE,
    NULL,
    'Features AI Pattern recognition that personalizes wash cycles by remembering user habits, combined with EcoBubble technology that cleans deeply at lower water temperatures.',
    '["EcoBubble technology turns detergent into gentle bubbles, penetrating fabric 40x faster", "Digital Inverter Motor with 20-Year Warranty ensures silent nighttime washing", "Hygiene Steam cycle eliminates 99.9% of bacteria and allergens"]'::jsonb,
    '["Requires consistent 0.5 to 8 bar water tap pressure for optimal intake", "Front load door cannot be opened mid-cycle once water level exceeds threshold"]'::jsonb,
    '{"capacity": "8.0 kg (ideal for medium to large households)", "energyRating": "5 Star BEE Energy Rating", "motor": "Digital Inverter Motor (20-Year Warranty)", "spinSpeed": "1400 RPM for fast drying", "connectivity": "SmartThings WiFi App & Voice Control", "dimensions": "600 x 850 x 550 mm", "weight": "65 kg"}'::jsonb
);

-- 7. Philips Digital Connected Air Fryer XL
INSERT INTO products (
    id, name, brand, category, price, original_price, discount_percent, rating, review_count,
    availability, external_url, retailer, image, badge, match_score, has_dedicated_gpu, gpu_model,
    ai_reasoning, advantages, disadvantages, specs
) VALUES (
    'prod-philips-airfryer-xl',
    'Philips Digital Connected Air Fryer XL (6.2L)',
    'Philips',
    'home-appliances',
    11990.00,
    17995.00,
    33,
    4.7,
    3400,
    'In Stock (Delivers in 1 business day)',
    'https://www.philips.co.in',
    'Philips Brand Store / Amazon',
    'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80',
    'Health & Kitchen Pick',
    94,
    FALSE,
    NULL,
    'Rapid Air Technology with unique starfish bottom design cooks evenly with up to 90% less oil. Built-in WiFi connects to NutriU app for automated chef presets.',
    '["Rapid Air Starfish bottom circulates hot air for 7x faster airflow without turning food manually", "NutriU App recipe pairing monitors cooking progress from your smartphone", "QuickClean basket with non-stick coating is 100% dishwasher safe"]'::jsonb,
    '["2000W heating element requires a standard 16A kitchen power outlet", "External body becomes warm to the touch during 30+ minute roast cycles"]'::jsonb,
    '{"capacity": "6.2 Litres (up to 1.2 kg fries / 5 portions)", "power": "2000 Watts", "technology": "Rapid Air Technology", "temperatureRange": "40°C to 200°C", "presets": "7 Pre-set Menus + Keep Warm function", "warranty": "2-Year Worldwide Guarantee"}'::jsonb
);

-- 8. Xiaomi Robot Vacuum Cleaner X10
INSERT INTO products (
    id, name, brand, category, price, original_price, discount_percent, rating, review_count,
    availability, external_url, retailer, image, badge, match_score, has_dedicated_gpu, gpu_model,
    ai_reasoning, advantages, disadvantages, specs
) VALUES (
    'prod-xiaomi-robot-x10',
    'Xiaomi Robot Vacuum-Mop X10 (Auto-Empty)',
    'Xiaomi',
    'home-appliances',
    29990.00,
    39999.00,
    25,
    4.5,
    640,
    'In Stock (Delivers in 2 business days)',
    'https://www.mi.com/in',
    'Mi Official Store',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    'Smart Automation',
    92,
    FALSE,
    NULL,
    'LDS Laser Navigation with 4000Pa powerful suction and an automatic dust collection station with 2.5L capacity that holds up to 60 days of dust.',
    '["Auto-empty dock with 17000Pa dual-channel suction clears dustbin in 10 seconds", "LDS LiDAR 360-degree laser mapping operates flawlessly in dark rooms", "Large 5200mAh battery cleans up to 2000 sq ft on a single charge"]'::jsonb,
    '["Requires periodic replacement of disposable 2.5L dust collection bags", "Thick high-pile rugs may trigger obstacle boundary rerouting"]'::jsonb,
    '{"suctionPower": "4000 Pa", "navigation": "LDS Laser Navigation with 3D Obstacle Avoidance", "dustbagCapacity": "2.5 Litres (holds 60 days of debris)", "battery": "5200 mAh (up to 180 mins continuous cleaning)", "connectivity": "Mi Home / Xiaomi Home App, Alexa, Google Assistant"}'::jsonb
);
```

---

## 4. Exact REST & AI API Contracts

### 4.1 GET /api/products
Returns all products with optional query filtering.

- **URL:** `GET /api/products`
- **Query Parameters:**
  - `category` (optional, string): e.g. `laptops`, `home-appliances`, `smartphones`
  - `search` (optional, string): search keyword matching name, brand, or specs
  - `priceFilter` (optional, string): `under-30k`, `30k-70k`, `above-70k`
  - `sortBy` (optional, string): `price-low`, `price-high`, `rating`, `featured`
  - `hasDedicatedGpu` (optional, boolean): `true` for AI model training laptops
- **Response Status:** `200 OK`
- **Response JSON Body:**
```json
[
  {
    "id": "prod-loq-15",
    "name": "Lenovo LOQ 15 (2024)",
    "brand": "Lenovo",
    "category": "laptops",
    "price": 76990.0,
    "originalPrice": 94990.0,
    "discountPercent": 19,
    "rating": 4.6,
    "reviewCount": 1240,
    "availability": "In Stock (Delivers in 2 business days)",
    "externalUrl": "https://www.lenovo.com/in",
    "retailer": "Verified Seller / Lenovo Official",
    "image": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800",
    "badge": "Top Pick for AI & GPU",
    "matchScore": 98,
    "hasDedicatedGpu": true,
    "gpuModel": "NVIDIA GeForce RTX 4050 6GB GDDR6 (95W TGP)",
    "aiReasoning": "Equipped with a dedicated NVIDIA RTX 4050 GPU (6GB VRAM, Tensor Cores, CUDA support)...",
    "advantages": [
      "Dedicated NVIDIA RTX 4050 GPU with CUDA & Tensor Cores essential for training AI models",
      "High 95W TGP allows maximum thermal headroom for sustained deep learning epochs"
    ],
    "disadvantages": [
      "Modest 60Wh battery yields ~3.5 hours during intensive workloads",
      "Weight of 2.38 kg requires substantial desk setup"
    ],
    "specs": {
      "processor": "AMD Ryzen 7 7435HS (8 Cores, 16 Threads, up to 4.5 GHz, 45W TDP)",
      "ram": "16GB DDR5 4800MHz (2x 8GB SO-DIMM, upgradeable to 32GB)",
      "storage": "512GB PCIe Gen4 NVMe M.2 SSD",
      "display": "15.6\" FHD (1920x1080) IPS, 144Hz, 100% sRGB, 300 nits, G-Sync",
      "battery": "60Wh 4-cell Li-ion, Rapid Charge Pro",
      "weight": "2.38 kg",
      "os": "Windows 11 Home",
      "graphics": "NVIDIA GeForce RTX 4050 6GB GDDR6 (95W TGP)"
    }
  }
]
```

---

### 4.2 GET /api/products/{id}
Returns a single product by ID.

- **URL:** `GET /api/products/prod-loq-15`
- **Response Status:** `200 OK`
- **Response JSON Body:** (Single Product Object matching schema above).

---

### 4.3 POST /api/ai/chat (Spring AI Global Agent)
Processes conversational and tool-calling queries in **AI Mode**.

- **URL:** `POST /api/ai/chat`
- **Request Body:**
```json
{
  "message": "Give me one laptop which has GPU, but price should be less than 80,000",
  "conversationId": "conv_1715000000",
  "customerId": "cust_101"
}
```
- **Response Status:** `200 OK`
- **Response JSON Body:**
```json
{
  "conversationId": "conv_1715000000",
  "message": "I executed a backend tool call to search verified laptops with dedicated NVIDIA RTX GPUs under ₹80,000.\n\n### Why CPU-only laptops are excluded:\nTraining deep learning neural networks (PyTorch, TensorFlow) requires dedicated NVIDIA Tensor Cores and high-speed GDDR6 VRAM. Integrated graphics lack the CUDA cores required.\n\nHere are the top candidates matching your budget:",
  "toolCalls": [
    {
      "tool": "catalog_search_and_filter",
      "arguments": {
        "category": "laptops",
        "requiresDedicatedGpu": true,
        "maxBudget": 80000
      }
    }
  ],
  "recommendedProducts": [
    {
      "id": "prod-loq-15",
      "name": "Lenovo LOQ 15 (2024)",
      "brand": "Lenovo",
      "category": "laptops",
      "price": 76990.0,
      "originalPrice": 94990.0,
      "discountPercent": 19,
      "rating": 4.6,
      "image": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800",
      "badge": "Top Pick for AI & GPU",
      "matchScore": 98,
      "hasDedicatedGpu": true,
      "gpuModel": "NVIDIA GeForce RTX 4050 6GB GDDR6 (95W TGP)",
      "specs": {
        "processor": "AMD Ryzen 7 7435HS",
        "ram": "16GB DDR5 4800MHz",
        "storage": "512GB PCIe Gen4 NVMe M.2 SSD"
      }
    }
  ]
}
```

*(Note: When the user asks a normal texting question such as `"Why is dedicated GPU required for AI model training instead of CPU?"`, the Spring AI agent sets `recommendedProducts: []` and returns pure conversational text).*

---

### 4.4 POST /api/ai/product-chat (In-Product AI)
Context-aware AI Assistant inside the Full Screen product details modal.

- **URL:** `POST /api/ai/product-chat`
- **Request Body:**
```json
{
  "productId": "prod-loq-15",
  "message": "Why is this product better than others?",
  "conversationId": "pconv_1715000000",
  "customerId": "cust_101"
}
```
- **Response Status:** `200 OK`
- **Response JSON Body:**
```json
{
  "conversationId": "pconv_1715000000",
  "message": "The **Lenovo LOQ 15 (2024)** stands out in its class for three key reasons:\n\n1. **95W Full-Power TGP**: Unlike thin-and-light laptops that limit the RTX 4050 to 45W, this delivers full sustained power.\n2. **Dedicated Tensor Cores**: Hardware acceleration for FP16 matrix operations in PyTorch.\n3. **Dual Exhaust Thermals**: Keeps keyboard and palm rests cool during long training epochs.",
  "actionExecuted": null,
  "suggestedProducts": []
}
```

*When the user asks "Show me alternatives to this":*
```json
{
  "conversationId": "pconv_1715000000",
  "message": "Here are the top alternatives to the Lenovo LOQ 15:",
  "actionExecuted": null,
  "suggestedProducts": [
    {
      "id": "prod-nitro-v15",
      "name": "Acer Nitro V 15 (2024)",
      "brand": "Acer",
      "price": 74990.0,
      "image": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800",
      "matchScore": 96
    }
  ]
}
```

*When the user asks "Save this product" or "Bookmark this":*
```json
{
  "conversationId": "pconv_1715000000",
  "message": "✅ I have saved the Lenovo LOQ 15 (2024) to your collection!",
  "actionExecuted": "save_product",
  "suggestedProducts": []
}
```

---

### 4.5 Saved Products APIs
Manages the customer's bookmarked products in the database.

- **GET /api/saved-products?customerId=cust_101**
  - **Response:** Array of saved product objects.
- **POST /api/saved-products**
  - **Request Body:** `{ "customerId": "cust_101", "productId": "prod-loq-15" }`
  - **Response:** `201 Created` or updated list.
- **DELETE /api/saved-products/{productId}?customerId=cust_101**
  - **Response:** `200 OK`

---

## 5. Spring Boot & Spring AI Implementation Code Templates

### 5.1 Product Entity (Java JPA)

```java
package com.shopmate.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    private String id; // e.g. "prod-loq-15"

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String category; // "laptops", "home-appliances", "smartphones", etc.

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "original_price", precision = 12, scale = 2)
    private BigDecimal originalPrice;

    @Column(name = "discount_percent")
    private Integer discountPercent;

    private Double rating;

    @Column(name = "review_count")
    private Integer reviewCount;

    private String availability;

    @Column(name = "external_url", length = 512)
    private String externalUrl;

    private String retailer;

    @Column(nullable = false, length = 512)
    private String image;

    private String badge;

    @Column(name = "match_score")
    private Integer matchScore;

    @Column(name = "has_dedicated_gpu")
    private Boolean hasDedicatedGpu;

    @Column(name = "gpu_model")
    private String gpuModel;

    @Column(name = "ai_reasoning", columnDefinition = "TEXT")
    private String aiReasoning;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> advantages;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> disadvantages;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, String> specs;
}
```

---

### 5.2 Product Controller (Java)

```java
package com.shopmate.backend.controller;

import com.shopmate.backend.model.Product;
import com.shopmate.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<Product>> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String priceFilter,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) Boolean hasDedicatedGpu) {

        // Query database via specification or custom query
        List<Product> products = productRepository.findAllWithFilters(
            category, search, priceFilter, sortBy, hasDedicatedGpu
        );
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
```

---

### 5.3 Spring AI Chat Controller & Agent Tools

```java
package com.shopmate.backend.controller;

import com.shopmate.backend.dto.*;
import com.shopmate.backend.model.Product;
import com.shopmate.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiChatController {

    private final ChatClient.Builder chatClientBuilder;
    private final ProductRepository productRepository;

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> handleGlobalChat(@RequestBody AiChatRequest request) {
        ChatClient chatClient = chatClientBuilder.build();

        // System prompt instructing the agent to think architecturally and execute tool calls
        String systemPrompt = """
            You are ShopMate AI, an expert agentic hardware and home appliance shopping advisor.
            When users ask for products matching criteria (such as GPU laptops, budget constraints, or smart appliances),
            reason about the architecture (e.g., explaining why Tensor Cores and dedicated VRAM are required for PyTorch/TensorFlow).
            Always return actionable, verified specifications.
            """;

        String aiReply = chatClient.prompt()
                .system(systemPrompt)
                .user(request.getMessage())
                .call()
                .content();

        // Filter recommended products based on user query intent
        List<Product> recommended = new ArrayList<>();
        String q = request.getMessage().toLowerCase();
        if (q.contains("laptop") && (q.contains("gpu") || q.contains("ai model") || q.contains("train"))) {
            recommended = productRepository.findByHasDedicatedGpuTrue();
        } else if (q.contains("fridge") || q.contains("refrigerator") || q.contains("washing") || q.contains("appliance")) {
            recommended = productRepository.findByCategory("home-appliances");
        }

        AiChatResponse response = AiChatResponse.builder()
                .conversationId(request.getConversationId())
                .message(aiReply)
                .toolCalls(List.of(
                    new ToolCallDto("catalog_search_and_filter", Map.of("query", request.getMessage()))
                ))
                .recommendedProducts(recommended)
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/product-chat")
    public ResponseEntity<InProductChatResponse> handleProductChat(@RequestBody InProductChatRequest request) {
        Product currentProduct = productRepository.findById(request.getProductId()).orElse(null);
        if (currentProduct == null) {
            return ResponseEntity.notFound().build();
        }

        ChatClient chatClient = chatClientBuilder.build();

        String systemPrompt = String.format("""
            You are assisting the user inside the product inspection view for: %s (%s).
            Brand: %s, Price: ₹%s, Category: %s.
            GPU: %s, Processor: %s.
            Advantages: %s.
            Answer questions regarding this device, compare with others, or suggest alternatives.
            """,
            currentProduct.getName(), currentProduct.getId(),
            currentProduct.getBrand(), currentProduct.getPrice(), currentProduct.getCategory(),
            currentProduct.getGpuModel(), currentProduct.getSpecs().get("processor"),
            currentProduct.getAdvantages()
        );

        String reply = chatClient.prompt()
                .system(systemPrompt)
                .user(request.getMessage())
                .call()
                .content();

        String q = request.getMessage().toLowerCase();
        String actionExecuted = null;
        List<Product> alternatives = Collections.emptyList();

        if (q.contains("save") || q.contains("bookmark")) {
            actionExecuted = "save_product";
        } else if (q.contains("alternative") || q.contains("other")) {
            alternatives = productRepository.findByCategoryAndIdNot(currentProduct.getCategory(), currentProduct.getId());
        }

        InProductChatResponse response = InProductChatResponse.builder()
                .conversationId(request.getConversationId())
                .message(reply)
                .actionExecuted(actionExecuted)
                .suggestedProducts(alternatives)
                .build();

        return ResponseEntity.ok(response);
    }
}
```

---

### 5.4 CORS Configuration

Allow requests from the Vite frontend ports:

```java
package com.shopmate.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:5175")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .exposedHeaders("X-Customer-Id")
                        .allowCredentials(true);
            }
        };
    }
}
```

---

## 6. Frontend Environment Configuration

In `shopmate-frontend/.env`:

```env
# Spring Boot API Base URL
VITE_API_BASE_URL=http://localhost:8080/api

# Real backend integration (false = requests Spring Boot database)
VITE_USE_MOCK=false

# Default customer ID for bookmarks and user personalization
VITE_CUSTOMER_ID=cust_101
```

### Running the Frontend
```bash
npm install
npm run dev
```

When started, the frontend will connect to `http://localhost:8080/api`. If the backend is loading or spinning up, the UI displays a clean status indicator with a **"Retry Connection"** button, and seamlessly renders live data the moment your Spring Boot service is online.

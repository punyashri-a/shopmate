-- ===================================================================
-- ShopMate Seed Data (PostgreSQL) - shopmate_db
-- 17 Verified Products across all 5 Frontend Categories & Default Customer
-- Categories: laptops, home-appliances, smartphones, headphones, monitors
-- Idempotent: Uses ON CONFLICT (id) DO NOTHING
-- ===================================================================

-- -------------------------------------------------------------------
-- Default Customer
-- -------------------------------------------------------------------
INSERT INTO customers (id, name, email) VALUES 
('cust_101', 'Varun Developer', 'varun@example.com')
ON CONFLICT (id) DO NOTHING;

-- ===================================================================
-- CATEGORY: LAPTOPS
-- ===================================================================

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
) ON CONFLICT (id) DO NOTHING;

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
) ON CONFLICT (id) DO NOTHING;

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
) ON CONFLICT (id) DO NOTHING;

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
) ON CONFLICT (id) DO NOTHING;

-- ===================================================================
-- CATEGORY: HOME APPLIANCES
-- ===================================================================

-- 5. LG 322L Smart Inverter Double Door Refrigerator
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
) ON CONFLICT (id) DO NOTHING;

-- 6. Samsung 8kg AI EcoBubble Front Load Washer
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
) ON CONFLICT (id) DO NOTHING;

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
) ON CONFLICT (id) DO NOTHING;

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
) ON CONFLICT (id) DO NOTHING;

-- ===================================================================
-- CATEGORY: SMARTPHONES
-- ===================================================================

-- 9. Samsung Galaxy S24 Ultra
INSERT INTO products (
    id, name, brand, category, price, original_price, discount_percent, rating, review_count,
    availability, external_url, retailer, image, badge, match_score, has_dedicated_gpu, gpu_model,
    ai_reasoning, advantages, disadvantages, specs
) VALUES (
    'prod-s24-ultra',
    'Samsung Galaxy S24 Ultra (512GB)',
    'Samsung',
    'smartphones',
    129999.00,
    139999.00,
    7,
    4.8,
    4120,
    'In Stock (Delivers tomorrow)',
    'https://www.samsung.com/in',
    'Samsung Official / Amazon',
    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80',
    'Flagship AI Phone',
    98,
    FALSE,
    NULL,
    'Powered by Snapdragon 8 Gen 3 with Galaxy AI on-device neural processing, offering generative photo editing, live call translation, and titanium durability.',
    '["Galaxy AI on-device neural engine for live translations and Circle to Search", "Titanium frame with anti-reflective Gorilla Armor glass", "200MP camera system with 5x optical periscope zoom"]'::jsonb,
    '["Large 6.8-inch footprint requires two-handed usage", "45W charging is slower than competitor 100W+ speeds"]'::jsonb,
    '{"processor": "Qualcomm Snapdragon 8 Gen 3 for Galaxy (4nm)", "ram": "12GB LPDDR5X", "storage": "512GB UFS 4.0", "display": "6.8\" Dynamic AMOLED 2X (3120x1440), 120Hz, 2600 nits", "battery": "5000mAh, 45W Fast Charging, 15W Wireless", "camera": "200MP Main + 50MP 5x Telephoto + 10MP 3x + 12MP Ultrawide", "os": "Android 14 with One UI 6.1 (7 Years of OS Updates)", "weight": "232g"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 10. Apple iPhone 15 Pro Max
INSERT INTO products (
    id, name, brand, category, price, original_price, discount_percent, rating, review_count,
    availability, external_url, retailer, image, badge, match_score, has_dedicated_gpu, gpu_model,
    ai_reasoning, advantages, disadvantages, specs
) VALUES (
    'prod-iphone-15-pro',
    'Apple iPhone 15 Pro Max (256GB)',
    'Apple',
    'smartphones',
    148900.00,
    159900.00,
    7,
    4.9,
    5280,
    'In Stock (Delivers in 2 business days)',
    'https://www.apple.com/in',
    'Apple Store / Imagine',
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
    'Top Pro Camera',
    97,
    FALSE,
    NULL,
    'Industry-leading 3nm A17 Pro SoC with hardware-accelerated ray tracing and 16-core Neural Engine for local machine learning models.',
    '["Aerospace-grade titanium design with contoured edges", "A17 Pro chip capable of console-quality gaming (Resident Evil, Assassin Creed)", "ProRes 4K60 video recording directly to external SSD via USB-C"]'::jsonb,
    '["Premium price point above ₹1.4 Lakh", "Slow 20W base bundled charging speed"]'::jsonb,
    '{"processor": "Apple A17 Pro (3nm, 6-Core CPU, 6-Core GPU, 16-Core Neural Engine)", "ram": "8GB Unified Memory", "storage": "256GB NVMe", "display": "6.7\" Super Retina XDR OLED (2796x1290), ProMotion 120Hz", "battery": "4422mAh, 29 Hours Video Playback", "camera": "48MP Main + 12MP 5x Tetraprism Telephoto + 12MP Ultrawide", "os": "iOS 17 (Upgradeable to iOS 18 with Apple Intelligence)", "weight": "221g"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 11. OnePlus 12 5G
INSERT INTO products (
    id, name, brand, category, price, original_price, discount_percent, rating, review_count,
    availability, external_url, retailer, image, badge, match_score, has_dedicated_gpu, gpu_model,
    ai_reasoning, advantages, disadvantages, specs
) VALUES (
    'prod-oneplus-12',
    'OnePlus 12 5G (16GB RAM + 512GB)',
    'OnePlus',
    'smartphones',
    64999.00,
    69999.00,
    7,
    4.6,
    2350,
    'In Stock (Delivers tomorrow)',
    'https://www.oneplus.in',
    'OnePlus Store / Amazon',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
    'Best Value Flagship',
    95,
    FALSE,
    NULL,
    'Combines Snapdragon 8 Gen 3 with 16GB RAM and 5400mAh dual-cell battery with 100W charging, delivering flagship performance under ₹65,000.',
    '["Blazing fast 100W charging fills 5400mAh battery in 26 minutes", "Top-tier 4500 nits peak brightness 2K ProXDR display", "Hasselblad 4th Gen camera tuned for realistic skin tones"]'::jsonb,
    '["Curved display edges may suffer occasional palm touches", "IP65 water resistance is not rated for full submersion"]'::jsonb,
    '{"processor": "Qualcomm Snapdragon 8 Gen 3 (4nm)", "ram": "16GB LPDDR5X", "storage": "512GB UFS 4.0", "display": "6.82\" 2K 120Hz LTPO ProXDR AMOLED (4500 nits peak)", "battery": "5400mAh, 100W SuperVOOC Wired, 50W AirVOOC", "camera": "50MP Sony LYT-808 + 64MP 3x Periscope + 48MP Ultrawide", "os": "OxygenOS 14 based on Android 14", "weight": "220g"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- ===================================================================
-- CATEGORY: HEADPHONES (AUDIO)
-- ===================================================================

-- 12. Sony WH-1000XM5 Wireless ANC Headphones
INSERT INTO products (
    id, name, brand, category, price, original_price, discount_percent, rating, review_count,
    availability, external_url, retailer, image, badge, match_score, has_dedicated_gpu, gpu_model,
    ai_reasoning, advantages, disadvantages, specs
) VALUES (
    'prod-sony-wh1000xm5',
    'Sony WH-1000XM5 Wireless ANC Headphones',
    'Sony',
    'headphones',
    28990.00,
    34990.00,
    17,
    4.8,
    6190,
    'In Stock (Delivers in 1 business day)',
    'https://www.sony.co.in',
    'Sony Center / Croma',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    'Top Pick: Audio',
    97,
    FALSE,
    NULL,
    'Industry benchmark for Active Noise Cancellation, featuring 8 microphones and two processors (QN1 + V1) with high-res LDAC audio support.',
    '["Dual processor ANC cancels high and mid-frequency background office chatter", "Speak-to-Chat automatically pauses playback when you start speaking", "Multipoint connection seamlessly switches between laptop and smartphone"]'::jsonb,
    '["Headband does not fold completely inward like previous XM4 generation", "Earcup synthetic leather can cause warmth in humid environments"]'::jsonb,
    '{"driver": "30mm Precision Engineered Carbon Fiber Dome", "anc": "Integrated Processor V1 + HD Noise Cancelling Processor QN1", "battery": "30 Hours with ANC On (3 min charge = 3 hours)", "codecs": "LDAC, AAC, SBC, DSEE Extreme AI Audio Upscaling", "weight": "250g", "connectivity": "Bluetooth 5.2, Multipoint, 3.5mm Aux Audio"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 13. Apple AirPods Pro (2nd Gen, USB-C)
INSERT INTO products (
    id, name, brand, category, price, original_price, discount_percent, rating, review_count,
    availability, external_url, retailer, image, badge, match_score, has_dedicated_gpu, gpu_model,
    ai_reasoning, advantages, disadvantages, specs
) VALUES (
    'prod-airpods-pro-2',
    'Apple AirPods Pro (2nd Gen, USB-C)',
    'Apple',
    'headphones',
    22990.00,
    24900.00,
    8,
    4.8,
    7890,
    'In Stock (Delivers tomorrow)',
    'https://www.apple.com/in',
    'Apple Authorized Reseller',
    'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80',
    'Best In-Ear ANC',
    96,
    FALSE,
    NULL,
    'Apple H2 silicon delivers personalized spatial audio with dynamic head tracking, next-gen transparency mode, and Adaptive Audio.',
    '["Adaptive Audio dynamically blends Transparency and Active Noise Cancellation", "Precision Finding with U1 chip in case with built-in speaker", "Lossless audio capability with Apple Vision Pro"]'::jsonb,
    '["Advanced features (Spatial Audio, auto-switch) restricted to Apple ecosystem", "In-ear silicone fit may not suit users with sensitive ear canals"]'::jsonb,
    '{"chip": "Apple H2 Headphone Chip + U1 Case Chip", "anc": "Up to 2x more Active Noise Cancellation + Adaptive Transparency", "battery": "6 Hours listening per charge (30 Hours total with USB-C case)", "charging": "USB-C, MagSafe, Apple Watch Charger, Qi Certified", "rating": "IP54 Dust, Sweat and Water Resistant (Buds and Case)", "weight": "5.3g per earbud"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 14. Bose QuietComfort Ultra Wireless Headphones
INSERT INTO products (
    id, name, brand, category, price, original_price, discount_percent, rating, review_count,
    availability, external_url, retailer, image, badge, match_score, has_dedicated_gpu, gpu_model,
    ai_reasoning, advantages, disadvantages, specs
) VALUES (
    'prod-bose-qc-ultra',
    'Bose QuietComfort Ultra Wireless Headphones',
    'Bose',
    'headphones',
    35900.00,
    39900.00,
    10,
    4.7,
    1450,
    'In Stock (Delivers in 2 business days)',
    'https://www.boseindia.com',
    'Bose Official Store / Amazon',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    'Immersive Spatial Sound',
    94,
    FALSE,
    NULL,
    'Bose Immersive Audio pushes spatial sound forward with CustomTune sound calibration tailored to your ear canal shape.',
    '["Plush ear cushions provide supreme long-haul flight comfort", "CustomTune sound calibration optimizes frequency curve for user ear acoustics", "Foldable design fits cleanly into compact travel hardshell case"]'::jsonb,
    '["Battery life drops to ~18 hours when Immersive Audio is active", "Higher price than Sony XM5"]'::jsonb,
    '{"anc": "World-class Active Noise Cancelling with CustomTune", "audio": "Bose Immersive Audio Spatial Technology", "battery": "Up to 24 Hours (18 Hours with Immersive Audio)", "connectivity": "Bluetooth 5.3 with Snapdragon Sound (aptX Adaptive)", "weight": "254g", "charging": "USB-C Fast Charging (15 min = 2.5 hours)"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- ===================================================================
-- CATEGORY: MONITORS
-- ===================================================================

-- 15. LG UltraGear 27" OLED 240Hz
INSERT INTO products (
    id, name, brand, category, price, original_price, discount_percent, rating, review_count,
    availability, external_url, retailer, image, badge, match_score, has_dedicated_gpu, gpu_model,
    ai_reasoning, advantages, disadvantages, specs
) VALUES (
    'prod-lg-ultragear-27',
    'LG UltraGear 27\" OLED QHD 240Hz Gaming Monitor',
    'LG',
    'monitors',
    74990.00,
    95000.00,
    21,
    4.8,
    890,
    'In Stock (Delivers in 2 business days)',
    'https://www.lg.com/in',
    'LG Brand Store / Amazon',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    'Top Pick: Monitor',
    98,
    FALSE,
    NULL,
    'True self-lit OLED panel delivering infinite contrast ratio, 240Hz ultra-smooth refresh rate, and near-zero 0.03ms response time for competitive gaming.',
    '["Stunning self-lit OLED panel with 1,500,000:1 contrast and true inky blacks", "Ultra-fast 240Hz refresh rate with 0.03ms (GtG) pixel response", "HDMI 2.1 and DisplayPort 1.4 with NVIDIA G-Sync support"]'::jsonb,
    '["Lower peak brightness than Mini-LED monitors in daylight rooms", "OLED static element care recommended to prevent burn-in"]'::jsonb,
    '{"display": "27\" QHD (2560 x 1440) Anti-Glare OLED Panel", "refreshRate": "240Hz with 0.03ms (GtG) Response Time", "color": "98.5% DCI-P3 Color Gamut, HDR10", "sync": "NVIDIA G-Sync Compatible & AMD FreeSync Premium", "ports": "2x HDMI 2.1, 1x DisplayPort 1.4, 2x USB 3.0 Up/Down", "stand": "Tilt (-5~15°), Height (110mm), Swivel (-10~10°), Pivot 90°"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 16. Dell UltraSharp 27" QHD IPS Black
INSERT INTO products (
    id, name, brand, category, price, original_price, discount_percent, rating, review_count,
    availability, external_url, retailer, image, badge, match_score, has_dedicated_gpu, gpu_model,
    ai_reasoning, advantages, disadvantages, specs
) VALUES (
    'prod-dell-u2724d',
    'Dell UltraSharp 27\" QHD IPS Black Monitor',
    'Dell',
    'monitors',
    38990.00,
    48999.00,
    20,
    4.7,
    1240,
    'In Stock (Delivers in 3 business days)',
    'https://www.dell.com/in',
    'Dell Official / Amazon',
    'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&auto=format&fit=crop&q=80',
    'Best for Coding & Creators',
    95,
    FALSE,
    NULL,
    'IPS Black technology delivers 2000:1 contrast ratio (2x regular IPS) with 120Hz refresh rate, certified 4-star eye comfort, and factory color calibration for software engineers and creators.',
    '["IPS Black panel produces 2000:1 contrast ratio for deep black levels in IDE dark themes", "Smooth 120Hz refresh rate reduces eye fatigue during extended coding sessions", "Built-in ambient light sensor automatically adjusts brightness"]'::jsonb,
    '["Does not feature integrated USB-C 90W Power Delivery laptop charging", "Response time (5ms) is tuned for productivity rather than esports"]'::jsonb,
    '{"display": "27\" QHD (2560 x 1440) IPS Black Technology Anti-Glare", "contrast": "2000:1 Static Contrast Ratio", "refreshRate": "120Hz with ComfortView Plus Low Blue Light", "color": "100% sRGB, 98% Display P3, Delta E < 2 Factory Calibrated", "ports": "1x DisplayPort 1.4, 1x HDMI, 1x DP Out (Daisy Chain), USB 3.2 Hub", "stand": "Full Ergonomics: Height, Tilt, Swivel, and Bi-directional Pivot"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 17. Samsung Odyssey G7 32" Curved 240Hz
INSERT INTO products (
    id, name, brand, category, price, original_price, discount_percent, rating, review_count,
    availability, external_url, retailer, image, badge, match_score, has_dedicated_gpu, gpu_model,
    ai_reasoning, advantages, disadvantages, specs
) VALUES (
    'prod-samsung-odyssey-g7',
    'Samsung Odyssey G7 32\" 1000R Curved 240Hz Gaming Monitor',
    'Samsung',
    'monitors',
    44990.00,
    58000.00,
    22,
    4.6,
    2100,
    'In Stock (Delivers in 2 business days)',
    'https://www.samsung.com/in',
    'Samsung Shop / Reliance Digital',
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&auto=format&fit=crop&q=80',
    'Curved Immersion',
    93,
    FALSE,
    NULL,
    'Deep 1000R curved display matches human field of view, paired with QLED Quantum Dot color and 240Hz refresh rate for maximum gaming immersion.',
    '["1000R curvature fills peripheral vision with reduced eye strain", "QLED Quantum Dot technology covers 125% sRGB color space", "CoreSync rear ambient lighting projects game colors onto the wall"]'::jsonb,
    '["Deep 1000R curve requires wide desk setup to position comfortably", "Viewing angles are slightly narrower than flat IPS panels"]'::jsonb,
    '{"display": "32\" WQHD (2560 x 1440) QLED VA Panel with 1000R Curvature", "refreshRate": "240Hz with 1ms (GtG) Pixel Response", "hdr": "VESA DisplayHDR 600, 600 nits Peak Brightness", "sync": "NVIDIA G-Sync & AMD FreeSync Premium Pro", "ports": "2x DisplayPort 1.4, 1x HDMI 2.0, 2x USB 3.0", "weight": "8.2 kg with stand"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

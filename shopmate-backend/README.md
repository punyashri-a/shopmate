# ShopMate Backend — Agentic AI Shopping Assistant

Spring Boot 3.x backend service for the ShopMate e-commerce platform.

---

## 🛠️ Technology Stack

- **Java Version:** 21 (LTS) — OpenJDK 21.0.13
- **Framework:** Spring Boot 3.3.5
- **Build Tool:** Maven 3.10.x / Maven Wrapper (`mvnw`)
- **Web Layer:** Spring Web (MVC)
- **Persistence:** Spring Data JPA + Hibernate 6.5+
- **Database:** PostgreSQL Driver (`org.postgresql:postgresql`)
- **Validation:** Spring Boot Starter Validation (Hibernate Validator)
- **Monitoring:** Spring Boot Starter Actuator
- **Boilerplate Reduction:** Project Lombok

---

## 📁 Package Structure

```
com.shopmate.backend
    ├── ShopmateBackendApplication.java   # Spring Boot entry point
    ├── config                           # Configuration classes
    │   ├── CorsConfig.java              # CORS for React frontend (:5173 - :5175, X-Customer-Id)
    │   └── JpaConfig.java               # JPA Auditing and Repository scan config
    ├── controller                       # REST controllers
    │   ├── HealthController.java        # Health check endpoint (/api/health)
    │   ├── ProductController.java       # Product REST endpoints (/api/products/**)
    │   └── SavedProductController.java  # Customer bookmarks (/api/saved-products/**)
    ├── dto                              # Data Transfer Objects
    │   ├── HealthResponse.java          # Health response DTO
    │   └── SaveProductRequest.java      # Customer save product request DTO
    ├── entity                           # JPA Entity definitions
    │   ├── Customer.java                # Customer entity (id, name, email, createdAt)
    │   ├── Product.java                 # Product entity with JSONB specs, advantages, disadvantages
    │   └── SavedProduct.java            # SavedProduct favorite bookmarks entity
    ├── repository                       # Spring Data JPA repositories
    │   ├── CustomerRepository.java      # Customer queries
    │   ├── ProductRepository.java       # Product queries + JpaSpecificationExecutor
    │   └── SavedProductRepository.java  # Customer saved product operations
    ├── service                          # Business logic service layer
    │   ├── CustomerService.java         # Customer service interface
    │   ├── CustomerServiceImpl.java     # Customer service implementation
    │   ├── ProductService.java          # Product service interface (catalog, search, categories)
    │   ├── ProductServiceImpl.java      # Product service implementation
    │   ├── SavedProductService.java     # Saved product service interface
    │   └── SavedProductServiceImpl.java # Saved product service implementation
    ├── exception                        # Global exception handlers (.gitkeep)
    ├── agent                            # AI Agent orchestrators (.gitkeep)
    └── tool                             # Agent Tool Calling definitions (.gitkeep)
```

---

## 🔌 Implemented REST APIs

### 1. Health API
- **`GET /api/health`**: Returns application status (`{"status": "UP", "application": "ShopMate Backend"}`).

### 2. Product Catalog APIs
- **`GET /api/products`**: Fetch products with optional query filters:
  - `category` (string): e.g. `laptops`, `home-appliances`, `smartphones`
  - `search` (string): keyword search matching name, brand, or description
  - `priceFilter` (string): `under-30k`, `30k-70k`, `above-70k`
  - `minPrice` / `maxPrice` (decimal): explicit price boundaries
  - `sortBy` (string): `price-low`, `price-high`, `rating`, `featured`
  - `hasDedicatedGpu` (boolean): `true` for GPU laptops
- **`GET /api/products/categories`**: Return all distinct product categories (`List<String>`).
- **`GET /api/products/{id}`**: Fetch single product by unique ID (`200 OK` or `404 Not Found`).

### 3. Customer Saved Products (Bookmarks) APIs
- **`GET /api/saved-products?customerId=cust_101`**: Fetch all saved products for a customer.
- **`POST /api/saved-products`**: Bookmark a product (`{ "customerId": "cust_101", "productId": "prod-loq-15" }`). Returns `201 Created`.
- **`DELETE /api/saved-products/{productId}?customerId=cust_101`**: Remove a product from bookmarks. Returns `200 OK`.
- **`GET /api/saved-products/{productId}/status?customerId=cust_101`**: Check if a product is saved (`{ "isSaved": true }`).

---

## 🚀 Running the Application

```bash
cd /home/punya/BACKUP/SHOPMATE/shopmate-backend

# Clean compile
./mvnw clean compile

# Boot the application
./mvnw spring-boot:run
```

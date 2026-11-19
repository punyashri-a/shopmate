# ShopMate — E-Commerce & Agentic AI Shopping Assistant Platform

ShopMate is a full-stack e-commerce and AI-powered shopping platform combining a modern React frontend with a Spring Boot and Spring AI backend. It features an interactive, tool-calling AI shopping assistant to guide users through hardware specifications, comparisons, and personalized recommendations.

---

## 🏛️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                 React Frontend (:5173 / :5175)              │
│  - Product Catalog & Filters (Home)                         │
│  - Dedicated AI Mode with Tool-Calling Popups (/ai)         │
│  - In-Product AI Drawer for Real-Time Q&A & Comparisons     │
│  - Responsive UI built with Tailwind CSS & Framer Motion     │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON
                               ▼
┌─────────────────────────────────────────────────────────────┐
│            Java Spring Boot Backend (:8080/api)             │
│  - ProductController (Catalog, Categories, Bookmarks)       │
│  - AgentController (Spring AI Global & In-Product Chat)      │
│  - CatalogSearchTool & CustomerActionTool (Agent Tool Calls) │
│  - ProductRepository (Spring Data JPA)                      │
└──────────────────────────────┬──────────────────────────────┘
                               │ SQL
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                       │
│  - products (JSONB specs, pricing, AI reasoning)            │
│  - customers (cust_101 user identification)                 │
│  - saved_products (Customer bookmarked items)               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```
.
├── shopmate-backend/         # Spring Boot 3.3.5 / Spring AI backend
│   ├── src/main/java/        # Controllers, Services, Repositories, AI Tools
│   ├── src/main/resources/   # Application configs (YAML), schema.sql, data.sql
│   ├── pom.xml               # Maven configuration
│   └── README.md             # Backend detailed documentation
│
├── shopmate-frontend/        # React 18 / Vite / Tailwind CSS frontend
│   ├── src/                  # Components, Pages, Context, Services
│   ├── package.json          # Frontend dependencies & scripts
│   ├── vite.config.js        # Vite configuration
│   └── README.md             # Frontend integration guide
│
├── .env.example              # Root template for environment variables
└── .gitignore                # Root Git ignore rules
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Java 21 (LTS)**
- **Node.js 18+** & npm
- **PostgreSQL** instance running locally on port 5432 with database `shopmate_db`
- **NVIDIA NIM API Key** (optional, for live LLM responses)

---

### 2. Backend Setup (`shopmate-backend`)

1. Copy `.env.example` to `.env`:
   ```bash
   cd shopmate-backend
   cp .env.example .env
   ```
2. Configure your database credentials and optional NVIDIA API key in `.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=shopmate_db
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   NVIDIA_API_KEY=your_key_here
   ```
3. Build and run the backend:
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend service starts at `http://localhost:8080`.

---

### 3. Frontend Setup (`shopmate-frontend`)

1. Install dependencies:
   ```bash
   cd shopmate-frontend
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

---

## 🔒 Security & Environment Variables

All sensitive credentials (API keys, database passwords, session tokens) are managed strictly through environment variables.
- Never commit `.env` files to source control.
- Sample configurations are provided in `.env.example`.
- Pre-configured `.gitignore` rules prevent accidental check-ins of build artifacts (`target/`, `node_modules/`, `dist/`) and `.env` files.

---

## 📄 License

This project is licensed under the MIT License.

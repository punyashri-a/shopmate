# ShopMate — Backend API Contract & Integration Guide

This document defines the REST and Server-Sent Events (SSE) contract for connecting the ShopMate React frontend to a Java, Spring Boot, and Spring AI backend service.

---

## 1. Environment Configuration

The frontend dynamically switches between local mock services and the live Spring Boot API using environment variables:

```properties
# Base URL of the Spring Boot server
VITE_API_BASE_URL=http://localhost:8080/api

# Set to false to disable mock mode and call live Spring Boot REST/SSE endpoints
VITE_USE_MOCK=false
```

When `VITE_USE_MOCK=false`, the frontend calls `VITE_API_BASE_URL` directly and will display explicit backend connection error banners if the server is offline or returns an error status (no silent fallbacks).

---

## 2. API Endpoints Specification

### 2.1 Natural Language Requirement Analysis
- **Endpoint:** `POST /api/shopping/analyze`
- **Description:** Analyzes the natural language prompt and extracts mandatory constraints, optional preferences, and inferred intent.
- **Request Body:**
```json
{
  "query": "Find me a laptop for programming under ₹65,000 with 16GB RAM and good battery life.",
  "budget": 65000,
  "category": "laptops",
  "preferences": {
    "researchDepth": "deep",
    "strictBudget": true
  }
}
```
- **Response Payload:**
```json
{
  "sessionId": "session-1715000000",
  "category": "laptops",
  "categorySource": "auto-detected",
  "budgetCeiling": 65000,
  "mandatorySpecs": [
    "16GB RAM minimum (required for IDE compilation and multitasking)",
    "Multi-core H-series or efficient modern CPU",
    "Minimum 512GB PCIe NVMe SSD storage",
    "Battery endurance >= 7 hours"
  ],
  "optionalPreferences": [
    "High-resolution OLED or IPS display with low blue-light emission",
    "Backlit tactile keyboard"
  ],
  "usageRequirements": "Software engineering, compiling code, local development environments, and Docker containers.",
  "assumptions": [
    "Assumed laptop is primary development workstation without external GPU requirement",
    "Assumed target market is India with pricing in INR"
  ],
  "missingInformation": [
    "Screen size preference not specified (evaluating 14\" to 16\" models)"
  ]
}
```

---

### 2.2 Trigger Multi-Agent Shopping Workflow
- **Endpoint:** `POST /api/shopping/search`
- **Description:** Launches the 4-agent collaborative execution pipeline (Requirement Analysis → Product Research → Product Comparison → Recommendation).
- **Request Body:**
```json
{
  "query": "Find me a laptop for programming under ₹65,000 with 16GB RAM and good battery life.",
  "budget": 65000,
  "category": "laptops",
  "preferences": {
    "researchDepth": "deep",
    "strictBudget": true
  }
}
```
- **Response Payload:**
```json
{
  "id": "session-1715000000",
  "status": "running",
  "streamUrl": "/api/shopping/events/session-1715000000"
}
```

---

### 2.3 Server-Sent Events (SSE) Stream
- **Endpoint:** `GET /api/shopping/events/{id}`
- **Header:** `Accept: text/event-stream`
- **Event: `agent-update`** (Emitted as each agent transitions between `waiting`, `running`, `completed`):
```json
event: agent-update
data: {
  "status": "running",
  "agents": [
    {
      "id": "agent-1",
      "name": "Requirement Analysis Agent",
      "status": "completed",
      "durationMs": 850,
      "thought": "Parsed primary programming context. Prioritized RAM density (16GB) and CPU multi-core compile throughput.",
      "extracted": { ... }
    },
    {
      "id": "agent-2",
      "name": "Product Research Agent",
      "status": "searching",
      "durationMs": null,
      "thought": "Querying verified retailer product indices..."
    }
  ]
}
```
- **Event: `completed`** (Emitted when Recommendation Agent finishes ranking):
```json
event: completed
data: {
  "sessionId": "session-1715000000",
  "status": "completed",
  "products": [ ... ],
  "recommendedProductId": "prod-lap-01",
  "summary": "Acer Swift Go 14 OLED ranked #1 for compile performance, 2.8K OLED screen, and portability."
}
```

---

### 2.4 Workflow Status & Results Polling (Fallback for non-SSE environments)
- **Endpoint:** `GET /api/shopping/{id}/status`
- **Response:**
```json
{
  "id": "session-1715000000",
  "status": "running", // "running" | "completed" | "failed"
  "currentAgent": "agent-2",
  "progress": 50,
  "errorMessage": null
}
```

- **Endpoint:** `GET /api/shopping/{id}/results`
- **Response:**
```json
{
  "sessionId": "session-1715000000",
  "status": "completed",
  "products": [ ... ],
  "summary": "Recommendation takeaway..."
}
```

---

### 2.5 Product Catalog APIs
- **Endpoint:** `GET /api/products`
  - **Query Params:** `category`, `search`, `minPrice`, `maxPrice`, `sortBy`
- **Endpoint:** `GET /api/products/{id}`
  - Returns product model, brand, verified pricing in INR, specs map, advantages, and disadvantages.

---

### 2.6 Product Comparison API
- **Endpoint:** `POST /api/comparisons`
- **Request Body:**
```json
{
  "productIds": ["prod-lap-01", "prod-lap-02"]
}
```
- **Response:** Returns side-by-side spec differences and AI trade-off analysis.

---

### 2.7 Saved Products & History APIs
- `GET /api/saved-products`
- `POST /api/saved-products`
- `DELETE /api/saved-products/{id}`
- `GET /api/shopping/history`
- `GET /api/shopping/history/{id}`
- `POST /api/shopping/history`
- `DELETE /api/shopping/history/{id}`
- `DELETE /api/shopping/history`

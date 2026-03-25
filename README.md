# Meal Ordering Microservices (MVP)

Welcome to the `it4020-meal-ordering-microservices-mvp` repository! 

This project is a complete Minimum Viable Product (MVP) for a meal ordering platform built using a microservices architecture. It includes full token-based authentication, role-based access control (RBAC), API Gateway routing, and multiple independent services handling specific business domains.

## 📁 System Architecture

The ecosystem operates over 6 distinct Node.js / Express microservices:
- **API Gateway (Port 8000)** - The single entry point that proxy routes all requests to the respective microservices and aggregates API documentation.
- **User Service (Port 8001)** - Handles user registrations, JWT authentication, roles, and profile updates.
- **Restaurant Service (Port 8002)** - Handles restaurant discovery and information.
- **Menu Service (Port 8003)** - Serves available food items securely.
- **Order Service (Port 8004)** - Manages user carts and active orders.
- **Payment Service (Port 8005)** - Processes mock transactions and attaches statuses to orders.

*(Note: Data is currently stored in-memory for this MVP stage).*

---

## 🚀 Getting Started

All source code and detailed documentation is located inside the [`meal-ordering-microservices`](./meal-ordering-microservices/) folder.

### 🏃‍♂️ Running the Services
To get the entire stack up and running as quickly as possible, please follow our step-by-step startup guide:

👉 **[Read the Quick Start "How to Run" guide](./meal-ordering-microservices/HOW_TO_RUN.md)**

### 📖 API Documentation
Full API specifications, workflow scenarios, swagger layouts, and architectural diagrams can be found in the main project README:

👉 **[Read the Full Technical README](./meal-ordering-microservices/README.md)**

---

## 🔐 Built-in Admin Account
For testing administrative endpoints (such as retrieving the list of all users or modifying global data), you can log into the Swagger UI with the pre-configured system admin:
- **Email:** `admin@gmail.com`
- **Password:** `admin`
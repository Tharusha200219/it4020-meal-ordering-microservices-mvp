# Startup Guide: How to Run the Project Locally

If you just cloned this repository, follow these quick steps to get all the microservices up and running quickly.

## Prerequisites
- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)

---

## Step 1: Install Dependencies

You need to install dependencies for all 6 microservices. Open a terminal in the root folder (`meal-ordering-microservices`) and run:

 `cd` into each folder manually and run `npm install`

---

## Step 2: Start the Services

You must start **all 6 services** for the system to work properly. 

### Recommended Method: Multiple Terminals
Open 6 separate terminal tabs/windows. In each tab, navigate to one of the service folders and run `npm start`:

1. **Terminal 1:** `cd api-gateway && npm start` *(Runs on port 8000)*
2. **Terminal 2:** `cd user-service && npm start` *(Runs on port 8001)*
3. **Terminal 3:** `cd restaurant-service && npm start` *(Runs on port 8002)*
4. **Terminal 4:** `cd menu-service && npm start` *(Runs on port 8003)*
5. **Terminal 5:** `cd order-service && npm start` *(Runs on port 8004)*
6. **Terminal 6:** `cd payment-service && npm start` *(Runs on port 8005)*

*(Make sure you see "running on port..." in each terminal)*

---

## Step 3: Test the API

Once everything is running, open your browser and go to the **API Gateway Swagger Documentation**:

👉 **[http://localhost:8000/api-docs](http://localhost:8000/api-docs)** 👈

This is your central hub! From here, you can test endpoints for users, menus, restaurants, orders, and payments without needing to visit the individual microservice ports.

---

### Need to restart or stop everything?
If you ever need to quickly kill all the running Node servers (for example, to free up the ports), run:
```bash
pkill -9 node
```
*(Or use `lsof -ti :8000-8005 | xargs kill -9` if you only want to kill the specific API ports).*

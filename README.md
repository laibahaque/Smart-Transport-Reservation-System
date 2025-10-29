# 🚌 Smart Transport Reservation System

A full-stack transport booking system built using **FastAPI (Backend)** and **React Native with Expo + TypeScript (Frontend)**.

---

## 🚀 Features
- User Signup & Login with session-based authentication  
- City-to-city route booking  
- Domestic and International travel support  
- Booking, cancellation, and route search  
- Pathfinding logic (direct + via/intermediate cities)  
- Modern mobile UI built with React Native + Tailwind  

---

## 🏗️ Tech Stack

### Backend
- **Python** with **FastAPI**
- **PostgreSQL** database
- **Uvicorn** as ASGI server
- **Pydantic** for data validation
- Environment variables via `.env`

### Frontend
- **React Native (Expo)**
- **TypeScript** for type safety
- **Axios** for API integration
- **AsyncStorage** for session management
- **React Navigation** for app routing

---

## ⚙️ Setup Instructions

### 1️⃣ Run the Backend
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
cd frontend
npm install
npm start

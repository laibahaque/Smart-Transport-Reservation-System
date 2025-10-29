from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ✅ Import route files
from app.routes import user_routes, vehicle_routes, route_routes, availability_routes,booking_routes
from app.routes.user_routes import router as user_router
from app.routes.auth import router as auth_router
app = FastAPI(title="Smart Transport Reservation System API")

# ✅ Allow frontend (Expo app) to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include route modules
app.include_router(user_router, prefix="/api", tags=["User"])
app.include_router(auth_router, prefix="/api", tags=["Auth"])
app.include_router(vehicle_routes.router, prefix="/api", tags=["Vehicle"])
app.include_router(route_routes.router, prefix="/api", tags=["Route"])
app.include_router(availability_routes.router, prefix="/api", tags=["Availability"])
app.include_router(booking_routes.router, prefix="/api", tags=["Booking"])

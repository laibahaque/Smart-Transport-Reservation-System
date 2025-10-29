from fastapi import APIRouter
from app.controllers.vehicle_controller import fetch_vehicles

router = APIRouter()

@router.get("/vehicles")
def get_vehicles():
    vehicles = fetch_vehicles()
    return vehicles 

from fastapi import APIRouter, Query
from typing import List
from app.controllers.availability_controller import fetch_availability, fetch_vehicles_by_route
from app.schemas.availability_schema import Availability

router = APIRouter(prefix="/availability", tags=["Availability"])

@router.get("", response_model=List[Availability])
def get_availability(
    from_city: str = Query(None),
    to_city: str = Query(None),
    transport_type: str = Query(None),
    date: str = Query(None)
):
    """
    Fetch availability filtered by city, transport type, and date.
    """
    return fetch_availability(from_city, to_city, transport_type, date)

@router.get("/vehicles")
def get_vehicles_by_route_api(
    route_id: int = Query(...),
    date: str = Query(None)
):
    return fetch_vehicles_by_route(route_id, date)

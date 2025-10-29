from fastapi import APIRouter, Query
from app.controllers.route_controller import fetch_routes, fetch_filtered_routes

router = APIRouter(prefix="/routes", tags=["Routes"])

# ✅ Get all routes
@router.get("/")
def get_routes():
    """
    Fetch all available routes.
    """
    routes = fetch_routes()
    return {"status": "success", "data": routes}

@router.get("/filter")
def get_filtered_routes(
    travel_type: str = Query(None),
    date: str = Query(None),
    transport_type: str = Query(None)
):
    """
    Fetch filtered routes by travel type, date, and transport type.
    """
    data = fetch_filtered_routes(travel_type, date, transport_type)
    return {"status": "success", "data": data}

from app.models.route_model import get_filtered_routes, get_all_routes

def fetch_routes():
    return get_all_routes()

def fetch_filtered_routes(travel_type=None, date=None, transport_type=None):
    return get_filtered_routes(travel_type, date, transport_type)

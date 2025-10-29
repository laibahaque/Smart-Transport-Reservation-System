from app.models.availability_model import get_all_availabilities
def fetch_availability(from_city=None, to_city=None, transport_type=None, date=None):
    """
    Controller to get filtered availability.
    """
    data = get_all_availabilities(from_city, to_city, transport_type, date)
    
    # ✅ Must return list directly, not wrapped in dict
    return data

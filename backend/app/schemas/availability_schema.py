from pydantic import BaseModel

class Availability(BaseModel):
    id: int
    vehicle_type: str
    route_id: int
    from_city: str
    to_city: str
    available_seat: int
    available_date: str
    available_time: str

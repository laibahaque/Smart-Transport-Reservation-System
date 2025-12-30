from typing import Optional
from pydantic import BaseModel

class BookingCreate(BaseModel):
    availability_id: int
    cnic: str
    seat_count: int = 1
    passport: Optional[str] = None

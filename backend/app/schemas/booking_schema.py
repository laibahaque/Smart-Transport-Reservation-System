from pydantic import BaseModel

class BookingCreate(BaseModel):
    availability_id: int
    cnic: str
    passport: str

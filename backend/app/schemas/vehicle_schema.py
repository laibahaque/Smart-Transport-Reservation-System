from pydantic import BaseModel

class Vehicle(BaseModel):
    id: int
    type: str

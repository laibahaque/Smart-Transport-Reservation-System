from pydantic import BaseModel

class Route(BaseModel):
    id: int
    from_city: str
    to_city: str

from fastapi import HTTPException
from app.models.user_model import insert_user, verify_user
from app.schemas.user_schema import UserCreate
from app.schemas.login_schema import UserLogin

def create_user(user: UserCreate):
    result = insert_user(user.name, user.phone, user.email, user.password)

    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    
    return {"message": result["message"]}

def login_user(user: UserLogin):
    result = verify_user(user.email, user.password)

    if result["status"] == "error":
        raise HTTPException(status_code=401, detail=result["message"])

    return {"message": "Login successful", "user": result["user"]}

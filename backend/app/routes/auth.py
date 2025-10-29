from fastapi import APIRouter, Request, HTTPException
from app.schemas.user_schema import UserCreate
from app.schemas.login_schema import UserLogin
from app.controllers.user_controller import create_user, login_user
from app.core.auth_session import create_session, logout_session, get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup")
def signup(user: UserCreate):
    return create_user(user)


@router.post("/login")
def login(user: UserLogin):
    result = login_user(user)

    if "user" not in result:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create session token
    user_id = result["user"]["id"]
    token = create_session(user_id)

    return {
        "message": "Login successful",
        "user": result["user"],
        "session_token": token
    }


@router.post("/logout")
def logout(request: Request):
    token = request.headers.get("Authorization")
    if not token:
        raise HTTPException(status_code=400, detail="Missing session token")
    
    logout_session(token)
    return {"message": "Logout successful"}

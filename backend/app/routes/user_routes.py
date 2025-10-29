from fastapi import APIRouter, Request, Depends, HTTPException
from app.schemas.user_schema import UserCreate
from app.schemas.login_schema import UserLogin
from app.controllers.user_controller import create_user, login_user
from app.core.auth_session import get_current_user
from app.core.database import get_connection

router = APIRouter()

# ✅ Signup
@router.post("/signup")
def signup(user: UserCreate):
    return create_user(user)

# ✅ Login
# @router.post("/login")
# def login(user: UserLogin):
#     return login_user(user)

# ✅ Get current logged-in user
@router.get("/users/me")
def get_logged_in_user(request: Request, user_id: int = Depends(get_current_user)):
    """
    Get details of the logged-in user using session token.
    """
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, name, email FROM users WHERE id = %s", (user_id,))
    user = cur.fetchone()
    cur.close()
    conn.close()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"id": user[0], "name": user[1], "email": user[2]}

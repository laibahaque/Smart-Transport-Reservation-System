from fastapi import Request, HTTPException

# Simple in-memory session store (for demo purpose)
# In production, use Redis or database-based session store
session_store = {}

def create_session(user_id: int) -> str:
    """
    Create a new session and return session token.
    """
    import secrets
    token = secrets.token_hex(16)
    session_store[token] = user_id
    return token


def get_current_user(request: Request) -> int:
    """
    Get logged-in user's ID from session token (Header-based).
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Unauthorized: Missing session token.")

    # ✅ Remove "Bearer " prefix if it exists
    if auth_header.startswith("Bearer "):
        token = auth_header.split("Bearer ")[1]
    else:
        token = auth_header.strip()

    if token not in session_store:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid or missing session token.")
    
    return session_store[token]

def logout_session(token: str):
    """
    Remove token when user logs out.
    """
    if token in session_store:
        del session_store[token]

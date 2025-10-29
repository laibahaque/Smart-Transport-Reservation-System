from app.core.database import get_connection
from app.utils.hashing import hash_password
import bcrypt

def insert_user(name: str, phone: str, email: str, password: str):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cur.fetchone():
            return {"status": "error", "message": "Email already exists"}

        cur.execute("""
            INSERT INTO users (name, phone, email, password)
            VALUES (%s, %s, %s, %s)
        """, (name, phone, email, hash_password(password)))

        conn.commit()
        return {"status": "success", "message": "User registered successfully"}
    
    except Exception as e:
        return {"status": "error", "message": str(e)}
    
    finally:
        if conn:
            cur.close()
            conn.close()


def verify_user(email: str, password: str):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("SELECT id, name, email, password FROM users WHERE email = %s", (email,))
        user = cur.fetchone()

        if not user:
            return {"status": "error", "message": "Invalid email or password"}

        stored_hash = user[3]
        if not bcrypt.checkpw(password.encode("utf-8"), stored_hash.encode("utf-8")):
            return {"status": "error", "message": "Invalid email or password"}

        user_data = {"id": user[0], "name": user[1], "email": user[2]}
        return {"status": "success", "user": user_data}
    
    except Exception as e:
        return {"status": "error", "message": str(e)}
    
    finally:
        if conn:
            cur.close()
            conn.close()

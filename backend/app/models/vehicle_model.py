from app.core.database import get_connection

def get_all_vehicles():
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, type FROM vehicle ORDER BY id ASC")
        rows = cur.fetchall()

        # ✅ Directly return a list (not wrapped in dict)
        return [{"id": row[0], "type": row[1]} for row in rows]

    except Exception as e:
        print("Database error:", e)
        return []

    finally:
        if conn:
            cur.close()
            conn.close()

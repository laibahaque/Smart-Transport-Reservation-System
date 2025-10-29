from app.core.database import get_connection

def get_all_availabilities(from_city=None, to_city=None, transport_type=None, date=None):
    conn = None
    cur = None
    try:
        conn = get_connection()
        cur = conn.cursor()

        query = """
            SELECT 
                a.id,
                v.type AS vehicle_type,
                r.id AS route_id,
                c1.city_name AS from_city,
                c2.city_name AS to_city,
                a.available_seat,
                a.available_date,
                a.available_time
            FROM availability a
            JOIN vehicle v ON a.vehicle_id = v.id
            JOIN route r ON a.route_id = r.id
            JOIN city c1 ON r.from_city_id = c1.id
            JOIN city c2 ON r.to_city_id = c2.id
            WHERE 1=1
        """
        params = []

        if from_city:
            query += " AND LOWER(c1.city_name) = LOWER(%s)"
            params.append(from_city)
        if to_city:
            query += " AND LOWER(c2.city_name) = LOWER(%s)"
            params.append(to_city)
        if transport_type:
            query += " AND LOWER(v.type) = LOWER(%s)"
            params.append(transport_type)
        if date:
            query += " AND DATE(a.available_date) = %s"
            params.append(date)

        query += " ORDER BY a.available_date, a.available_time;"
        cur.execute(query, tuple(params))
        rows = cur.fetchall()
        print("✅ Fetched availability rows:", rows)


        result = []
        for row in rows:
            result.append({
                "id": row[0],
                "vehicle_type": row[1],
                "route_id": row[2],
                "from_city": row[3],
                "to_city": row[4],
                "available_seat": row[5],
                "available_date": str(row[6]),
                "available_time": str(row[7]),
            })

        return result

    except Exception as e:
        print("❌ Error fetching availability:", e)
        return []

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

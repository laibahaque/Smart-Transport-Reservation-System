from app.core.database import get_connection

def get_all_routes():
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT 
                r.id, 
                c1.city_name AS from_city, 
                c2.city_name AS to_city
            FROM route r
            JOIN city c1 ON r.from_city_id = c1.id
            JOIN city c2 ON r.to_city_id = c2.id
            ORDER BY r.id
        """)
        rows = cur.fetchall()

        routes = []
        for row in rows:
            routes.append({
                "id": row[0],
                "from_city": row[1],
                "to_city": row[2],
            })
        return routes

    except Exception as e:
        print("❌ Error fetching routes:", e)
        return []

    finally:
        if conn:
            cur.close()
            conn.close()


def get_filtered_routes(travel_type=None, date=None, transport_type=None):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()

        query = """
            SELECT 
                r.id AS route_id,
                c1.city_name AS from_city,
                c2.city_name AS to_city,
                c1.type AS from_city_type,
                c2.type AS to_city_type,
                v.type AS vehicle_type,
                a.available_seat,
                a.available_date,
                a.available_time
            FROM route r
            JOIN city c1 ON r.from_city_id = c1.id
            JOIN city c2 ON r.to_city_id = c2.id
            JOIN availability a ON a.route_id = r.id
            JOIN vehicle v ON a.vehicle_id = v.id
            WHERE 1=1
        """

        params = []

        if date:
            query += " AND a.available_date = %s"
            params.append(date)
        if transport_type:
            query += " AND v.type = %s"
            params.append(transport_type)
        if travel_type == "international":
            query += " AND ((c1.type = 'domestic' AND c2.type = 'international'))"
        elif travel_type == "domestic":
            query += " AND c1.type = 'domestic' AND c2.type = 'domestic'"

        query += " ORDER BY r.id"

        cur.execute(query, tuple(params))
        rows = cur.fetchall()

        if not rows:
            return {"from_cities": [], "to_cities": [], "routes": []}

        routes = []
        for row in rows:
            routes.append({
                "id": row[0],
                "from_city": row[1],
                "to_city": row[2],
                "from_city_type": row[3],
                "to_city_type": row[4],
                "vehicle_type": row[5],
                "available_seat": row[6],
                "available_date": str(row[7]),
                "available_time": str(row[8])
            })

        from_cities = sorted({r["from_city"] for r in routes})
        to_cities = sorted({r["to_city"] for r in routes})

        return {
            "from_cities": from_cities,
            "to_cities": to_cities,
            "routes": routes
        }

    except Exception as e:
        print("❌ Error fetching filtered routes:", e)
        return {"from_cities": [], "to_cities": [], "routes": []}

    finally:
        if conn:
            cur.close()
            conn.close()

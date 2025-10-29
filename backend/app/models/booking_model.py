from app.core.database import get_connection

from app.core.database import get_connection

def insert_booking(user_id: int, availability_id: int, cnic: str, passport: str):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()

        # ✅ Step 1: Check if availability exists and get available seats
        cur.execute("SELECT available_seat FROM availability WHERE id = %s", (availability_id,))
        availability = cur.fetchone()
        if not availability:
            return {"status": "error", "message": "Selected availability not found"}

        available_seat = availability[0]
        if available_seat <= 0:
            return {"status": "error", "message": "No seats available for this schedule."}

        # ✅ Step 2: Check if the user already booked the same availability
        cur.execute("""
            SELECT id FROM booking_detail
            WHERE user_id = %s AND availability_id = %s
        """, (user_id, availability_id))
        existing_booking = cur.fetchone()

        if existing_booking:
            return {"status": "error", "message": "You have already booked this schedule."}

        # ✅ Step 3: Insert new booking
        cur.execute("""
            INSERT INTO booking_detail (user_id, availability_id, cnic, passport, status)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
        """, (user_id, availability_id, cnic, passport, "Confirmed"))
        booking_id = cur.fetchone()[0]

        # ✅ Step 4: Decrease available seat by 1 in availability table
        cur.execute("""
            UPDATE availability
            SET available_seat = available_seat - 1
            WHERE id = %s
        """, (availability_id,))

        conn.commit()

        return {
            "status": "success",
            "message": "Booking confirmed successfully",
            "booking_id": booking_id
        }

    except Exception as e:
        if conn:
            conn.rollback()
        return {"status": "error", "message": str(e)}

    finally:
        if conn:
            cur.close()
            conn.close()


def get_user_bookings(user_id: int):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT 
                b.id AS booking_id,
                u.name AS user_name,
                u.email AS user_email,
                c1.city_name AS from_city,
                c2.city_name AS to_city,
                v.type AS vehicle_type,
                a.available_date,
                a.available_time,
                a.available_seat,
                b.status,
                b.created_at
            FROM booking_detail b
            JOIN availability a ON b.availability_id = a.id
            JOIN route r ON a.route_id = r.id
            JOIN city c1 ON r.from_city_id = c1.id
            JOIN city c2 ON r.to_city_id = c2.id
            JOIN users u ON b.user_id = u.id
            JOIN vehicle v ON a.vehicle_id = v.id
            WHERE b.user_id = %s
            ORDER BY b.id DESC
        """, (user_id,))

        rows = cur.fetchall()

        bookings = []
        for row in rows:
            bookings.append({
                "booking_id": row[0],
                "user_name": row[1],
                "user_email": row[2],
                "from_city": row[3],
                "to_city": row[4],
                "vehicle_type": row[5],
                "available_date": str(row[6]),
                "available_time": str(row[7]),
                "available_seat": row[8],
                "status": row[9],
                "created_at": str(row[10]),
            })

        return {"status": "success", "bookings": bookings}

    except Exception as e:
        return {"status": "error", "message": str(e)}

    finally:
        if conn:
            cur.close()
            conn.close()

def get_user_bookings(user_id: int):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT 
                b.id AS booking_id,
                u.name AS user_name,
                u.email AS user_email,
                c1.city_name AS from_city,
                c2.city_name AS to_city,
                v.type AS vehicle_type,
                a.available_date,
                a.available_time,
                a.available_seat,
                b.status,
                b.created_at
            FROM booking_detail b
            JOIN availability a ON b.availability_id = a.id
            JOIN route r ON a.route_id = r.id
            JOIN city c1 ON r.from_city_id = c1.id
            JOIN city c2 ON r.to_city_id = c2.id
            JOIN users u ON b.user_id = u.id
            JOIN vehicle v ON a.vehicle_id = v.id
            WHERE b.user_id = %s
            ORDER BY b.id DESC
        """, (user_id,))

        rows = cur.fetchall()

        bookings = []
        for row in rows:
            bookings.append({
                "booking_id": row[0],
                "user_name": row[1],
                "user_email": row[2],
                "from_city": row[3],
                "to_city": row[4],
                "vehicle_type": row[5],
                "available_date": str(row[6]),
                "available_time": str(row[7]),
                "available_seat": row[8],
                "status": row[9],
                "created_at": str(row[10]),
            })

        return {"status": "success", "bookings": bookings}

    except Exception as e:
        return {"status": "error", "message": str(e)}

    finally:
        if conn:
            cur.close()
            conn.close()
def cancel_user_booking(user_id: int, booking_id: int):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()

        # ✅ Step 1: Check if booking exists and belongs to the user
        cur.execute("""
            SELECT availability_id, status 
            FROM booking_detail 
            WHERE id = %s AND user_id = %s
        """, (booking_id, user_id))
        booking = cur.fetchone()

        if not booking:
            return {"status": "error", "message": "Booking not found or doesn't belong to user."}

        availability_id, status = booking

        # ✅ Step 2: If already canceled, stop
        if status == "Cancelled":
            return {"status": "error", "message": "Booking already cancelled."}

        # ✅ Step 3: Update booking status to 'Cancelled'
        cur.execute("""
            UPDATE booking_detail
            SET status = 'Cancelled'
            WHERE id = %s
        """, (booking_id,))

        # ✅ Step 4: Increase seat count back in availability table
        cur.execute("""
            UPDATE availability
            SET available_seat = available_seat + 1
            WHERE id = %s
        """, (availability_id,))

        conn.commit()

        return {"status": "success", "message": "Booking cancelled successfully."}

    except Exception as e:
        if conn:
            conn.rollback()
        return {"status": "error", "message": str(e)}

    finally:
        if conn:
            cur.close()
            conn.close()

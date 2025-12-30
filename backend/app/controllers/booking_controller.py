from fastapi import HTTPException
from app.models.booking_model import insert_booking, get_user_bookings,cancel_user_booking

def create_booking_controller(user_id: int, booking_data):
    result = insert_booking(user_id, booking_data.availability_id, booking_data.cnic, booking_data.passport, booking_data.seat_count)

    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result


def fetch_user_bookings_controller(user_id: int):
    result = get_user_bookings(user_id)
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result
def cancel_booking_controller(user_id: int, booking_id: int):
    result = cancel_user_booking(user_id, booking_id)

    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result

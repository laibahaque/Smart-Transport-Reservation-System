from fastapi import APIRouter, Depends, Request
from app.schemas.booking_schema import BookingCreate
from app.controllers.booking_controller import create_booking_controller, fetch_user_bookings_controller
from app.core.auth_session import get_current_user

router = APIRouter(prefix="/booking", tags=["Booking"])

# ✅ Create booking
@router.post("")

def create_booking(request: Request, booking: BookingCreate, user_id: int = Depends(get_current_user)):
    return create_booking_controller(user_id, booking)


# ✅ Fetch all bookings for logged-in user
@router.get("/my-bookings")
def get_my_bookings(request: Request, user_id: int = Depends(get_current_user)):
    return fetch_user_bookings_controller(user_id)
# ✅ Cancel booking
@router.put("/{booking_id}/cancel")
def cancel_booking(request: Request, booking_id: int, user_id: int = Depends(get_current_user)):
    from app.controllers.booking_controller import cancel_booking_controller
    return cancel_booking_controller(user_id, booking_id)

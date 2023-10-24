import { useDispatch } from "react-redux";
import { useState } from "react";
import { useModal } from "../../context/Modal";
import {
  deleteBookingThunk,
  getCurrentUserBookingsThunk,
} from "../../store/booking";
import "./DeleteBooking.css";

export default function DeleteBookingModal({ booking }) {
  const [errors, setErrors] = useState({});
  const [hasSubmit, setHasSubmit] = useState(false);
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleBookingDelete = async (e) => {
    e.preventDefault();

    setHasSubmit(true);

    const deleteBooking = await dispatch(deleteBookingThunk(booking.id));

    if (deleteBooking && deleteBooking.message) {
      setErrors(deleteBooking);
    } else {
      window.alert("Reservation deleted!");
      closeModal();
      dispatch(getCurrentUserBookingsThunk());
    }
  };

  return (
    <div className="deleted">
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to delete this reservation?</p>
      {hasSubmit && <p className="error">{errors.message}</p>}
      <div className="confirm-delete-booking-div">
        <button
          type="submit"
          onClick={handleBookingDelete}
          id="confirm-delete-booking-button"
        >
          Yes
        </button>
        <button onClick={closeModal}>No</button>
      </div>
    </div>
  );
}

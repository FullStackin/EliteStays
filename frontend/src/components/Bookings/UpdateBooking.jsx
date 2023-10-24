import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  editBookingThunk,
  getCurrentUserBookingsThunk,
} from "../../store/booking";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { getSpotThunk } from "../../store/spots";
import "./UpdateBooking.css";

export default function UpdateBookingModal({ booking }) {
  const [editStartDate, setEditStartDate] = useState();
  const [editEndDate, setEditEndDate] = useState();
  const [errors, setErrors] = useState({});
  const [hasSubmit, setHasSubmit] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();

  useEffect(() => {
    const errorLi = {};
    if (editStartDate === undefined)
      errorLi.editStartDate = "Please enter new check-in date.";
    if (editEndDate === undefined)
      errorLi.editEndDate = "Please enter new check-out date.";

    setErrors(errorLi);
  }, [editStartDate, editEndDate]);

  const onSubmit = async (e) => {
    e.preventDefault();

    setHasSubmit(true);

    const payload = {
      startDate: editStartDate,
      endDate: editEndDate,
    };
    const editBooking = await dispatch(editBookingThunk(booking.id, payload));

    if (editBooking.message) {
      setErrors(editBooking);
    } else {
      dispatch(getCurrentUserBookingsThunk());
      dispatch(getSpotThunk(booking.Spot.id));
      window.alert("Reservation Updated!");
      history.push("/bookings/current");
      closeModal();
    }
  };

  return (
    <>
      <div id="update-booking-title">
        <h2>Update Your Luxoury Stay at</h2>
        <h3>{booking.Spot.name}</h3>
      </div>
      {hasSubmit && <p className="error">{errors.editStartDate}</p>}
      {hasSubmit && <p className="error">{errors.editEndDate}</p>}
      {hasSubmit && <p className="error">{errors.message}</p>}
      <form onSubmit={onSubmit} id="update-booking-form">
        <label>Check In Date</label>
        <input
          type="date"
          placeholder={booking.startDate}
          value={editStartDate}
          onChange={(e) => setEditStartDate(e.target.value)}
        />
        <label>Check Out Date</label>
        <input
          type="date"
          placeholder={booking.endDate}
          value={editEndDate}
          onChange={(e) => setEditEndDate(e.target.value)}
        />
        <button
          disabled={Object.values(errors).length > 0}
          id={
            Object.values(errors).length === 0
              ? "update-booking-button-active"
              : "update-booking-button-disabled"
          }
        >
          Update Reservation
        </button>
      </form>
    </>
  );
}

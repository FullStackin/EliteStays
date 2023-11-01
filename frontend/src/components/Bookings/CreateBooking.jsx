import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBookingThunk, loadBookingThunk } from "../../store/booking";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import "./CreateBooking.css";

export default function CreateBookingModal({ spot, onClose }) {
  const [bookingStartDate, setBookingStartDate] = useState("");
  const [bookingEndDate, setBookingEndDate] = useState("");
  const [errors, setErrors] = useState({});
  const [hasSubmit, setHasSubmit] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();
  const currentDate = new Date();

  const modalRef = useRef();

  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    const errorLi = {};
    if (bookingStartDate === undefined || bookingStartDate < currentDate)
      errorLi.bookingStartDate = "Please enter a valid check-in date.";
    if (bookingEndDate === undefined || bookingEndDate < currentDate)
      errorLi.bookingEndDate = "Please enter a valid check-out date.";

    setErrors(errorLi);
  }, [bookingStartDate, bookingEndDate]);

  const closeModalOnClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeModalOnClickOutside);
    return () => {
      document.removeEventListener("click", closeModalOnClickOutside);
    };
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setHasSubmit(true);
    console.log("spot:", spot);
    if (!spot || !spot.id) {
      console.error("Invalid spot object");
      return;
    }

    const booking = {
      spotId: spot[0].id,
      userId: user.id,
      startDate: bookingStartDate,
      endDate: bookingEndDate,
    };
    const newBooking = await dispatch(createBookingThunk(spot[0].id, booking));
    if (newBooking.errors) {
      setErrors(newBooking.errors);
    } else {
      dispatch(loadBookingThunk(spot[0].id));
      window.alert("Reservation success!");
      history.push(`/bookings/current`);
      closeModal();
    }
  };

  return (
    <div className="booking-overlay">
      <div ref={modalRef} className="booking-modal">
        <div id="make-reservation-spot">
          <h2>Make a reservation at</h2>
          <h3>{spot.name}!</h3>
          {hasSubmit && <p className="error">{errors.bookingStartDate}</p>}
          {hasSubmit && <p className="error">{errors.bookingEndDate}</p>}
        </div>
        <form onSubmit={onSubmit} id="make-reservation-form">
          <label>Check-In Date</label>
          <input
            type="date"
            placeholder="Please enter your check-in date"
            value={bookingStartDate}
            onChange={(e) => setBookingStartDate(e.target.value)}
          />
          <label>Check-Out Date</label>
          <input
            type="date"
            placeholder="Please enter your check-out date"
            value={bookingEndDate}
            onChange={(e) => setBookingEndDate(e.target.value)}
          />
          <button
            disabled={Object.values(errors).length > 0}
            id={
              Object.values(errors).length === 0
                ? "make-reserve-button-active"
                : "make-reserve-button-disabled"
            }
          >
            Reserve
          </button>
        </form>
      </div>
    </div>
  );
}

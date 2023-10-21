import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBookingThunk, loadBookingThunk } from '../../store/booking';
import { useModal } from '../../context/Modal';
import { useHistory } from 'react-router-dom';
import './CreateBooking.css'

export default function CreateBookingModal({ spot }) {

    const [bookingStartDate, setBookingStartDate] = useState("");
    const [bookingEndDate, setBookingEndDate] = useState("");
    const [errors, setErrors] = useState({});
    const [hasSubmit, setHasSubmit] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal } = useModal();
    const currentDate = new Date()

    const user = useSelector((state) => state.session.user);

    useEffect(() => {
        const errorLi = {};
        if (bookingStartDate === undefined || bookingStartDate < currentDate) errorLi.bookingStartDate = "Please enter valid check-in date.";
        if (bookingEndDate === undefined || bookingEndDate < currentDate) errorLi.bookingEndDate = "Please enter valid check-out date.";

        setErrors(errorLi)
    }, [bookingStartDate, bookingEndDate])


    const onSubmit = async (e) => {
        e.preventDefault();

        setHasSubmit(true)

        const booking = {
            spotId: spot[0].id,
            userId: user.id,
            startDate: bookingStartDate,
            endDate: bookingEndDate,
        }

        const newBooking = await dispatch(createBookingThunk(spot[0].id, booking));

        if(newBooking.errors) {
            setErrors(newBooking.errors);
            console.log("errors : ", errors);
        } else {
            dispatch(loadBookingThunk(spot[0].id));
            window.alert("Reservation success!");
            history.push(`/bookings/current`);
            closeModal();
        }

    };


    return (
        <>
        <div id='make-reservation-spot'>
        <h2>Make a reservation at</h2>
        <h2>{spot[0].name}!</h2>
        {hasSubmit && <p className="error">{errors.startDate}</p>}
        {hasSubmit && <p className="error">{errors.endDate}</p>}
        </div>
        <form
            onSubmit={onSubmit}
            id="make-reservation-form"
        >
            <label>Check In Date</label>
            <input
                type="date"
                placeholder='Please enter your check-in date'
                value={bookingStartDate}
                onChange={(e) => setBookingStartDate(e.target.value)}
            />
            <label>Check Out Date</label>
            <input
                type="date"
                placeholder="Please enter your check-out date"
                value={bookingEndDate}
                onChange={(e) => setBookingEndDate(e.target.value)}
            />
            <button
            disabled={Object.values(errors).length > 0}
             id={Object.values(errors).length === 0 ? 'make-reserve-button-active' : 'make-reserve-button-disabled'}
             >Reserve</button>
        </form>
        </>
    );
};

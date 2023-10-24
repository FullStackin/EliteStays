import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUserBookingsThunk } from "../../store/booking";
import PopModalMenu from "../Navigation/PopModalMenu";
import UpdateBookingModal from "./UpdateBooking";
import DeleteBookingModal from "./DeleteBooking";
import "./ManageBooking.css";

export default function ManageBookings() {
  // Define a functional component named ManageBookings
  const userBookingStore = useSelector((state) => state.booking.userBookings); // Use the useSelector hook to extract userBookings from the Redux store
  // console.log("userBookings in ManageBooking: ", userBookingStore);
  const userBookingsArr = Object.values(userBookingStore); // Convert the userBookingStore object to an array
  // console.log("useBookingsArr in ManageBooking: ", userBookingsArr);

  const dispatch = useDispatch(); // Get access to the dispatch function from the Redux store

  useEffect(() => {
    // Use the useEffect hook to perform an action when the component mounts or userBookingStore changes
    // console.log("getCurrentUserBookingsThuns runs in the ManageBooking useEffect");
    dispatch(getCurrentUserBookingsThunk()); // Dispatch the getCurrentUserBookingsThunk action to fetch user bookings
  }, [dispatch]); // Specify the dependency array to trigger the effect when dispatch changes

  if (!userBookingsArr.length) {
    // Check if the user has any bookings, and if not, display a message
    return <p>You don't have any reservation.</p>;
  }

  return (
    <>
      <h2 id="manage-booking-title">Manage Bookings</h2>
      <div id="manage-booking-div" className="grid">
        {userBookingsArr.map((booking) => (
          <div key={booking.id} className="booking-card">
            <img
              src={booking.Spot.previewImage}
              alt=""
              className="booking-image"
            />
            <p id="booking-spot-name" className="spot-name">
              {booking.Spot.name}
            </p>
            <div id="booking-info-div" className="info-div">
              {(() => {
                const month = booking.startDate.split("-")[1];
                const year = booking.startDate.split("-")[0];
                const date = booking.startDate.split("-")[2].split("T")[0];
                return (
                  <p>
                    Check-in Date: {month}/{date}/{year}
                  </p>
                );
              })()}
              {(() => {
                const month = booking.endDate.split("-")[1];
                const year = booking.endDate.split("-")[0];
                const date = booking.endDate.split("-")[2].split("T")[0];
                return (
                  <p>
                    Check-out Date: {month}/{date}/{year}
                  </p>
                );
              })()}
              {(() => {
                const month = booking.createdAt.split("-")[1];
                const year = booking.createdAt.split("-")[0];
                const date = booking.createdAt.split("-")[2].split("T")[0];
                return (
                  <p>
                    Reserved on: {month}/{date}/{year}
                  </p>
                );
              })()}
              {(() => {
                const month = booking.updatedAt.split("-")[1];
                const year = booking.updatedAt.split("-")[0];
                const date = booking.updatedAt.split("-")[2].split("T")[0];
                return (
                  <p>
                    Updated last: {month}/{date}/{year}
                  </p>
                );
              })()}
            </div>
            <div id="manage-booking-buttons" className="button-row">
              <button className="update-button">
                <PopModalMenu
                  modalComponent={<UpdateBookingModal booking={booking} />}
                  itemText="Update"
                />
              </button>
              <button className="delete-button">
                <PopModalMenu
                  modalComponent={<DeleteBookingModal booking={booking} />}
                  itemText="Delete"
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

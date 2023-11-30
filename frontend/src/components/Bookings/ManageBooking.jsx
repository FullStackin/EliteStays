import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUserBookingsThunk } from "../../store/booking";
import PopModalMenu from "../Navigation/PopModalMenu";
import UpdateBookingModal from "./UpdateBooking";
import DeleteBookingModal from "./DeleteBooking";
import "./ManageBooking.css";

export default function ManageBookings() {
  const userBookingStore = useSelector((state) => state.booking.userBookings);
  const userBookingsArr = Object.values(userBookingStore);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUserBookingsThunk());
  }, [dispatch]);

  if (!userBookingsArr.length) {
    return <p>There are currently no reservation under your name.</p>;
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

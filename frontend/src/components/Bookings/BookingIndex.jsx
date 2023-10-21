import { useSelector, useDispatch } from "react-redux";
import { loadBookingThunk } from "../../store/booking";
import { useEffect } from "react";
import { getSpotThunk } from "../../store/spots";
import PopModalMenu from "../Navigation/PopModalMenu";
import CreateBooking from "./CreateBooking";
import "./BookingIndex.css";

export default function BookingIndex() {
  const spotStore = useSelector((state) => state.spots.singleSpot);
  const spot = Object.values(spotStore);

  const user = useSelector((state) => state.session.user);

  const bookingsStore = useSelector((state) => state.bookings.allBookings);
  const bookingArr = Object.values(bookingsStore);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSpotThunk(spot[0].id));
    dispatch(loadBookingThunk(spot[0].id));
  }, [dispatch]);

  if (!spot) return null;
  if (!user)
    return (
      <p id="no-user-for-reservation">Please log in to make a reservation.</p>
    );

  if (bookingArr.length === 0) {
    return (
      <>
        <div id="no-reservation">
          {spot[0]?.name} currently has no reservation.
        </div>
        <div>
          {spot[0]?.ownerId !== user.id ? (
            <button className="make-reservation-button">
              <PopModalMenu
                modalComponent={<CreateBooking spot={spot} />}
                itemText="Make your reservation"
              />
            </button>
          ) : (
            ""
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <div id="reserve-schedule-div">
        <h3>{spot[0]?.name} Reserved Schedule</h3>
        {bookingArr.map((booking) => (
          <li key={booking.id}>
            {(() => {
              const month = {
                "01": "Jan",
                "02": "Feb",
                "03": "Mar",
                "04": "Apr",
                "05": "May",
                "06": "Jun",
                "07": "Jul",
                "08": "Aug",
                "09": "Sep",
                10: "Oct",
                11: "Nov",
                12: "Dec",
              };

              const startDateString = booking.startDate
                .split("-")[2]
                .split("T");
              const endDateString = booking.endDate.split("-")[2].split("T");

              if (booking.User) {
                return (
                  <p>
                    ✅This spot is reserved by {booking.User.firstName}{" "}
                    {booking.User.lastName} between{" "}
                    {month[booking.startDate.split("-")[1]]}{" "}
                    {startDateString[0]} {booking.startDate.split("-")[0]} /{" "}
                    {endDateString[0]} {month[booking.endDate.split("-")[1]]}{" "}
                    {booking.endDate.split("-")[0]}
                  </p>
                );
              } else {
                return (
                  <p>
                    ✅This spot is reserved between{" "}
                    {month[booking.startDate.split("-")[1]]}{" "}
                    {startDateString[0]} {booking.startDate.split("-")[0]} /{" "}
                    {endDateString[0]} {month[booking.endDate.split("-")[1]]}{" "}
                    {booking.endDate.split("-")[0]}
                  </p>
                );
              }
            })()}
            {(() => {})()}
          </li>
        ))}
      </div>

      <div id="make-reservation-div">
        {spot[0].ownerId !== user.id ? (
          <button className="make-reservation-button">
            <PopModalMenu
              modalComponent={<CreateBooking spot={spot} />}
              itemText="Make your reservation"
            />
          </button>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

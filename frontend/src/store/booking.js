import { csrfFetch } from "./csrf";

// Action Types
export const LOAD_BOOKINGS = "booking/LOAD_BOOKINGS";
export const CREATE_BOOKING = "booking/CREATE_BOOKING";
export const EDIT_BOOKING = "booking/EDIT_BOOKING";
export const DELETE_BOOKING = "booking/DELETE_BOOKING";
export const GET_CURRENT_USER_BOOKINGS = "booking/GET_CURRENT_USER_BOOKINGS";

// Action Creators
export const loadBookingAction = (bookings) => ({
  type: LOAD_BOOKINGS,
  bookings,
});

export const createBookingAction = (booking) => ({
  type: CREATE_BOOKING,
  booking,
});

export const editBookingAction = (editedBooking) => ({
  type: EDIT_BOOKING,
  editedBooking,
});

export const deleteBookingAction = (bookingId) => ({
  type: DELETE_BOOKING,
  bookingId,
});

export const getCurrentUserBookingsAction = (userBookings) => ({
  type: GET_CURRENT_USER_BOOKINGS,
  userBookings,
});

// Thunk Action Creators
export const loadBookingThunk = (spotId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/${spotId}/bookings`);

    if (res.ok) {
      const bookings = await res.json();
      dispatch(loadBookingAction(bookings));
      return bookings;
    }
  } catch (err) {
    throw err; 
  }
};

export const createBookingThunk = (spotId, booking) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/${spotId}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    });

    if (res.ok) {
      const newBooking = await res.json();
      dispatch(createBookingAction(newBooking));
      return newBooking;
    }
  } catch (err) {
    throw err;
  }
};

export const editBookingThunk = (bookingId, payload) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/bookings/${bookingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const editedBooking = await res.json();
      dispatch(editBookingAction(editedBooking));
      return editedBooking;
    }
  } catch (err) {
    throw err;
  }
};

export const deleteBookingThunk = (bookingId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/bookings/${bookingId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      dispatch(deleteBookingAction(bookingId));
    }
  } catch (err) {
    throw err;
  }
};

export const getCurrentUserBookingsThunk = () => async (dispatch) => {
  try {
    const res = await csrfFetch("/api/bookings/current");

    if (res.ok) {
      const userBookings = await res.json();
      dispatch(getCurrentUserBookingsAction(userBookings));
      console.log("userBookings fetched and dispatched:", userBookings);
      return userBookings;
    }
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    throw err;
  }
};

// Reducer
const initialState = {
  allBookings: null,
  singleBooking: null,
  userBookings: {},
};

const bookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_BOOKINGS: {
      const allBookings = {};
      action.bookings.Bookings.forEach((booking) => {
        allBookings[booking.id] = booking;
      });

      return {
        ...state,
        allBookings,
      };
    }
    case CREATE_BOOKING: {
      const newBooking = action.booking;
      return {
        ...state,
        allBookings: {
          ...state.allBookings,
          [newBooking.id]: newBooking,
        },
      };
    }
    case EDIT_BOOKING: {
      const editedBooking = action.editedBooking;
      return {
        ...state,
        allBookings: {
          ...state.allBookings,
          [editedBooking.id]: editedBooking,
        },
      };
    }
    case DELETE_BOOKING: {
      const { [action.bookingId]: deletedBooking, ...newAllBookings } =
        state.allBookings;
      return {
        ...state,
        allBookings: newAllBookings,
      };
    }
    case GET_CURRENT_USER_BOOKINGS: {
      console.log("action", action); // Log the action for debugging
      console.log("state before update", state); // Log the state before the update

      const userBookings = {};
      action.userBookings.Bookings.forEach((booking) => {
        userBookings[booking.id] = booking;
      });

      console.log("userBookings", userBookings); // Log the userBookings object

      return {
        ...state,
        userBookings,
      };
    }
    default:
      return state;
  }
};

export default bookingReducer;

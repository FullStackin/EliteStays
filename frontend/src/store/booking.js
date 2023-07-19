import { csrfFetch } from "./csrf";

export const FETCH_ALL_BOOKINGS = "booking/FETCH_ALL_BOOKINGS";
export const CREATE_NEW_BOOKING = "booking/CREATE_NEW_BOOKING";
export const UPDATE_BOOKING = "booking/UPDATE_BOOKING";
export const REMOVE_BOOKING = "booking/REMOVE_BOOKING";
export const FETCH_USER_BOOKINGS = "booking/FETCH_USER_BOOKINGS";

export const fetchAllBookingsAction = (bookings) => {
  return {
    type: FETCH_ALL_BOOKINGS,
    payload: bookings,
  };
};

export const createNewBookingAction = (booking) => {
  return {
    type: CREATE_NEW_BOOKING,
    payload: booking,
  };
};

export const updateBookingAction = (editedBooking) => {
  return {
    type: UPDATE_BOOKING,
    payload: editedBooking,
  };
};

export const removeBookingAction = (bookingId) => {
  return {
    type: REMOVE_BOOKING,
    payload: bookingId,
  };
};

export const fetchUserBookingsAction = (userBookings) => {
  return {
    type: FETCH_USER_BOOKINGS,
    payload: userBookings,
  };
};

export const fetchAllBookingsThunk = (spotId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/${spotId}/bookings`);

    if (res.ok) {
      const bookings = await res.json();
      console.log("Bookings in booking reducer: ", bookings);
      dispatch(fetchAllBookingsAction(bookings));
      return bookings;
    }
  } catch (err) {
    const errors = err.json();
    return errors;
  }
};

export const createNewBookingThunk = (spotId, booking) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/${spotId}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    });

    console.log("response from createBookingThunk: ", res);
    if (res.ok) {
      const newBooking = await res.json();
      console.log("newBooking in createBookingThunk: ", newBooking);
      dispatch(createNewBookingAction(newBooking));
      return newBooking;
    }
  } catch (err) {
    const errors = err.json();
    return errors;
  }
};

export const updateBookingThunk = (bookingId, payload) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/bookings/${bookingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const editedBooking = await res.json();
      dispatch(updateBookingAction(editedBooking));
      return editedBooking;
    }
  } catch (err) {
    const errors = await err.json();
    return errors;
  }
};

export const removeBookingThunk = (bookingId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/bookings/${bookingId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      console.log("res in deleteBookingThunk: ", res);
      dispatch(removeBookingAction(bookingId));
      return;
    }
  } catch (err) {
    const errors = await err.json();
    return errors;
  }
};

export const fetchUserBookingsThunk = () => async (dispatch) => {
  try {
    const res = await csrfFetch("/api/bookings/current");

    if (res.ok) {
      const userBookings = await res.json();
      console.log("userBookings in the thunk: ", userBookings);
      dispatch(fetchUserBookingsAction(userBookings));
      return userBookings;
    }
  } catch (err) {
    const errors = await err.json();
    return errors;
  }
};

const initialState = {
  allBookings: {},
  singleBooking: {},
  userBookings: {},
};

const bookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALL_BOOKINGS: {
      const newState = {
        ...state,
        allBookings: {},
        singleBooking: {},
        userBookings: {},
      };
      action.payload.forEach((booking) => {
        newState.allBookings[booking.id] = booking;
      });
      console.log("newState in booking reducer: ", newState);
      return newState;
    }
    case CREATE_NEW_BOOKING: {
      const newState = {
        ...state,
        allBookings: {
          ...state.allBookings,
          [action.payload.id]: action.payload,
        },
        singleBooking: {},
        userBookings: {},
      };
      return newState;
    }
    case UPDATE_BOOKING: {
      const newState = {
        ...state,
        allBookings: {
          ...state.allBookings,
          [action.payload.id]: action.payload,
        },
        singleBooking: {},
        userBookings: { ...state.userBookings },
      };
      return newState;
    }
    case REMOVE_BOOKING: {
      const newState = {
        ...state,
        allBookings: { ...state.allBookings },
        singleBooking: {},
        userBookings: {},
      };
      delete newState.allBookings[action.payload];
      return newState;
    }
    case FETCH_USER_BOOKINGS: {
      console.log("userBookings in the reducer function: ", action.payload);
      const newState = {
        ...state,
        allBookings: { ...state.allBookings },
        singleBooking: {},
        userBookings: {},
      };
      action.payload.forEach((booking) => {
        newState.userBookings[booking.id] = booking;
      });
      return newState;
    }
    default:
      return state;
  }
};

export default bookingReducer;

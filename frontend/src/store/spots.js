import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = "spots/getAllSpots";
const GET_SPOT = "spots/getSpot";
const CREATE_SPOT = "spots/createSpot";
const DELETE_SPOT = "spots/deleteSpot";
const GET_USER_SPOTS = "spots/current";
const UPDATE_SPOT = "spots/update";
const SEARCH_SPOTS = "spots/SEARCH_SPOTS";

//Spot Actions

const getAllSpotsAction = (spots) => {
  return {
    type: GET_ALL_SPOTS,
    payload: spots,
  };
};

const getSpotAction = (spot) => {
  return {
    type: GET_SPOT,
    payload: spot,
  };
};

const createSpotAction = (spot) => {
  return {
    type: CREATE_SPOT,
    payload: spot,
  };
};

const deleteSpotAction = (spot) => {
  return {
    type: DELETE_SPOT,
    payload: spot,
  };
};

const getUserSpotsAction = (spots) => {
  return {
    type: GET_USER_SPOTS,
    payload: spots,
  };
};

const updateSpotAction = (spot) => {
  return {
    type: UPDATE_SPOT,
    payload: spot,
  };
};

const searchSpotAction = (spots) => {
  return {
    type: SEARCH_SPOTS,
    spots,
  };
};

export const getUserSpotsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots/current");

  if (res.ok) {
    const userSpots = await res.json();
    const userSpotsObj = {};
    userSpots.Spots.forEach((spot) => (userSpotsObj[spot.id] = spot));

    dispatch(getUserSpotsAction(userSpotsObj));
  } else {
    //err
  }
};

export const getSpotThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);
  const spot = await res.json();
  dispatch(getSpotAction(spot));
};

export const createSpotThunk =
  ({ createdSpot, spotImgs }) =>
  async (dispatch) => {
    try {
      const res = await csrfFetch("/api/spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createdSpot),
      });
      if (res.ok) {
        const newSpot = await res.json();
        const formData = new FormData();
        Object.entries(spotImgs).forEach(([key, image]) => {
          formData.append("images", image, key); // Adjust the key accordingly
        });

        const images = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
          method: "POST",
          body: formData,
        });

        dispatch(createSpotAction(newSpot));
        return newSpot;
      } else {
        // Handle the case where the response is not okay
        // For example, throw an error and let the caller handle it
        throw new Error(
          "Failed to create spot. Server responded with status: " + res.status
        );
      }
    } catch (err) {
      //err
    }
  };

export const deleteSpotThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (res.ok) {
    dispatch(deleteSpotAction(spotId));
  } else {
    //err
  }
};

// This is an async thunk function responsible for updating a spot's information.
export const updateSpotThunk =
  ({ createdSpot, spotImgs }) =>
  async (dispatch) => {
    try {
      // Extract the spot ID from the createdSpot object.
      const spotId = createdSpot.id;

      // Make a PUT request to the server API to update the spot with the given ID.
      const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createdSpot), // Convert the updated spot data to JSON format.
      });

      // Check if the response from the server is successful (status code 200-299).
      if (res.ok) {
        // Parse the response JSON data to get the updated spot information.
        const spot = await res.json();
        if (spotImgs) {
          const formData = new FormData();
          Object.entries(spotImgs).forEach(([key, image]) => {
            formData.append("images", image, key);
          });

          const images = await csrfFetch(`/api/spots/${spotId}/images`, {
            method: "POST",
            body: formData,
          });
        }
        // Dispatch an action to update the spot in the Redux store.
        dispatch(updateSpotAction(createdSpot));

        // Return the updated spot data to the caller.
        return spot;
      } else {
        // If the response status is not okay, handle the error.
        // For example, throw an error with a descriptive message.
        throw new Error(
          "Failed to update spot. Server responded with status: " + res.status
        );
      }
    } catch (err) {
      // Handle any exceptions that occurred during the API request.
      // For instance, log the error for debugging purposes.
      console.error("Error while updating spot:", err);
      // Rethrow the error to propagate it further.
      throw err;
    }
  };

export const getAllSpotsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");
  if (res.ok) {
    const data = await res.json();
    const spots = data.Spots;
    const allSpotsObj = {};
    spots.forEach((spot) => (allSpotsObj[spot.id] = spot));
    dispatch(getAllSpotsAction(allSpotsObj));
  } else {
    console.log("Error all");
  }
};

export const searchSpotThunk = (query) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots?${query}`);

    console.log("query in thunk: ", `/api/spots/${query}`);

    if (res.ok) {
      const spots = await res.json();
      dispatch(searchSpotAction(spots));
      return spots;
    }
  } catch (err) {
    const errors = await err.json();
    return errors;
  }
};

const initialState = { allSpots: {}, singleSpot: {} };

const spotReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_ALL_SPOTS: {
      newState = { ...state, allSpots: { ...state.allSpots } };
      newState.allSpots = action.payload;
      return newState;
    }
    case GET_SPOT: {
      newState = { ...state, allSpots: { ...state.allSpots } };
      newState.singleSpot = action.payload;
      return newState;
    }
    case CREATE_SPOT: {
      newState = { ...state, allSpots: { ...state.allSpots } };
      newState.singleSpot = action.payload;
      return newState;
    }
    case DELETE_SPOT: {
      newState = { ...state, allSpots: { ...state.allSpots } };
      delete newState.allSpots[action.payload];
      return newState;
    }
    case GET_USER_SPOTS: {
      newState = { ...state, allSpots: { ...state.allSpots } };
      newState.allSpots = action.payload;
      return newState;
    }
    case UPDATE_SPOT: {
      newState = { ...state, allSpots: { ...state.allSpots } };
      newState.singleSpot = action.payload;
      return newState;
    }
    case SEARCH_SPOTS: {
      const spotState = {
        ...state,
        allState: { ...state.allState },
        singleSpot: { ...state.singleSpot },
        searchSpot: {},
      };
      action.spots.Spots.forEach((spot) => {
        spotState.searchSpot[spot.id] = spot;
      });

      return spotState;
    }
    default:
      return state;
  }
};

export default spotReducer;

import { csrfFetch } from "./csrf";

const FETCH_ALL_SPOTS = "spots/FETCH_ALL_SPOTS";
const FETCH_SINGLE_SPOT = "spots/FETCH_SINGLE_SPOT";
const MODIFY_SPOT = "spots/MODIFY_SPOT";
const REMOVE_SPOT = "spots/REMOVE_SPOT";
const FETCH_USER_SPOTS = "spots/FETCH_USER_SPOTS";
const RESET_SPOT = "spots/RESET_SPOT";
const FIND_SPOTS = "spots/FIND_SPOTS";

export const fetchAllSpotsAction = (spots) => ({
  type: FETCH_ALL_SPOTS,
  spots,
});

export const fetchSingleSpotAction = (spot) => ({
  type: FETCH_SINGLE_SPOT,
  spot,
});

export const modifySpotAction = (spot) => ({
  type: MODIFY_SPOT,
  spot,
});

export const removeSpotAction = (spotId) => ({
  type: REMOVE_SPOT,
  spotId,
});

export const fetchUserSpotsAction = (spots) => ({
  type: FETCH_USER_SPOTS,
  spots,
});

export const resetSpotAction = () => ({
  type: RESET_SPOT,
});

export const findSpotsAction = (spots) => ({
  type: FIND_SPOTS,
  spots,
});

export const fetchAllSpotsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");

  if (res.ok) {
    const spots = await res.json();
    dispatch(fetchAllSpotsAction(spots));
    return spots;
  }
};

export const fetchSingleSpotThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);

  if (res.ok) {
    const spotDetails = await res.json();
    dispatch(fetchSingleSpotAction(spotDetails));
    return spotDetails;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const createSpotThunk =
  (spot, imagesArray, owner) => async (dispatch) => {
    try {
      const res = await csrfFetch("/api/spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spot),
      });

      if (res.ok) {
        const newSpot = await res.json();

        const finalImageArray = [];

        for (let image of imagesArray) {
          image.spotId = newSpot.id;
          const imageRes = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(image),
          });

          if (imageRes.ok) {
            const newImage = await imageRes.json();
            finalImageArray.push(newImage);
          }
        }
        newSpot.SpotImages = finalImageArray;
        newSpot.owner = owner;

        dispatch(fetchSingleSpotAction(newSpot));
        return newSpot;
      }
    } catch (err) {
      const error = await err.json();
      return error;
    }
  };

export const modifySpotThunk = (spot) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spot.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spot),
  });

  if (res.ok) {
    const editedSpot = await res.json();

    dispatch(fetchSingleSpotAction(editedSpot));
    return editedSpot;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const removeSpotThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    dispatch(removeSpotAction(spotId));
    return;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const fetchUserSpotsThunk = () => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/current`);

  if (res.ok) {
    const userSpots = await res.json();
    dispatch(fetchAllSpotsAction(userSpots));
    return userSpots;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const findSpotsThunk = (query) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots?${query}`);

    console.log("query in thunk: ", `/api/spots/${query}`);

    if (res.ok) {
      const spots = await res.json();
      console.log("spots in Spot Thunk: ", spots);
      dispatch(findSpotsAction(spots));
      return spots;
    }
  } catch (err) {
    const errors = await err.json();
    console.log("errors in spot reducer: ", errors);
    return errors;
  }
};

const initialState = { allState: {}, singleSpot: {}, searchSpot: {} };

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALL_SPOTS: {
      const newState = {
        ...state,
        allState: {},
        singleSpot: {},
        searchSpot: {},
      };
      action.spots.Spots.forEach((spot) => {
        newState.allState[spot.id] = spot;
      });
      return newState;
    }
    case FETCH_SINGLE_SPOT: {
      const spotState = {
        ...state,
        allState: { ...state.allState },
        singleSpot: { [action.spot.id]: action.spot },
        searchSpot: {},
      };
      return spotState;
    }
    case MODIFY_SPOT: {
      const spotState = {
        ...state,
        singleSpot: { [action.spot.id]: action.spot },
      };
      return spotState.singleSpot;
    }
    case REMOVE_SPOT: {
      const spotsState = {
        ...state,
        allState: { ...state.allState },
        singleSpot: {},
        searchSpot: {},
      };
      delete spotsState.allState[action.spotId];
      return spotsState;
    }
    case FETCH_USER_SPOTS: {
      const spotsState = {
        ...state,
        allState: {},
        singleSpot: {},
        searchSpot: {},
      };
      action.spots.Spots.forEach((spot) => {
        spotsState.allState[spot.id] = spot;
      });
      return spotsState;
    }
    case FIND_SPOTS: {
      console.log("Search Listing in reducer: ", action.spots);
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
    case RESET_SPOT: {
      const emptyState = {
        ...state,
        allState: {},
        singleSpot: {},
        searchSpot: { ...state.searchSpot },
      };
      return emptyState;
    }
    default:
      return state;
  }
};

export default spotsReducer;

import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = "spots/getAllSpots";
const GET_SPOT = "spots/getSpot";
const CREATE_SPOT = "spots/createSpot";
const DELETE_SPOT = "spots/deleteSpot";
const GET_USER_SPOTS = "spots/current";
const UPDATE_SPOT = "spots/update";

//ac for user spots
const getUserSpotsAC = (spots) => {
  return {
    type: GET_USER_SPOTS,
    payload: spots,
  };
};

//action creator for AllSpots
const getAllSpotsAC = (spots) => {
  return {
    type: GET_ALL_SPOTS,
    payload: spots,
  };
};

//ac for single spot
const getSpotAC = (spot) => {
  return {
    type: GET_SPOT,
    payload: spot,
  };
};

const createSpotAC = (spot) => {
  return {
    type: CREATE_SPOT,
    payload: spot,
  };
};

const deleteSpotAC = (spot) => {
  return {
    type: DELETE_SPOT,
    payload: spot,
  };
};

const updateSpotAC = (spot) => {
  return {
    type: UPDATE_SPOT,
    payload: spot,
  };
};

export const getUserSpotsThunk = () => async (dispatch) => {
  console.log("reached get user spots");
  const res = await csrfFetch("/api/spots/current");

  if (res.ok) {
    const userSpots = await res.json();
    // console.log('res from cur  user spots', userSpots);
    const userSpotsObj = {};
    userSpots.Spots.forEach((spot) => (userSpotsObj[spot.id] = spot));
    // console.log('res after userspotobj', userSpotsObj);

    dispatch(getUserSpotsAC(userSpotsObj));
  } else {
    //err
  }
};

export const createSpotThunk =
  ({ createdSpot, spotImgs }) =>
  async (dispatch) => {
    console.log("create spot info inside thunk: ", createdSpot);
    const res = await csrfFetch("/api/spots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createdSpot),
    });
    if (res.ok) {
      const newSpot = await res.json();
      for (let i = 0; i < spotImgs.length; i++) {
        await csrfFetch(`/api/spots/${newSpot.id}/images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(spotImgs[i]),
        });
      }

      dispatch(createSpotAC(newSpot));
      return newSpot;
    }
  };

export const deleteSpotThunk = (spotId) => async (dispatch) => {
  console.log("deletespot thunk id:", spotId);
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (res.ok) {
    dispatch(deleteSpotAC(spotId));
  } else {
    //err
  }
};

export const updateSpotThunk =
  ({ createdSpot }) =>
  async (dispatch) => {
    // console.log('update spot info thunk', createdSpot);
    // console.log('updatespotid', createdSpot.id);
    const spotId = createdSpot.id;
    const res = await csrfFetch(`/api/spots/${spotId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createdSpot),
    });
    if (res.ok) {
      const spot = await res.json();
      //   for (let i = 0; i < spotImgs.length; i++) {
      //     await csrfFetch(`/api/spots/${spot.id}/images`, {
      //       method: "POST",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify(spotImgs[i]),
      //     });
      //   }
      dispatch(updateSpotAC(createdSpot));
    } else {
    }
  };

export const getSpotThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);
  //   console.log("hi from spot  thunk");
  const spot = await res.json();
  dispatch(getSpotAC(spot));
};

export const getAllSpotsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");
  const spots = await res.json();
  const allSpotsObj = {};
  spots.forEach((spot) => (allSpotsObj[spot.id] = spot));
  console.log(allSpotsObj);
  dispatch(getAllSpotsAC(allSpotsObj));
};

const initialState = { allSpots: {}, singleSpot: {} };

const spotReducer = (state = initialState, action) => {
  console.log("Action: ", action);
  console.log("Spot reducer running");
  let newState;
  switch (action.type) {
    case GET_ALL_SPOTS: {
      console.log("get all spots case");
      newState = { ...state, allSpots: { ...state.allSpots } };
      newState.allSpots = action.payload;
      return newState;
    }
    case GET_SPOT: {
      console.log("get spot case", state);
      newState = { ...state, allSpots: { ...state.allSpots } };
      newState.singleSpot = action.payload;
      return newState;
    }
    case CREATE_SPOT: {
      console.log("create spot case");
      newState = { ...state, allSpots: { ...state.allSpots } };
      newState.singleSpot = action.payload;
      return newState;
    }
    case DELETE_SPOT: {
      console.log("delete spot case");
      console.log("action: ", action);
      newState = { ...state, allSpots: { ...state.allSpots } };
      delete newState.allSpots[action.payload];
      return newState;
    }
    case GET_USER_SPOTS: {
      console.log("get user spots/manage case");
      newState = { ...state, allSpots: { ...state.allSpots } };
      newState.allSpots = action.payload;
      return newState;
    }
    case UPDATE_SPOT: {
      console.log("update spot case");
      newState = { ...state, allSpots: { ...state.allSpots } };
      newState.singleSpot = action.payload;
      return newState;
    }
    default:
      console.log("default case");
      return state;
  }
};

export default spotReducer;

import { csrfFetch } from "./csrf";
import { useDispatch } from "react-redux";
import { getSpotThunk } from "./spots";

const CREATE_REVIEW = "reviews/CreateReview";
const GET_REVIEWS = "reviews/GetReviews";
const UPDATE_REVIEW = "reviews/UpdateReview";
const DELETE_REVIEW = "reviews/deleteReview";

//Actions
const CreateReviewAction = (review) => {
  return {
    type: CREATE_REVIEW,
    payload: review,
  };
};

const GetReviewsAction = (reviews) => {
  return {
    type: GET_REVIEWS,
    payload: reviews,
  };
};

const updateReviewAction = (review) => {
  return {
    type: UPDATE_REVIEW,
    payload: review,
  };
};

const deleteReviewAction = (review) => {
  return {
    type: DELETE_REVIEW,
    payload: review,
  };
};

//Thunks
export const createReviewThunk =
  ({ spotId, review }) =>
  async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    });

    if (res.ok) {
      const reviewObj = await res.json();
      dispatch(CreateReviewAction(reviewObj));
      dispatch(getSpotThunk(spotId));
      return reviewObj;
    }
  };

export const getReviewsThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);

  if (res.ok) {
    const reviews = (await res.json()).Reviews;
    console.log("reviews", reviews);
    dispatch(GetReviewsAction(reviews));
    return reviews;
  }
};

export const updateReviewThunk = (review) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${review.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  });

  if (res.ok) {
    const updatedReview = await res.json();
    dispatch(updateReviewAction(updatedReview));
    dispatch(getSpotThunk(review.spotId));
    return updatedReview;
  }
};

export const deleteReviewThunk = (review) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${review.id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (res.ok) {
    dispatch(deleteReviewAction(review.id));
    dispatch(getSpotThunk(review.spotId));
  }
};

const initialState = { spot: {}, user: {} };

const reviewReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case CREATE_REVIEW: {
      newState = { ...state, spot: { ...state.spot }, user: { ...state.user } };
      console.log("state", newState);
      console.log("action obj", action);
      newState.spot[action.payload.id] = action.payload;
      console.log("state2", newState);
      return newState;
    }
    case GET_REVIEWS: {
      newState = { ...state, spot: {}, user: {} };
      console.log("get reviews case", action.payload);
      action.payload.forEach((review) => (newState.spot[review.id] = review));
      console.log("new state after reviews", newState);
      return newState;
    }
    case UPDATE_REVIEW: {
      newState = { ...state };
      console.log("updated review state", newState);
      console.log("action obj in update", action.payload);
      newState.spot[action.payload.id] = action.payload;
      console.log("state after update", newState);
      return newState;
    }
    case DELETE_REVIEW: {
      // console.log('state',state);
      newState = { ...state, spot: { ...state.spot }, user: { ...state.user } };
      console.log("state spot reviews", newState);
      console.log("action obj in delete", action.payload);
      delete newState.spot[action.payload];
      console.log("state2", newState);
      return newState;
    }
    default:
      return state;
  }
};

export default reviewReducer;

import { csrfFetch } from "./csrf";

export const FETCH_REVIEWS = "review/FETCH_REVIEWS";
export const ADD_REVIEW = "review/ADD_REVIEW";
export const DELETE_REVIEW = "review/DELETE_REVIEW";
export const UPDATE_REVIEW = "reviwe/UPDATE_REVIEW";
export const RESET_REVIEW = "review/RESET_REVIEW";

export const fetchReviewsAction = (reviews) => {
  return {
    type: FETCH_REVIEWS,
    reviews,
  };
};

export const addReviewAction = (review) => {
  return {
    type: ADD_REVIEW,
    review,
  };
};

export const deleteReviewAction = (reviewId) => {
  return {
    type: DELETE_REVIEW,
    reviewId,
  };
};

export const updateReviewAction = (updatedReview) => {
  return {
    type: UPDATE_REVIEW,
    updatedReview,
  };
};

export const resetReviewAction = () => {
  return {
    type: RESET_REVIEW,
  };
};

export const fetchReviewsThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);

  if (res.ok) {
    const reviews = await res.json();
    dispatch(fetchReviewsAction(reviews));
    return reviews;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const createReviewThunk = (spotId, review) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    });

    if (res.ok) {
      const newReview = await res.json();
      dispatch(addReviewAction(newReview));
      return newReview;
    }
  } catch (err) {
    const errors = await err.json();
    return errors;
  }
};

export const deleteReviewThunk = (reviewId) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    dispatch(deleteReviewAction(reviewId));
    return;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const fetchCurrentUserReviewsThunk = () => async (dispatch) => {
  try {
    const res = await csrfFetch("/api/reviews/current");

    if (res.ok) {
      const currentUserReviews = await res.json();
      dispatch(fetchReviewsAction(currentUserReviews));
      return currentUserReviews;
    }
  } catch (err) {
    const errors = await err.json();
    return errors;
  }
};

export const updateReviewThunk = (reviewId, payload) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const updatedReview = await res.json();
      dispatch(updateReviewAction(updatedReview));
      return updatedReview;
    }
  } catch (err) {
    const errors = await err.json();
    return errors;
  }
};

//reducer
const initialState = {};

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REVIEWS: {
      const reviewsState = {};
      action.reviews.Reviews.forEach((review) => {
        reviewsState[review.id] = review;
      });
      return reviewsState;
    }
    case ADD_REVIEW: {
      const reviewsState = { ...state, [action.review.id]: action.review };
      return reviewsState;
    }
    case DELETE_REVIEW: {
      const reviewsState = { ...state };
      delete reviewsState[action.reviewId];
      return reviewsState;
    }

    case UPDATE_REVIEW: {
      const reviewsState = {
        ...state,
        [action.updatedReview.id]: {
          ...state[action.updatedReview.id],
          ...action.updatedReview,
        },
      };
      return reviewsState;
    }

    case RESET_REVIEW: {
      return {};
    }

    default:
      return state;
  }
};

export default reviewReducer;

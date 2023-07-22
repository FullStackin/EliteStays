import { csrfFetch } from "./csrf";

const UPLOAD_IMAGE = 'listingImages/UPLOAD_IMAGE';

const uploadImageAction = (image) => {
  return {
    type: UPLOAD_IMAGE,
    payload: image
  };
};

export const uploadListingImageThunk = (listingId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/listings/${listingId}/images`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: "",
        preview: true
      })
    });

    if (res.ok) {
      const newImage = await res.json();
      dispatch(uploadImageAction(newImage));
      return newImage;
    } else {
      const errors = await res.json();
      return errors;
    }
  } catch (error) {
    console.error('Error uploading listing image:', error);
  }
};

const initialState = {};

const listingImageReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD_IMAGE: {
      const listingImagesState = { ...state, [action.payload.id]: action.payload };
      return listingImagesState;
    }

    default:
      return state;
  }
};

export default listingImageReducer;

import { csrfFetch } from "./csrf";

const UPLOAD_IMAGE = 'spotImages/UPLOAD_IMAGE';

const uploadImage = (image) => {
  return {
    type: UPLOAD_IMAGE,
    payload: image
  };
};

export const uploadSpotImage = (spotId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/${spotId}/images`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: "",
        preview: true
      })
    });

    if (res.ok) {
      const newImage = await res.json();
      dispatch(uploadImage(newImage));
      return newImage;
    } else {
      const errors = await res.json();
      return errors;
    }
  } catch (error) {
    console.error('Error uploading spot image:', error);
  }
};

const initialState = {};

const spotImageReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD_IMAGE: {
      const spotImagesState = { ...state, [action.payload.id]: action.payload };
      return spotImagesState;
    }

    default:
      return state;
  }
};

export default spotImageReducer;

import { csrfFetch } from "./csrf";

//type string
const FETCH_USER_DETAILS = "users/FETCH_USER_DETAILS";

//action creator
export const fetchUserAction = (user) => {
  return {
    type: FETCH_USER_DETAILS,
    user,
  };
};

//thunk action creator
export const fetchUserThunk = (userId) => async (dispatch) => {
  const res = await csrfFetch(`/api/users/${userId}`);

  if (res.ok) {
    const user = await res.json();
    dispatch(fetchUserAction(user));
    return user;
  } else {
    const errors = await res.json();
    return errors;
  }
};

//reducer
const initialState = {};

const UserDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_DETAILS: {
      const usersState = {};
      action.user.Users.forEach((user) => {
        usersState[user.id] = user;
      });

      return usersState;
    }
    default:
      return state;
  }
};

export default UserDetailsReducer;

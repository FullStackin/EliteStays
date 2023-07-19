// frontend/src/store/index.js
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import sessionReducer from "./session";
import spotsReducer from './spot';
import bookingReducer from './booking';
import reviewReducer from './review';
import UserDetailsReducer from './users';
import spotImageReducer from './spotimage';

const rootReducer = combineReducers({
  session: sessionReducer,
  spot: spotsReducer,
  review: reviewReducer,
  users: UserDetailsReducer,
  spotimage: spotImageReducer,
  booking: bookingReducer,

});

let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
    return createStore(rootReducer, preloadedState, enhancer);
  };

  export default configureStore;

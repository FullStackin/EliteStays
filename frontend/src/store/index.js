import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import spotReducer from "./spots";
import reviewReducer from "./reviews";
import bookingReducer from "./booking";
import logger from "redux-logger";

const rootReducer = combineReducers({
  session: sessionReducer,
  spots: spotReducer,
  reviews: reviewReducer,
  booking: bookingReducer,
});

let enhancer;

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
enhancer = composeEnhancers(applyMiddleware(thunk, logger));

if (process.env.NODE_ENV === "production") {
  enhancer = applyMiddleware(thunk);
} else {
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;

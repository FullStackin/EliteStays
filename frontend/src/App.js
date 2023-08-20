import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import AllSpots from "./components/AllSpots";
import SingleSpot from "./components/SingleSpot";
import CreateSpotForm from "./components/CreateSpotForm";
import ManageSpots from "./components/ManageSpots";
import UpdateSpot from "./components/UpdateSpot";
import UpdateReview from "./components/UpdateReview/updateReview";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <AllSpots />
          </Route>
          <Route exact path="/spots/new">
            {sessionUser ? <CreateSpotForm /> : <Redirect to="/login" />}
          </Route>
          <Route exact path="/spots/current">
            <ManageSpots />
          </Route>
          <Route exact path="/spots/:spotId/update">
            <UpdateSpot />
          </Route>
          <Route exact path="/spots/:spotId">
            <SingleSpot />
          </Route>
          <Route exact path="/spots/:spotId/reviews/:reviewId/update">
            <UpdateReview />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;

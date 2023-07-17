import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormModal from "./components/SignupFormModal";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import { ModalProvider, Modal } from "./context/Modal"; // import ModalProvider and Modal

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <ModalProvider>
      {" "}
      {/* Wrap your application with ModalProvider */}
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/signup">
            <SignupFormModal />
          </Route>
        </Switch>
      )}
      <Modal />{" "}
      {/* Place the Modal component somewhere within the ModalProvider */}
    </ModalProvider>
  );
}

export default App;

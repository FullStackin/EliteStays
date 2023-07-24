import React from "react";
import SpotForm from "../SpotForm";
import "./CreateSpotForm.css";

const CreateSpotForm = () => {
  const spot = {
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    lat: "",
    lng: "",
    description: "",
    price: "",
  };

  return (
    <div className="create-form-wrapper">
      <SpotForm spot={spot} type={"new"} className="spot-form" />
    </div>
  );
};

export default CreateSpotForm;

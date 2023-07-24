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

  const spotImgs = {};

  return (
    <div className="-create-form-wrapper">
      <SpotForm spot={spot} type={"new"} className="spot-form-box" />
    </div>
  );
};

export default CreateSpotForm;

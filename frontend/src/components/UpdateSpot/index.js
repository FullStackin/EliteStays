import { useDispatch } from "react-redux";
import { updateSpotThunk } from "../../store/spots";
import { useModal } from "../../context/Modal";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";
import SpotForm from "../SpotForm";

const UpdateSpotForm = () => {
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spots.allSpots[spotId]);
  console.log(spot);
  return <SpotForm spot={spot} type={"update"} updateId={spotId} />;
};

export default UpdateSpotForm;

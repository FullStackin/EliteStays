import { useDispatch } from "react-redux";
import { deleteSpotThunk } from "../../store/spots";
import { useModal } from "../../context/Modal";
import "./DeleteSpot.css";

function DeleteSpot({ spot }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = (e) => {
    e.preventDefault();
    return dispatch(deleteSpotThunk(spot.id)).then(closeModal);
  };
  console.log("delete spot", spot.id);

  return (
    <div className="delete-spot-modal">
      <h1>Confirm Delete</h1>
      <h2>Are you sure you'd like to remove this spot from the listings?</h2>
      <button onClick={handleDelete}>Yes (Delete)</button>
      <button onClick={closeModal}>No (Keep Spot)</button>
    </div>
  );
}

export default DeleteSpot;

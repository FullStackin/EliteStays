import { deleteReviewThunk } from "../../store/reviews";
import { getSpotThunk } from "../../store/spots";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import "./DeleteReview.css";

function DeleteReview({ review }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  
  const handleDelete = (e) => {
    e.preventDefault();
    return dispatch(deleteReviewThunk(review)).then(closeModal);
  };

  return (
    <div className="delete-review-modal">
      <h1>Confirm Delete</h1>
      <h2>Do you confirm to deleting this review?</h2>
      <button onClick={handleDelete}>Yes (Delete)</button>
      <button onClick={closeModal}>No (Keep Review)</button>
    </div>
  );
}

export default DeleteReview;

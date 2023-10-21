import { useDispatch, useSelector } from "react-redux";
import { updateReviewThunk } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import { useParams } from "react-router-dom";
import ReviewForm from "../ReviewForm";

const UpdateReview = ({ review, spotId }) => {
  const spot = useSelector((state) => state.spots.allSpots[spotId]);
  return (
    <ReviewForm
      review={review}
      spotId={spotId}
      type={"update"}
      updateId={spotId}
    />
  );
};

export default UpdateReview;

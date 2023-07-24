// ReviewForm.js
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  createReviewThunk,
  getReviewsThunk,
  updateReviewThunk,
} from "../../store/reviews";
import "./ReviewForm.css";
import { getSpotThunk } from "../../store/spots";

function ReviewForm({ spotId, review, type, updateId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [text, setText] = useState("");
  const [stars, setStars] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === "update") {
      const newReview = {
        id: review.id,
        spotId: spotId,
        review: text,
        stars: stars,
      };
      return dispatch(updateReviewThunk(newReview))
        .then(() => dispatch(getReviewsThunk(spotId)))
        .then(() => dispatch(getSpotThunk(spotId)))
        .then(closeModal);
    } else {
      const newReview = {
        review: text,
        stars: stars,
      };
      return dispatch(createReviewThunk({ spotId, review: newReview }))
        .then(() => dispatch(getReviewsThunk(spotId)))
        .then(() => dispatch(getSpotThunk(spotId)))
        .then(closeModal);
    }
  };

  return (
    <div className="review-modal">
      <form onSubmit={handleSubmit} className="review-form">
        <h2>How was your stay?</h2>
        <textarea
          placeholder="Leave your review here"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="star-rating">
          <div
            className={stars >= 1 ? "filled" : "empty"}
            onMouseEnter={() => setStars(1)}
            onMouseLeave={() => setStars(stars)}
            onClick={() => setStars(1)}
          >
            {stars > 1 ? (
              <i className="fa-solid fa-star"></i>
            ) : (
              <i className="fa-regular fa-star"></i>
            )}
          </div>
          <div
            className={stars >= 2 ? "filled" : "empty"}
            onMouseEnter={() => setStars(2)}
            onMouseLeave={() => setStars(stars)}
            onClick={() => setStars(2)}
          >
            {stars > 1 ? (
              <i className="fa-solid fa-star"></i>
            ) : (
              <i className="fa-regular fa-star"></i>
            )}
          </div>
          <div
            className={stars >= 3 ? "filled" : "empty"}
            onMouseEnter={() => setStars(3)}
            onMouseLeave={() => setStars(stars)}
            onClick={() => setStars(3)}
          >
            {stars > 1 ? (
              <i className="fa-solid fa-star"></i>
            ) : (
              <i className="fa-regular fa-star"></i>
            )}
          </div>
          <div
            className={stars >= 4 ? "filled" : "empty"}
            onMouseEnter={() => setStars(4)}
            onMouseLeave={() => setStars(stars)}
            onClick={() => setStars(4)}
          >
            {stars > 1 ? (
              <i className="fa-solid fa-star"></i>
            ) : (
              <i className="fa-regular fa-star"></i>
            )}
          </div>
          <div
            className={stars >= 5 ? "filled" : "empty"}
            onMouseEnter={() => setStars(5)}
            onMouseLeave={() => setStars(stars)}
            onClick={() => setStars(5)}
          >
            {stars > 1 ? (
              <i className="fa-solid fa-star"></i>
            ) : (
              <i className="fa-regular fa-star"></i>
            )}
          </div>
        </div>
        <button type="submit" disabled={!stars || text.length < 6}>
          Submit Your Review
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;

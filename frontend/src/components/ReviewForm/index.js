import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useState } from "react";
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
  const [text, setText] = useState(type === "update" ? review?.review : "");
  const [stars, setStars] = useState(type === "update" ? review?.stars : "");
  const [isFormValid, setIsFormValid] = useState(true);

  const maxCharacterCount = 2000;

  const handleStarMouseEnter = (rating) => {
    setStars(rating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stars || text.trim().length === 0 || text.length > maxCharacterCount) {
      setIsFormValid(false);
      return;
    }

    setIsFormValid(true);

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
          onChange={(e) => {
            setText(e.target.value);
            setIsFormValid(true);
          }}
          maxLength={maxCharacterCount}
        />
        {text.length > maxCharacterCount && (
          <p className="error-message">
            Review should not exceed {maxCharacterCount} characters.
          </p>
        )}
        {!isFormValid && (
          <p className="error-message">
            Please provide both a rating and a review before submitting.
          </p>
        )}
        <div className="character-count">
          {text.length}/{maxCharacterCount} characters
        </div>
        <div className="star-rating">
          <div
            className={stars >= 1 ? "filled" : "empty"}
            onMouseEnter={() => handleStarMouseEnter(1)}
            onClick={() => setStars(1)}
          >
            {stars >= 1 ? (
              <i className="fa-solid fa-star"></i>
            ) : (
              <i className="fa-regular fa-star"></i>
            )}
          </div>
          <div
            className={stars >= 2 ? "filled" : "empty"}
            onMouseEnter={() => handleStarMouseEnter(2)}
            onClick={() => setStars(2)}
          >
            {stars >= 2 ? (
              <i className="fa-solid fa-star"></i>
            ) : (
              <i className="fa-regular fa-star"></i>
            )}
          </div>
          <div
            className={stars >= 3 ? "filled" : "empty"}
            onMouseEnter={() => handleStarMouseEnter(3)}
            onClick={() => setStars(3)}
          >
            {stars >= 3 ? (
              <i className="fa-solid fa-star"></i>
            ) : (
              <i className="fa-regular fa-star"></i>
            )}
          </div>
          <div
            className={stars >= 4 ? "filled" : "empty"}
            onMouseEnter={() => handleStarMouseEnter(4)}
            onClick={() => setStars(4)}
          >
            {stars >= 4 ? (
              <i className="fa-solid fa-star"></i>
            ) : (
              <i className="fa-regular fa-star"></i>
            )}
          </div>
          <div
            className={stars >= 5 ? "filled" : "empty"}
            onMouseEnter={() => handleStarMouseEnter(5)}
            onClick={() => setStars(5)}
          >
            {stars >= 5 ? (
              <i className="fa-solid fa-star"></i>
            ) : (
              <i className="fa-regular fa-star"></i>
            )}
          </div>
        </div>
        <button
          type="submit"
          disabled={
            !stars || text.length < 6 || text.length > maxCharacterCount
          }
        >
          Submit Your Review
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;

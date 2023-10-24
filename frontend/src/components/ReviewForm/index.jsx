import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import {
  createReviewThunk,
  getReviewsThunk,
  updateReviewThunk,
} from "../../store/reviews";
import { getSpotThunk } from "../../store/spots";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";

import "./ReviewForm.css";

function ReviewForm({ spotId, review, type, updateId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [text, setText] = useState(type === "update" ? review?.review : "");
  const [stars, setStars] = useState(type === "update" ? review?.stars : 0);
  const [isFormValid, setIsFormValid] = useState(false); // Initialize as false

  const maxCharacterCount = 255;

  const handleStarMouseEnter = (rating) => {
    setStars(rating);
    validateForm(rating, text);
  };

  const handleTextareaChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    validateForm(stars, newText);
  };

  const validateForm = (rating, reviewText) => {
    const isValid = rating > 0 && reviewText.trim().length > 0;
    setIsFormValid(isValid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }

    if (type === "update") {
      const newReview = {
        id: review.id,
        spotId: spotId,
        review: text,
        stars: stars,
      };
      await dispatch(updateReviewThunk(newReview));
    } else {
      const newReview = {
        review: text,
        stars: stars,
      };
      await dispatch(createReviewThunk({ spotId, review: newReview }));
    }

    dispatch(getReviewsThunk(spotId));
    dispatch(getSpotThunk(spotId));
    closeModal();
  };

  return (
    <div className="review-modal">
      <form onSubmit={handleSubmit} className="review-form">
        <h2>How was your stay?</h2>
        <textarea
          placeholder="Leave your review here"
          value={text}
          onChange={handleTextareaChange}
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
          {[1, 2, 3, 4, 5].map((rating) => (
            <div
              key={rating}
              className={stars >= rating ? "filled" : "empty"}
              onMouseEnter={() => handleStarMouseEnter(rating)}
            >
              {stars >= rating ? (
                <FontAwesomeIcon icon={solidStar} />
              ) : (
                <FontAwesomeIcon icon={regularStar} />
              )}
            </div>
          ))}
        </div>
        <button type="submit" disabled={!isFormValid}>
          Submit Your Review
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;

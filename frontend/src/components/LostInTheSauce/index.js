import "./LostInTheSauce.css";
import { RiEmotionUnhappyLine } from "react-icons/ri";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

function LostInTheSauce() {
  return (
    <div className="not-found-container">
      <div className="emoji-icon">
        <RiEmotionUnhappyLine />
      </div>
      <h2 className="not-found-heading">
        Oops! It seems you've taken a detour off the<p className="goldenBoy">Golden Path.</p>
      </h2>
      <p className="not-found-text">
        No worries, our dedicated concierge is ready to assist you.
      </p>
      <div className="button-container">
        <Link to="/" className="not-found-button">
          <FaHome /> Return to Luxury
        </Link>
      </div>
    </div>
  );
}

export default LostInTheSauce;

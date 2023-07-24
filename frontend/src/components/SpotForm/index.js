import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import { createSpotThunk, updateSpotThunk } from "../../store/spots";
import "./SpotForm.css";
import { useEffect } from "react";

function SpotForm({ spot, type, updateId }) {
  const [name, setName] = useState(spot ? spot.name : "");
  const [address, setAddress] = useState(spot ? spot.address : "");
  const [city, setCity] = useState(spot ? spot.city : "");
  const [state, setState] = useState(spot ? spot.state : "");
  const [country, setCountry] = useState(spot ? spot.country : "");
  const [lat, setLat] = useState(spot ? spot.lat : "");
  const [lng, setLng] = useState(spot ? spot.lng : "");
  const [description, setDescription] = useState(spot ? spot.description : "");
  const [price, setPrice] = useState(spot ? spot.price : "");
  const [err, setErr] = useState({});
  const [showError, setShowError] = useState(false);

  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");
  const [img3, setImg3] = useState("");
  const [img4, setImg4] = useState("");
  const [img5, setImg5] = useState("");

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const err = {};
    if (name.length < 1) err.name = "Name is required";
    if (address.length < 1) err.address = "Address is required";
    if (city.length < 1) err.city = "City is required";
    if (state.length < 1) err.state = "State is required";
    if (country.length < 1) err.country = "Country is required";
    if (description.length < 30)
      err.description = "Description needs a minimum of 30 characters";
    if (price.length < 1) err.price = "Price per night is required";
    if (isNaN(price)) err.price = "Price per night must be a number";
    if (type === "new" && img1.length < 1)
      err.img1 = "Preview image is required";
    setErr(err);
  }, [name, address, city, state, country, description, price, img1]);

  //handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(err).length > 0) {
      setShowError(true);
    } else {
      let createdSpot = {
        ...spot,
        address: address,
        city: city,
        state: state,
        country: country,
        lat: 1,
        lng: 1,
        name: name,
        description: description,
        price: price,
      };
      //add images
      const spotImgs = [];

      if (img1) spotImgs.push({ url: img1, preview: true });
      if (img2) spotImgs.push({ url: img2, preview: false });
      if (img3) spotImgs.push({ url: img3, preview: false });
      if (img4) spotImgs.push({ url: img4, preview: false });
      if (img5) spotImgs.push({ url: img5, preview: false });

      //Split between new/update
      if (type === "new") {
        const newSpot = await dispatch(
          createSpotThunk({ createdSpot, spotImgs })
        ).catch(async (res) => {
          const data = await res.json();
        });

        history.push(`/spots/${newSpot?.id}`);
      } else {
        const spot = await dispatch(updateSpotThunk({ createdSpot, spotImgs }));

        history.push(`/spots/${updateId}`);
      }
    }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="spot-form">
        <h2 className="form-title">
          {type === "new"
            ? "Construct a novel Spot"
            : "Refine your existing Spot"}
        </h2>
        <div>
          <h3>What is the location of your establishment?</h3>
          <p>
            Your esteemed guests will receive the precise address post their
            booking confirmation.
          </p>
        </div>
        <label className="form-label">
          Country: <br />
          <input
            className="form-input-inline"
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Country"
          />
          {showError && err.country && <p className="err-msg">{err.country}</p>}
        </label>
        <label className="form-label">
          Street Address: <br />
          <input
            className="form-input"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
          />
          {showError && err.address && <p className="err-msg">{err.address}</p>}
        </label>
        <div className="row">
          <label className="form-input-inline">
            City<br></br>
            <input
              className="form-input-inline"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
            />
            {showError && err.city && <p className="err-msg">{err.city}</p>}
            {showError && err.state && <p className="err-msg">{err.state}</p>}
          </label>
          <label className="form-label">
            State <br></br>
            <input
              className="form-input-inline"
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
            />
          </label>
        </div>
        <br />
        <hr />
        <div className="divider" />
        <label className="form-label">
          <h3>Furnish a comprehensive description of your spot</h3>
          <p>
            list your space's prime features, any unique amenities such as
            high-speed wifi or parking, and the charming aspects of your
            neighbourhood.
          </p>
          <textarea
            className="form-input"
            type="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please write at least 30 characters"
          />
          {showError && err.description && (
            <p className="err-msg">
              {"Description needs 30 or more characters"}
            </p>
          )}
        </label>
        <br />
        <hr />
        <label className="form-label">
          <h3>Devise a captivating title for your spot</h3>
          <p>
            Engage prospective guests with a title that emphasizes the unique
            traits of your spot.
          </p>
          <input
            className="form-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name of your spot"
          />
          {showError && err.name && (
            <p className="err-msg">{"Name is required"}</p>
          )}
        </label>
        <br />
        <hr />
        <label className="form-label">
          <h3>Establish a base price for your spot</h3>
          <p>
            A competitive pricing strategy can enhance the visibility of your
            listing and elevate its position in search results.
          </p>
          <div className="form-inline">
            <div className="price-icon">{"$ "}</div>
            <input
              className="form-input"
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price per night (USD)"
            />
          </div>
          {showError && err.price && <p className="err-msg">{err.price}</p>}
        </label>
        <br />
        <hr />
        {type === "new" && (
          <div className="image-url-wrapper">
            <label className="form-label">
              <h3>Embellish your spot with striking visuals</h3>
              <p>
                A link to at least one image is required to present your spot to
                potential guests.
              </p>
              <input
                className="form-input"
                type="url"
                value={img1}
                onChange={(e) => setImg1(e.target.value)}
                placeholder="Preview Image URL"
              />
              {showError && err.img1 && <p className="err-msg">{err.img1}</p>}
              <br />
              <br />
              <input
                className="form-input"
                type="url"
                value={img2}
                onChange={(e) => setImg2(e.target.value)}
                placeholder="Image URL"
              />
              <br />
              <br />
              <input
                className="form-input"
                type="url"
                value={img3}
                onChange={(e) => setImg3(e.target.value)}
                placeholder="Image URL"
              />
              <br />
              <br />
              <input
                className="form-input"
                type="url"
                value={img4}
                onChange={(e) => setImg4(e.target.value)}
                placeholder="Image URL"
              />
              <br />
              <br />
              <input
                className="form-input"
                type="url"
                value={img5}
                onChange={(e) => setImg5(e.target.value)}
                placeholder="Image URL"
              />
            </label>
          </div>
        )}
        <br />
        <br />
        <button disabled={false} type="submit" className="form-submit">
          Establish Spot
        </button>
      </form>
    </div>
  );
}

export default SpotForm;

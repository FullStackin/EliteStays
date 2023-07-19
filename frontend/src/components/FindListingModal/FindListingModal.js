import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { findSpotsThunk } from "../../store/spot";
import { useModal } from "../../context/Modal";
import "./FindListingModal.css";

export default function FindListingModal() {
  const [minLat, setMinLat] = useState("");
  const [maxLat, setMaxLat] = useState("");
  const [minLng, setMinLng] = useState("");
  const [maxLng, setMaxLng] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [name, setName] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    // const query = `?minLat=${minLat}&maxLat=${maxLat}&minLng=${minLng}&maxLng=${maxLng}&minPrice=${minPrice}&maxPrice=${maxPrice}&name=${(`%${name}%`)}`
    const queryArr = [];

    if (minLat) queryArr.push(`minLat=${minLat}`);
    if (maxLat) queryArr.push(`maxLat=${maxLat}`);
    if (minLng) queryArr.push(`minLng=${minLng}`);
    if (maxLng) queryArr.push(`maxLng=${maxLng}`);
    if (minPrice) queryArr.push(`minPrice=${minPrice}`);
    if (maxPrice) queryArr.push(`maxPrice=${maxPrice}`);
    if (name) queryArr.push(`name=${`%${name}%`}`);
    if (checkInDate) queryArr.push(`startDate=${checkInDate}`);
    if (checkOutDate) queryArr.push(`endDate=${checkOutDate}`);

    const query = queryArr.join("&");

    console.log("qurey in FindListingModal: ", query);

    const spotResults = await dispatch(findSpotsThunk(query));

    // console.log("spotResults in FindListingModal: ", spotResults);

    if (spotResults.errors) {
      setErrors(spotResults.errors);
      console.log("errors in FindListingModal: ", errors);
    } else {
      console.log("query in FindListingModal", query);
      history.push(`/spots/query`);
      // <Find Listing query={query} />
      closeModal();
    }

    setMinLat("");
    setMaxLat("");
    setMinLng("");
    setMaxLng("");
    setMinPrice("");
    setMaxPrice("");
    setName("");
    setCheckInDate("");
    setCheckOutDate("");
  };

  return (
    <>
      <form id="search-spot-form" onSubmit={handleSubmit}>
        <h1>Search Listing</h1>
        <div className="search-item-div">
          <h4>Search By Listing Name</h4>
          <label>
            {/* <span>
                    Spot Name
                </span> */}
            <input
              type="text"
              placeholder="Please enter the spot name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="search-input"
            />
          </label>
        </div>
        <div className="search-item-div">
          <h4>Search By Price Range</h4>
          <div className="search-criteria-div">
            <label>
              <span>Minimum price</span>
              <input
                type="number"
                placeholder="minimum price"
                step="any"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="search-input"
              />
            </label>
            <label>
              <span>Maximum Price</span>
              <input
                type="number"
                placeholder="maximum price"
                step="any"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="search-input"
              />
            </label>
          </div>
        </div>
        <div className="search-item-div">
          <h4>Search By Preferred Schedule</h4>
          <div className="search-criteria-div">
            <label>
              <span>Preferred Check-In Date</span>
              <input
                type="date"
                placeholder="Please enter prefer check-in date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="search-input"
              />
            </label>
            <label>
              <span>Preferred Check Out Date</span>
              <input
                type="date"
                placeholder="Please enter prefer check-out date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="search-input"
              />
            </label>
          </div>
        </div>
        <div className="search-item-div">
          <h4>Search by Latitude Range</h4>
          <div className="search-criteria-div">
            <label>
              <span>Minimum Latitude</span>
              <input
                type="number"
                placeholder="minimum latitude"
                step="any"
                value={minLat}
                onChange={(e) => setMinLat(e.target.value)}
                className="search-input"
              />
            </label>
            <label>
              <span>Maximum Latitude</span>
              <input
                type="number"
                placeholder="maximum latitude"
                step="any"
                value={maxLat}
                onChange={(e) => setMaxLat(e.target.value)}
                className="search-input"
              />
            </label>
          </div>
        </div>
        <div className="search-item-div">
          <h4>Search By Longitude Range</h4>
          <div className="search-criteria-div">
            <label>
              <span>Minimum Longitude</span>
              <input
                type="number"
                placeholder="minimum longitude"
                step="any"
                value={minLng}
                onChange={(e) => setMinLng(e.target.value)}
                className="search-input"
              />
            </label>
            <label>
              <span>Maximum Longitude</span>
              <input
                type="number"
                placeholder="maximum longitude"
                step="any"
                value={maxLng}
                onChange={(e) => setMaxLng(e.target.value)}
                className="search-input"
              />
            </label>
          </div>
        </div>

        <button type="submit" id="search-button">
          Search
        </button>
      </form>
    </>
  );
}

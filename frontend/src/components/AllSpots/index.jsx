import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpotsThunk } from "../../store/spots";
import "./AllSpots.css";
import AllSpotsItem from "../AllSpotsItem";

function AllSpots() {
  const allSpots = Object.values(
    useSelector((state) => state.spots.allSpots)
  ).reverse();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllSpotsThunk());
  }, [dispatch]);

  return (
    <div className="page-container">
      <div className="all-spots">
        {allSpots.map((spot) => (
          <AllSpotsItem spot={spot} key={spot.id} />
        ))}
      </div>
    </div>
  );
}

export default AllSpots;

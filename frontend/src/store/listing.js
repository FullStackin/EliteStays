import { csrfFetch } from "./csrf";

const SHOW_ALL_LISTING = "listings/SHOW_ALL_LISTINGS";
const FETCH_SINGLE_LISTING = "listings/FETCH_SINGLE_LISTING";
const MODIFY_LISTING = "listings/MODIFY_LISTING";
const REMOVE_LISTING = "listings/REMOVE_LISTING";
const FETCH_USER_LISTINGS = "listings/FETCH_USER_LISTINGS";
const RESET_LISTING = "listings/RESET_LISTING";
const FIND_LISTINGS = "listings/FIND_LISTINGS";

export const fetchAllListingsAction = (listings) => ({
  type: SHOW_ALL_LISTING,
  listings,
});

export const fetchSingleListingAction = (listing) => ({
  type: FETCH_SINGLE_LISTING,
  listing,
});

export const modifyListingAction = (listing) => ({
  type: MODIFY_LISTING,
  listing,
});

export const removeListingAction = (listingId) => ({
  type: REMOVE_LISTING,
  listingId,
});

export const fetchUserListingsAction = (listings) => ({
  type: FETCH_USER_LISTINGS,
  listings,
});

export const resetListingAction = () => ({
  type: RESET_LISTING,
});

export const findListingsAction = (listings) => ({
  type: FIND_LISTINGS,
  listings,
});

export const fetchAllListingThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/listings");

  if (res.ok) {
    const listings = await res.json();
    dispatch(fetchAllListingsAction(listings));
    return listings;
  }
};

export const fetchSingleListingThunk = (listingId) => async (dispatch) => {
  const res = await csrfFetch(`/api/listings/${listingId}`);

  if (res.ok) {
    const listingDetails = await res.json();
    dispatch(fetchSingleListingAction(listingDetails));
    return listingDetails;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const createListingThunk =
  (listing, imagesArray, owner) => async (dispatch) => {
    try {
      const res = await csrfFetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listing),
      });

      if (res.ok) {
        const newListing = await res.json();

        const finalImageArray = [];

        for (let image of imagesArray) {
          image.listingId = newListing.id;
          const imageRes = await csrfFetch(
            `/api/listings/${newListing.id}/images`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(image),
            }
          );

          if (imageRes.ok) {
            const newImage = await imageRes.json();
            finalImageArray.push(newImage);
          }
        }
        newListing.ListingImages = finalImageArray;
        newListing.owner = owner;

        dispatch(fetchSingleListingAction(newListing));
        return newListing;
      }
    } catch (err) {
      const error = await err.json();
      return error;
    }
  };

export const modifyListingThunk = (listing) => async (dispatch) => {
  const res = await csrfFetch(`/api/listings/${listing.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(listing),
  });

  if (res.ok) {
    const editedListing = await res.json();

    dispatch(fetchSingleListingAction(editedListing));
    return editedListing;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const removeListingThunk = (listingId) => async (dispatch) => {
  const res = await csrfFetch(`/api/listings/${listingId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    dispatch(removeListingAction(listingId));
    return;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const fetchUserListingsThunk = () => async (dispatch) => {
  const res = await csrfFetch(`/api/listings/current`);

  if (res.ok) {
    const userListings = await res.json();
    dispatch(fetchAllListingsAction(userListings));
    return userListings;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const findListingThunk = (query) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/listings?${query}`);

    console.log("query in thunk: ", `/api/listings/${query}`);

    if (res.ok) {
      const listings = await res.json();
      console.log("listings in listing Thunk: ", listings);
      dispatch(findListingsAction(listings));
      return listings;
    }
  } catch (err) {
    const errors = await err.json();
    console.log("errors in listing reducer: ", errors);
    return errors;
  }
};

const initialState = {
  allState: {},
  singleListing: {},
  searchListing: {},
};

const listingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_ALL_LISTING: {
      const newState = {
        ...state,
        allState: {},
        singleListing: {},
        searchListing: {},
      };
      action.listings.Listings.forEach((listing) => {
        newState.allState[listing.id] = listing;
      });
      return newState;
    }
    case FETCH_SINGLE_LISTING: {
      const listingState = {
        ...state,
        allState: { ...state.allState },
        singleListing: { [action.listing.id]: action.listing },
        searchListing: {},
      };
      return listingState;
    }
    case MODIFY_LISTING: {
      const listingState = {
        ...state,
        singleListing: { [action.listing.id]: action.listing },
      };
      return listingState; // Return the updated state directly
    }
    case REMOVE_LISTING: {
      const listingsState = {
        ...state,
        allState: { ...state.allState },
        singleListing: {},
        searchListing: {},
      };
      delete listingsState.allState[action.listingId];
      return listingsState;
    }
    case FETCH_USER_LISTINGS: {
      const listingsState = {
        ...state,
        allState: {},
        singleListing: {},
        searchListing: {},
      };
      action.listings.listings.forEach((listing) => {
        listingsState.allState[listing.id] = listing;
      });
      return listingsState;
    }
    case FIND_LISTINGS: {
      console.log("Search Listing in reducer: ", action.listings);
      const listingState = {
        ...state,
        allState: { ...state.allState },
        singleListing: { ...state.singleListing },
        searchListing: {},
      };
      action.listings.listings.forEach((listing) => {
        listingState.searchListing[listing.id] = listing;
      });

      return listingState;
    }
    case RESET_LISTING: {
      const emptyState = {
        ...state,
        allState: {},
        singleListing: {},
        searchListing: { ...state.searchListing },
      };
      return emptyState;
    }
    default:
      return state;
  }
};

export default listingsReducer;

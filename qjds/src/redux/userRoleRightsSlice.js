import { createSlice } from "@reduxjs/toolkit";
import { API_URL } from "../app/API_URL";
import Axios from "axios";

const initialRoleRights = { rights: [] };

export const callTypes = {
  list: "list",
  action: "action",
};

export const { reducer: rightsReducer, actions } = createSlice({
  name: "roleRights",
  initialState: initialRoleRights,
  reducers: {
    // getroleRights
    rightsFetched: (state, action) => {
      state.rights = [...action.payload];
    },
  },
});

export const fetchRights = (role) => (dispatch) => {
  return Axios.get(API_URL + "role/" + role)
    .then((response) => {
      dispatch(actions.rightsFetched(response.data.rights));
    })
    .catch((error) => {
      alert("some error occured");     
    });
};

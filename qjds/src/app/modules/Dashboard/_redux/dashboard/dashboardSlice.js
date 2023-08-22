import { createSlice } from "@reduxjs/toolkit";

const initialdashboardState = {
  contracts:null,
  quotes:null
};
export const callTypes = {
  list: "list",
  action: "action",
  
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: initialdashboardState,
  reducers: {
    catchError: (state, action) => {
      state.error = `${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },
    startCall: (state, action) => {
      state.error = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },
    // getcontractstats
    contractStatsFetched: (state, action) => {
      console.log(action.payload,"action aapyload")
      state.actionsLoading = false;
      state.contracts = action.payload;
      state.error = null;
    },
    
    // getcontractstats
    quotesStatsFetched: (state, action) => {
      state.actionsLoading = false;
      state.quotes = action.payload;
      state.error = null;
    },
  },
});

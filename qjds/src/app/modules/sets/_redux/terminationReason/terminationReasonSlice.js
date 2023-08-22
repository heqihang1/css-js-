import { createSlice } from "@reduxjs/toolkit";

const initialpaymentMethodsState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: null,
  paymentMethodForEdit: undefined,
  lastError: null,
};
export const callTypes = {
  list: "list",
  action: "action",
};

export const terminationReasonSlice = createSlice({
  name: "terminationReason",
  initialState: initialpaymentMethodsState,
  reducers: {
    catchError: (state, action) => {
      state.error = `${action.type}: ${action.payload.error}`;
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
    // findpaymentMethods
    findAllterminationReasons: (state, action) => {
      const { totalCount, entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
    },
    terminationReasonFetched: (state, action) => {
      state.actionsLoading = false;
      state.districtForEdit = action.payload.districtForEdit;
      state.error = null;
    },
    // findterms_conditions
    terminationReasonsFetched: (state, action) => {
      const { totalCount, entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
    },
    terminationReasonDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el._id !== action.payload.id
      );
    },
  },
});

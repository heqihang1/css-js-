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

export const rejectReasonSlice = createSlice({
  name: "rejectReason",
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
    findAllrejectReasons: (state, action) => {
      const { totalCount, entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
    },
    rejectReasonFetched: (state, action) => {
      state.actionsLoading = false;
      state.districtForEdit = action.payload.districtForEdit;
      state.error = null;
    },
    // findterms_conditions
    rejectReasonsFetched: (state, action) => {
      const { totalCount, entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
    },
    rejectReasonDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el._id !== action.payload.id
      );
    },
  },
});

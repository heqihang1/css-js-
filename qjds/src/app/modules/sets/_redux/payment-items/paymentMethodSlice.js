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

export const paymentMethodsSlice = createSlice({
  name: "paymentMethods",
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
    // getpaymentMethodById
    paymentMethodFetched: (state, action) => {
      state.actionsLoading = false;
      state.paymentMethodForEdit = action.payload.paymentMethodForEdit;
      state.error = null;
    },
    // findpaymentMethods
    paymentMethodsFetched: (state, action) => {
      const { totalCount, entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
    },
    // createpaymentMethod
    paymentMethodCreated: (state, action) => {
      state.ewactionsLoading = false;
      state.error = null;
      state.entities.push(action.payload.paymentMethod);
    },
    // updatepaymentMethod
    paymentMethodUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map((entity) => {
        if (entity._id === action.payload.paymentMethod.id) {
          return action.payload.paymentMethod;
        }
        return entity;
      });
    },
    // deletepaymentMethod
    paymentMethodDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el._id !== action.payload.id
      );
    },
    // deletepaymentMethods
    paymentMethodsDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => !action.payload.ids.includes(el.id)
      );
    },
    // paymentMethodsUpdateState
    paymentMethodsStatusUpdated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      const { ids, status } = action.payload;
      state.entities = state.entities.map((entity) => {
        if (ids.findIndex((id) => id === entity.id) > -1) {
          entity.status = status;
        }
        return entity;
      });
    },
  },
});

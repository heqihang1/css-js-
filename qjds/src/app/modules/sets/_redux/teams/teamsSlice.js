import { createSlice } from "@reduxjs/toolkit";

const initialterms_conditionsState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: null,
  teamForEdit: undefined,
  lastError: null,
};
export const callTypes = {
  list: "list",
  action: "action",
};

export const teamSlice = createSlice({
  name: "teams",
  initialState: initialterms_conditionsState,
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
    // getterms_conditionById
    teamFetched: (state, action) => {
      state.actionsLoading = false;
      state.teamForEdit = action.payload.teamForEdit;
      state.error = null;
    },
    // findterms_conditions
    teamsFetched: (state, action) => {
      const { totalCount, entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
    },
    // createterms_condition
    terms_conditionCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.push(action.payload.terms_condition);
    },
    // updateterms_condition
    terms_conditionUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map((entity) => {
        if (entity._id === action.payload.terms_condition.id) {
          return action.payload.terms_condition;
        }
        return entity;
      });
    },
    // deleteterms_condition
    teamDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el._id !== action.payload.id
      );
    },
    // deleteterms_conditions
    terms_conditionsDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => !action.payload.ids.includes(el._id)
      );
    },
    // terms_conditionsUpdateState
    terms_conditionsStatusUpdated: (state, action) => {
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
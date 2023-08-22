import { createSlice } from "@reduxjs/toolkit";

const initialrolesState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: [],
  roleForEdit: undefined,
  lastError: null,
};
export const callTypes = {
  list: "list",
  action: "action",
};

export const rolesSlice = createSlice({
  name: "roles",
  initialState: initialrolesState,
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
    // getroleById  通过 id获取角色
    roleFetched: (state, action) => {
      state.actionsLoading = false;
      state.roleForEdit = action.payload.roleForEdit;
      state.error = null;
    },
    // findroles   找到角色
    rolesFetched: (state, action) => {
      const { totalCount, entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
    },
    // createrole  创建角色
    roleCreated: (state, action) => {
      state.ewactionsLoading = false;
      state.error = null;
      state.entities.push(action.payload.role);
    },
    // updaterole  更新角色
    roleUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map((entity) => {
        if (entity._id === action.payload.role.id) {
          return action.payload.role;
        }
        return entity;
      });
    },
    // deleterole  删除角色
    roleDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el._id !== action.payload.id
      );
    },
    // deleteroles  按 id删除角色
    rolesDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => !action.payload.ids.includes(el.id)
      );
    },
    // rolesUpdateState  更新状态
    rolesStatusUpdated: (state, action) => {
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

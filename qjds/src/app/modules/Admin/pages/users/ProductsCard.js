// users组件
import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { isEqual, isFunction } from "lodash";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import { Table } from "../../../../components/Table";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as uiHelpers from "./ProductsUIHelpers";
import * as actions from "../../_redux/users/usersActions";
import { generateColumns } from "../../../../utils/admin/users/tableDeps";
import { checkPermission } from "../../../../utils/utils";

export function ProductsCard(props) {
  const history = useHistory();

  const columns = generateColumns(history);
  const initialFilter = {
    filter: {},
    sortOrder: "desc", // asc||desc
    sortField: "createdAt",
    pageNumber: 1,
    pageSize: 10,
    status: "active"
  };
  const filter = () => {
    const initialFilter = {
      filter: {},
      sortOrder: "desc", // asc||desc
      sortField: "createdAt",
      pageNumber: 1,
      pageSize: 10,
      status: "active"
    };
    return initialFilter;
  };

  const [queryParams, setQueryParamsBase] = useState(filter());

  const setQueryParams = useCallback((nextQueryParams) => {
    setQueryParamsBase((prevQueryParams) => {
      if (isFunction(nextQueryParams)) {
        nextQueryParams = nextQueryParams(prevQueryParams);
      }
      if (isEqual(prevQueryParams, nextQueryParams)) {
        return prevQueryParams;
      }
      return nextQueryParams;
    });
  }, []);

  const { currentState } = useSelector(
    (state) => ({ currentState: state.users }),
    shallowEqual
  );
  
  // Products Redux state
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.findusers(queryParams));
  }, [dispatch, queryParams]);

  useEffect(() => {
    if (props.refreshPage) {
      dispatch(actions.findusers(queryParams));
    }
  }, [props.refreshPage])

  const { totalCount, entities, listLoading } = currentState;

  // Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: queryParams.pageSize,
    page: queryParams.pageNumber,
  };

  return (
    <Card>
      <CardHeader title="Users list">
        <CardHeaderToolbar>
          {checkPermission("USER", "can_add") && (
            <button
              type="button"
              className="btn btn-primary ml-2"
              onClick={() => history.push("/admin/users/new")}
            >
              New User
            </button>
          )}
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <Table
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          columns={columns}
          showUserStatusFilter={true}
          listLoading={listLoading}
          entities={entities}
          handleSearch={(query) => {
            setQueryParamsBase({
              ...queryParams,
              search: query,
              pageNumber: 1,
            });
          }}
          handleChangeUserStatus={(e) => {
            setQueryParamsBase({
              ...queryParams,
              status: e?.value,
              pageNumber: 1,
            });
          }}
          paginationOptions={paginationOptions}
          typeFilter={true}
        />
      </CardBody>
    </Card>
  );
}

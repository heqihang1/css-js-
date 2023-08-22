// roles组件
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
import * as actions from "../../_redux/roles/rolesActions";
import { generateColumns } from "../../../../utils/admin/roles/tableDeps";
import { checkPermission } from "../../../../utils/utils";

export function ProductsCard() {
  const history = useHistory();

  const columns = generateColumns(history);

  const filter = () => {
    const initialFilter = {
      filter: {},
      sortOrder: "desc", // asc||desc
      sortField: "createdAt",
      pageNumber: 1,
      pageSize: 10,
      search: ''
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
    (state) => ({ currentState: state.roles }),
    shallowEqual
  );

  // Products Redux state  产品还原状态
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.findroles(queryParams));
  }, [dispatch, queryParams]);

  const { totalCount, entities, listLoading } = currentState;

  // Table pagination properties  表格分页属性
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: queryParams.pageSize,
    page: queryParams.pageNumber,
  };

  return (
    <Card>
      <CardHeader title="Roles list">
        <CardHeaderToolbar>
          {checkPermission('ROLE', 'can_add') && (
            <button
              type="button"
              className="btn btn-primary ml-2"
              onClick={() => history.push("/admin/roles/new")}
            >
              New Role
            </button>
          )}
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <Table
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          columns={columns}
          listLoading={listLoading}
          entities={entities}
          handleSearch={(query) =>
            setQueryParamsBase({ ...queryParams, search: query, pageNumber: 1 })
          }
          paginationOptions={paginationOptions}
          typeFilter
        />
      </CardBody>
    </Card>
  );
}

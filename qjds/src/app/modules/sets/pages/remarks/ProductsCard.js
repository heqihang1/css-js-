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
import * as actions from "../../_redux/remarks/remarksActions";
import { generateColumns } from "../../../../utils/sets/remarks/tableDeps";
import { searchData } from '../../../../utils/utils'
import { checkPermission } from "../../../../utils/utils";

export function ProductsCard(props) {
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
    (state) => ({ currentState: state.remarks }),
    shallowEqual
  );
  // Products Redux state
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.fetchRemarks(queryParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams, dispatch]);
  const { totalCount, entities, listLoading } = currentState;
  const [filterData, setFilterData] = useState({ entities: [], totalCount: 0 });

  useEffect(() => {
    setFilterData({ entities, totalCount });
  }, [entities]);
  // Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: queryParams.pageSize,
    page: queryParams.pageNumber,
  };

  useEffect(() => {
    if (props.refreshPage) {
      dispatch(actions.fetchRemarks(queryParams));
    }
  }, [props.refreshPage])

  return (
    <Card>
      <CardHeader title="Remarks list">
        <CardHeaderToolbar>
        {checkPermission('REMARK', 'can_add') && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => history.push("/sets/remarks/new")}
          >
            New Remark
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
          entities={filterData.entities}
          handleSearch={(query) =>
            setQueryParamsBase({...queryParams, search: query, pageNumber: 1})            
          }
          paginationOptions={paginationOptions}
          typeFilter
        />
      </CardBody>
    </Card>
  );
}

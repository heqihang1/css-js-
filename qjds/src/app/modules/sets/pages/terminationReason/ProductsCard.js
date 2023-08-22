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
import * as actions from "../../_redux/terminationReason/terminationReasonActions";
import { GenerateColumns } from "../../../../utils/sets/terminationReason/tableDeps";
import { searchData } from "../../../../utils/utils";
import { checkPermission } from "../../../../utils/utils";

export function ProductsCard(props) {
  const history = useHistory();

  let refreshList = () => {
    dispatch(actions.fetchTerminationReasons(queryParams));
  };

  const columns = GenerateColumns(history, true, { refreshList });
  const filter = () => {
    const initialFilter = {
      filter: {},
      sortOrder: "desc", // asc||desc
      sortField: "createdAt",
      pageNumber: 1,
      pageSize: 10,
      search: "",
      status: true
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
    (state) => ({ currentState: state.terminationReasons }),
    shallowEqual
  );

  // Products Redux state
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.fetchTerminationReasons(queryParams));
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
      dispatch(actions.fetchTerminationReasons(queryParams));
    }
  }, [props.refreshPage])

  return (
    <Card>
      <CardHeader title="Termination Reason">
        <CardHeaderToolbar>
          {checkPermission("TERMINATION_REASON", "can_add") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => history.push("/sets/termination-reason/new")}
            >
              New Termination Reason
            </button>
          )}
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <Table
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          columns={columns}
          showCommSectorStatusFilter={true}
          listLoading={listLoading}
          entities={filterData.entities}
          handleSearch={(query) =>
            setQueryParamsBase({ ...queryParams, search: query, pageNumber: 1 })
          }
          handleChangeCommSectorStatus={(e) => {
            setQueryParamsBase({
              ...queryParams,
              status: e?.value,
              pageNumber: 1,
            });
          }}
          paginationOptions={paginationOptions}
          typeFilter
        />
      </CardBody>
    </Card>
  );
}

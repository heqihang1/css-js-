import React, { useEffect, useState, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { isEqual, isFunction } from "lodash";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { Table } from "../../../../../components/Table";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as uiHelpers from "./../ProductsUIHelpers";
import * as actions from "../../../../jobs/_redux/job/jobActions";
import { generateColumns } from "../../../../../utils/teamJobs/tableDeps";

const JobsList = () => {
  const { id } = useParams();
  const history = useHistory();

  const filter = () => {
    const initialFilter = {
      filter: `{}`,
      sortOrder: "desc", // asc||desc
      sortField: "createdAt",
      pageNumber: 1,
      pageSize: 10,
      search: "",
    };

    // for (let col in columns) {
    //   initialFilter.filter[col.dataField] = "";
    // }

    return initialFilter;
  };

  const columns = generateColumns();

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

  let path = history.location.pathname.split("/");
  let pathName = path[path.length - 1];
  const [urlPathName, setUrlPathName] = useState(pathName);
  const { currentState } = useSelector(
    (state) => ({ currentState: state.job }),
    shallowEqual
  );
  // Products Redux state
  const dispatch = useDispatch();

  useEffect(() => {
    setUrlPathName(pathName);
    const queryParamsEdited = JSON.parse(JSON.stringify(queryParams));
    if (pathName != urlPathName) {
      queryParamsEdited.pageNumber = 1;
    }
    switch (pathName) {
      case "all":
        dispatch(actions.fetchJobsTeam(id, queryParamsEdited));
        break;
      default:
        dispatch(actions.fetchJobsTeam(id, queryParamsEdited));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams, dispatch, pathName]);
  const { totalCount, entities, listLoading } = currentState;

  // Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: queryParams.pageSize,
    page: queryParams.pageNumber,
  };
  const [filterData, setFilterData] = useState({ entities: [], totalCount: 0 });
  useEffect(() => {
    setFilterData({ entities, totalCount });
  }, [entities]);

  return (
    <Card>
      <CardHeader title="Jobs list">
        <CardHeaderToolbar></CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <Table
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          columns={columns}
          listLoading={listLoading}
          entities={filterData.entities}
          handleSearch={(query) =>
            setQueryParamsBase({ ...queryParams, search: query, pageNumber: 1 })
          }
          paginationOptions={paginationOptions}
          typeFilter={true}
        />
      </CardBody>
    </Card>
  );
};
export default JobsList;

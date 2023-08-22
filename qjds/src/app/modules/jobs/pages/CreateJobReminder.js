import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { isEqual, isFunction } from "lodash";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../_metronic/_partials/controls";
import { Table } from "../../../components/Table";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as uiHelpers from "./ProductsUIHelpers";
import * as actions from "../../contracts/_redux/contracts/contractsActions";
import { generateColumns } from "../../../utils/jobs/createJobReminder";
import { useIntl } from "react-intl";
import SuccessErrorAlert from "../../../components/SuccessErrorAlert";

const CreateJobReminder = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  const history = useHistory();
  const intl = useIntl();

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [contractConfirm, setContractConfirm] = useState({});
  const [uploadDocumentModel, setUploadDocumentModel] = useState(false);
  const [isSuccess, setisSuccess] = useState({ success: 0, message: "" });

  const columns = generateColumns(history, true, {});
  const initialFilter = {
    filter: {},
    sortOrder: "desc", // asc||desc
    sortField: "createdAt",
    pageNumber: 1,
    pageSize: 10,
    search: "",
  };
  const filter = () => {
    const initialFilter = {
      filter: params.next_reminder_month
        ? { next_remind_month: params.next_reminder_month }
        : "",
      sortOrder: "desc", // asc||desc
      sortField: "createdAt",
      pageNumber: 1,
      pageSize: 10,
      search: "",
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
    (state) => ({ currentState: state.contracts }),
    shallowEqual
  );
  // Products Redux state
  const dispatch = useDispatch();
  let path = history.location.pathname.split("/");
  let pathName = path[path.length - 1];

  useEffect(() => {
    dispatch(actions.findconfirmedcontracts(queryParams));
  }, [queryParams, dispatch, pathName]);

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

  return (
    <>
      {isSuccess.success !== 0 && (
        <SuccessErrorAlert isSuccess={isSuccess} setisSuccess={setisSuccess} />
      )}
      <Card>
        <CardHeader title="Create Job Reminder">
          <CardHeaderToolbar></CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <Table
            queryParams={queryParams}
            setQueryParams={setQueryParams}
            columns={columns}
            listLoading={listLoading}
            entities={filterData.entities}
            paginationOptions={paginationOptions}
            showNextReminderFilter={true}
            handleSearch={(query) =>
              setQueryParamsBase({
                ...queryParams,
                search: query,
                pageNumber: 1,
              })
            }
            handleChangeMonth={(e) => {
              setQueryParamsBase({
                ...queryParams,
                filter:
                  e.target.value !== ""
                    ? `{"next_remind_month": "${e.target.value}"}`
                    : {},
                pageNumber: 1,
              });
            }}
            typeFilter={true}
          />
        </CardBody>
      </Card>
    </>
  );
};

export default CreateJobReminder;

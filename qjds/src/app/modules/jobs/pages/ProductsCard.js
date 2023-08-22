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
import * as actions from "../_redux/job/jobActions";
import { generateColumns } from "../../../utils/jobs/tableDeps";
import { jobStatuses } from "../../jobs/partials/statuses";
import ReScheduleModal from "./ReScheduleModal";
import CancelOrderModel from "./CancelOrderModel";
import UploadDocumentModal from "./UploadDocumentModal";
import * as districtActions from "../../sets/_redux/districts/districtsActions";

export function ProductsCard() {
  const history = useHistory();

  const filter = () => {
    const initialFilter = {
      filter: {},
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

  let rescheduleJobOrder = (id) => {
    let job = entities.find((entity) => entity._id === id);
    setJobData(job);
    setIsReScheduleDialogOpen(true);
  };

  let cancelJobOrder = (id) => {
    let job = entities.find((entity) => entity._id === id);
    setJobData(job);
    setIsCancelDialogOpen(true);
  };

  let uploadDocument = (id, flag) => {
    let job = entities.find((entity) => entity._id === id);
    setJobData(job);
    setIsFinishJobOrder(flag)
    setUploadDocumentModel(true);
  };

  const [isReScheduleDialogOpen, setIsReScheduleDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [jobData, setJobData] = useState({});
  const [uploadDocumentModel, setUploadDocumentModel] = useState(false);
  const [isFinishJobOrder, setIsFinishJobOrder] = useState(false);

  const columns = generateColumns(history, true, {
    rescheduleJobOrder: rescheduleJobOrder,
    cancelJobOrder: cancelJobOrder,
    uploadDocument: uploadDocument,
  });

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

  // const { currentState } = useSelector(
  //   (state) => ({ currentState: state.quotations }),
  //   shallowEqual
  // );
  let path = history.location.pathname.split("/");
  let pathName = path[path.length - 1];
  const [urlPathName, setUrlPathName] = useState(pathName);
  const { currentState, districts } = useSelector(
    (state) => ({
      currentState: state.job,
      districts: state.districts.entities || [],
    }),
    shallowEqual
  );

  const districtOptions = districts?.map((x) => {
    return {
      label: x.district_eng_name,
      value: x.district_eng_name,
    };
  });

  // Products Redux state
  const dispatch = useDispatch();

  useEffect(() => {
    setUrlPathName(pathName);
    const queryParamsEdited = JSON.parse(JSON.stringify(queryParams));
    if (pathName != urlPathName) {
      queryParamsEdited.pageNumber = 1;
    }
    // jobStatuses.PENDING
    switch (pathName) {
      case "all":
        dispatch(
          actions.fetchJobs({
            ...queryParamsEdited,
            filter: {},
          })
        );
        break;
      case "pending":
        dispatch(
          actions.fetchJobs({
            ...queryParamsEdited,
            filter: {
              status: jobStatuses.PENDING,
            },
          })
        );
        break;
      case "waiting-arragement":
        dispatch(
          actions.fetchJobs({
            ...queryParamsEdited,
            filter: {
              status: jobStatuses.APPROVED,
            },
          })
        );
        break;
      case "cancelled":
        dispatch(
          actions.fetchJobs({
            ...queryParamsEdited,
            filter: {
              status: jobStatuses.CANCELLED,
            },
          })
        );
        break;
      case "rejected":
        dispatch(
          actions.fetchJobs({
            ...queryParamsEdited,
            filter: {
              status: jobStatuses.REJECTED,
            },
          })
        );
        break;
      case "arraged-job":
        dispatch(
          actions.fetchJobs({
            ...queryParamsEdited,
            filter: {
              status: {
                $in: ["In Progress", jobStatuses.ARRAGED],
              },
            },
          })
        );
        break;
      case "finished":
        dispatch(
          actions.fetchJobs({
            ...queryParamsEdited,
            filter: {
              status: jobStatuses.FINISHED,
            },
          })
        );
        break;
      default:
        dispatch(actions.fetchJobs(queryParamsEdited));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams, dispatch, pathName]);

  useEffect(() => {
    dispatch(districtActions.findAllDistrictsList());
  }, []);

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
      <ReScheduleModal
        show={isReScheduleDialogOpen}
        doc={jobData}
        onHide={() => setIsReScheduleDialogOpen(false)}
      />
      <CancelOrderModel
        show={isCancelDialogOpen}
        doc={jobData}
        onHide={() => setIsCancelDialogOpen(false)}
      />

      <UploadDocumentModal
        show={uploadDocumentModel}
        doc={jobData}
        isFinishJobOrder={isFinishJobOrder}
        onHide={() => setUploadDocumentModel(false)}
        onSuccess={() => history.push('/jobs/all')}
      />

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
          showDistrictFilter={true}
          districts={districtOptions}
          handleSearch={(query) =>
            setQueryParamsBase({ ...queryParams, search: query, pageNumber: 1 })
          }
          handleChangeDistrict={(e) => {
            console.log("hereeee", e);
            setQueryParamsBase({
              ...queryParams,
              district: e?.value,
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

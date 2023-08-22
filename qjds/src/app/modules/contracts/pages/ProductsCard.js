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
import * as actions from "../_redux/contracts/contractsActions";
import { GenerateColumns } from "../../../utils/contracts/tableDeps";
import { ProductDeleteDialog } from "./product-delete/ProductDelete";
import ConfirmModal from "./ConfirmModal";
import UploadDocumentModal from "./UploadDocumentModal";
import { checkPermission } from "../../../utils/utils";
import { searchData } from "../../../utils/utils";
import { useIntl } from "react-intl";
import SuccessErrorAlert from "../../../components/SuccessErrorAlert";
import RejectModal from "./RejectModal";
import {
  approveSpecialEdit, 
  rejectSpecialEdit
} from "../_redux/contracts/contractsCrud";
export function ProductsCard() {
  const history = useHistory();
  const intl = useIntl();

  let confirmContract = (id) => {
    let contract = entities.find((entity) => entity._id === id);
    setContractConfirm(contract);
    setIsConfirmDialogOpen(true);
  };

  let uploadDocument = (id) => {
    let contract = entities.find((entity) => entity._id === id);
    setContractConfirm(contract);
    setUploadDocumentModel(true);
  };

  let deleteContract = (id) => {
    let contract = entities.find((entity) => entity._id === id);
    setContractDelete(contract);
    setIsDeleteDialogOpen(true);
  };

  let rejectContract = (id) => {
    let contract = entities.find((entity) => entity._id === id);
    setContractConfirm(contract);
    setIsRejectDialogOpen(true);
  };
  let approveT = async (id) => {
    await approveSpecialEdit(id)
      .then((res) => {
        setisSuccess({
          success: 2,
          message: "Contract approved successfully",
        });
        setTimeout(() => {
          setisSuccess({ success: 0, message: "" });
        }, 3000);
        dispatch(actions.findspecialpendingcontracts(queryParams));
      })
      .catch((err) => {
        let myerr = err.response.data.message;
        setisSuccess({
          success: 1,
          message: myerr || "An unknown error occured",
        });
        setTimeout(() => {
          setisSuccess({ success: 0, message: "" });
        }, 5000);
      });
  };
  let rejectT= async (id) => {
    await rejectSpecialEdit(id)
      .then((res) => {
        setisSuccess({
          success: 2,
          message: "Contract rejected successfully",
        });
        setTimeout(() => {
          setisSuccess({ success: 0, message: "" });
        }, 3000);
        dispatch(actions.findspecialpendingcontracts(queryParams));
      })
      .catch((err) => {
        let myerr = err.response.data.message;
        setisSuccess({
          success: 1,
          message: myerr || "An unknown error occured",
        });
        setTimeout(() => {
          setisSuccess({ success: 0, message: "" });
        }, 5000);
      });
  };

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [contractConfirm, setContractConfirm] = useState({});
  const [uploadDocumentModel, setUploadDocumentModel] = useState(false);
  const [contractDelete, setContractDelete] = useState({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSuccess, setisSuccess] = useState({ success: 0, message: "" });
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const columns = GenerateColumns(history, true, {
    confirm: confirmContract,
    uploadDocument: uploadDocument,
    deleteContract: deleteContract,
    rejectContract: rejectContract,
    approveT:approveT,
    rejectT:rejectT,
  });
  const initialFilter = {
    filter: {},
    sortOrder: "desc", // asc||desc
    sortField: "createdAt",
    pageNumber: 1,
    pageSize: 10,
    search: "",
  };
  const filter = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const initialFilter = {
      filter: {},
      sortOrder: "desc", // asc||desc
      sortField: "createdAt",
      pageNumber: 1,
      pageSize: 10,
      search: (params.quote_contract_no) ? params.quote_contract_no : "",
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
    switch (pathName) {
      case "all":
        dispatch(actions.findcontracts(queryParams));
        break;
      case "pending-approval":
        dispatch(actions.findpendingcontracts(queryParams));
        break;
      case "on-confirm":
        dispatch(actions.findapprovedcontracts(queryParams));
        break;
      case "rejects":
        dispatch(actions.findrejectedcontracts(queryParams));
        break;
      case "client-reject":
        dispatch(actions.findclientrejectedcontracts(queryParams));
        break;
      case "confirmed":
        dispatch(actions.findconfirmedcontracts(queryParams));
        break;
      case "special-pending":
        dispatch(actions.findspecialpendingcontracts(queryParams));
        break;
      case "terminated":
        dispatch(actions.findterminatedcontracts(queryParams));
        break;
      case "job":
        dispatch(actions.findconfirmedcontracts(queryParams));
        break;
      default:
        dispatch(actions.findcontracts(queryParams));
    }
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

  function uploadDocumentSuccess() {
    setisSuccess({
      success: 2,
      message: "Upload signed document successfully",
    });
    setTimeout(() => {
      setisSuccess({ success: 0, message: "" });
    }, 3000);
  }

  return (
    <>
    {isSuccess.success !== 0 && (
      <SuccessErrorAlert isSuccess={isSuccess} setisSuccess={setisSuccess} />
    )}
    <Card>
      <ProductDeleteDialog
        show={isDeleteDialogOpen}
        contractDelete={contractDelete}
        onHide={() => setIsDeleteDialogOpen(false)}
      />
      {/* Confirm contract(确认合同弹窗) */}
      <ConfirmModal
        show={isConfirmDialogOpen}
        doc={contractConfirm}
        onHide={() => setIsConfirmDialogOpen(false)}
      />
      <RejectModal
        show={isRejectDialogOpen}
        doc={contractConfirm}
        onHide={() => setIsRejectDialogOpen(false)}
      />
      <UploadDocumentModal
        show={uploadDocumentModel}
        doc={contractConfirm}
        onHide={() => setUploadDocumentModel(false)}
        onSuccess={() => uploadDocumentSuccess()}
      />
      <CardHeader title={intl.formatMessage({ id: "CONTRACTS.TITLE" })}>
        <CardHeaderToolbar>
        {checkPermission('CONTRACT', 'can_add') && (
          <button
            type="button"
            className="btn btn-primary mr-3"
            onClick={() => history.push("/contracts/old-new")}
          >
            {intl.formatMessage({
              id: "CONTRACTS.MAKE_UP_FOR_CONFIRMED_CONTRACTS",
            })}
          </button>
          )}
          {checkPermission('CONTRACT', 'can_add') && (
          <button
            type="button"
            className="btn btn-primary ml-2"
            onClick={() => history.push("/contracts/new")}
          >
            {intl.formatMessage({ id: "CONTRACTS.NEW_CONTRACT" })}
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
          paginationOptions={paginationOptions}
          handleSearch={(query) =>
            setQueryParamsBase({ ...queryParams, search: query, pageNumber: 1 })
          }
          typeFilter={true}
        />
      </CardBody>
    </Card>
    </>
  );
}

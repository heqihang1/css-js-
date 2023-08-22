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
import * as actions from "../_redux/quotes/quotesActions";
import { generateColumns } from "../../../utils/quotes/tableDeps";
import { ProductDeleteDialog } from "./product-delete/ProductDelete";
import { ReUseModal } from "./ReUseModal";
import ConfirmModal from "./ConfirmModal";
import RejectModal from "./RejectModal";
import UploadDocumentModal from "./UploadDocumentModal";
import { checkPermission } from "../../../utils/utils";
import SuccessErrorAlert from "../../../components/SuccessErrorAlert";
import { approveSpecialEdit,rejectSpecialEdit } from "../../../modules/quotes/_redux/quotes/quotesCrud";

export function ProductsCard() {
  const history = useHistory();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [reuseDialogOpen, setReuseDialogOpen] = useState(false);
  const [quoteReuse, setQuoteReuse] = useState(null);
  const [quoteDelete, setQuoteDelete] = useState({});

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [quoteConfirm, setQuoteConfirm] = useState({});
  const [uploadDocumentModel, setUploadDocumentModel] = useState(false);

  const filter = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const initialFilter = {
      filter: {},
      sortOrder: "desc", // asc||desc
      sortField: "createdAt", // sortField
      pageNumber: 1,
      search: (params.quote_contract_no) ? params.quote_contract_no : "",
      pageSize: 10,
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
  
  let approveS=async (id) => {
    await approveSpecialEdit(id)
      .then((res) => {
        setisSuccess({
          success: 2,
          message: "Quotation approved successfully",
        });
        setTimeout(() => {
          setisSuccess({ success: 0, message: "" });
        }, 3000);
        dispatch(actions.findspecialpendingdquotations(queryParams));
      }).catch((err) => {
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
  let rejectS = async (id) => {
    await rejectSpecialEdit(id)
      .then((res) => {
        setisSuccess({
          success: 2,
          message: "Quotation rejected successfully",
        });
        setTimeout(() => {
          setisSuccess({ success: 0, message: "" });
        }, 3000);
        dispatch(actions.findspecialpendingdquotations(queryParams));
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
  let deleteQuote = (id) => {
    let quote = entities.find((entity) => entity._id === id);
    setQuoteDelete(quote);
    setIsDeleteDialogOpen(true);
  };

  const reuseQuote = (id) => {
    setQuoteReuse(id);
    setReuseDialogOpen(true);
  };

  let confirmQuote = (id) => {
    let quote = entities.find((entity) => entity._id === id);
    setQuoteConfirm(quote);
    setIsConfirmDialogOpen(true);
  };

  let rejectQuote = (id) => {
    let quote = entities.find((entity) => entity._id === id);
    setQuoteConfirm(quote);
    setIsRejectDialogOpen(true);
  };

  let uploadDocument = (id) => {
    let quote = entities.find((entity) => entity._id === id);
    setQuoteConfirm(quote);
    setUploadDocumentModel(true);
  };

  const columns = generateColumns(history, true,{
    deleteQuote,
    confirmQuote,
    rejectQuote,
    reuseQuote,
    uploadDocument,
    approveS,
    rejectS,
  });

  const { currentState } = useSelector(
    (state) => ({ currentState: state.quotations }),
    shallowEqual
  );

  // Products Redux state
  const dispatch = useDispatch();
  let path = history.location.pathname.split("/");
  let pathName = path[path.length - 1];
  useEffect(() => {
    switch (pathName) {
      case "job":
          dispatch(actions.findconfirmedquotations(queryParams));
          break;
      case "all":
        dispatch(actions.findquotations(queryParams));
        break;
      case "pending-approval":
        dispatch(actions.findpendingquotations(queryParams));
        break;
      case "on-confirm":
        dispatch(actions.findapprovedquotations(queryParams));
        break;
      case "rejects":
        dispatch(actions.findrejectedquotations(queryParams));
        break;
      case "client-reject":
        dispatch(actions.findclientrejectedquotations(queryParams));
        break;
      case "confirmed":
        dispatch(actions.findconfirmedquotations(queryParams));
        break;
      case "special-pending":
        dispatch(actions.findspecialpendingdquotations(queryParams));
        break;
      default:
        dispatch(actions.findquotations(queryParams));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams, dispatch, pathName]);
  const { totalCount, entities, listLoading } = currentState;
  const [filterData, setFilterData] = useState({ entities: [], totalCount: 0 });
  const [isSuccess, setisSuccess] = useState({ success: 0, message: "" });

  useEffect(() => {
    setFilterData({ entities, totalCount });
  }, [entities]);
  // Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: filterData.totalCount,
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
        quoteDelete={quoteDelete}
        onHide={() => setIsDeleteDialogOpen(false)}
      />
      <ReUseModal
        show={reuseDialogOpen}
        id={quoteReuse}
        onHide={() => {
          setReuseDialogOpen(false);
        }}
      />
      <ConfirmModal
        show={isConfirmDialogOpen}
        doc={quoteConfirm}
        onHide={() => setIsConfirmDialogOpen(false)}
      />
      <RejectModal
        show={isRejectDialogOpen}
        doc={quoteConfirm}
        onHide={() => setIsRejectDialogOpen(false)}
      />
      <UploadDocumentModal
        show={uploadDocumentModel}
        doc={quoteConfirm}
        onHide={() => setUploadDocumentModel(false)}
        onSuccess={() => uploadDocumentSuccess()}
      />

      <CardHeader title="Quotation list">
        <CardHeaderToolbar>
        {checkPermission('QUOTATION', 'can_add') && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => history.push("/quotes/new")}
          >
            New Quotation
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
          handleSearch={(query) => {
            setQueryParamsBase({
              ...queryParams,
              search: query,
              pageNumber: 1,
            });
          }}
          paginationOptions={paginationOptions}
          typeFilter={true}
        />
      </CardBody>
    </Card>
    </>
  );
}

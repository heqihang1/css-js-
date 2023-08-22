import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { isEqual, isFunction } from "lodash";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../_metronic/_partials/controls";
import _ from "lodash";
import { Modal } from "react-bootstrap";
import { API_URL } from "../../../../app/API_URL";
// import ConfirmModal from "./ConfirmModal";
import { ProductDeleteDialog } from "./product-delete-dialog/ProductDeleteDialog";
import { Table } from "../../../components/Table";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as uiHelpers from "./ProductsUIHelpers";
import * as actions from "../_redux/invoice/invoiceActions";
import { generateColumns } from "../../../utils/invoices/tableDeps";
import PaidInvoiceModal from "./PaidInvoiceModal";
import { invoiceStatuses } from "../../invoices/partials/statuses";
import { checkPermission } from "../../../utils/utils";
import axios from "axios";

export function ProductsCard() {
  const history = useHistory();
  let deleteInvoice = (id) => {
    let invoice = entities.find((entity) => entity._id === id);
    setinvoiceDelete(invoice);
    setIsDeleteDialogOpen(true);
  };

  let confirminvoice = (id) => {
    let invoice = entities.find((entity) => entity._id === id);
    setinvoiceConfirm(invoice);
    setIsConfirmDialogOpen(true);
  };

  let paidInvoice = (id) => {
    let invoice = entities.find((entity) => entity._id === id);
    setPaidInvoiceData(invoice);
    setPaidInvoiceDialogOpen(true);
  };

  let unpaid = (id) => {
    setUnpaidInvoiceId(id);
    setShowUnpaidModal(true);
  };

  function unpaidInvoice() {
    axios.put(API_URL + `invoices/unpaid/${unpaidInvoiceId}`).then((res) => {
      setShowUnpaidModal(false);
      const queryParamsEdited = JSON.parse(JSON.stringify(queryParams));
      dispatch(
        actions.fetchInvoices({
          ...queryParamsEdited,
          filter: {
            status: invoiceStatuses.PAID,
          },
        })
      );
    });
  }

  const columns = generateColumns(history, true, {
    deleteInvoice,
    confirminvoice,
    paidInvoice,
    unpaid,
  });
  const filter = () => {
    const initialFilter = {
      filter: {},
      sortOrder: "desc", // asc||desc
      sortField: "invoice_no",
      pageNumber: 1,
      pageSize: 10,
      search: "",
    };

    // for (let col in columns) {
    //   initialFilter.filter[col.dataField] = "";
    // }

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

  // const { currentState } = useSelector(
  //   (state) => ({ currentState: state.quotations }),
  //   shallowEqual
  // );
  let path = history.location.pathname.split("/");
  let pathName = path[path.length - 1];
  const [urlPathName, setUrlPathName] = useState(pathName);
  const { currentState } = useSelector(
    (state) => ({ currentState: state.invoice }),
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
        dispatch(
          actions.fetchInvoices({
            ...queryParamsEdited,
            filter: {
              invoice_no: { $not: { $regex: "TEMP-" } },
              status: { $ne: "Deleted" },
            },
          })
        );
        break;
      case "pending-approval":
        dispatch(
          actions.fetchInvoices({
            ...queryParamsEdited,
            filter: {
              status: invoiceStatuses.WAITING,
            },
          })
        );
        break;
      case "payments-pending":
        dispatch(
          actions.fetchInvoices({
            ...queryParamsEdited,
            filter: {
              status: {
                $in: [invoiceStatuses.PENDING, invoiceStatuses.PARTIAL_PAYMENT],
              },
            },
          })
        );
        break;
      case "rejects":
        dispatch(
          actions.fetchInvoices({
            ...queryParamsEdited,
            filter: {
              status: invoiceStatuses.REJECT,
            },
          })
        );
        break;
      case "paid-list":
        dispatch(
          actions.fetchInvoices({
            ...queryParamsEdited,
            filter: {
              status: invoiceStatuses.PAID,
            },
          })
        );
        break;
      default:
        dispatch(actions.fetchInvoices(queryParamsEdited));
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [paidInvoiceDialogOpen, setPaidInvoiceDialogOpen] = useState(false);
  const [invoiceDelete, setinvoiceDelete] = useState({});
  const [invoiceConfirm, setinvoiceConfirm] = useState({});
  const [paidInvoiceData, setPaidInvoiceData] = useState({});
  const [filterData, setFilterData] = useState({ entities: [], totalCount: 0 });
  const [unpaidInvoiceId, setUnpaidInvoiceId] = useState("");
  const [showUnpaidModal, setShowUnpaidModal] = useState(false);

  const fetchCustomerOfficerImages = async (ids, records, total) => {
    try {
      await axios
        .post(API_URL + "users/getUsersImages", { ids: ids })
        .then(async (res) => {
          if (res.data) {
            const addImage = await records.map((x) => {
              return {
                ...x,
                customer_id: x.customer_id.map((cc) => {
                  const findUser = res.data.find(
                    (ofc) => ofc._id === cc?.customer_officer_id
                  );
                  return {
                    ...cc,
                    customer_officer_id: findUser
                      ? findUser
                      : cc?.customer_officer_id,
                  };
                }),
              };
            });
            setFilterData({
              ...filterData,
              entities: addImage || filterData.entities,
            });
          }
        });
    } catch (err) {}
  };

  useEffect(() => {
    const customer_officer_ids =
      _.uniq(entities?.map((x) => x.customer_id[0]?.customer_officer_id)) || [];
    setTimeout(() => {
      fetchCustomerOfficerImages(customer_officer_ids, entities, totalCount);
    }, 100);
    setFilterData({ entities, totalCount });
  }, [entities]);

  function ClosePaidModal(isRefresh) {
    setPaidInvoiceDialogOpen(false);
    if (isRefresh == "yes") {
      setUrlPathName(pathName);
      const queryParamsEdited = JSON.parse(JSON.stringify(queryParams));
      if (pathName != urlPathName) {
        queryParamsEdited.pageNumber = 1;
      }
      dispatch(
        actions.fetchInvoices({
          ...queryParamsEdited,
          filter: {
            status: {
              $in: [invoiceStatuses.PENDING, invoiceStatuses.PARTIAL_PAYMENT],
            },
          },
        })
      );
    }
  }

  function CloseDeleteModal(isRefresh) {
    setIsDeleteDialogOpen(false);
    if (isRefresh == "yes") {
      setUrlPathName(pathName);
      const queryParamsEdited = JSON.parse(JSON.stringify(queryParams));
      if (pathName != urlPathName) {
        queryParamsEdited.pageNumber = 1;
      }
      switch (pathName) {
        case "pending-approval":
          dispatch(
            actions.fetchInvoices({
              ...queryParamsEdited,
              filter: {
                status: invoiceStatuses.WAITING,
              },
            })
          );
          break;
        case "rejects":
          dispatch(
            actions.fetchInvoices({
              ...queryParamsEdited,
              filter: {
                status: invoiceStatuses.REJECT,
              },
            })
          );
          break;
      }
    }
  }

  return (
    <>
      <Card>
        <ProductDeleteDialog
          show={isDeleteDialogOpen}
          invoiceDelete={invoiceDelete}
          onHide={CloseDeleteModal}
        />
        {/* <ConfirmModal
          show={isConfirmDialogOpen}
          doc={invoiceConfirm}
          onHide={() => setIsConfirmDialogOpen(false)}
        /> */}
        <PaidInvoiceModal
          show={paidInvoiceDialogOpen}
          doc={paidInvoiceData}
          onHide={ClosePaidModal}
        />
        <CardHeader title="Invoices list">
          <CardHeaderToolbar>
            {checkPermission("INVOICE", "can_add") && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => history.push("/invoices/new")}
              >
                Create New Invoice
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
              setQueryParamsBase({
                ...queryParams,
                search: query,
                pageNumber: 1,
              })
            }
            paginationOptions={paginationOptions}
            typeFilter={true}
          />
        </CardBody>
      </Card>

      <Modal
        show={showUnpaidModal}
        onHide={() => setShowUnpaidModal(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Please confirm unpaid this invoice, after confirm will back to
          "Payments Pending" status.
        </Modal.Body>
        <Modal.Footer>
          <div>
            <button
              type="button"
              onClick={() => setShowUnpaidModal(false)}
              className="btn btn-light btn-elevate"
            >
              Cancel
            </button>
            <> </>
            <button
              type="button"
              onClick={() => unpaidInvoice()}
              className="btn btn-delete btn-elevate btn-danger"
            >
              Confirm
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

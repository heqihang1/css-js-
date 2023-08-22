import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { isEqual, isFunction } from "lodash";
import { Modal } from "react-bootstrap";
import { Table } from "../../../components/Table";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as uiHelpers from "./ProductsUIHelpers";
import * as quoteActions from "../../quotes/_redux/quoteSalesRemark/salesRemarkActions";
import * as contractActions from "../../contracts/_redux/contractsSalesRemark/salesRemarkActions";
import { generateColumns } from "../../../utils/jobSalesRemark/tableDeps";

const SalesRemarkModal = ({ show, onHide, onShow, event }) => {
  const history = useHistory();
  const filter = () => {
    const initialFilter = {
      filter: {},
      sortOrder: "desc", // asc||desc
      sortField: "createdAt",
      pageNumber: 1,
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

  const { currentState } = useSelector(
    (state) =>
      event?.quotation_id
        ? { currentState: state.quoteSalesRemark }
        : { currentState: state.contractSalesRemark },
    shallowEqual
  );

  const dispatch = useDispatch();
  useEffect(() => {
    if (event?.quotation_id) {
      dispatch(
        quoteActions.findAllSalesRemarkList(queryParams, event?.quotation_id)
      );
    } else if (event?.contract_id) {
      dispatch(
        contractActions.findAllSalesRemarkList(queryParams, event?.contract_id)
      );
    }
  }, [queryParams, dispatch]);
  const { totalCount, entities, listLoading } = currentState;
  const [filterData, setFilterData] = useState({ entities: [], totalCount: 0 });

  useEffect(() => {
    setFilterData({ entities, totalCount });
  }, [entities]);

  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: queryParams.pageSize,
    page: queryParams.pageNumber,
  };

  useEffect(() => {
    if (show) {
      if (event?.quotation_id) {
        dispatch(
          quoteActions.findAllSalesRemarkList(queryParams, event?.quotation_id)
        );
        dispatch(quoteActions.readQuoteSalesRemark(event?.quotation_id))
      } else if (event?.contract_id) {
        dispatch(
          contractActions.findAllSalesRemarkList(
            queryParams,
            event?.contract_id
          )
        );
        dispatch(contractActions.readContractSalesRemark(event?.contract_id))
      }
    }
  }, [show]);

  const columns = generateColumns(history, true, {});
  return (
    <>
      <Modal show={show} onHide={onHide} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Sales Remark ({event?.job_no || ""})</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="col-lg-12">
            <Table
              queryParams={queryParams}
              setQueryParams={setQueryParams}
              columns={columns}
              listLoading={listLoading}
              entities={filterData.entities}
              paginationOptions={paginationOptions}
              typeFilter
              hideFilter
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <button
              type="button"
              onClick={onHide}
              className="btn btn-secondary btn-elevate"
            >
              Close
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SalesRemarkModal;

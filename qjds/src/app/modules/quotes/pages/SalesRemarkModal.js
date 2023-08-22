import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { isEqual, isFunction } from "lodash";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../_metronic/_partials/controls";
import { Modal } from "react-bootstrap";
import { Table } from "../../../components/Table";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as uiHelpers from "./ProductsUIHelpers";
import * as actions from "../_redux/quoteSalesRemark/salesRemarkActions";
import { generateColumns } from "../../../utils/quoteSalesRemark/tableDeps";
import { checkPermission } from "../../../utils/utils";
import InputColor from 'react-input-color'

const SalesRemarkModal = ({ show, onHide, onShow, quote_id, totalSalesRemark }) => {
  const [newRemarkModel, setNewRemarkModel] = useState(false)
  const [remark, setRemark] = useState('')
  const [color, setColor] = useState('')
  const history = useHistory();
  const filter = () => {
    const initialFilter = {
      filter: {},
      sortOrder: "desc", // asc||desc
      sortField: "createdAt",
      pageNumber: 1,
      pageSize: 10
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
    (state) => ({ currentState: state.quoteSalesRemark }),
    shallowEqual
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.findAllSalesRemarkList(queryParams, quote_id));
  }, [queryParams, dispatch]);
  const { totalCount, entities, listLoading } = currentState;
  const [filterData, setFilterData] = useState({ entities: [], totalCount: 0 });

  useEffect(() => {
    setFilterData({ entities, totalCount });
    totalSalesRemark(totalCount)
  }, [entities]);

  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: queryParams.pageSize,
    page: queryParams.pageNumber,
  };

  function addRemark() {
    dispatch(actions.createSalesRemark({ remark: remark, quotation_id: quote_id, color: color })).then(() => {
      setNewRemarkModel(false)
      onShow()
    });
  }

  useEffect(() => {
    if (show) {
      dispatch(actions.findAllSalesRemarkList(queryParams, quote_id));
    }
  }, [show])

  useEffect(() => {
    if (newRemarkModel) {
      setRemark('')
      onHide()
    }
  }, [newRemarkModel])

  let deleteSalesRemark = (id) => {
    dispatch(actions.deleteSalesRemark(id)).then(() => {
      dispatch(actions.findAllSalesRemarkList(queryParams, quote_id));
    });
  };

  const columns = generateColumns(history, checkPermission("QUOTATION_DETAILS_SALES_REMARK", "can_delete"), {
    deleteSalesRemark
  });

  const handleColorInput = (e) => {
    if (e.hex !== color) {
      setColor(e.hex)
    }
  }

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Sales Remark
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {checkPermission("QUOTATION_DETAILS_SALES_REMARK", "can_add") && (
            <div className="row">
              <div className="col-lg-12 text-right">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setNewRemarkModel(true)}
                >
                  New Remark
                </button>
              </div>
            </div>
          )}
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

      <Modal
        show={newRemarkModel}
        onHide={() => setNewRemarkModel(false)}
        size="lg"
      >
        <Modal.Body>
          <div className="row">
            <div className="col-lg-12" style={{ fontSize: '16px' }}>
              <b>Add Remark</b>
            </div>
            <div className="col-lg-12 mt-3">
              <textarea
                className="form-control"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                rows={5}
              ></textarea>
            </div>

            <div className="col-lg-12 mt-4" style={{ fontSize: '16px' }}>
              <b>Color</b>
            </div>
            <div className="col-lg-12 mt-3">
              <InputColor
                name="color"
                style={{minHeight:'40px', minWidth:'100px'}}
                id="color"
                initialValue={color}
                onChange={handleColorInput}
              />
            </div>

            <div className="col-lg-12 text-right mt-4">
              <button
                type="button"
                onClick={() => setNewRemarkModel(false)}
                className="btn btn-secondary btn-elevate"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary btn-elevate ml-4"
                disabled={!remark}
                onClick={() => addRemark()}
              >
                Add
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SalesRemarkModal;

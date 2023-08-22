/* eslint-disable no-restricted-imports */
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../_metronic/_partials/controls";
import * as actions from "../../_redux/contracts/contractsActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

const initialFilter = {
  filter: {},
  sortOrder: "desc", // asc||desc
  sortField: "createdAt", // sortField
  pageNumber: 1,
  search: "",
  pageSize: 10,
};

export function ProductDeleteDialog({ contractDelete, show, onHide }) {
  // Products Redux state
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.contracts.actionsLoading }),
    shallowEqual
  );

  // if !id we should close modal
  useEffect(() => {
    if (!contractDelete) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractDelete]);

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  const deleteProduct = () => {
    dispatch(actions.deletecontract(contractDelete._id)).then(() => {
      dispatch(actions.findcontracts(initialFilter));
      onHide();
    });
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      {isLoading && <ModalProgressBar variant="query" />}

      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Contract Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <>
            <p>Are you sure to permanently delete this contract?</p>
            <h4>{contractDelete.contract_no}</h4>
          </>
        )}
        {isLoading && <span>Contract is deleting...</span>}
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button
            type="button"
            onClick={onHide}
            className="btn btn-light btn-elevate"
          >
            Cancel
          </button>
          <> </>
          <button
            type="button"
            onClick={deleteProduct}
            className="btn btn-delete btn-elevate btn-danger"
          >
            Delete
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

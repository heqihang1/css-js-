/* eslint-disable no-restricted-imports */
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../_metronic/_partials/controls";
import * as actions from "../../_redux/quotes/quotesActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

const initialFilter = {
  filter: {},
  sortOrder: "desc", // asc||desc
  sortField: "createdAt", // sortField
  pageNumber: 1,
  search: "",
  pageSize: 10,
};

export function ProductDeleteDialog({ quoteDelete, show, onHide }) {
  // Products Redux state
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.quotations.actionsLoading }),
    shallowEqual
  );

  // if !id we should close modal
  useEffect(() => {
    if (!quoteDelete) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteDelete]);

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  const deleteProduct = () => {
    dispatch(actions.deletequotation(quoteDelete._id)).then(() => {
      dispatch(actions.findquotations(initialFilter));
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
          Quotation Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <>
            <p>Are you sure to permanently delete this quotation?</p>
            <h4>{quoteDelete.quotation_no}</h4>
          </>
        )}
        {isLoading && <span>Quotation is deleting...</span>}
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

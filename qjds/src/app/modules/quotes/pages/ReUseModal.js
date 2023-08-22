/* eslint-disable no-restricted-imports */
import React, { useEffect } from "react";
import { Modal, ModalFooter, Button } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../_metronic/_partials/controls";
import * as actions from "../_redux/quotes/quotesActions";

const initialFilter = {
  filter: {},
  sortOrder: "desc", // asc||desc
  sortField: "createdAt", // sortField
  pageNumber: 1,
  search: "",
  pageSize: 10,
};

export function ReUseModal({ id, show, onHide }) {
  // Products Redux state
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.customers.actionsLoading }),
    shallowEqual
  );

  // if !id we should close modal
  useEffect(() => {
    if (!id) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  // REUSE QUOTATION
  const reuseQuote = () => {
    dispatch(actions.reuseQuotation(id)).then(() => {
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
        <Modal.Title id="example-modal-sizes-title-lg">Reuse Quote</Modal.Title>
      </Modal.Header>
      <ModalFooter>
        <Button color="primary" onClick={onHide}>
          Cancel
        </Button>
        <Button color="primary" onClick={reuseQuote}>
          Ok
        </Button>
      </ModalFooter>
    </Modal>
  );
}

/* eslint-disable no-restricted-imports */
import React, { useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../_metronic/_partials/controls";
import * as actions from "../_redux/contracts/contractsActions";

export function ReUseModal({ contractReuseId, show, hideReuseContract }) {
  // Products Redux state
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.contracts.actionsLoading }),
    shallowEqual
  );

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  const reuseContract = () => {
    dispatch(actions.reuseContract(contractReuseId)).then(() => {
      hideReuseContract();
    });
  };

  return (
    <Modal
      show={show}
      onHide={hideReuseContract}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      {isLoading && <ModalProgressBar variant="query" />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Reuse Contract
        </Modal.Title>
      </Modal.Header>
      {/* <Modal.Body>
        {!isLoading && <span>Contract id here: 45243234</span>}
        {isLoading && <span>Reusing...</span>}
      </Modal.Body> */}
      <Modal.Footer>
        <Button color="secondary" onClick={hideReuseContract}>
          Cancel
        </Button>
        <Button color="primary" onClick={reuseContract}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

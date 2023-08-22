/* eslint-disable no-restricted-imports */
import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../_metronic/_partials/controls";
import * as actions from "../../_redux/contracts/contractsActions";

export function ProductDeleteDialog({ id, show, onHide, deleteSuccess }) {
  // Products Redux state
  const dispatch = useDispatch();
  const { isLoading, contracts } = useSelector(
    (state) => ({
      isLoading: state.contracts.actionsLoading,
      contracts: state.contracts.entities,
    }),
    shallowEqual
  );

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  const deleteProduct = () => {
    dispatch(actions.deletecontract(id)).then(() => {
      dispatch(actions.findcontracts());
      deleteSuccess();
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
            <h4>
              {contracts &&
                [...contracts].find((contract) => contract._id === id)
                  ?.contract_no}
            </h4>
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

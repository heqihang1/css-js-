/* eslint-disable no-restricted-imports */
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/commercialSector/commercialSectorActions";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export function ProductActivateDialog({ id, show, onHide }) {
  let query = useQuery();

  // Products Redux state
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.commercialSectors.actionsLoading }),
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
  useEffect(() => { }, [isLoading, dispatch]);

  const deleteProduct = () => {
    dispatch(actions.activateCommercialSector(id)).then(() => {
      dispatch(actions.fetchCommercialSectors());
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
        <Modal.Title id="example-modal-sizes-title-lg">Confirm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && <span>Please confirm active this district</span>}
        <br />
        <strong>{query.get("commercialSector")}</strong>
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
            Confirm
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

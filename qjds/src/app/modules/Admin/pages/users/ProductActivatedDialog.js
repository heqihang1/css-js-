/* eslint-disable no-restricted-imports */
import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../_metronic/_partials/controls";
import * as actions from "../../_redux/users/usersActions";

export function ProductActivateDialog({ id, show, onHide }) {
  // Products Redux state
  const dispatch = useDispatch();
  const { isLoading, users } = useSelector(
    (state) => ({
      isLoading: state.users.actionsLoading,
      users: state.users.entities,
    }),
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

  const activateUser = () => {
    dispatch(actions.activateuser(id)).then(() => {
      //dispatch(actions.findusers({ sortField: "createdAt" }));
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
          User Activate
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <>
            <p>Are you sure you want to activate this user?</p>
            <h4>
              {users && [...users].find((user) => user._id === id)?.username}
            </h4>
          </>
        )}
        {isLoading && <span>User is being activated...</span>}
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
            onClick={activateUser}
            className="btn btn-primary btn-elevate"
          >
            Activate
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

/* eslint-disable no-restricted-imports */
import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/users/usersActions";

export function ProductDeleteDialog({ id, show, onHide }) {
  // Products Redux state  产品还原状态
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

  const deleteProduct = () => {
    dispatch(actions.deleteuser(id)).then(() => {
      dispatch(actions.findusers());
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
        <Modal.Title id="example-modal-sizes-title-lg">User Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <>
            <p>Are you sure to permanently delete this user?</p>
            <h4>
              {users && [...users].find((user) => user._id === id)?.username}
            </h4>
          </>
        )}
        {isLoading && <span>User is deleting...</span>}
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

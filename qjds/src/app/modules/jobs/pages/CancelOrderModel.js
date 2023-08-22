import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import {
  cancelJobOrder
} from "../_redux/job/jobCrud";
import { useHistory } from "react-router-dom";

const CancelOrderModel = ({ doc, show, onHide }) => {
  const history = useHistory();
  const cancelJobOrderFunc = async () => {

    cancelJobOrder(doc._id)
      .then((res) => {
        onHide()
        history.push("/jobs/all");
      })
      .catch((err) => {})
  }

  return (
    <Modal show={show} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">Confirm</Modal.Title>
        </Modal.Header>

        <Modal.Body className="overlay overlay-block cursor-default">
          Please confirm cancal this job order.
        </Modal.Body>

        <Modal.Footer>
          <div>
            <button
              type="button"
              onClick={() => onHide()}
              className="btn btn-secondary mr-2"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => cancelJobOrderFunc()}
              className="btn btn-primary bg-danger border-danger"
            >
              Confirm
            </button>
          </div>
        </Modal.Footer>
      </Modal>
  );
};

export default CancelOrderModel;

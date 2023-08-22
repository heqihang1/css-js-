/* eslint-disable no-restricted-imports */
import React from "react";
import { Modal } from "react-bootstrap";
import { Field } from "formik";
import { Input } from "../../../../../_metronic/_partials/controls";

export function SpecialWorkerModal({ show, onHide }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          特別工作單數量
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
          <Field
            type="number"
            name="job_order_no"
            component={Input}
            placeholder="特別工作單數量"
            label="特別工作單數量："
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button
            type="button"
            onClick={onHide}
            className="btn btn-delete btn-elevate"
          >
            Ok
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

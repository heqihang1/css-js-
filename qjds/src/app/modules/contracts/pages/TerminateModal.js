import React, { useEffect, useState } from "react";
import { FormLabel, Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import * as actions from "../../sets/_redux/terminationReason/terminationReasonActions";
import * as contractActions from "../_redux/contracts/contractsActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Form, Formik } from "formik";
import SearchSelect from "react-select";

const TerminateModal = ({ doc, show, onHide, refreshPage }) => {
  const [submitted, setSubmitted] = useState(false);
  const [showConfirmModel, setShowConfirmModel] = useState(false);
  const [terminateReason, setTerminateReason] = useState('')
  const [otherTerminateReason, setOtherTerminateReason] = useState('')
  const [terminateReasonOption, setTerminateReasonOption] = useState([])
  const history = useHistory();
  const dispatch = useDispatch();
  const { terminateReasons = [] } = useSelector(
    (state) => ({
      terminateReasons: state.terminationReasons.entities,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (!doc) {
      onHide();
    }
  }, [doc]);

  useEffect(() => {
    if (show) {
      setTerminateReason('')
      setOtherTerminateReason('')
      setSubmitted(false)
    }
  }, [show]);


  useEffect(() => {
    dispatch(actions.fetchTerminationReasons({
      filter: {},
      sortOrder: "desc",
      sortField: "createdAt",
      pageNumber: 1,
      pageSize: 100000,
      status: true
    }));
  }, [])

  useEffect(() => {
    if (terminateReasons) {
      let options = []
      terminateReasons.filter((item) => {
        options.push({
          label: item.termination_reason,
          value: item._id,
        })
      })
      options.push({
        label: 'Other',
        value: 'OTHER',
      })
      setTerminateReasonOption(options)
    }
  }, [terminateReasons])

  const terminateContract = async () => {
    setSubmitted(true);
    if (terminateReason != "" && (terminateReason?.value != "OTHER" || otherTerminateReason != "")) {
      setShowConfirmModel(true)
      onHide();
    }
  };

  const confirmTerminateContract = async () => {
    let requestBody = {};
    if (terminateReason.value == 'OTHER') {
      requestBody =  {
        terminate_reason: otherTerminateReason
      }
    } else {
      requestBody =  {
        terminate_reason_id: terminateReason.value,
        terminate_reason: terminateReason.label
      }
    }
    dispatch(contractActions.terminateContract(doc._id, requestBody)).then(() => {
      setShowConfirmModel(false)
      refreshPage()
    });
  }

  return (
    <>
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Terminate contract
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik>
          {({ values, handleChange, handleSubmit, submitForm }) => {
            return (
              <Form className="form form-label-right">
                <div className="col form-group">
                  <div className="form-group ">
                    <FormLabel>Termination Reason</FormLabel>
                      <SearchSelect
                        name="terminate_reason"
                        options={terminateReasonOption}
                        placeholder="Please select termination reason"
                        onChange={(opt) => {
                          setTerminateReason(opt);
                        }}
                        value={terminateReason}
                      />
                      {submitted === true && terminateReason === "" ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">Termination reason is required</div>
                      </div>
                    ) : null}
                  </div>
                  { terminateReason?.value && terminateReason?.value === 'OTHER' ? <div className="form-group ">
                    <FormLabel>Other reason</FormLabel>
                    <textarea
                      className="form-control"
                      value={otherTerminateReason}
                      onChange={(e) => setOtherTerminateReason(e.target.value)}
                    ></textarea>

                    {submitted === true && otherTerminateReason === "" ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">Other reason is required</div>
                      </div>
                    ) : null}
                  </div> : '' }
                </div>
              </Form>
            );
          }}
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button
            type="button"
            onClick={onHide}
            className="btn btn-secondary btn-elevate"
          >
            Close
          </button>
          <> </>
          <button
            type="button"
            className="btn btn-danger btn-elevate"
            onClick={terminateContract}
          >
            Terminate
          </button>
        </div>
      </Modal.Footer>
    </Modal>
    <Modal
      show={showConfirmModel}
      onHide={() => setShowConfirmModel(false)}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Confirm
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Please confirm to terminate this contract.
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button
            type="button"
            onClick={() => setShowConfirmModel(false)}
            className="btn btn-secondary btn-elevate"
          >
            Close
          </button>
          <> </>
          <button
            type="button"
            className="btn btn-danger btn-elevate"
            onClick={() => confirmTerminateContract()}
          >
            Confirm
          </button>
        </div>
      </Modal.Footer>
    </Modal>
    </>
  );
};

export default TerminateModal;
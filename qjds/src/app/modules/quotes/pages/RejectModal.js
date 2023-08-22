import React, { useEffect, useState } from "react";
import { FormLabel, Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import * as actions from "../../sets/_redux/rejectReason/rejectReasonActions";
import * as quoteActions from "../_redux/quotes/quotesActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Form, Formik } from "formik";
import SearchSelect from "react-select";

const RejectModal = ({ doc, show, onHide }) => {
  const [submitted, setSubmitted] = useState(false);
  const [rejectReason, setRejectReason] = useState('')
  const [otherRejectReason, setOtherRejectReason] = useState('')
  const [rejectReasonOption, setRejectReasonOption] = useState([])
  const history = useHistory();
  const dispatch = useDispatch();
  const { rejectReasons = [] } = useSelector(
    (state) => ({
      rejectReasons: state.rejectReasons.entities,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (!doc) {
      onHide();
    }
  }, [doc]);

  useEffect(() => {
    setRejectReason('')
    setOtherRejectReason('')
    setSubmitted(false)
  }, [show]);


  useEffect(() => {
    dispatch(actions.fetchRejectReasons({
      filter: {},
      sortOrder: "desc",
      sortField: "createdAt",
      pageNumber: 1,
      pageSize: 100000,
      status: true
    }));
  }, [])

  useEffect(() => {
    if (rejectReasons) {
      let options = []
      rejectReasons.filter((item) => {
        options.push({
          label: item.reject_reason,
          value: item._id,
        })
      })
      options.push({
        label: 'Other',
        value: 'OTHER',
      })
      setRejectReasonOption(options)
    }
  }, [rejectReasons])

  const rejectQuote = async () => {
    setSubmitted(true);
    if (rejectReason != "" && (rejectReason?.value != "OTHER" || otherRejectReason != "")) {
      let requestBody = {};
      if (rejectReason.value == 'OTHER') {
        requestBody =  {
          reject_reason: otherRejectReason
        }
      } else {
        requestBody =  {
          reject_reason_id: rejectReason.value,
          reject_reason: rejectReason.label
        }
      }
      dispatch(quoteActions.rejectClientQuotation(doc._id, requestBody)).then(() => {
        onHide();
        history.push(`/quotes`);
      });
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Reject quotation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik>
          {({ values, handleChange, handleSubmit, submitForm }) => {
            return (
              <Form className="form form-label-right">
                <div className="col form-group">
                  <div className="form-group ">
                    <FormLabel>Reject Reason</FormLabel>
                      <SearchSelect
                        name="reject_reason"
                        options={rejectReasonOption}
                        placeholder="Select select reject reason"
                        onChange={(opt) => {
                          setRejectReason(opt);
                        }}
                        value={rejectReason}
                      />
                      {submitted === true && rejectReason === "" ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">Reject reason is required</div>
                      </div>
                    ) : null}
                  </div>
                  { rejectReason?.value && rejectReason?.value === 'OTHER' ? <div className="form-group ">
                    <FormLabel>Other reason</FormLabel>
                    <textarea
                      className="form-control"
                      value={otherRejectReason}
                      onChange={(e) => setOtherRejectReason(e.target.value)}
                    ></textarea>

                    {submitted === true && otherRejectReason === "" ? (
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
            onClick={rejectQuote}
          >
            Reject
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default RejectModal;

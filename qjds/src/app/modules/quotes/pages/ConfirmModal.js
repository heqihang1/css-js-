import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { FormLabel, Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../_metronic/_partials/controls";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
} from "../../../../_metronic/_partials/controls";
import SelectFilter from "react-select";
import * as actions from "../_redux/quotes/quotesActions";
import * as districtActions from "../../sets/_redux/districts/districtsActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Field, Form, Formik } from "formik";
import { DragDropFile } from "../../../components/DragAndDrop";

const ConfirmModal = ({ doc, show, onHide }) => {
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedJobEndDate, setSelectedJobEndDate] = useState("");
  const [worker, setWorker] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showConfirmModel, setShowConfirmModel] = useState(false)
  const history = useHistory();
  const dispatch = useDispatch();
  const { isLoading, districts = [] } = useSelector(
    (state) => ({
      isLoading: state.quotations.actionsLoading,
      districts: state.districts.entities,
    }),
    shallowEqual
  );

  // const districtOptions = districts?.map((x) => {
  //   return {
  //     label: x.district_eng_name,
  //     value: x._id,
  //   };
  // });

  // if !id we should close modal
  useEffect(() => {
    if (!doc) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc]);

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const confirmQuote = async (isConfirm) => {
    setSubmitted(true);
    if (worker && worker !== "" && selectedJobEndDate && selectedJobEndDate !== "") {
      if (isConfirm) {
        const requestBody = {
          area: selectedDistrict?.value ? selectedDistrict?.value : null,
          worker: worker,
          expected_job_date: selectedDate ? new Date(selectedDate) : "",
          end_job_date: selectedJobEndDate ? new Date(selectedJobEndDate) : "",
        };
        if (filesSelected.length > 0 && filesSelected[0]?.file[0]) {
          let file = filesSelected[0].file[0];
          requestBody.signed_document = {
            file_name: file.name,
            document: await toBase64(file),
          };
        }
        dispatch(actions.confirmQuotation(doc._id, requestBody)).then(() => {
          onHide();
          setShowConfirmModel(false)
          history.push(`/quotes`);
        });
        
      } else {
        setShowConfirmModel(true)
      }
    }
  };

  const ref = React.useRef();

  // drag state
  const [dragActive, setDragActive] = React.useState(false);
  // ref
  const inputRef = React.useRef();

  // handle drag events
  const handleDrag = function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = function(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // triggers when file is selected with click
  const handleDragChange = function(e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  let [filesSelected, setFilesSelected] = React.useState([]);

  let handleFiles = (file) => {
    setFilesSelected([
      // ...filesSelected,
      {
        filename: file[0].name,
        size: (file[0].size / 1000000).toFixed(2),
        file,
      },
    ]);
  };

  let removeFile = (index) => {
    setFilesSelected(filesSelected.filter((_, i) => i !== index));
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };

  // useEffect(() => {
  //   dispatch(districtActions.findAllDistrictsList());
  //   // eslint-disable-next-line
  // }, []);
  return (
    <>
      <Modal
        show={show && !showConfirmModel}
        onHide={onHide}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Confirm quotation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            innerRef={ref}
            onSubmit={async (values, formikActions) => {
              formikActions.setSubmitting(true);
              formikActions.resetForm({
                contracted_offer: "",
              });
              onHide();
            }}
          >
            {({ values, handleChange, handleSubmit, submitForm }) => {
              return (
                <Form className="form form-label-right" onDragEnter={handleDrag}>
                  <div className="col form-group">
                    <div className="form-group ">
                      <FormLabel>Confirm the following quotation?</FormLabel>
                      <Field
                        name="quotation_no"
                        component={Input}
                        withFeedbackLabel={false}
                        value={doc?.quotation_no}
                        disabled
                      />
                    </div>
                    <div className="form-group ">
                      <FormLabel>The amounts are as follows:</FormLabel>
                      <Field
                        name="amount"
                        component={Input}
                        withFeedbackLabel={false}
                        disabled
                        value={"$ " + doc?.amount.toFixed(2)}
                      />
                    </div>
                    {/* <div className="form-group ">
                      <FormLabel>District</FormLabel>
                      <SelectFilter
                        onChange={setSelectedDistrict}
                        value={selectedDistrict}
                        options={districtOptions}
                      />
                    </div> */}
                    <div className="form-group ">
                      <FormLabel>Expected Job Date</FormLabel>
                      <Field
                        name="date"
                        type="datetime-local"
                        component={Input}
                        withFeedbackLabel={false}
                        value={selectedDate}
                        onChange={(e) => {
                          setSelectedDate(e.target.value);
                        }}
                      />
                    </div>
                    <div className="form-group ">
                      <FormLabel>Job End Date</FormLabel>
                      <Field
                        name="date"
                        type="datetime-local"
                        component={Input}
                        withFeedbackLabel={false}
                        value={selectedJobEndDate}
                        onChange={(e) => {
                          setSelectedJobEndDate(e.target.value);
                        }}
                      />
                      {submitted === true && selectedJobEndDate === "" ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">Job end date is required</div>
                        </div>
                      ) : null}
                    </div>
                    <div className="form-group ">
                      <FormLabel>Worker</FormLabel>
                      <Field
                        name="worker"
                        type="number"
                        component={Input}
                        withFeedbackLabel={false}
                        value={worker}
                        onChange={(e) => {
                          setWorker(e.target.value);
                        }}
                      />
                      {submitted === true && worker === "" ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">Worker is required</div>
                        </div>
                      ) : null}
                    </div>
                    <div className="form-group ">
                      <FormLabel>Confirmed Signed Document</FormLabel>
                      <DragDropFile
                        utils={{
                          handleChange: handleDragChange,
                          handleDrag,
                          handleDrop,
                          onButtonClick,
                          inputRef,
                          dragActive,
                          files: filesSelected,
                          removeFile,
                        }}
                      />
                    </div>
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
              className="btn btn-primary btn-elevate"
              onClick={() => confirmQuote(false)}
            >
              Confirm
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
          <Modal.Title id="example-modal-sizes-title-sm">
            Confirm
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This quotation job order quantity is <b>{(doc.job_order_no) ? doc.job_order_no : 0}</b>, Are you sure confirm the quotation?
        </Modal.Body>
        <Modal.Footer>
          <div>
            <button
              type="button"
              onClick={() => setShowConfirmModel(false)}
              className="btn btn-secondary btn-elevate"
            >
              Back
            </button>
            <> </>
            <button
              type="button"
              className="btn btn-primary btn-elevate"
              onClick={() => confirmQuote(true)}
            >
              Confirm
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ConfirmModal;

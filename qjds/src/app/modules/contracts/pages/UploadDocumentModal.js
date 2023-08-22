import React, { useEffect, useState } from "react";
import { FormLabel, Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import * as actions from "../_redux/contracts/contractsActions";
import * as districtActions from "../../sets/_redux/districts/districtsActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Field, Form, Formik } from "formik";
import { DragDropFile } from "../../../components/DragAndDrop";

const UploadDocumentModal = ({ doc, show, onHide, onSuccess }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({
      isLoading: state.contracts.actionsLoading,
    }),
    shallowEqual
  );

  // if !id we should close modal
  useEffect(() => {
    if (!doc) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc]);

  useEffect(() => {
    setFilesSelected([])
  }, [show])

  // looking for loading/dispatch
  useEffect(() => { }, [isLoading, dispatch]);

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const uploaddocument = async () => {
    if (filesSelected.length > 0 && filesSelected[0]?.file[0]) {
      let file = filesSelected[0].file[0];
      let signed_document = await toBase64(file);
      const requestBody = {
        signed_document: {
          file_name: file.name,
          document: signed_document
        }
      };
      console.log('asd', requestBody)
      dispatch(actions.uploadDocumentContract(doc._id, requestBody)).then(() => {
        onHide();
        onSuccess();
      });
    }
  };

  const ref = React.useRef();

  // drag state
  const [dragActive, setDragActive] = React.useState(false);
  // ref
  const inputRef = React.useRef();

  // handle drag events
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // triggers when file is selected with click
  const handleDragChange = function (e) {
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
    //setFilesSelected(filesSelected.filter((_, i) => i !== index));
    setFilesSelected([]);
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };
  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Upload Signed Document
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          innerRef={ref}
          onSubmit={async (values, formikActions) => {
            // formikActions.resetForm({
            //   contracted_offer: "",
            // });
            uploaddocument();
          }}
        >
          {({ values, handleChange, handleSubmit, submitForm }) => {
            return (
              <Form className="form form-label-right" onDragEnter={handleDrag}>
                <div className="col form-group">
                  <div className="form-group ">
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
            onClick={uploaddocument}
          >
            Confirm
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadDocumentModal;

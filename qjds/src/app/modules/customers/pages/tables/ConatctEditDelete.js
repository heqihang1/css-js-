import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import * as uiHelpers from "../ProductsUIHelpers";
import { useDispatch } from "react-redux";
import { Table } from "../../../../components/Table";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../_metronic/_partials/controls";
// import * as actions from "../../_redux/customers/customersActions";
import { generateColumns } from "../../../../utils/customers/places/tableDeps";
import { isEqual, isFunction } from "lodash";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
} from "../../../../../_metronic/_partials/controls";
import Axios from "axios";
import { API_URL } from "../../../../API_URL";
import { Field, Form, Formik } from "formik";
import { useFormikContext } from "formik";
import {
  addContact,
  editContact,
  deleteContact,
} from "../../_redux/customers/customersCrud";
import Select from "react-select";

const ContactEditDelete = ({
  show,
  type,
  doc,
  custLoader,
  onHide,
  getcontacts,
  editCont,
  locationOptions,
}) => {
  
  const [editdata, setEditdata] = useState(
    doc || {
      contact_name: "",
      office_number: "",
      mobile_number: "",
      email: "",
      location_id: null,
      contact_position: "",
      fax_number: "",
      id: "",
    }
  );
  const ref = React.useRef();

  var handleSubmit = async () => {
    if (type == "edit") {
      ref.current.handleSubmit();
    } else {
      await deleteContact(doc?._id);
      onHide();
      getcontacts();
    }
  };

  function handleSelect(value) {}

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          {type == "edit" ? " Edit Contact" : " Delete Contact"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {type == "edit" ? (
          <Formik
            initialValues={doc}
            validationSchema={Yup.object().shape({
              contact_name: Yup.string().required("Contact name is required"),
              office_number: Yup.string().required(
                "Office/Home Phone is required"
              ),
              // email: Yup.string().email("Wrong email format").optional(),
              email: Yup.string().optional(),
            })}
            innerRef={ref}
            onSubmit={async (values, formikActions) => {
              formikActions.setSubmitting(true);
              const {
                _id,
                contact_name,
                office_number,
                mobile_number,
                email,
                location_id,
                contact_position,
                fax_number,
                ext,
              } = values;

              await editCont(
                {
                  contact_name,
                  office_number,
                  location_id: (location_id._id) ? location_id._id : location_id.value,
                  mobile_number,
                  email,
                  contact_position,
                  fax_number,
                  ext,
                },
                _id
              );
              // editLoc(values, values.id);

              // setEditdata(values, values.id);
              // getLocations();
              formikActions.resetForm({
                contact_name: "",
                office_number: "",
                mobile_number: "",
                email: "",
                location_id: null,
                contact_position: "",
                fax_number: "",
                ext: "",
              });
              onHide();
              await getcontacts();
            }}
          >
            {({
              values,
              handleChange,
              handleSubmit,
              submitForm,
              setFieldValue,
            }) => (
              <Form className="form form-label-right ">
                <div className="col form-group">
                  <div className="form-group  ">
                    <label>Contact name <span className="indicatory">*</span></label>
                    <Field
                      name="contact_name"
                      // disabled={disabled}
                      values={values.contact_name}
                      component={Input}
                      withFeedbackLabel={false}
                      placeholder="Contact name"
                    />
                  </div>
                  <div className="form-group">
                    <Field
                      name="email"
                      values={values.email}
                      // disabled={disabled}
                      component={Input}
                      withFeedbackLabel={false}
                      placeholder="Email"
                      label="Email"
                    />
                  </div>
                  <div className="form-group">
                    <label>Office/Home Phone <span className="indicatory">*</span></label>
                    <Field
                      name="office_number"
                      // disabled={disabled}
                      values={values.office_number}
                      component={Input}
                      withFeedbackLabel={false}
                      placeholder="Office/Home Phone"
                    />
                  </div>
                  <div className="form-group">
                    <Field
                      name="ext"
                      values={values.ext}
                      // disabled={disabled}
                      component={Input}
                      withFeedbackLabel={false}
                      placeholder="Ext."
                      label="Ext."
                    />
                  </div>
                  <div className="form-group">
                    <Field
                      name="fax_number"
                      values={values.fax_number}
                      // disabled={disabled}
                      component={Input}
                      withFeedbackLabel={false}
                      placeholder="Fax Number"
                      label="Fax Number"
                    />
                  </div>
                  <div className="form-group">
                    <Field
                      name="mobile_number"
                      values={values.mobile_number}
                      // disabled={disabled}
                      component={Input}
                      withFeedbackLabel={false}
                      placeholder="Cell Phone"
                      label="Cell Phone"
                    />
                  </div>
                  <div className="form-group">
                    {/* <Field
                      name="location_name"
                      values={values.location_name}
                      // disabled={disabled}
                      component={Input}
                      withFeedbackLabel={false}
                      placeholder="location name"
                      label="location name"
                    /> */}
                    <label>Location <span className="indicatory">*</span></label>
                    <Select
                      name="location_id"
                      options={locationOptions}
                      onChange={(option) => {
                        setFieldValue("location_id", option);
                      }}
                      value={locationOptions.filter((item) => item.value == values.location_id._id || item.value == values.location_id.value )}
                    />
                  </div>

                  <div className="form-group">
                    <Field
                      name="contact_position"
                      values={values.contact_position}
                      // disabled={disabled}
                      component={Input}
                      withFeedbackLabel={false}
                      placeholder="Contact Position"
                      label="Contact Position"
                    />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <span>Are you sure to permanently delete this Contact?</span>
        )}
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button
            type="button"
            onClick={onHide}
            className="btn btn-secondary btn-elevate"
          >
            Cancel
          </button>
          <> </>
          <button
            type="button"
            className="btn btn-primary btn-elevate"
            onClick={handleSubmit}
            disabled={custLoader}
          >
            {type == "edit" ? "Save" : "Delete"}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ContactEditDelete;

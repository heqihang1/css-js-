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

const locations = [
  {
    value: "62dfb91fdd246dad4202a77f",
    label: "US",
    _id: "1",
  },
  {
    value: "62eb999f1784a15781ccf02c",
    label: "china",
    _id: "2",
  },
  {
    value: "62eb99ab1784a15781ccf039",
    label: "london 123",
    _id: "3",
  },
];
const CreateContact = ({
  getcontacts,
  customer_id,
  locationOptions = [],
  custLoader,
  saveContact,
}) => {
  const [editdata] = useState({
    contact_name: "",
    office_number: "",
    mobile_number: "",
    location_id: "",
    email: "",
    contact_position: "",
    fax_number: "",
    ext: "",
  });

  return (
    <>
      <Formik
        initialValues={editdata}
        validationSchema={Yup.object().shape({
          contact_name: Yup.string().required("Contact name is required"),
          office_number: Yup.string().required("Office/Home Phone is required"),
          location_id: Yup.string().required("location name is required"),
          // email: Yup.string().email("Wrong email format").optional(),
          email: Yup.string().optional(),
        })}
        onSubmit={async (values, formikActions) => {
          formikActions.setSubmitting(true);
          const {
            contact_name,
            office_number,
            mobile_number,
            email,
            location_id,
            contact_position,
            fax_number,
            ext,
          } = values;

          await saveContact(
            {
              contact_name,
              office_number,
              location_id,
              mobile_number,
              email,
              contact_position,
              fax_number,
              ext,
            },
            customer_id
          );

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
          // setTimeout(async () => {
          //   await getcontacts();
          // }, 1000);
        }}
      >
        {({ values, handleChange, handleSubmit, setFieldValue, errors }) => (
          <Form className="form form-label-right ">
            <div className="row form-group mt-5">
              <div className="form-group col-6  ">
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
              <div className="form-group col-6">
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
              <div className="form-group col-6">
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
              <div className="form-group col-6">
                <Field
                  name="ext"
                  // disabled={disabled}
                  values={values.ext}
                  component={Input}
                  withFeedbackLabel={false}
                  placeholder="Ext."
                  label="Ext."
                />
              </div>
              <div className="form-group col-6">
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
              <div className="form-group col-6">
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
              <div className="form-group col-6">
                <label htmlFor="Location" style={{ display: "block" }}>
                  Location <span className="indicatory">*</span>
                </label>
                <Select
                  name="location_id"
                  options={locationOptions}
                  value={
                    locationOptions.length > 0
                      ? locationOptions.filter(
                          (x) => x.value === values.location_id
                        )
                      : null
                  }
                  onChange={(option) => {
                    setFieldValue("location_id", option?.value);
                  }}
                  // value={values.locations}
                />
                {errors.location_id && (
                  <label style={{ color: "red" }}>{errors.location_id}</label>
                )}
              </div>
              {/* <div className="form-group col-6">
                <Field
                  name="contact_position"
                  values={values.contact_position}
                  // disabled={disabled}
                  component={Input}
                  withFeedbackLabel={false}
                  placeholder="Contact Position"
                  label="Contact Position"
                />
              </div> */}
              <div className="form-group col-6">
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
            <div className="col-lg-2 ">
              <label className="d-block">&nbsp;</label>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginLeft: -10, marginTop: -15 }}
                onSubmit={handleSubmit}
                disabled={custLoader}
              >
                Add New Contact
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CreateContact;

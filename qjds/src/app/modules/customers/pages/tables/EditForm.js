import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import * as uiHelpers from "../ProductsUIHelpers";
import { Table } from "../../../../components/Table";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import SelectFilter from "react-select";
import { ModalProgressBar } from "../../../../../_metronic/_partials/controls";
// import * as actions from "../../_redux/customers/customersActions";
import { generateColumns } from "../../../../utils/customers/places/tableDeps";
import { isEqual, isFunction } from "lodash";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
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
import * as DisActions from "../../../sets/_redux/districts/districtsActions";

const EditDeleteForm = ({
  show,
  type,
  onHide,
  editLoc,
  locLoader,
  deleteLoc,
  getLocations,
  doc,
}) => {
  const dispatch = useDispatch();
  let editDoc = { ...doc, district: doc?.district ? doc?.district?._id : "" };
  const ref = React.useRef();

  const { districtsList } = useSelector(
    (state) => ({
      actionsLoading: state.customers.actionsLoading,
      districtsList: state.districts.entities || [],
    }),
    shallowEqual
  );

  const districtsOptions = districtsList?.map((x) => {
    return {
      label: `${x?.district_eng_name} (${x?.district_chi_name})`,
      value: x?._id,
    };
  });

  // const [editdata, setEditdata] = useState({
  //   location_name: "",
  //   location_address: "",
  //   id: "",
  // });

  var handleSubmit = async () => {
    if (type == "edit") {
      ref.current.handleSubmit();
    } else {
      await deleteLoc(doc._id);
      onHide();
      getLocations();
    }
  };

  useEffect(() => {
    dispatch(DisActions.findAllDistrictsList());
    // eslint-disable-next-line
  }, []);
  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          {type == "edit" ? "Location Edit" : "Location Delete"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {type == "edit" ? (
          <Formik
            initialValues={editDoc}
            validationSchema={Yup.object().shape({
              location_name: Yup.string().required(
                "Place name is required"
              ),
              location_address: Yup.string().required(
                "Location address is required"
              ),
              district: Yup.string().required("District is required"),
            })}
            innerRef={ref}
            onSubmit={async (values, formikActions) => {
              formikActions.setSubmitting(true);
              const { _id, location_address, location_name, district, location_remark, feet } = values;
              editLoc({ location_address, location_name, district, location_remark, feet }, _id);
              formikActions.resetForm({
                location_name: "",
                district: "",
                location_address: "",
                location_remark: "",
                feet: ""
              });
              onHide();
              await getLocations();
            }}
          >
            {({
              values,
              handleChange,
              handleSubmit,
              submitForm,
              setFieldValue,
              errors
            }) => {
              return (
                <Form className="form form-label-right">
                  <div className="col form-group">
                    <div className="form-group ">
                      <label>Place name <span className="indicatory">*</span></label>
                      <Field
                        name="location_name"
                        // disabled={disabled}
                        values={values.location_name}
                        component={Input}
                        withFeedbackLabel={false}
                        placeholder="place name"
                      />
                    </div>
                    <div className="form-group">
                      <label>District <span className="indicatory">*</span></label>
                      <SelectFilter
                        options={districtsOptions}
                        onChange={(opt) => {
                          if (opt) {
                            setFieldValue("district", opt.value);
                          } else {
                            setFieldValue("district", "");
                          }
                        }}
                        value={districtsOptions.filter(
                          (x) => x.value === values.district
                        )}
                      />
                      {errors.district && (
                        <label style={{ color: "red" }}>{errors.district}</label>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Address <span className="indicatory">*</span></label>
                      <Field
                        name="location_address"
                        // disabled={disabled}
                        values={values.location_address}
                        component={Input}
                        withFeedbackLabel={false}
                        placeholder="address"                        
                      />
                    </div>
                    <div className="form-group">
                      <Field
                        name="feet"
                        // disabled={disabled}
                        values={values.feet}
                        component={Input}
                        withFeedbackLabel={false}
                        placeholder="Feet"
                        label="Feet"
                        onChange={(opt) => {
                          setFieldValue("feet", opt.target.value);
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <Field
                        name="location_remark"
                        // disabled={disabled}
                        values={values.location_remark}
                        component={Input}
                        withFeedbackLabel={false}
                        placeholder="Location Remark"
                        label="Location Remark"
                      />
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        ) : (
          <>
            <p>Are you sure to permanently delete this location?</p>
            <strong>{doc.location_address}</strong>
          </>
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
            disabled={locLoader}
          >
            {type == "edit" ? "Save" : "Delete"}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default EditDeleteForm;

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
import SelectFilter from "react-select";
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
import EditDeleteFrom from "./EditForm";
import { typeOf } from "react-is";
import * as DisActions from "../../../sets/_redux/districts/districtsActions";

export default function PlacesTable({
  edit = false,
  saveLoc = null,
  deleteLoc,
  editLoc,
  locLoader,
  setLocationOptions,
  saveContact,
}) {
  const [doc, setDoc] = useState(null);
  const [type, setType] = useState("edit");
  const [show, setShow] = useState(false);

  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.customers.actionsLoading }),
    shallowEqual
  );

  const history = useHistory();
  const dispatch = useDispatch();

  const opneModal = (doc, type, loc) => {
    setType(type);
    setDoc(doc);
    setShow(true);
  };

  const onHide = () => {
    setShow(false);
  };

  const columns = generateColumns(history, edit, opneModal);
  const filter = () => {
    const initialFilter = {
      filter: {},
      sortOrder: "desc", // asc||desc
      sortField: "createdAt",
      pageNumber: 1,
      pageSize: 10,
    };

    return initialFilter;
  };

  const { productForEdit, districtsList } = useSelector(
    (state) => ({
      actionsLoading: state.customers.actionsLoading,
      productForEdit: state.customers.customerForEdit,
      districtsList: state.districts.entities || [],
    }),
    shallowEqual
  );

  const [queryParams, setQueryParamsBase] = useState(filter());
  const setQueryParams = useCallback((nextQueryParams) => {
    setQueryParamsBase((prevQueryParams) => {
      if (isFunction(nextQueryParams)) {
        nextQueryParams = nextQueryParams(prevQueryParams);
      }

      if (isEqual(prevQueryParams, nextQueryParams)) {
        return prevQueryParams;
      }

      return nextQueryParams;
    });
  }, []);

  const [locations, setlocations] = useState({ totalDocs: 0, docs: [] });
  const [defaultlocations, setDefaultlocations] = useState({
    totalDocs: 0,
    docs: [],
  });

  function getAllLocation() {
    let ids = productForEdit.location.map((loc) => loc._id);
    Axios.post(API_URL + "customers/customer/locations", {
        ...queryParams,
        pageNumber: 1,
        pageSize: 10000000,
        ids: ids.join(",")
    }).then((data) => {
      setLocationOptions(
        data.data.docs.map((item) => ({
          value: item._id,
          label: `${item.location_name} (${item.location_address})`,
        }))
      );
    });
  }

  function getLocations() {
    let ids = productForEdit.location.map((loc) => loc._id);
    Axios.post(API_URL + "customers/customer/locations", {
        ...queryParams,
        ids: ids.join(",")
    }).then((data) => {
      setlocations(data.data);
      setDefaultlocations(data.data);
      if (setLocationOptions) {
        getAllLocation()
      }
    });
  }

  const districtsOptions = districtsList?.map((x) => {
    return {
      label: `${x?.district_eng_name} (${x?.district_chi_name})`,
      value: x?._id,
    };
  });

  useEffect(() => {
    productForEdit && getLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams, dispatch, productForEdit]);
  const { totalDocs, docs } = locations;

  const paginationOptions = {
    custom: true,
    totalSize: totalDocs,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: queryParams.pageSize,
    page: queryParams.pageNumber,
  };

  const handleSearch = (searchTerm) => {
    const docs = defaultlocations.docs.filter((item) => {
      return Object.values(item).some((val) =>
        String(val)
          .toLowerCase()
          .includes(searchTerm)
      );
    });
    const totalDocs = docs.length;
    setlocations({ totalDocs, docs });
  };

  useEffect(() => {
    dispatch(DisActions.findAllDistrictsList());
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <Card>
        <CardHeader title="Location List"></CardHeader>
        <CardBody>
          <Table
            saveContact={saveContact}
            queryParams={queryParams}
            setQueryParams={setQueryParams}
            columns={columns}
            listLoading={false}
            entities={docs}
            paginationOptions={paginationOptions}
            handleSearch={(query) =>
              setQueryParamsBase({ ...queryParams, search: query, pageNumber: 1 })
            }
          />
          {edit && (
            <Formik
              initialValues={{
                location_name: "",
                district: "",
                location_address: "",
                location_remark: "",
                feet: ""
              }}
              validationSchema={Yup.object().shape({
                location_name: Yup.string().required(
                  "Location name is required"
                ),
                location_address: Yup.string().required(
                  "Location address is required"
                ),
                district: Yup.string().required("District is required"),
              })}
              onSubmit={(values, formikActions) => {
                formikActions.setSubmitting(true);
                saveLoc(values);
                getLocations();

                formikActions.resetForm({
                  location_name: "",
                  district: "",
                  location_address: "",
                  location_remark: "",
                  feet: ""
                });
              }}
            >
              {({ values, handleChange, handleSubmit, setFieldValue, errors }) => (
                <Form className="form form-label-right mt-9">
                  <div className="row form-group">
                    <div className="form-group col-lg-10">
                      <label>Location name <span className="indicatory">*</span></label>
                      <Field
                        name="location_name"
                        // disabled={disabled}
                        component={Input}
                        withFeedbackLabel={false}
                        placeholder="Location name"
                      />
                    </div>
                    {/* <div className="form-group col-lg-5">
                      <label>District</label>
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
                    </div> */}
                    <div className="form-group col-lg-5">
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
                    <div className="form-group col-lg-5">
                      <label> Address <span className="indicatory">*</span></label>
                      <Field
                        name="location_address"
                        // disabled={disabled}
                        component={Input}
                        withFeedbackLabel={false}
                        placeholder="address"
                      />
                    </div>
                    <div className="form-group col-lg-3">
                      <Field
                        name="feet"
                        // disabled={disabled}
                        component={Input}
                        withFeedbackLabel={false}
                        placeholder="Feet"
                        label="Feet"
                      />
                    </div>
                    <div className="form-group col-lg-9">
                      <Field
                        name="location_remark"
                        // disabled={disabled}
                        component={Input}
                        withFeedbackLabel={false}
                        placeholder="Location Remark"
                        label="Location Remark"
                      />
                    </div>
                    <div className="col-lg-2">
                      <label className="d-block">&nbsp;</label>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onSubmit={() => handleSubmit()}
                        disabled={locLoader}
                      >
                        Add New Location
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </CardBody>
      </Card>
      <EditDeleteFrom
        locLoader={locLoader}
        show={show}
        type={type}
        doc={doc}
        onHide={onHide}
        editLoc={editLoc}
        deleteLoc={deleteLoc}
        getLocations={getLocations}
      />
    </>
  );
}

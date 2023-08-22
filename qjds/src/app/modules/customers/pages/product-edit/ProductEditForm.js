import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import * as actions from "../../_redux/customers/customersActions";
import * as ComSecActions from "../../../sets/_redux/commercialSector/commercialSectorActions";
import * as DisActions from "../../../sets/_redux/districts/districtsActions";
import SelectFilter from "react-select";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { Input, Select } from "../../../../../_metronic/_partials/controls";
import Axios from "axios";
import { API_URL } from "../../../../API_URL";
import { checkPermission } from "../../../../utils/utils";

const initProduct = {
  customer_type: "Personal",
  customer_name: "",
  commercial_sector: [],
  email: "",
  customer_remark: "",
  customer_referral: false,
  recommend_by: '',
  office_number: "",
  fax_number: "",
  mobile_number: "",
  customer_officer: "",
  business_source: "",
  location_address: "",
  location_name: "",
  contract_email: "",
  contact_name: "",
  contact_address: "",
  contact_position: "",
  contract_office_number: "",
  contract_mobile_number: "",
  contract_fax_number: "",
  ext: "",
};

export function ProductEditForm({
  product,
  btnRef,
  saveProduct,
  resetRef,
  disabled = false,
}) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [users, setusers] = useState([]);
  const [reIntial, setReIntial] = useState(true);

  const business_sourcies = [
    {
      label: 'Facebook',
      value: 'Facebook'
    },
    {
      label: 'Instagram',
      value: 'Instagram'
    },
    {
      label: 'Google',
      value: 'Google'
    },
    {
      label: '轉介',
      value: '轉介'
    },
    {
      label: 'Other',
      value: 'Other'
    }
  ]

  const customersList = useSelector((state) => state.customers)?.entities || [];
  const commercialSecList = useSelector(
    (state) => state?.commercialSectors?.entities || []
  );
  const { districtsList } = useSelector(
    (state) => ({
      districtsList: state.districts.entities || [],
    }),
    shallowEqual
  );
  const companyCustomers = customersList;

  const isCustomerOrNot = (cName = "") => {
    if (product.customer.customer_name === cName.trim()) {
      return true;
    } else {
      const checkCompNames = companyCustomers.filter(
        (x) => x.customer_name === cName.trim()
      );
      return checkCompNames?.length > 0 ? false : true;
    }
  };

  // Validation schema  // 表单校验 
  const ProductEditSchema = Yup.object().shape({
    customer_name: Yup.string()
      .required("Customer name is required")
      .test(
        "customer_name",
        "Company name already in use. choose another one.",
        function (val) {
          dispatch(
            actions.findCustomers({
              pageSize: 10,
              filter: { customer_type: "Company" },
              search: val,
              do_not_search_customer: true
            })
          );
          return this.parent.customer_type === "Personal"
            ? true
            : isCustomerOrNot(val);
        }
      )
      .test(
        "customer_name",
        "Don't allow special characters ?, *, +, {, }, [, ], \\, ^ and $",
        function (val) {
          return (val && (val.includes('?') || 
                  val.includes('*') ||
                  val.includes('+') ||
                  val.includes('{') ||
                  val.includes('}') ||
                  val.includes('[') ||
                  val.includes(']') ||
                  val.includes("\\") ||
                  val.includes('^') ||
                  val.includes('$'))) ? false : true
        }
      ),
    customer_type: Yup.string().required("Customer type is required"),
    // email: Yup.string().email("Wrong email format").optional(),
    email: Yup.string().optional(),
    district: Yup.string().required("District is required"),
    customer_remark: Yup.string().optional(),
    customer_referral: Yup.string().optional(),
    recommend_by: Yup.string().optional(),
    office_number: Yup.string().optional(),
    ext: Yup.string().optional(),
    fax_number: Yup.string().optional(),
    mobile_number: Yup.string().optional(),
    customer_officer: Yup.string().optional(),
    business_source: Yup.string().optional(),
    location_address: Yup.string().required(),
    location_name: Yup.string().optional(),
    //contact_email: Yup.string().email("Wrong email format").optional(),
    contact_name: Yup.string()
      .required("Contact name is required")
      .min(2)
      .max(255),
    contact_address: Yup.string().optional(),
    contact_position: Yup.string().optional(),
  });

  useEffect(() => {
    async function getUsers() {
      const data = await Axios.get(API_URL + "users?all=true");
      const salesDeptUsers = data.data.users
        .filter((x) => x?.department === "Sales" && x?.status === "active")
        .map((x) => {
          return {
            label: (
              <div className="d-flex align-items-center">
                {x?.profile_pic ? (
                  <Avatar
                    src={x?.profile_pic}
                    alt={String(
                      x?.displayname ? x?.displayname : x?.username
                    ).toUpperCase()}
                    style={{ width: 28, height: 28, marginRight: 10 }}
                  />
                ) : (
                  <Avatar style={{ width: 28, height: 28, marginRight: 10 }}>
                    {String(
                      x?.displayname ? x?.displayname : x?.username
                    )[0].toUpperCase()}
                  </Avatar>
                )}

                {x?.displayname ? x?.displayname : x.username}
              </div>
            ),
            value: x?.displayname ? x?.displayname : x.username,
          };
        });
      setusers(salesDeptUsers);
    }
    getUsers();
  }, []);

  useEffect(() => {
    if (
      product.customer.customer_name &&
      product.customer.customer_name !== ""
    ) {
      dispatch(
        actions.findCustomers({
          pageSize: 10,
          filter: { customer_type: "Company" },
          search: product.customer.customer_name,
          do_not_search_customer: true
        })
      );
    }
    // eslint-disable-next-line
  }, [product.customer.customer_name]);

  useEffect(() => {
    dispatch(ComSecActions.findAllCommercialSectorsList());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (product) {
      dispatch(DisActions.findAllDistrictsList(product.location[0]?.district || ""));
    }
  }, [product])

  let ids = []
  if (product?.customer?.commercial_sector) {
    product.customer.commercial_sector.filter((item) => {
      ids.push(item._id)
    })
  }
  const commercialSecOptions = []
  commercialSecList.filter((x) => {
    if (x.status || ids.includes(x?._id)) {
      commercialSecOptions.push({
        label: x?.commercial_sector_name,
        value: x?._id
      })
    }
  });

  const districtsOptions = districtsList?.map((x) => {
    return {
      label: `${x?.district_eng_name} (${x?.district_chi_name})`,
      value: x?._id,
    };
  });

  useEffect(() => {
    setTimeout(() => {
      setReIntial(false)
    }, [2000])
  }, [])

  return (
    <>
      <Formik
        enableReinitialize={reIntial}
        initialValues={{
          ...product.customer,
          ...product.location[0],
          customer_type: product.customer.customer_type
            ? product.customer.customer_type
            : "Personal",
          customer_referral: product.customer.customer_referral
            ? product.customer.customer_referral
            : false,
          district: product.location[0]?.district || "",
          commercial_sector: product?.customer?.commercial_sector
            ? product?.customer?.commercial_sector?.map((x) => x._id)
            : [],
          contact_email: product.contact[0]?.email,
          contact_name: product.contact[0]?.contact_name,
          contact_address: product.contact[0]?.contact_address,
          contact_position: product.contact[0]?.contact_position,
          contact_office_number: product.contact[0]?.office_number,
          contact_mobile_number: product.contact[0]?.mobile_number,
          contact_fax_number: product.contact[0]?.fax_number,
          ext: product.customer.ext,
        }}
        validationSchema={ProductEditSchema}
        onSubmit={(values) => {
          if (disabled) return;
          let newCustomer = {
            customer: {
              customer_type: values.customer_type,
              customer_name: values.customer_name,
              email: values.email,
              customer_remark: values.customer_remark,
              customer_referral: values.customer_referral,
              recommend_by: values.recommend_by,
              office_number: values.office_number,
              ext: values.ext,
              fax_number: values.fax_number,
              mobile_number: values.mobile_number,
              customer_officer: values.customer_officer,
              business_source: values.business_source,
              create_by: user.username,
              commercial_sector: values.commercial_sector,
            },
            location: {
              location_address: values.location_address,
              district: values.district,
              location_name: id ? values.location_name : "Main",
            },
            contact: {
              email: values.email,
              contact_name: values.contact_name,
              contact_address: values.contact_address,
              contact_position: values.contact_position,
              office_number: values.office_number,
              mobile_number: values.mobile_number,
              fax_number: values.fax_number,
            },
          };
          saveProduct(newCustomer);
        }}
      >
        {({
          handleSubmit,
          resetForm,
          handleChange,
          setFieldValue,
          values,
          errors,
        }) => (
          <>
            <Form className="form form-label-right">
              {values.customer_type === "Company" ? (
                <div className="form-group">
                  <label htmlFor="model" className="mr-5">
                    Type <span className="indicatory">*</span>
                  </label>
                  <div className="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      disabled={disabled}
                      className="custom-control-input"
                      id="defaultInline1"
                      value={"Company"}
                      name="customer_type"
                      checked={
                        values.customer_type === "Company" ? true : false
                      }
                      onChange={handleChange}
                    />
                    <label
                      style={
                        values.customer_type === "Company"
                          ? { color: "dodgerblue" }
                          : {}
                      }
                      className="custom-control-label"
                      htmlFor="defaultInline1"
                    >
                      Company
                    </label>
                  </div>

                  <div className="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      disabled={disabled}
                      className="custom-control-input"
                      id="defaultInline2"
                      name="customer_type"
                      value={"Personal"}
                      checked={
                        values.customer_type === "Personal" ? true : false
                      }
                      onChange={handleChange}
                    />
                    <label
                      style={
                        values.customer_type === "Personal"
                          ? { color: "dodgerblue" }
                          : {}
                      }
                      className="custom-control-label"
                      htmlFor="defaultInline2"
                    >
                      Personal
                    </label>
                  </div>
                </div>
              ) : (
                <div className="form-group">
                  <label htmlFor="model" className="mr-5">
                    Type <span className="indicatory">*</span>
                  </label>
                  <div className="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      disabled={disabled}
                      className="custom-control-input"
                      id="defaultInline1"
                      value={"Company"}
                      checked={
                        values.customer_type === "Company" ? true : false
                      }
                      name="customer_type"
                      onChange={handleChange}
                    />
                    <label
                      style={
                        values.customer_type === "Company"
                          ? { color: "dodgerblue" }
                          : {}
                      }
                      className="custom-control-label"
                      htmlFor="defaultInline1"
                    >
                      Company
                    </label>
                  </div>

                  <div className="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      disabled={disabled}
                      className="custom-control-input"
                      id="defaultInline2"
                      name="customer_type"
                      value={"Personal"}
                      checked={
                        values.customer_type === "Personal" ? true : false
                      }
                      onChange={handleChange}
                    />
                    <label
                      style={
                        values.customer_type === "Personal"
                          ? { color: "dodgerblue" }
                          : {}
                      }
                      className="custom-control-label"
                      htmlFor="defaultInline2"
                    >
                      Personal
                    </label>
                  </div>
                </div>
              )}

              {values.customer_type !== "Personal" && (
                <div className="form-group">
                  <label>Commercial Sector</label>
                  <SelectFilter
                    isDisabled={disabled}
                    options={commercialSecOptions}
                    isMulti
                    onChange={(opt) => {
                      if (opt) {
                        setFieldValue(
                          "commercial_sector",
                          opt.map((x) => x.value)
                        );
                      } else {
                        setFieldValue("commercial_sector", []);
                      }
                    }}
                    value={commercialSecOptions.filter((x) => {
                      return values?.commercial_sector.indexOf(x.value) !== -1;
                    })}
                  />
                </div>
              )}

              <div className="form-group">
                <label>person/company name <span className="indicatory">*</span></label>
                <Field
                  name="customer_name"
                  disabled={disabled}
                  component={Input}
                  withFeedbackLabel={false}
                  placeholder="person/company name"
                />
                {errors?.customer_name && (
                  <label style={{ color: "red" }}>
                    {errors?.customer_name}
                  </label>
                )}
              </div>
              <div className="form-group">
                <label>District <span className="indicatory">*</span></label>
                <SelectFilter
                  isDisabled={disabled}
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
                {errors?.district && (
                  <label style={{ color: "red" }}>
                    {errors?.district}
                  </label>
                )}
              </div>
              <div className="form-group">
                <label>Address <span className="indicatory">*</span></label>
                <Field
                  disabled={disabled}
                  name="location_address"
                  component={Input}
                  placeholder="adrress"
                  withFeedbackLabel={false}
                />
              </div>
              <div className="form-group row">
                <div className="col-lg-4">
                  <label>Contact Person <span className="indicatory">*</span></label>
                  <Field
                    disabled={disabled}
                    withFeedbackLabel={false}
                    name="contact_name"
                    component={Input}
                    placeholder="Contact Person"
                  />
                </div>
                <div className="col-lg-4">
                  <Field
                    withFeedbackLabel={false}
                    disabled={disabled}
                    name="contact_position"
                    component={Input}
                    placeholder="Contact Person Jobs"
                    label="Contact Person Jobs"
                  />
                </div>
              </div>
              <div className="form-group">
                <Field
                  withFeedbackLabel={false}
                  disabled={disabled}
                  name="email"
                  component={Input}
                  placeholder="Email"
                  label="Email"
                />
              </div>
              <div className="form-group row">
                <div className="col-lg-4">
                  <Field
                    withFeedbackLabel={false}
                    disabled={disabled}
                    name="office_number"
                    component={Input}
                    placeholder="Office Phone"
                    label="Office Phone"
                  />
                </div>
                <div className="col-lg-4">
                  <Field
                    withFeedbackLabel={false}
                    disabled={disabled}
                    name="ext"
                    component={Input}
                    placeholder="Ext."
                    label="Ext."
                  />
                </div>
                {/* <div className="col-lg-4">
                  <Field
                    disabled={disabled}
                    name="no_office"
                    component={Input}
                    placeholder="Office Phone"
                    label="Number of the office"
                  />
                </div> */}
                <div className="col-lg-4">
                  <Field
                    withFeedbackLabel={false}
                    disabled={disabled}
                    name="mobile_number"
                    component={Input}
                    placeholder="Cell Phone"
                    label="Cell Phone"
                  />
                </div>
              </div>
              <div className="form-group row">
                <div className="col-lg-4">
                  <Field
                    withFeedbackLabel={false}
                    disabled={disabled}
                    name="fax_number"
                    component={Input}
                    placeholder="Fax"
                    label="Fax"
                  />
                </div>
              </div>
              <div className="form-group row">
                <div className="col-lg-4">
                  <label>Business Source</label>
                  <SelectFilter
                    isDisabled={disabled}
                    options={business_sourcies}
                    onChange={(opt) => {
                      setFieldValue("business_source", (opt?.value) ? opt.value : '');
                    }}
                    value={(values?.business_source) ? business_sourcies.filter(
                        (x) => x?.value === values?.business_source
                      )[0] : ''
                    }
                    isClearable={true}
                  />
                </div>
                <div className="col-lg-4 mt-10">
                  <label htmlFor="model" className="pr-4">
                    Customer Referrals
                  </label>
                  <div className="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      className="custom-control-input"
                      id="customer_referral1"
                      name="customer_referral"
                      disabled={disabled}
                      checked={
                        values.customer_referral === true ? true : false
                      }
                      onClick={() => { setFieldValue("customer_referral", true) }}
                    />
                    <label
                      style={
                        values.customer_referral === true
                          ? { color: "dodgerblue" }
                          : {}
                      }
                      className="custom-control-label"
                      htmlFor="customer_referral1"
                    >
                      Yes
                    </label>
                  </div>

                  <div className="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      className="custom-control-input"
                      id="customer_referral2"
                      name="customer_referral"
                      disabled={disabled}
                      checked={
                        values.customer_referral === false ? true : false
                      }
                      onClick={() => { setFieldValue("customer_referral", false)}}
                    />
                    <label
                      style={
                        values.customer_referral === false
                          ? { color: "dodgerblue" }
                          : {}
                      }
                      className="custom-control-label"
                      htmlFor="customer_referral2"
                    >
                      No
                    </label>
                  </div>
                </div>
                { values.customer_referral ? <div className="col-lg-4">
                  <Field
                    withFeedbackLabel={false}
                    disabled={disabled}
                    name="recommend_by"
                    component={Input}
                    placeholder="Referrals By"
                    label="Referrals By"
                  />
                </div> : '' }
              </div>

              <div className="form-group">
                <Field
                  withFeedbackLabel={false}
                  disabled={disabled}
                  name="customer_remark"
                  component={Input}
                  placeholder="Customer Remark"
                  label="Customer Remark"
                />
              </div>
              <div className="form-group">
                <label>Customer Officer <span className="indicatory">*</span></label>
                <SelectFilter
                  // isDisabled={
                  //   id
                  //     ? !checkPermission("CUSTOMER_OFFICER", "can_edit")
                  //     : false
                  // }
                  isDisabled={ disabled ? true : id ? !checkPermission("CUSTOMER_OFFICER", "can_edit") : false }
                  options={users}
                  onChange={(opt) => {
                    setFieldValue("customer_officer", opt.value);
                  }}
                  value={
                    users.filter(
                      (x) => x?.value === values?.customer_officer
                    )[0]
                  }
                />
              </div>
              {/* <div className="form-group">
                <label>Description</label>
                <Field
                  name="description"
                  as="textarea"
                  className="form-control"
                />
              </div> */}
              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>
              <button
                style={{ display: "none" }}
                ref={resetRef}
                onClick={() => resetForm({ values: {...initProduct, customer_officer: values?.customer_officer} })}
                type="button"
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

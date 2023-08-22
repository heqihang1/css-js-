import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { Input, Select } from "../../../../../_metronic/_partials/controls";
import { ModalProgressBar } from "../../../../../_metronic/_partials/controls";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import PricingCard from "./PricingCard";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FormLabel } from "react-bootstrap";
import { Editor } from "../../../../components/Editor";
import SearchSelect from "react-select/creatable";
import { useLocation } from "react-router-dom";
import SelectFilter from "react-select";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Checkbox from '@material-ui/core/Checkbox';
import * as districtActions from "../../../sets/_redux/districts/districtsActions";
import * as customersActions from "../../../customers/_redux/customers/customersActions";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export function ProductEditForm({
  product,
  saveProduct,
  disabled = false,
  actionsLoading,
  users = [],
  loader = false,
  paymentMethods = [],
  remarks = [],
  services = [],
  serSearchCustomer = "",
}) {
  let {
    worker,
    expected_job_date,
    end_job_date,
    service_visit_notes,
    services: currentServices,
    customer_contact_no,
    remark
  } = product;
  let initialService = {
    desc: "",
  };
  const dispatch = useDispatch();
  const [disabledSelect, setDisabled] = useState(false);
  const [selServices, setservices] = useState([{ id: 0, ...initialService }]);
  const contact_personRef = React.useRef(null);
  const [customer, setCustomer] = useState();
  const [contact_person, setContactPerson] = useState(null);
  const [working_location, setWorkingLocation] = useState();
  const [contactNo, setContactNo] = useState(null);
  let [defaultPlaces, setDefaultPlaces] = useState("");
  const placesRef = React.useRef(null);
  const [checkbox, setCheckbox] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const { districts, customers } = useSelector(
    (state) => ({
      districts: state.districts.entities,
      customers: state.customers.entities,
    }),
    shallowEqual
  );

  const districtOptions =
    districts?.map((x) => {
      return {
        label: x.district_eng_name,
        value: x._id,
      };
    }) || [];

  useEffect(() => {
    dispatch(districtActions.findAllDistrictsList());
  }, []);

  let removeService = (id) => {
    let remServices = selServices.filter((selService) => selService.id !== id);
    setservices(remServices);
  };

  const [options, setOptions] = useState([]);
  const addNewItem = (e) => {
    e.preventDefault();
    setservices([
      ...selServices,
      { id: selServices.length + 1, initialService },
    ]);
  };

  const setService = (id, service) => {
    setservices(
      selServices.map((item) =>
        item.id === id
          ? {
              ...item,
              service: service
                ? services.find((myserv) => myserv._id === service)
                : null,
              desc: services.find((myserv) => myserv._id === service)
                .service_content,
            }
          : item
      )
    );
  };

  function redirectContractQuotationPage() {
    if (product?.contract_id && product?.contract_id != "") {
      window.open(`/contracts/${product?.contract_id}/details`);
    } else if (product?.quotation_id && product?.quotation_id != "") {
      window.open(`/quotes/${product?.quotation_id}/details`);
    }
  }

  const setDescription = (id, description, itemIndex) => {
    const tempData = [...selServices]
    tempData[itemIndex].desc = description
    setService(tempData)
    // setservices(
    //   selServices.map((item) =>
    //     item.id === id
    //       ? {
    //         ...item,
    //         desc,
    //       }
    //       : item
    //   )
    // );
  };
  function onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    let newitems = reorder(
      selServices,
      result.source.index,
      result.destination.index
    );

    setservices(newitems);
  }
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  let editorRef = React.useRef();

  useEffect(() => {
    if (product?.services && product?.services?.length > 0) {
      setservices(
        currentServices.map((service, index) => ({
          id: index,
          service: service?.service_id,
          desc: service?.desc,
        }))
      );
    }

    if (product?.customer_id) {
      dispatch(
        customersActions.findCustomers({
          pageSize: 100,
          filter: { _id: product?.customer_id?._id },
          customer_id: product?.customer_id?._id
        })
      );
    }
    if (customers && customers.length > 0 && product?.customer_id) {
      customers.filter((item) => {
        if (item._id == product?.customer_id._id) {
          setCustomer({
            label: item.customer_name,
            value: item._id,
            cp: item.contact_person,
            location_id: item.location_id,
          });
        }
      });
    }
    if (customer_contact_no) {
      setContactNo({ label: customer_contact_no, value: customer_contact_no });
    }
    if (product?.contact_person) {
      setContactPerson({
        label: product?.contact_person,
        value: product?.contact_person,
      });
      setCheckbox(product.hide_cusotmer_information)
      // setContactPerson({
      //   label: product?.contact_person.contact_name,
      //   value: product?.contact_person._id,
      // });
    }
    if (product?.working_location) {
      setWorkingLocation({
        value: product?.working_location._id,
        label: `(${product?.working_location.location_name}) ${product?.working_location.location_address}`,
      });
    }
  }, [id, options, product]);

  useEffect(() => {
    if (customers && customers.length > 0 && product?.customer_id) {
      customers.filter((item) => {
        if (item._id == product?.customer_id?._id) {
          setCustomer({
            label: item.customer_name,
            value: item._id,
            cp: item.contact_person,
            location_id: item.location_id,
          });
        }
      });
    }
  }, [customers]);

  // Validation schema
  const ProductEditSchema = Yup.object().shape({
    end_job_date: Yup.string().required("Job end date is required")
  });

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          expected_job_date: expected_job_date
            ? moment(expected_job_date).format("YYYY-MM-DD HH:mm")
            : "",
          end_job_date: end_job_date
            ? moment(end_job_date).format("YYYY-MM-DD HH:mm")
            : "",
          worker: worker,
          service_visit_notes: service_visit_notes ? service_visit_notes : "",
          remark: remark ? remark : ""
          // customer_contact_no: customer_contact_no ? customer_contact_no : "",
        }}
        validationSchema={ProductEditSchema}
        onSubmit={(values) => {
          values.expected_job_date = values.expected_job_date
            ? new Date(values.expected_job_date)
            : "";
          values.end_job_date = values.end_job_date
            ? new Date(values.end_job_date)
            : "";
          values.contact_person = contact_person?.value;
          values.customer_contact_no = contactNo?.value;
          values.working_location = working_location?.value
            ? working_location.value
            : null;
            
          values.hide_cusotmer_information = checkbox; // hide按钮
          let finalProduct = {};
          let myservs = [];
          for (let service of selServices) {
            myservs.push({
              title: service?.service?.service_name,
              service_id: service?.service?._id,
              desc: service?.desc,
            });
          }
          finalProduct = {
            ...values,
            services: myservs,
          };
          console.log("data", finalProduct);
          saveProduct(finalProduct);
        }}
      >
        {({ handleSubmit, handleChange, errors, values, setFieldValue }) => {
          return (
            <div className="d-flex" style={{position:'relative'}}>
              <div className="col-lg-9">
                <Card>
                  <CardBody>
                    <div className="mt-5">
                      <Form className="form form-label-right">
                        <div
                          className="form-group row justify-content-between"
                          style={{
                            borderBottom: "1px solid",
                            paddingBottom: "15px",
                          }}
                        >
                          <div className="col-lg-6">
                            <input
                              style={{
                                position: "absolute",
                                maxHeight: "84px",
                              }}
                              type="image"
                              src="/media/details_logo.png"
                              className="img-fluid"
                              alt="Image logo"
                            />
                          </div>
                          <div className="col-lg-3 d-flex justify-content-end align-items-center mt-3">
                            Worker
                          </div>
                          <div className="col-lg-3 mt-3">
                            <Field
                              name="worker"
                              type="text"
                              customFeedbackLabel={true}
                              component={Input}
                            />
                          </div>
                          <div className="col-lg-6"></div>
                          <div className="col-lg-3 d-flex justify-content-end align-self-center mt-3">
                            Expected Job Date
                          </div>
                          <div className="col-lg-3 mt-3">
                            <Field
                              name="expected_job_date"
                              type="datetime-local"
                              component={Input}
                            />
                          </div>
                          <div className="col-lg-6"></div>
                          <div className="col-lg-3 d-flex justify-content-end align-self-center mt-3">
                            Job End Date <span className="indicatory">*</span> 
                          </div>
                          <div className="col-lg-3 mt-3">
                            <Field
                              name="end_job_date"
                              type="datetime-local"
                              component={Input}
                            />
                          </div>
                        </div>

                        <div className="job-order-content">
                          <p className="table-section-title" style={{display:'flex'}}>
                            <strong>A. Customer Information</strong>
                            <div>
                              <Checkbox
                                checked={checkbox}
                                value={checkbox}
                                onChange={()=>{
                                  setCheckbox(!checkbox)
                                }}
                                color="default"
                                style={{padding:'0',margin:'0 8px 0 30px'}}
                                inputProps={{ 'aria-label': 'checkbox with default color' }}
                              />
                              <span>Hide customer information</span>
                            </div>
                          </p>

                          <table style={{ fontSize: "16px", width: "100%" }}>
                            <thead>
                              <tr>
                                <td colSpan={4}>
                                  Quotation/Contract Number :&nbsp;{" "}
                                  <span>
                                    <strong>
                                      {product?.quote_contract_no
                                        ? `#${product?.quote_contract_no}`
                                        : null}
                                    </strong>
                                  </span>
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td
                                  style={{ width: "15%", verticalAlign: "top" }}
                                >
                                  <strong>Customer Name:</strong>
                                </td>
                                <td
                                  style={{ width: "35%", verticalAlign: "top" }}
                                >
                                  {product?.customer_id?.customer_name || "N/A"}
                                </td>
                              </tr>

                              <tr>
                                <td
                                  style={{ width: "15%", verticalAlign: "top" }}
                                >
                                  <strong>Address:</strong>
                                </td>
                                <td
                                  style={{ width: "35%", verticalAlign: "top" }}
                                >
                                  {(product?.customer_id?.location_id &&
                                    product?.customer_id?.location_id[0]
                                      ?.location_address) ||
                                    "N/A"}
                                </td>

                                <td
                                  style={{ width: "20%", verticalAlign: "top" }}
                                >
                                  <strong>Customer Fax No. :</strong>
                                </td>
                                <td
                                  style={{ width: "30%", verticalAlign: "top" }}
                                >
                                  {product?.customer_id?.fax_number || "N/A"}
                                </td>
                              </tr>

                              <tr>
                                <td
                                  style={{ width: "15%", verticalAlign: "top" }}
                                >
                                  <strong>Email:</strong>
                                </td>
                                <td
                                  style={{ width: "35%", verticalAlign: "top" }}
                                >
                                  {product?.customer_id?.email || "N/A"}
                                </td>

                                <td
                                  style={{ width: "20%", verticalAlign: "top" }}
                                >
                                  <strong>Service Hotline :</strong>
                                </td>
                                <td
                                  style={{ width: "30%", verticalAlign: "top" }}
                                >
                                  {product?.customer_id?.customer_officer_id
                                    ?.hotline || "N/A"}
                                </td>
                              </tr>

                              <tr>
                                <td
                                  style={{ width: "15%", verticalAlign: "top" }}
                                >
                                  <strong>Contact Person :</strong>
                                </td>
                                <td
                                  colSpan={3}
                                  style={{ width: "85%", verticalAlign: "top" }}
                                >
                                  {/* {product?.customer_id?.contact_person_old ||
                                    "N/A"} */}
                                  {/* <Field
                                    name="contact_person"
                                    value={contact_person}
                                    onChange={(e) => {
                                      setContactPerson(e.target.value);
                                    }}
                                    type="text"
                                    customFeedbackLabel={true}
                                    component={Input}
                                  /> */}

                                  <SearchSelect
                                    name="contact_person"
                                    options={
                                      customers && customer
                                        ? customer.cp.map((cp) => {
                                            return {
                                              label: cp.contact_name,
                                              value: cp.contact_name,
                                              item: cp
                                            };
                                          })
                                        : []
                                    }
                                    placeholder="Select Contact Person"
                                    onChange={(opt) => {
                                      setContactPerson(opt);
                                      setContactNo({
                                        label: opt?.item?.office_number,
                                        value: opt?.item?.office_number
                                      });
                                    }}
                                    value={contact_person}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style={{ width: "20%", verticalAlign: "top" }}
                                >
                                  <strong>Customer Contact No. :</strong>
                                </td>
                                <td
                                  // style={{ width: "30%", verticalAlign: "top" }}
                                  colSpan={3}
                                  style={{ width: "85%", verticalAlign: "top" }}
                                >
                                  {/* <Field
                                    name="customer_contact_no"
                                    type="text"
                                    customFeedbackLabel={true}
                                    component={Input}
                                  /> */}
                                  <SearchSelect
                                    name="customer_contact_no"
                                    options={
                                      customers && customer
                                        ? customer.cp.map((cp) => {
                                            return {
                                              label: cp.office_number,
                                              value: cp.office_number,
                                            };
                                          })
                                        : []
                                    }
                                    placeholder="Select Contact No."
                                    onChange={(opt) => {
                                      setContactNo(opt);
                                    }}
                                    value={contactNo}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style={{ width: "15%", verticalAlign: "top" }}
                                >
                                  <strong>Working Location :</strong>
                                </td>
                                <td
                                  colSpan={3}
                                  style={{ width: "85%", verticalAlign: "top" }}
                                >
                                  {/* <ul>
                                    {product?.places?.map((x, index) => {
                                      return (
                                        <li key={index}>
                                          {x?.location_address}
                                        </li>
                                      );
                                    })}
                                  </ul> */}

                                  <SelectFilter
                                    name="working_location"
                                    options={
                                      customers && customer
                                        ? customer.location_id.map(
                                            (location) => ({
                                              value: location._id,
                                              label: `(${location.location_name}) ${location.location_address}`,
                                            })
                                          )
                                        : []
                                    }
                                    placeholder="Select Working Location"
                                    onChange={(opt) => {
                                      setWorkingLocation(opt);
                                    }}
                                    value={working_location}
                                  />
                                </td>
                              </tr>

                              <tr>
                                <td
                                  style={{ width: "20%", verticalAlign: "top" }}
                                >
                                  <strong>Remark :</strong>
                                </td>
                                <td
                                  colSpan={3}
                                  style={{ width: "85%", verticalAlign: "top" }}
                                >
                                  <Field
                                    name="remark"
                                    type="text"
                                    customFeedbackLabel={true}
                                    component={Input}
                                  />
                                </td>
                              </tr>

                            </tbody>
                          </table>

                          <p className="table-section-title">
                            <strong>B. Service Item</strong>
                          </p>
                        </div>

                        <div className="w-full mt-2">
                          <Card>
                            <CardBody>
                              <DragDropContext
                                onDragEnd={(result) => onDragEnd(result)}
                                css={{ height: "100%" }}
                              >
                                <Droppable droppableId="droppable">
                                  {(provided, snapshot) => (
                                    <div
                                      {...provided.droppableProps}
                                      ref={provided.innerRef}
                                    >
                                      {selServices.map((item, index) => {
                                        return (
                                          <Draggable
                                            index={index}
                                            key={item.id}
                                            draggableId={item.id.toString()}
                                          >
                                            {(provided, snapshot) => (
                                              <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{
                                                  userSelect: "none",
                                                  padding: "16px",
                                                  margin: "0 0 8px 0",
                                                  backgroundColor: snapshot.isDragging
                                                    ? "#F7FCFF"
                                                    : "#ffffff",
                                                  boxShadow:
                                                    "0px 2px 2px 0px rgba(0,0,0,0.2)",
                                                  ...provided.draggableProps
                                                    .style,
                                                }}
                                                className="mt-8 mb-8 rounded"
                                              >
                                                <PricingCard
                                                  services={services}
                                                  disabled={disabled}
                                                  item={item}
                                                  removeItem={removeService}
                                                  setDescription={
                                                    setDescription
                                                  }
                                                  setService={setService}
                                                  itemIndex={index}
                                                />
                                              </div>
                                            )}
                                          </Draggable>
                                        );
                                      })}
                                    </div>
                                  )}
                                </Droppable>
                              </DragDropContext>
                            </CardBody>
                          </Card>
                          <div className="pt-0 pb-0 mb-10 d-flex justify-content-end">
                            <button
                              className="btn btn-primary ml-10 mr-10"
                              onClick={addNewItem}
                            >
                              Add Item
                            </button>
                          </div>
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>
              </div>
              <div className="ml-4 mr-4 col-lg-3">
                <Card style={{position:'fixed', width:'16%'}}>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="btn btn-primary m-3 ml-10 mr-10"
                    disabled={loader}
                  >
                    Save
                  </button>
                </Card>
              </div>
            </div>
          );
        }}
      </Formik>
    </>
  );
}

import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input, Select } from "../../../../../_metronic/_partials/controls";
import PricingCard from "./PricingCard";
import { ModalProgressBar } from "../../../../../_metronic/_partials/controls";
import { ProductConditionTitles } from "../ProductsUIHelpers";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import * as customersActions from "../../../customers/_redux/customers/customersActions";
import * as paymentActions from "../../../sets/_redux/payment-items/paymentMethodActions";
import * as serviceActions from "../../../sets/_redux/services/servicesActions";
import * as invoiceActions from "../../../invoices/_redux/invoice/invoiceActions";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import SearchSelect from "react-select";
import { FormLabel } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import axios from "axios";
import { useHistory } from "react-router-dom";
import moment from "moment";

const INVOICE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_URL_DEV + "invoices/"
    : process.env.REACT_APP_API_URL + "invoices/";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export function ProductEditForm({
  match: {
    params: { id },
  },
}) {
  const isClonePage = Boolean(window.location.pathname.includes("clone"));
  const history = useHistory();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [searchCustomer, serSearchCustomer] = useState("");
  const [formData, setFormData] = useState({});
  const [items, setItems] = useState([
    {
      id: +new Date(),
      amount: "",
      title: "",
      description: "",
    },
  ]);
  const [editInvoiceData, setEditInvoiceData] = useState({});
  const [customer, setCustomer] = useState();
  const [contact_person, setContactPerson] = useState();
  const [payment_method, setPaymentMethod] = useState();
  let [defaultPlaces, setDefaultPlaces] = useState([]);
  const [total, settotal] = useState(0);
  const { customers, paymentMethods } = useSelector(
    (state) => ({
      customers: state.customers.entities,
      // services: state.services.entities,
      paymentMethods: state.paymentMethods.entities,
    }),
    shallowEqual
  );
  const [isSuccess, setIsSuccess] = useState({
    show: false,
    showProgress: false,
    message: "Added success",
  });
  const addNewItem = () => {
    setItems([
      ...items,
      { id: +new Date(), amount: "", description: "", title: "" },
    ]);
  };
  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const setServiceData = (itemEdited, itemIndex) => {
    const tempData = [...items]
    tempData[itemIndex].amount = itemEdited.amount
    tempData[itemIndex].description = itemEdited.description
    tempData[itemIndex].title = itemEdited.title
    tempData[itemIndex].htmlMode = itemEdited.htmlMode
    setItems(tempData)
    // setItems(
    //   items.map((item) =>
    //     item.id === itemEdited.id
    //       ? {
    //         ...item,
    //         amount: itemEdited.amount,
    //         description: itemEdited.description,
    //         title: itemEdited.title,
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
      items,
      result.source.index,
      result.destination.index
    );

    setItems(newitems);
  }
  function getTotal(services) {
    let mytotal = 0;
    for (let service of services) {
      mytotal += Number(service?.amount) || 0;
    }
    return mytotal;
  }

  useEffect(() => {
    settotal(getTotal(items));
  }, [items]);

  function isValidServiceItem() {
    let valid = true;
    items.map((i) => {
      // if (i.title == "" || i.amount === "" || i.description == "") {
      if (i.title == "" || i.amount === "") {
        valid = false;
      }
    });
    return valid;
  }
  const ProductEditSchema = Yup.object().shape({
    address: Yup.string().test(
      "custom-required",
      "Working Location is required",
      (value) => {
        return defaultPlaces.length > 0 ? true : false;
      }
    ),
    contract_quote_no: Yup.string().required(
      "Contract / Quotation is required"
    ),
    contact_person: Yup.string().test(
      "custom-required",
      "Contact Person is required",
      (value) => contact_person
    ),
    payment_method: Yup.string().test(
      "custom-required",
      "Payment Method is required",
      (value) => payment_method
    ),
    customer: Yup.string().test(
      "custom-required",
      "Customer is required",
      (value) => customer
    ),
    service_items: Yup.string().test(
      "custom-required",
      "Service title, amount and description are required",
      (value) => {
        return isValidServiceItem();
      }
    ),
  });
  function saveData(values) {
    setIsSuccess({ ...isSuccess, showProgress: true });
    const data = {
      customer_id: customer.value,
      date: (values.date) ? values.date : moment().format("YYYY-MM-DD"),
      quote_contract_no: values.contract_quote_no,
      address: values.address,
      job_start_date: values.job_start_date,
      job_end_date: values.job_end_date,
      contact_person: contact_person.value,
      payment_term_id: payment_method?.value,
      amount: total.toFixed(2),
      services: [],
      part_time: values.part_time,
      contract_invoice: values.contract_invoice
    };
    items.map((item) => {
      data.services.push({
        price: item.amount,
        desc: item.description,
        title: item.title,
      });
    });

    if (!isClonePage && id) {
      setLoader(true);
      axios
        .put(INVOICE_URL + id, data)
        .then((res) => {
          if (res.data.success) {
            const resData = res.data;
            setIsSuccess({
              showProgress: false,
              show: true,
              message: resData.message,
            });
            setTimeout(() => {
              history.push(`/invoices/${id}/details`);
            }, 2000);
          } else {
            setLoader(false);
            setIsSuccess({
              ...isSuccess,
              showProgress: false,
              show: true,
              message: "API Failed!",
            });
          }
        })
        .catch(() => {
          setLoader(false);
          setIsSuccess({
            ...isSuccess,
            showProgress: false,
            show: true,
            message: "API Failed!",
          });
        });
    } else {
      setLoader(true);
      axios
        .post(INVOICE_URL + "create-invoice", data)
        .then((res) => {
          if (res.data.success) {
            const resData = res.data;
            setIsSuccess({
              showProgress: false,
              show: true,
              message: resData.message,
            });
            setTimeout(() => {
              history.push("/invoices/all");
            }, 2000);
          } else {
            setLoader(false);
            setIsSuccess({
              ...isSuccess,
              showProgress: false,
              show: true,
              message: "API Failed!",
            });
          }
        })
        .catch(() => {
          setLoader(false);
          setIsSuccess({
            ...isSuccess,
            showProgress: false,
            show: true,
            message: "API Failed!",
          });
        });
    }
  }

  useEffect(() => {
    //dispatch(serviceActions.fetchservices({ pageSize: 100000 }));
    dispatch(paymentActions.findpaymentMethods({ pageSize: 100000, excludeFields: true }));
    if (id) {
      dispatch(invoiceActions.fetchInvoice(id)).then((res) => {
        var data = res.data;
        setEditInvoiceData(data);
        if (data.customer_id) {
          dispatch(
            customersActions.findCustomers({
              pageSize: 100,
              filter: { _id: data.customer_id._id },
              customer_id: data?.customer_id?._id
            })
          );
        }
        if (customers && customers.length > 0 && data.customer_id) {
          customers.filter((item) => {
            if (item._id == data.customer_id._id) {
              setCustomer({
                label: item.customer_name,
                value: item._id,
                cp: item.contact_person,
                location_id: item.location_id,
              });
            }
          });
        }

        if (data.contact_person) {
          setContactPerson({
            label: data.contact_person.contact_name,
            value: data.contact_person._id,
          });
        }

        var defaultPlacesArr = [];
        if (data.address && data.address.length > 0) {
          var defaultplaces = [];
          data.address.filter((item) => {
            defaultplaces.push({
              value: item._id,
              label: item.location_address,
            });
            defaultPlacesArr.push(item._id);
          });
          setDefaultPlaces(defaultplaces);
        }

        if (data.payment_term_id) {
          setPaymentMethod({
            value: data.payment_term_id._id,
            label: data.payment_term_id.payment_method_name,
          });
        }

        if (data.services && data.services.length > 0) {
          var servicesArr = [];
          data.services.filter((item) => {
            servicesArr.push({
              id: +new Date(),
              amount: item.price,
              description: item.desc,
              title: item.title,
              htmlMode: (data.services.length > 10) ? true : false
            });
            setItems(servicesArr);
          });
        }

        setFormData({
          date: data.date ? moment(data.date).format("YYYY-MM-DD") : "",
          contract_quote_no: data.quote_contract_no,
          address: defaultPlacesArr,
          job_start_date: data.job_start_date
            ? moment(data.job_start_date).format("YYYY-MM-DD")
            : "",
          job_end_date: data.job_end_date
            ? moment(data.job_end_date).format("YYYY-MM-DD")
            : "",
          customer: "",
          contact_person: "",
          payment_method: "",
          service_items: "",
          part_time: data.part_time,
          contract_invoice: data.contract_invoice
        });
      });
    } else {
      setFormData({
        date: moment().format("YYYY-MM-DD"),
        contract_quote_no: "",
        address: "",
        job_start_date: "",
        job_end_date: "",
        customer: "",
        contact_person: "",
        payment_method: "",
        service_items: "",
        part_time: false,
        contract_invoice: false
      });
    }
  }, []);

  useEffect(() => {
    //if (searchCustomer !== "") {
      dispatch(
        customersActions.findCustomers({
          sortOrder: "desc",
          sortField: "createdAt",
          pageSize: 100,
          search: searchCustomer,
          customer_id: editInvoiceData?.customer_id?._id
        })
      );
    //}
    // eslint-disable-next-line
  }, [searchCustomer]);

  useEffect(() => {
    if (id) {
      if (customers && customers.length > 0 && editInvoiceData.customer_id) {
        customers.filter((item) => {
          if (item._id == editInvoiceData.customer_id._id) {
            setCustomer({
              label: item.customer_name,
              value: item._id,
              cp: item.contact_person,
              location_id: item.location_id,
            });
          }
        });
      }
    }
  }, [customers]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        validationSchema={ProductEditSchema}
        initialValues={formData}
        onSubmit={(values) => {
          saveData(values);
        }}
      >
        {({ handleSubmit, errors, setFieldValue, values }) => (
          <div className="d-flex flex-wrap" style={{position:'relative'}}>
            <div className="col-12 col-lg-9">
              {isSuccess.show ? (
                <Alert
                  variant={"success"}
                  dismissible
                  onClose={() => setIsSuccess({ ...isSuccess, show: false })}
                >
                  <strong>{isSuccess.message}</strong>
                </Alert>
              ) : null}
              <Card>
                {isSuccess.showProgress ? <ModalProgressBar /> : null}
                <CardBody>
                  <div className="mt-5">
                    <Form className="form form-label-right">
                      {/* <div className="form-group row justify-content-between">
                        <div className="col-lg-5">
                          <input
                            type="image"
                            src="/media/logo-light.png"
                            className="img-fluid"
                            alt="Image logo"
                          />
                          <br></br>
                          <label className="pt-20">
                            <Field type="checkbox" name="toggle" className="mr-2" />
                            Part Time
                          </label>
                        </div>
                        <div className="col-lg-7"> */}
                      <div className="form-group row justify-content-between">
                        <div className="col-lg-6">
                          <input
                            type="image"
                            src="/media/logo-light.png"
                            className="img-fluid"
                            alt="Image logo"
                          />
                        </div>
                        <div className="col-lg-3 text-right mt-3">Date</div>
                        <div className="col-lg-3">
                          <Field
                            name="date"
                            type="date"
                            component={Input}
                            value={values.date}
                          />
                        </div>
                        <div className="col-lg-6"></div>
                        <div className="col-lg-3 d-flex justify-content-end align-self-center mt-3">
                          Contract / Quotation Number <span className="indicatory">*</span>
                        </div>
                        <div className="col-lg-3 mt-3">
                          <Field
                            name="contract_quote_no"
                            type="text"
                            customFeedbackLabel={true}
                            component={Input}
                          />
                        </div>
                        <div className="col-lg-6"></div>
                        <div className="col-lg-3 d-flex justify-content-end align-self-center mt-3">
                          Job Start Date
                        </div>
                        <div className="col-lg-3 mt-3">
                          <Field
                            name="job_start_date"
                            type="date"
                            component={Input}
                          />
                        </div>
                        <div className="col-lg-6 mt-3">
                          <label>
                            <Field
                              type="checkbox"
                              name="part_time"
                              className="mr-2"
                            />{" "}
                            Part Time
                          </label>
                          <label className="ml-10">
                            <Field
                              type="checkbox"
                              name="contract_invoice"
                              className="mr-2"
                            />{" "}
                            Contract Invoice
                          </label>
                        </div>
                        <div className="col-lg-3 d-flex justify-content-end align-self-center mt-3">
                          Job End Date
                        </div>
                        <div className="col-lg-3 mt-3">
                          <Field
                            name="job_end_date"
                            type="date"
                            component={Input}
                          />
                        </div>
                      </div>
                      {/* </div>
                      </div> */}
                      <div className="form-group row">
                        <div className="col-lg-6">
                          <FormLabel>Customer <span className="indicatory">*</span></FormLabel>
                          <SearchSelect
                            isDisabled={id ? true : false}
                            name="customer"
                            onInputChange={serSearchCustomer}
                            options={
                              customers
                                ? customers.map((item) => {
                                  return {
                                    label: item.customer_name,
                                    value: item._id,
                                    cp: item.contact_person,
                                    location_id: item.location_id,
                                  };
                                })
                                : []
                            }
                            placeholder="Select Customer"
                            onChange={(opt) => {
                              setCustomer(opt);
                              if (opt.cp.length > 0) {
                                setContactPerson({
                                  label: opt.cp[0].contact_name,
                                  value: opt.cp[0]._id,
                                });
                              } else {
                                setContactPerson("");
                              }

                              if (opt.location_id?.length > 0) {
                                setDefaultPlaces([
                                  {
                                    value: opt.location_id[0]._id,
                                    label: opt.location_id[0].location_address,
                                  },
                                ]);
                                setFieldValue("address", [
                                  opt.location_id[0]._id,
                                ]);
                              }
                            }}
                            value={customer}
                          />
                          {errors.customer ? (
                            !customer ? (
                              <div className="text-danger">
                                {errors.customer}
                              </div>
                            ) : (
                              ""
                            )
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="col-lg-6">
                          <FormLabel>Contact Person <span className="indicatory">*</span></FormLabel>
                          <SearchSelect
                            name="contact_person"
                            options={
                              customers && customer
                                ? customer.cp.map((cp) => {
                                  return {
                                    label: cp.contact_name,
                                    value: cp._id,
                                  };
                                })
                                : []
                            }
                            placeholder="Select Contact Person"
                            onChange={(opt) => {
                              setContactPerson(opt);
                            }}
                            value={contact_person}
                          />
                          {errors.contact_person ? (
                            !contact_person ? (
                              <div className="text-danger">
                                {errors.contact_person}
                              </div>
                            ) : (
                              ""
                            )
                          ) : (
                            ""
                          )}
                        </div>

                        <div className="col-lg-12 mt-5">
                          <FormLabel>Working Location <span className="indicatory">*</span></FormLabel>
                          <SearchSelect
                            name="address"
                            value={defaultPlaces}
                            options={
                              customers && customer
                                ? customer.location_id.map((location) => ({
                                  value: location._id,
                                  label: location.location_address,
                                }))
                                : []
                            }
                            placeholder="Select Working Location"
                            isMulti
                            onChange={(opt) => {
                              opt
                                ? setDefaultPlaces(opt)
                                : setDefaultPlaces([]);
                              opt
                                ? setFieldValue(
                                  "address",
                                  opt.map((opt) => opt.value)
                                )
                                : setFieldValue("address", []);
                            }}
                          />
                          {errors.address ? (
                            defaultPlaces.length == 0 ? (
                              <div className="text-danger">
                                {errors.address}
                              </div>
                            ) : (
                              ""
                            )
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div className="w-full mt-2">
                        {/* <Card> */}

                        <CardBody className="p-0">
                          {errors.service_items ? (
                            !isValidServiceItem() ? (
                              <div className="text-danger">
                                {errors.service_items}
                              </div>
                            ) : (
                              ""
                            )
                          ) : (
                            ""
                          )}
                          <DragDropContext
                            onDragEnd={(result) => onDragEnd(result)}
                          >
                            <Droppable droppableId="droppable">
                              {(provided, snapshot) => (
                                <div
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                >
                                  {items.map((item, index) => {
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
                                              ...provided.draggableProps.style,
                                            }}
                                            className="mt-8 mb-8 rounded"
                                          >
                                            <PricingCard
                                              item={item}
                                              // services={services}
                                              removeItem={removeItem}
                                              disabled={items.length === 1}
                                              setServiceData={(itemEdited, itemIndex) =>
                                                setServiceData(itemEdited, itemIndex)
                                              }
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
                        <div className="pt-0 pb-0 mb-10 d-flex justify-content-end">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={addNewItem}
                          >
                            Add Item
                          </button>
                        </div>
                        <div className="d-flex justify-content-end">
                          <div className="mr-5 mt-2">
                            <p>Total : ${total.toFixed(2)}</p>
                          </div>
                        </div>
                        {/* </Card> */}
                      </div>

                      <div className="form-group row">
                        <div className="col-lg-12">
                          <FormLabel>Payment Method <span className="indicatory">*</span></FormLabel>
                          <SearchSelect
                            name="payment_method"
                            options={
                              paymentMethods &&
                              paymentMethods.map((paymentMethod) => ({
                                value: paymentMethod._id,
                                label: paymentMethod.payment_method_name,
                              }))
                            }
                            placeholder="Select Payment Method"
                            onChange={(opt) => {
                              setPaymentMethod(opt);
                            }}
                            value={payment_method}
                          />
                          {errors.payment_method ? (
                            !payment_method ? (
                              <div className="text-danger">
                                {errors.payment_method}
                              </div>
                            ) : (
                              ""
                            )
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
            </div>
            <div className="col-12 col-lg-3">
              <Card>
                <button
                  style={{position:'fixed', width:'16%'}}
                  type="submit"
                  className="btn btn-primary bg-white border-primary text-primary"
                  onClick={() => handleSubmit()}
                  disabled={loader}
                >
                  Submit
                </button>
              </Card>
            </div>
          </div>
        )}
      </Formik>
    </>
  );
}

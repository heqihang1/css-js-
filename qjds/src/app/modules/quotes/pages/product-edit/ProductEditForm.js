import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { Input, Select } from "../../../../../_metronic/_partials/controls";
// import { useHistory } from "react-router-dom";
// import { Editor } from "../../../../components/Editor";
import { ModalProgressBar } from "../../../../../_metronic/_partials/controls";
// import { ProductConditionTitles } from "../ProductsUIHelpers";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import { SpecialWorkerModal } from "./SpecialWorkersModal";
import PricingCard from "./PricingCard";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FormLabel } from "react-bootstrap";
import { Editor } from "../../../../components/Editor";
import SearchSelect from "react-select";
import { useLocation } from "react-router-dom";
import { quoteStatuses } from "../../partials/statuses";
import { useSelector } from "react-redux";

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
  customers = [],
  users = [],
  loader = false,
  paymentMethods = [],
  remarks = [],
  services = [],
  serSearchCustomer = "",
}) {
  let {
    issueDate: create_date,
    customer_office_worker,
    job_order_no,
    payment_term_id,
    remark_id,
    contact_person,
    places,
    customer_id,
    services: currentServices,
    hide_working_location
  } = product;

  const isClonePage = Boolean(window.location.pathname.includes("clone"));
  let [payment_term, setpayment_term] = useState({});
  let [remark, setremark] = useState({});
  let [contact_p, setcontact_p] = useState();
  let [defaultPlaces, setDefaultPlaces] = useState([]);
  let [remark_content, setremark_content] = useState("");
  let getDate = (passDate) => {
    var date = new Date(passDate);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    return year + "-" + month + "-" + day;
  };
  create_date = getDate(create_date);

  let initialService = {
    amount: 0,
    discount: 0,
    feet: 0,
    desc: "",
    price: 0,
    offer: ""
  };

  const [selectedCustomer, setselectedCustomer] = useState(null);
  const [total, settotal] = useState(0);
  const [disabledSelect, setDisabled] = useState(false);
  const [selServices, setservices] = useState([{ id: 0, ...initialService }]);
  const contact_personRef = React.useRef(null);
  const placesRef = React.useRef(null);
  const { user } = useSelector((state) => state.auth);
  const getAmount = (feet = 0, price = 0, discount = 0, service) => {
    let amount = feet * price * ((100 - discount) / 100);
    if (service && service.service_minimum_consumption && amount < service.service_minimum_consumption) {
      amount = parseInt(service.service_minimum_consumption)
    }
    return amount
  };

  function getTotal(services) {
    let mytotal = 0;
    for (let service of services) {
      mytotal += Number(service?.amount) || 0;
    }
    return mytotal;
  }

  useEffect(() => {
    settotal(getTotal(selServices));
  }, [selServices]);

  let removeService = (id) => {
    let remServices = selServices.filter((selService) => selService.id !== id);
    setservices(remServices);
  };

  const [show, setShow] = useState(false);
  const [options, setOptions] = useState([]);
  const addNewItem = (e) => {
    e.preventDefault();
    setservices([
      ...selServices,
      { id: selServices.length + 1, ...initialService },
    ]);
  };

  const setFeet = (id, feet) => {
    setservices(
      selServices.map((item) =>
        item.id === id
          ? {
            ...item,
            feet,
            amount: getAmount(feet, item.price, item.discount, item.service),
          }
          : item
      )
    );
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
            price: services.find((myserv) => myserv._id === service)
              .service_price,
            desc: services.find((myserv) => myserv._id === service)
              .service_content,
            amount: service
              ? getAmount(
                item.feet,
                services.find((myserv) => myserv._id === service)
                  .service_price,
                item.discount,
                services.find((myserv) => myserv._id === service)
              )
              : 0,
          }
          : item
      )
    );
  };
  const setdiscount = (id, discount) => {
    setservices(
      selServices.map((item) =>
        item.id === id
          ? {
            ...item,
            discount,
            amount: getAmount(item.feet, item.price, discount, item.service),
          }
          : item
      )
    );
  };

  const setprice = (id, price) => {
    setservices(
      selServices.map((item) =>
        item.id === id
          ? {
            ...item,
            price,
            amount: getAmount(item.feet, price, item.discount),
          }
          : item
      )
    );
  };

  const setDescription = (id, description, itemIndex) => {
    const tempData = [...selServices]
    tempData[itemIndex].desc = description
    setService(tempData)
    // setservices(
    //   selServices.map((item) =>
    //     item.id === id
    //       ? {
    //         ...item,
    //         desc: description,
    //       }
    //       : item
    //   )
    // );
  };

  const setOffer = (id, Offer, itemIndex) => {
    const tempData = [...selServices]
    tempData[itemIndex].offer = Offer
    setService(tempData)
    // setservices(
    //   selServices.map((item) =>
    //     item.id === id
    //       ? {
    //         ...item,
    //         offer: Offer,
    //       }
    //       : item
    //   )
    // );
  };

  const editItem = (id, htmlMode) => {
    setservices(
      selServices.map((item) =>
        item.id === id
          ? {
            ...item,
            htmlMode,
          }
          : item
      )
    );
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

  // COMMISSIONER OPTIONS
  const commissionerOptions = users.map((x) => {
    return {
      label: x?.displayname ? x?.displayname : x.username,
      value: x?._id,
    };
  });

  useEffect(() => {
    if (customers) {
      setOptions(
        customers.map((item, index) => {
          return {
            id: item._id,
            value: index,
            label: item.customer_name,
            child: item.contact_person,  //联级联系人数组
            location_id: item.location_id, // 联机地址数组
          }
        })
      );
    }
  }, [customers]);

  useEffect(() => {
    // console.log(options, "options");
    if (!isClonePage && id && options.length) {
      let cust = options.find((opt) => opt.id == -id);
      if (cust) {
        setselectedCustomer(cust);
        setDisabled(true);
      }
    }

    if (customer_id?._id) {
      let cust = options.find((opt) => opt.id === customer_id._id);
      if (!isClonePage && cust) {
        setselectedCustomer(cust);
        setDisabled(true);
      }

      if (!isClonePage) {
        setcontact_p({
          label: contact_person?.contact_name,
          value: contact_person?._id,
        });
        setDefaultPlaces(
          places.map((place) => ({
            label: place.location_address,
            value: place._id,
          }))
        );
      }
      setpayment_term({
        value: payment_term_id?._id,
        label: payment_term_id?.payment_method_name,
      });
      setremark({
        value: remark_id?._id,
        label: remark_id?.remark_name,
      });
      setremark_content(product?.remark_desc || "");
      setservices(
        currentServices.map((service, index) => ({
          id: index,
          feet: Number(service.feet),
          service: service.service_id,
          discount: Number(service.discount),
          desc: service?.desc,
          offer: service?.offer,
          price: service?.cost,
          amount: getAmount(service.feet, service.cost, service.discount, service.service_id),
          htmlMode: (currentServices.length > 10) ? true : false
        }))
      );
    } else {
      setselectedCustomer(null);
      setDisabled(false)
      setpayment_term({});
      setremark({});
      setcontact_p();
      setDefaultPlaces([]);
      setservices([{ id: 0, ...initialService }]);
      setremark_content("");
    }
  }, [id, customer_id]);

  useEffect(() => {
    if (customer_id?._id) {
      let cust = options.find((opt) => opt.id === customer_id._id);
      if (!isClonePage && cust) {
        setselectedCustomer(cust);
        setDisabled(true);
      }
    }
  }, [options])

  const commissioner_name = user?.displayname
    ? user?.displayname
    : user.username;

  function isValidServiceItem() {
    let valid = true;
    selServices.map((i) => {
      if (i.service_id == "" || i.feet === "" || i.discount === "" || i.price === "" || i.amount === "" || i.desc == "" || i.desc == "<p><br></p>") {
        valid = false;
      }
    });
    return valid;
  }

  // Validation schema
  const ProductEditSchema = Yup.object().shape({
    contact_person: Yup.string().required("Contact Person is required"),
    payment_term_id: Yup.string().required("Payment Method is required"),
    customer: Yup.string().test(
      "custom-required",
      "Customer is required",
      (value) => selectedCustomer
    ),
    places: Yup.string().test(
      "custom-required",
      "Places is required",
      (value) => {
        return defaultPlaces.length > 0 ? true : false;
      }
    ),
    remark: Yup.string().test(
      "custom-required",
      "Remark is required",
      (value) => (remark.value) ? true : false
    ),
    service_items: Yup.string().test(
      "custom-required",
      "Service project, feet, discount %, amount, cost price and description are required",
      (value) => {
        return isValidServiceItem();
      }
    ),
  });

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          job_order_no: job_order_no || 1,
          create_date: customer_id?._id
            ? create_date
            : "", // moment().format("YYYY-MM-DD")
          customer_office_worker: customer_id?._id
            ? customer_office_worker
            : commissioner_name,
          payment_term_id: customer_id?._id ? payment_term_id?._id : "",
          remark_id: customer_id?._id ? remark_id?._id : "",
          contact_person: customer_id?._id ? contact_person?._id : "",
          hide_working_location: hide_working_location ? hide_working_location : false
        }}
        validationSchema={ProductEditSchema}
        onSubmit={(values) => {
          let finalProduct = {};
          let myservs = [];
          for (let service of selServices) {
            if (service.service) {
              myservs.push({
                title: service.service.service_name,
                service_id: service.service._id,
                feet: Number(service.feet),
                discount: Number(service.discount),
                desc: service?.desc,
                offer: service?.offer,
                cost: Number(service?.price),
                price: Number(service?.amount),
              });
            }
          }

          const customer_officer_id = commissionerOptions.filter(
            (x) => x?.label === values.customer_office_worker
          )[0]?.value;

          values.create_date = (values.create_date) ? values.create_date : moment().format("YYYY-MM-DD")
          finalProduct = {
            ...values,
            services: myservs,
            customer_id: selectedCustomer !== null ? selectedCustomer?.id : "",
            customer_name:
              selectedCustomer !== null ? selectedCustomer?.label : "",
            issueDate: values?.create_date,
            remark_desc: editorRef.current.value,
            amount: total,
          };
          if (customer_officer_id) {
            finalProduct.customer_office_worker_id = customer_officer_id
          }
          saveProduct(finalProduct);
        }}
      >
        {({ handleSubmit, errors, values, setFieldValue }) => {
          return (
            <div className="d-flex" style={{ position: 'relative' }}>
              <div className="col-lg-9">
                <Card>
                  {actionsLoading && <ModalProgressBar />}
                  <CardBody>
                    <div className="mt-5">
                      <Form className="form form-label-right">
                        <div className="form-group row">
                          <div className="col-lg-6">
                            <input
                              type="image"
                              src="/media/logo-light.png"
                              className="img-fluid"
                              alt="Image logo"
                            />
                          </div>
                          <div className="col-lg-6">
                            <Field
                              disabled={disabled}
                              name="create_date"
                              type="date"
                              component={Input}
                              placeholder="date"
                              label="date"
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="col-lg-6">
                            <FormLabel>Customer <span className="indicatory">*</span></FormLabel>
                            <SearchSelect
                              name="customer"
                              options={options}
                              onInputChange={serSearchCustomer}
                              onChange={(opt) => {
                                contact_personRef.current.select.clearValue();
                                placesRef.current.select.clearValue();
                                // setFieldValue("customer_id", opt._id);
                                setselectedCustomer(opt);
                                if (opt.child.length > 0) {
                                  setcontact_p({
                                    value: opt.child[0]._id,
                                    label: opt.child[0].contact_name,
                                  });
                                  setFieldValue(
                                    "contact_person", opt.child[0]._id
                                  );
                                }
                                if (opt.location_id.length > 0) {
                                  setDefaultPlaces([
                                    {
                                      value: opt.location_id[0]._id,
                                      label: opt.location_id[0].location_address,
                                    },
                                  ]);
                                  setFieldValue("places", [
                                    opt.location_id[0]._id,
                                  ]);
                                }
                              }}
                              isDisabled={isClonePage ? false : disabledSelect}
                              value={selectedCustomer}
                              placeholder="Select Customer"
                            />
                            {errors.customer ? (
                              !selectedCustomer ? (
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
                              ref={contact_personRef}
                              value={contact_p}
                              options={
                                customers && selectedCustomer
                                  ? selectedCustomer.child.map((cp) => {
                                    return {
                                      label: cp.contact_name,
                                      value: cp._id,
                                    };
                                  })
                                  : []
                              }
                              placeholder="Select Contact Person"
                              onChange={(opt) => {
                                setcontact_p(opt);
                                setFieldValue("contact_person", opt?.value);
                              }}
                            />
                            {errors.contact_person ? (
                              !contact_p ? (
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
                        </div>
                        <div className="form-group">
                          <FormLabel>Places <span className="indicatory">*</span></FormLabel>
                          <SearchSelect
                            ref={placesRef}
                            name="places"
                            value={defaultPlaces}
                            options={
                              customers && selectedCustomer
                                ? selectedCustomer.location_id.map((loc) => {
                                  return {
                                    label: loc.location_address,
                                    value: loc._id,
                                  };
                                })
                                : []
                            }
                            placeholder="Select Places"
                            isMulti
                            onChange={(opt) => {
                              opt
                                ? setDefaultPlaces(opt)
                                : setDefaultPlaces([]);
                              opt
                                ? setFieldValue(
                                  "places",
                                  opt.map((opt) => opt.value)
                                )
                                : setFieldValue("places", []);
                            }}
                          />
                          {errors.places ? (
                            defaultPlaces.length == 0 ? (
                              <div className="text-danger">
                                {errors.places}
                              </div>
                            ) : (
                              ""
                            )
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="form-group">
                          <label>
                            <Field
                              type="checkbox"
                              name="hide_working_location"
                              className="mr-2"
                            />
                            Hide Working Location
                          </label>
                        </div>
                        <div className="w-full mt-2">
                          <div className="row">
                            <div className="col-lg-6">
                              <FormLabel>Service items</FormLabel>
                            </div>
                          </div>
                          <Card>
                            <CardBody>
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
                                                  setFeet={setFeet}
                                                  setDiscount={setdiscount}
                                                  setPrice={setprice}
                                                  setDescription={
                                                    setDescription
                                                  }
                                                  setOffer={setOffer}
                                                  setService={setService}
                                                  editItem={editItem}
                                                  itemIndex={index}
                                                  selServices={selServices}
                                                  setservices={setservices}
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
                        <div className="form-group row justify-content-between align-items-center">
                          {/* <div className="col-lg-4">
                            <label>Commissioner</label>
                            <SearchSelect
                              options={commissionerOptions}
                              onChange={(opt) => {
                                setFieldValue(
                                  "customer_office_worker",
                                  opt.label
                                );
                              }}
                              value={
                                commissionerOptions.filter(
                                  (x) =>
                                    x?.label === values.customer_office_worker
                                )[0]
                              }
                            />
                          </div> */}
                          <div></div>
                          <div className="mr-5 mt-2">
                            <p>Total : ${total.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="form-group">
                          <FormLabel>Payment method <span className="indicatory">*</span></FormLabel>
                          <SearchSelect
                            name="payment_term_id"
                            disabled={disabled}
                            value={payment_term}
                            options={
                              paymentMethods &&
                              paymentMethods.map((paymentMethod) => ({
                                value: paymentMethod._id,
                                label: paymentMethod.payment_method_name,
                              }))
                            }
                            onChange={(opt) => {
                              setpayment_term(opt);
                              setFieldValue("payment_term_id", opt?.value);
                            }}
                          />
                          {errors.payment_term_id ? (
                            <div className="text-danger">
                              {errors.payment_term_id}
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="form-group">
                          <FormLabel>Remark <span className="indicatory">*</span></FormLabel>
                          <SearchSelect
                            name='remark'
                            disabled={disabled}
                            value={remark}
                            options={
                              remarks &&
                              remarks.map((remark) => ({
                                value: remark._id,
                                label: remark.remark_name,
                              }))
                            }
                            onChange={(opt) => {
                              setremark(opt);
                              setFieldValue("remark_id", opt.value);
                              editorRef.current.value = remarks.find(
                                (remark) => remark._id === opt.value
                              ).remark_content;
                            }}
                          />
                          {errors.remark ? (
                            !remark.value ? (
                              <div className="text-danger">
                                {errors.remark}
                              </div>
                            ) : (
                              ""
                            )
                          ) : (
                            ""
                          )}
                          <br />
                          <Editor
                            placeholder={""}
                            editor={editorRef}
                            initContent={remark_content || ""}
                          />
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>
              </div>
              <div className="ml-4 mr-4 col-lg-3">
                <SpecialWorkerModal show={show} onHide={() => setShow(false)} />
                <Card style={{ position: 'fixed', width: '16%' }}>
                  <button
                    type="button"
                    className="btn btn-primary m-3 ml-10 mr-10"
                    onClick={() => setShow(true)}
                  >
                    Special Job Quantity
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary m-3 ml-10 mr-10"
                    onClick={() => handleSubmit()}
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

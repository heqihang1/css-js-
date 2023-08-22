import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { Input, Select } from "../../../../../_metronic/_partials/controls";
import { ModalProgressBar } from "../../../../../_metronic/_partials/controls";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import "../../../../../_metronic/_assets/sass/layout/_quoteApp.scss";
import { SpecialWorkerModal } from "./SpecialWorkersModal";
import PricingCard from "./PricingCard";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FormLabel } from "@material-ui/core";
import { Editor } from "../../../../components/Editor";
import SearchSelect from "react-select";
import { useLocation } from "react-router-dom";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import QuoteApp from './QuoteApp';
import * as customersActions from "../../../customers/_redux/customers/customersActions";
// Validation schema
// const ProductEditSchema = Yup.object().shape({
//   customer_id: Yup.string().required("Client is required"),
//   create_date: Yup.string().required("Date is required"),
// });

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export function ProductEditForm({
  product = {},
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
    contract_start_date,
    contract_end_date,
    customer_office_worker,
    job_order_no,
    payment_term_id,
    remark_id,
    contact_person,
    places,
    contract_period,
    customer_id,
    services: currentServices,
    hide_working_location,
    services_set
  } = product;

  const intl = useIntl();
  const isClonePage = Boolean(window.location.pathname.includes("clone"));
  let [payment_term, setpayment_term] = useState({});
  let [remark, setremark] = useState({});
  let [contact_p, setcontact_p] = useState();
  let [defaultPlaces, setDefaultPlaces] = useState([]);
  let [remark_content, setRemarkContent] = useState("");
  const dispatch = useDispatch();
  const {
    productForEdit,
  } = useSelector(
    (state) => ({
      productForEdit: state.contracts.contractForEdit,
    }),
    shallowEqual
  );
  const dataRef = useRef()
  const tableArrRef = useRef()

  const { user } = useSelector((state) => state.auth);
  let getDate = (passDate) => {
    var date = new Date(passDate);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    return year + "-" + month + "-" + day;
  };

  function getMonthBetween(start, end) {//传入的格式YYYY-MM
    var result = [];
    var s = start.split("-");
    var e = end.split("-");
    var min = new Date();
    var max = new Date();
    var yearMonthCode;
    var yearMonth;
    min.setFullYear(s[0], s[1] * 1 - 1, 1);//开始日期
    max.setFullYear(e[0], e[1] * 1 - 1, 1);//结束日期
    var curr = min;
    while (curr <= max) {
      yearMonthCode = moment(curr).format('YYYY-MM')
      var month = curr.getMonth();
      var year = curr.getFullYear();

      var str = curr.getFullYear() + "-" + (month);
      var s = curr.getFullYear() + "-0";
      if (str == s) {
        str = curr.getFullYear() + "-1";
      }
      var m = month + 1
      result.push({
        yearMonthCode: yearMonthCode,
        yearMonth: year + '年' + m + '月'
      });
      curr.setMonth(month + 1);
    }
    return result;
  }

  create_date = create_date ? getDate(create_date) : "";
  contract_start_date = contract_start_date ? getDate(contract_start_date) : "";
  contract_end_date = contract_end_date ? getDate(contract_end_date) : "";

  const show_amount_val = product?.show_amount;
  let calculations = [
    "Every time",
    "Per month",
    "Quarterly",
    "Every half year",
    "per year"
  ];
  let showAmountOption = [
    "Yes",
    "No"
  ];
  let timeId = moment().valueOf()
  let initialService = {
    discount: 0,
    feet: 0,
    calculation: calculations[0] || "",
    show_amount: showAmountOption[0] || "",
    desc: "",
    offer: "",
    price: 0,
    time_id: timeId
  };
  const obj = {
    service_id: 0,
    service_name: '',
    count: '',
    time_id: timeId
  }

  const [selectedCustomer, setselectedCustomer] = useState(null);
  const [total, settotal] = useState(0);
  const [disabledSelect, setDisabled] = useState(false);
  const [selServices, setservices] = useState([{ id: 0, ...initialService }]);
  const contact_personRef = React.useRef(null);
  const placesRef = React.useRef(null);
  const [show, setShow] = useState(false);
  const [options, setOptions] = useState([]);
  const [tableArr, setTableArr] = useState([[{ id: 0, ...obj }]])
  const [jobTotal, setJobTotal] = useState(0)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [len, setLen] = useState(null)  // 定义状态用户选择日期计算月份

  function isValidServiceItem() {
    let valid = true;
    selServices.map((i) => {
      if (i.service_id == "" || i.discount === "" || i.price === "" || i.amount === "" || i.desc == "" || i.desc == "<p><br></p>") {
        valid = false;
      }
    });
    return valid;
  }

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

  const getAmount = (feet = 0, price = 0, discount = 0, service) => {
    // console.log('sss', service)
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

  // 貌似没用到
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
  // 貌似没用到
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
  // 貌似没用到
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
  // 貌似没用到
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
  // 貌似没用到
  const setOffer = (id, Offer, itemIndex) => {
    const tempData = [...selServices]
    tempData[itemIndex].offer = Offer
    setService(tempData)
    // setservices(
    //   selServices.map((item) =>
    //     item.id === id
    //       ? {
    //         ...item,
    //         offer,
    //       }
    //       : item
    //   )
    // );
  };
  // 貌似没用到
  const setprice = (id, price) => {
    setservices(
      selServices.map((item) =>
        item.id === id
          ? {
            ...item,
            price,
            amount: getAmount(item.feet, price, item.discount, item.service),
          }
          : item
      )
    );
  };

  // 显示数量
  const setShowAmount = (id, show_amount) => {
    setservices(
      selServices.map((item) =>
        item.id === id ? { ...item, show_amount } : item
      )
    );
  };

  // pdf编辑事件
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

  const editorRef = React.useRef(null);

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

  // 初始化数据
  useEffect(() => {
    if (!isClonePage && id && options.length) {
      let cust = options.find((opt) => opt.id == id);
      if (cust) {
        setselectedCustomer(cust);
        setDisabled(true);
      }
    }
    // 编辑
    if (customer_id?._id) {
      let cust = options.find((opt) => opt.id == customer_id._id);
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
            label: place?.location_address,
            value: place?._id,
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
      setRemarkContent(product?.remark_desc || "");
      setservices(
        currentServices.map((service, index) => {
          return ({
            id: index,
            feet: Number(service.feet),
            service: service.service_id,
            discount: Number(service.discount),
            service_content: service?.service_content,
            calculation: (service?.calculation == "Every time" || service?.calculation == "Per month" || service?.calculation == "Quarterly" || service?.calculation == "Every half year" || service?.calculation == "per year" || service?.calculation == "Do not show") ? service.calculation : calculations[0],
            show_amount: (service?.show_amount) ? service?.show_amount : showAmountOption[0],
            desc: service?.desc,
            offer: service?.offer,
            price: service?.cost,
            amount: getAmount(service.feet, service.cost, service.discount, service.service_id),
            htmlMode: (currentServices.length > 10) ? true : false,
            time_id: service.time_id
          })
        })
      );
      setTableArr(services_set)
    } else {
      // 新增
      setTableArr([[{ id: 0, ...obj }]])
      setDisabled(false)
      setselectedCustomer(null);
      setcontact_p();
      setpayment_term({});
      setremark({});
      setDefaultPlaces([]);
      setservices([{ id: 0, ...initialService }]);
      setRemarkContent("");
      setStartDate('');
      setEndDate('');
      setLen(null)
      // 如果是从编辑跳转到新增时
      if (customers?.length === 1) {
        // 从新获取select customer 列表数据
        dispatch(
          customersActions.findCustomers({
            filter: {},
            sortOrder: "desc",
            sortField: "createdAt",
            search: '',
            pageNumber: 1,
            pageSize: 100,
            customer_id: productForEdit?.customer_id?._id
          })
        );
      }

    }
  }, [id, customer_id]);

  useEffect(() => {
    if (customer_id?._id) {
      let cust = options.find((opt) => opt.id == customer_id._id);
      if (!isClonePage && cust) {
        setselectedCustomer(cust);
        setDisabled(true);
      }
      setStartDate(contract_start_date)
      setEndDate(contract_end_date)
      dateChange(contract_start_date, contract_end_date)
    }
  }, [options])

  const commissioner_name = user?.displayname
    ? user?.displayname
    : user.username;

  // 拖拽相关逻辑
  // 删除事件
  let removeService = (id, _, time_id) => {
    let remServices = selServices.filter((selService) => selService.id !== id);
    setservices(remServices);

    let remTableArr = []
    tableArr.forEach((item) => {
      if (item?.length > 1) {
        const list = item.filter((v) => v.time_id !== time_id)
        remTableArr.push(list)
      } else {
        if (item[0].time_id !== time_id) {
          remTableArr.push(item)
        }
      }
    })
    // return;
    setTableArr(remTableArr)
  };

  // 新增事件
  const addNewItem = (e) => {
    e.preventDefault();
    const time_id = moment().valueOf()
    setservices([
      ...selServices,
      { id: selServices.length + 1, time_id, ...initialService },
    ]);

    setTableArr([
      ...tableArr,
      [{ id: tableArr.length + 1, time_id, ...obj }]
    ])
  };
  // dianji
  const addNew = (v) => {
    setTableArr(v)
  }

  // 选择的服务时间（每月/季度/半年）
  const setCalculation = (timeId, calculation) => {
    setservices(
      selServices.map((item) => {
        return item.time_id === timeId ? { ...item, calculation } : item
      })
    );

    const count = calculation == 'Per month'
      ? 12 : calculation == 'Quarterly'
        ? 4 : calculation == 'Every half year'
          ? 2 : calculation == 'per year'
            ? 1 : ''

    // 这里选择不展示时间
    setTableArr(
      tableArr.map((item) => {
        return item.map(child => {
          return child.time_id === timeId
            ? { ...child, count }
            : child
        })
      })
    )

  };

  // 开始日期和结束日期同时存在值，方可展示拖拽数值
  const contractStartDateChange = (s) => {
    setStartDate(s)
    if (s && endDate) {
      dateChange(s, endDate)
    }
  }
  const contractEndDateChange = (e) => {
    setEndDate(e)
    if (startDate && e) {
      dateChange(startDate, e)
    }
  }

  const dateChange = (s, e) => {
    if (s && e) {
      const length = getMonthBetween(s, e).length
      setLen(length)
    }
  }

  // 编辑时首次不执行该方法
  const setTableRef = useRef(false);
  const setTableArrChange = (e) => {
    if (customer_id?._id && !setTableRef.current) {
      setTableRef.current = true
      return
    }
    setTableArr(e)
  }

  useEffect(() => {
    const jobTotal = tableArr.reduce((pre, item) => {
      const mun = Math.max.apply(Math, item.map(c => c.count))
      if (len > 12) {
        const count = mun == 12 ? mun + (len - 12) : mun == 4 ? mun + (Math.floor(len / 3) - 4)
          : mun == 2 ? mun + (Math.floor(len / 6) - 2) : mun == 1 ? mun + (Math.floor(len / 12) - 1) : ''
        return count + pre
      } else {
        const count = mun == 12 ? len : mun == 4 ? (Math.floor(len / 3) > 0 ? Math.floor(len / 3) : '') : mun == 2
          ? (Math.floor(len / 6) > 0 ? Math.floor(len / 6) : '')
          : mun == 1 ? (Math.floor(len / 12) > 0 ? Math.floor(len / 12) : '') : ''
        return count + pre
      }
    }, 0)
    setJobTotal(jobTotal)

  }, [tableArr, jobTotal, selServices, len])


  return (
    <>
      <Formik
        enableReinitialize={true}
        validationSchema={ProductEditSchema}
        initialValues={{
          job_order_no: job_order_no || 1,
          create_date: customer_id?._id
            ? create_date
            : "", // moment().format("YYYY-MM-DD")
          // contract_start_date: startDate,
          // contract_end_date: endDate,
          customer_office_worker: customer_id?._id
            ? customer_office_worker
            : commissioner_name,
          payment_term_id: customer_id?._id ? payment_term_id?._id : "",
          remark_id: customer_id?._id ? remark_id?._id : "",
          contact_person: customer_id?._id ? contact_person?._id : "",
          contract_period: customer_id?._id ? contract_period : "",
          show_amount: customer_id?._id ? show_amount_val : true,
          hide_working_location: hide_working_location ? hide_working_location : false
        }}
        // validationSchema={ProductEditSchema}
        onSubmit={(values) => {
          // console.log(values); value数据是from表单中定义的name相关
          let finalProduct = {};
          let myservs = [];
          for (let service of selServices) {
            if (service.service) {
              myservs.push({
                title: service.service.service_name,
                service_id: service.service._id,
                feet: Number(service.feet),
                discount: Number(service.discount),
                desc: service.desc,
                offer: service.offer,
                calculation: service.calculation,
                show_amount: service?.show_amount,
                cost: Number(service?.price),
                price: Number(service.amount),
                time_id: service.time_id
              });
            }
          }
          const customer_officer_id = commissionerOptions.filter(
            (x) => x?.label === values.customer_office_worker
          )[0]?.value;
          values.create_date = (values.create_date) ? values.create_date : moment().format("YYYY-MM-DD")
          values.contract_start_date = startDate ? startDate : ''
          values.contract_end_date = endDate ? endDate : ''
          finalProduct = {
            ...values,
            services: myservs,
            customer_id: selectedCustomer !== null ? selectedCustomer?.id : "",
            issueDate: values?.create_date,
            remark_desc: editorRef.current.value,
            contract_amount: total,
            services_set: tableArr  // 拖拽时表格参数
          };

          // console.log('最终参数====+》', finalProduct);

          if (customer_officer_id) {
            finalProduct.customer_office_worker_id = customer_officer_id
          }
          saveProduct(finalProduct);
        }}
      >
        {({ handleSubmit, errors, setFieldValue, values }) => (
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
                            placeholder={intl.formatMessage({
                              id: "CONTRACTS.DATE",
                            })}
                            label={intl.formatMessage({ id: "CONTRACTS.DATE" })}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-lg-6">
                          <FormLabel>
                            {intl.formatMessage({ id: "CONTRACTS.CUSTOMER" })} <span className="indicatory">*</span>
                          </FormLabel>
                          <SearchSelect
                            defaultValue={selectedCustomer}
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
                            isDisabled={disabledSelect}
                            value={selectedCustomer}
                            placeholder={intl.formatMessage({
                              id: "CONTRACTS.SELECT_CUSTOMER",
                            })}
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
                          <FormLabel>
                            {intl.formatMessage({
                              id: "CONTRACTS.CONTACT_PERSON",
                            })} <span className="indicatory">*</span>
                          </FormLabel>
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
                            placeholder={intl.formatMessage({
                              id: "CONTRACTS.SELECT_CONTACT_PERSON",
                            })}
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
                        <FormLabel>
                          {intl.formatMessage({ id: "CONTRACTS.PLACES" })} <span className="indicatory">*</span>
                        </FormLabel>
                        <SearchSelect
                          ref={placesRef}
                          value={defaultPlaces}
                          name="places"
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
                          placeholder={intl.formatMessage({
                            id: "CONTRACTS.SELECT_PLACES",
                          })}
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
                      <div className="form-group row">
                        <div className="col-lg-4">
                          <Field
                            type="number"
                            disabled={disabled}
                            name="contract_period"
                            // type="text"
                            component={Input}
                            placeholder={intl.formatMessage({
                              id: "CONTRACTS.CONTRACT_PERIOD",
                            })}
                            label={intl.formatMessage({
                              id: "CONTRACTS.CONTRACT_PERIOD",
                            })}
                            withFeedbackLabel={false}
                          />
                        </div>
                        <div className="col-lg-4">
                          <Field
                            disabled={disabled}
                            name="contract_start_date"
                            type="date"
                            component={Input}
                            placeholder={intl.formatMessage({
                              id: "CONTRACTS.START_DATE",
                            })}
                            label={intl.formatMessage({
                              id: "CONTRACTS.START_DATE",
                            })}
                            value={startDate}
                            onChange={(e) => {
                              contractStartDateChange(e.target.value)
                            }}
                          />
                        </div>
                        <div className="col-lg-4">
                          <Field
                            disabled={disabled}
                            name="contract_end_date"
                            type="date"
                            component={Input}
                            placeholder={intl.formatMessage({
                              id: "CONTRACTS.END_DATE",
                            })}
                            label={intl.formatMessage({
                              id: "CONTRACTS.END_DATE",
                            })}
                            value={endDate}
                            onChange={(e) => {
                              contractEndDateChange(e.target.value)
                            }}
                          />
                        </div>
                      </div>
                      <div className="w-full mt-2">
                        <div className="row">
                          <div className="col-lg-6">
                            <FormLabel>
                              {intl.formatMessage({
                                id: "CONTRACTS.SERVICE_ITEMS",
                              })}
                            </FormLabel>
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
                                                removeItem={removeService}   // 删除id
                                                setFeet={setFeet}
                                                setDiscount={setdiscount}
                                                setDescription={setDescription}
                                                setOffer={setOffer}
                                                setPrice={setprice}
                                                setService={setService}
                                                calculations={calculations}
                                                showAmountOption={showAmountOption}
                                                setCalc={setCalculation}
                                                setShowAmount={setShowAmount}
                                                editItem={editItem}
                                                itemIndex={index}
                                                selServices={selServices}
                                                setservices={setservices}
                                                setTableArr={setTableArrChange}
                                                tableArr={tableArr}
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
                            {intl.formatMessage({
                              id: "CONTRACTS.ADD_SERVICE_ITEM",
                            })}
                          </button>
                        </div>
                      </div>
                      <div className="form-group row justify-content-between align-items-center">
                        {/* <div className="col-lg-4">
                          <label>Customer Officer</label>
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
                        <div className="col-lg-6">
                          <div className="d-flex">
                            <input
                              type="checkbox"
                              checked={values?.show_amount}
                              onClick={() => {
                                setFieldValue(
                                  "show_amount",
                                  !values.show_amount
                                );
                              }}
                            />
                            <label style={{ margin: 0, paddingLeft: 15 }}>
                              Display Total Amount
                            </label>
                          </div>
                          {/* <SearchSelect
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
                          /> */}
                        </div>
                        <div className="mr-5">
                          <p className="mb-0">Total : ${total}</p>
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

              {/* 服务支持拖拽 */}
              {/* <div style={{ position: 'fixed', top: 300, width: '16%' }}>
                <div className="mb-4 d-flex" style={{ fontWeight: 800 }}>
                  Total Job Quantity： {jobTotal}
                </div>
                <div ref={tableArrRef} className="quiteApp">
                  <QuoteApp tableArr={tableArr} ref={dataRef} addNew={addNew} len={len} />
                </div>
              </div> */}

            </div>
          </div>
        )}
      </Formik>
    </>
  );
}

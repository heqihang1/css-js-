import React, { useEffect, useState, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { isEqual, isFunction } from "lodash";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../_metronic/_partials/controls";
import { Table } from "../../../components/Table";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as uiHelpers from "../../customers/pages/ProductsUIHelpers";
import * as actions from "../../customers/_redux/customers/customersActions";
import { generateColumns } from "../../../utils/customers/tableDeps";
import { Input } from "../../../../_metronic/_partials/controls";
import { Formik, Form, Field } from "formik";
import { FormLabel } from "react-bootstrap";
import * as Yup from "yup";
import excel from "exceljs"
import { saveAs } from "file-saver"
import moment from "moment";
import axios from "axios";
import { API_URL } from "../../../../app/API_URL";

export function NewCustomer() {
  const history = useHistory();

  const columns = generateColumns(history, false);
  const filter = () => {
    const initialFilter = {
      filter: {},
      sortOrder: "desc", // asc||desc
      sortField: "createdAt",
      search: '',
      pageNumber: 1,
      pageSize: 10,
    };
    return initialFilter;
  };

  const [queryParams, setQueryParamsBase] = useState(filter());
  const [isGenereate, setIsGenereate] = useState(false);
  const [initialValues, setInitialValues] = useState({});
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
  const [contacts, setcontacts] = useState({ totalDocs: 0, docs: [] });
  const [defaultContact, setDefaultContact] = useState({
    totalDocs: 0,
    docs: [],
  });
  const { currentState, customers } = useSelector((state) => {
    return { currentState: state.customers, customers: state.customers.entities };
  }, shallowEqual);
  // Products Redux state
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(actions.findCustomers(queryParams));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [queryParams, dispatch]);

  const { totalCount, entities, listLoading } = currentState;
  useEffect(() => {
    setFilterData({ entities, totalCount });
  }, [entities]);
  const [filterData, setFilterData] = useState({ entities: [], totalCount: 0 });
  // Table pagination properties
  const { totalDocs, docs } = contacts;

  const paginationOptions = {
    custom: true,
    totalSize: filterData.totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: queryParams.pageSize,
    page: queryParams.pageNumber,
  };

  function genereateExcel(customers) {
    setIsGenereate(false)
    console.log('customer', customers)
    const wb = new excel.Workbook()
    const ws = wb.addWorksheet("Sheet 1", {views: [{showGridLines: false}]})

    let row_no = 1

    ws.columns = [
      { width: 25, alignment : { vertical: 'middle', horizontal: 'center' } },
      { width: 25, alignment : { vertical: 'middle', horizontal: 'center' } },
      { width: 25, alignment : { vertical: 'middle', horizontal: 'center' } },
      { width: 25, alignment : { vertical: 'middle', horizontal: 'center' } },
      { width: 25, alignment : { vertical: 'middle', horizontal: 'center' } }
    ]

    ws.addRow([
      'Customer Type',
      'Client Name',
      'Contact Person',
      'Office Phone',
      'Cell Phone'
    ])
    ws.getRow(row_no).font = { bold:true }
    row_no++;

    for (let i = 0; i <= customers.length; i++) {
      if (customers[i]) {
        ws.addRow([
          customers[i].customer_type,
          customers[i].customer_name,
          customers[i].contact_person[0]?.contact_name,
          customers[i].office_number,
          customers[i].mobile_number
        ])
        row_no++;
      }
    }
    wb.xlsx.writeBuffer(`New Customer - ${moment().format('YYYY-MM-DD')}.xlsx`).then((buffer) => {
      saveAs(
          new Blob([buffer], { type: "application/octet-stream" }),
          `New Customer - ${moment().format('YYYY-MM-DD')}.xlsx`
      )
    })
  }
  
  useEffect(() => {
    let from = ''
    let to = ''
    if (Boolean(window.location.pathname.includes("Month"))) {
      from = moment().startOf('month').format('YYYY-MM-DD');
      to = moment().endOf('month').format('YYYY-MM-DD');
    } else if (Boolean(window.location.pathname.includes("Week"))) {
      from = moment(moment().startOf('week')).add(1, 'days').format("YYYY-MM-DD");
      to = moment(moment().endOf('week')).add(1, 'days').format("YYYY-MM-DD");
    } else if (Boolean(window.location.pathname.includes("Day"))) {
      from = moment().format('YYYY-MM-DD');
      to = moment().format('YYYY-MM-DD');
    }
    delete queryParams.filter.customer_type
    queryParams.filter.createdAt = { $gte: from, $lte: to };
    //queryParams.pageSize = 100000
    dispatch(actions.findCustomers(queryParams));
    setInitialValues({
      from: from,
      to: to,
      customer_type: 'All'
    })
  }, [])

  useEffect(() => {
    dispatch(actions.findCustomers(queryParams));
  }, [queryParams]);

  const NewCustomerSchema = Yup.object().shape({
    from: Yup.string().required("From date is required"),       
    to: Yup.string().required("To date is required")
  });
  return (
    <Card>
      <CardHeader title="New Customer">
        <CardHeaderToolbar>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <Formik
          enableReinitialize={true}     
          validationSchema={NewCustomerSchema}   
          initialValues={initialValues}
          onSubmit={(values) => {   
            var qParams = {
              filter: {},
              sortOrder: "desc", // asc||desc
              sortField: "createdAt",
              search: '',
              pageNumber: 1,
              pageSize: 100000000
            }
            queryParams.pageNumber = 1
            if (values.customer_type == 'All') {
              delete queryParams.filter.customer_type
            } else {
              queryParams.filter.customer_type = values.customer_type
              qParams.filter.customer_type = values.customer_type
            }
            if (values.from && values.to) {
              queryParams.filter.createdAt = { $gte: values.from, $lte: values.to };
              qParams.filter.createdAt = { $gte: values.from, $lte: values.to };
            }
            //queryParams.pageSize = 100000
            dispatch(actions.findCustomers(queryParams));

            if (isGenereate) {
              setIsGenereate(false)
              axios
                .get(API_URL + `user/customers`, { params: qParams })
                .then((res) => {
                  genereateExcel(res.data.docs)
                });
              }}
            }
        >
          {({ handleSubmit, setFieldValue, values }) => (
            <div className="mt-5">
              <Form className="form form-label-right">
                <div className="form-group row">
                  <div className="col-lg-3 pl-10">
                    <FormLabel>Customer Type <span className="indicatory">*</span></FormLabel>
                    <br></br>

                    <div className="custom-control custom-radio custom-control-inline mt-2 ml-4">
                      <input
                        type="radio"
                        className="custom-control-input"
                        id="defaultInline1"
                        value={"All"}
                        name="customer_type"
                        defaultChecked
                        onInput={() => setFieldValue("customer_type", "All")}
                      />
                      <label
                        style={
                          values.customer_type === "All"
                            ? { color: "dodgerblue" }
                            : {}
                        }
                        className="custom-control-label"
                        htmlFor="defaultInline1"
                      >
                        All
                      </label>
                    </div>

                    <div className="custom-control custom-radio custom-control-inline">
                      <input
                        type="radio"
                        className="custom-control-input"
                        id="defaultInline2"
                        value={"Company"}
                        name="customer_type"
                        onInput={() => setFieldValue("customer_type", "Company")}
                      />
                      <label
                        style={
                          values.customer_type === "Company"
                            ? { color: "dodgerblue" }
                            : {}
                        }
                        className="custom-control-label"
                        htmlFor="defaultInline2"
                      >
                        Company
                      </label>
                    </div>

                    <div className="custom-control custom-radio custom-control-inline">
                      <input
                        type="radio"
                        className="custom-control-input"
                        id="defaultInline3"
                        name="customer_type"
                        value={"Personal"}
                        onInput={() => setFieldValue("customer_type", "Personal")}
                      />
                      <label
                        style={
                          values.customer_type === "Personal"
                            ? { color: "dodgerblue" }
                            : {}
                        }
                        className="custom-control-label"
                        htmlFor="defaultInline3"
                      >
                        Personal
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <FormLabel>From <span className="indicatory">*</span></FormLabel>
                    <Field        
                      name="from"                      
                      type="date"
                      component={Input}
                    /> 
                  </div>
                  <div className="col-lg-3">
                    <FormLabel>To <span className="indicatory">*</span></FormLabel>
                    <Field     
                      name="to"                          
                      type="date"
                      component={Input}
                    /> 
                  </div>
                  <div className="col-lg-3 mt-8">
                    <button
                      type="submit"
                      className="btn btn-primary bg-white border-primary text-primary"
                      onClick={(e) => { setIsGenereate(false); handleSubmit() } }
                    >                  
                      Search
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary bg-white border-primary text-primary ml-3"
                      onClick={(e) => { setIsGenereate(true); handleSubmit() } }
                    >                  
                      Generate
                    </button>
                  </div>
                </div>
              </Form>
            </div>
          )}
        </Formik>
        <Table
          typeFilter={true}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          columns={columns}
          listLoading={listLoading}
          entities={filterData.entities}
          paginationOptions={paginationOptions}
          defaultContact={defaultContact}
          setDefaultContact={setDefaultContact}
          hideFilter={true}
          />
      </CardBody>
    </Card>
  );
}

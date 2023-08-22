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
import { generateColumns } from "../../../utils/unfinishedJob/tableDeps";
import * as customersActions from "../../customers/_redux/customers/customersActions";
import { Formik, Form, Field } from "formik";
import { FormLabel } from "react-bootstrap";
import excel from "exceljs"
import { saveAs } from "file-saver"
import moment from "moment";
import { API_URL } from "../../../API_URL";
import axios from "axios";
import SearchSelect from "react-select";
import { Avatar } from "@material-ui/core";

export function UnfinishedJob() {
  const history = useHistory();
  const dispatch = useDispatch()
  const columns = generateColumns(history, false);
  const filter = () => {
    const initialFilter = {
      filter: {},
      sortOrder: "desc", // asc||desc
      sortField: "job_no",
      search: '',
      pageNumber: 1,
      pageSize: 10
    };
    return initialFilter;
  };

  const [queryParams, setQueryParamsBase] = useState(filter());
  const [isGenereate, setIsGenereate] = useState(false);
  const [excelData, setExcelData] = useState([])
  const [customer, setCustomer] = useState();
  const [searchCustomer, serSearchCustomer] = useState("");
  const [initialValues, setInitialValues] = useState({
    customer: '',
    type: ''
  });
  const [reportData, serReportData] = useState({
    totalCount: 0,
    entities: [],
    listLoading: false
  });

  const typeOption = [
    {
      label: 'All',
      value: ''
    },
    {
      label: 'Quotation',
      value: 'QUOTE'
    },
    {
      label: 'Contract',
      value: 'CONTRACT'
    }
  ]

  const { customers } = useSelector(
    (state) => ({
      customers: state.customers.entities
    }),
    shallowEqual
  );

  useEffect(() => {
    //if (searchCustomer !== "") {
      dispatch(
        customersActions.findCustomers({
          pageSize: 100,
          search: searchCustomer,
        })
      );
    //}
    // eslint-disable-next-line
  }, [searchCustomer]);



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
  const [defaultContact, setDefaultContact] = useState({
    totalDocs: 0,
    docs: [],
  });

  const { totalCount, entities, listLoading } = reportData;
  useEffect(() => {
    setFilterData({ entities, totalCount });
  }, [entities]);
  const [filterData, setFilterData] = useState({ entities: [], totalCount: 0 });
  // Table pagination properties  

  const paginationOptions = {
    custom: true,
    totalSize: filterData.totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: queryParams.pageSize,
    page: queryParams.pageNumber,
  };

  function genereateExcel() {
    setIsGenereate(false)
    const wb = new excel.Workbook()
    const ws = wb.addWorksheet("Sheet 1", { views: [{ showGridLines: false }] })

    let row_no = 1

    ws.columns = [
      { width: 25, alignment: { vertical: 'middle', horizontal: 'center' } },
      { width: 25, alignment: { vertical: 'middle', horizontal: 'center' } },
      { width: 25, alignment: { vertical: 'middle', horizontal: 'center' } },
      { width: 25, alignment: { vertical: 'middle', horizontal: 'center' } },
      { width: 25, alignment: { vertical: 'middle', horizontal: 'center' } },
      { width: 25, alignment: { vertical: 'middle', horizontal: 'center' } }
    ]

    ws.addRow([
      'Customer Name',
      'Type',
      'Quotation / Contract No.',
      'Job Order No.',
      'Contact Person',
      'Contact Person Number'
    ])
    ws.getRow(row_no).font = { bold:true }
    row_no++;

    for (let i = 0; i <= excelData.length; i++) {
      if (excelData[i]) {
        ws.addRow([
          excelData[i]?.customer_name,
          (excelData[i]?.contract_id) ? "Contract" : 'Quotation',
          excelData[i]?.quote_contract_no,
          excelData[i]?.job_no,
          excelData[i]?.contact_person,
          excelData[i]?.customer_contact_no
        ])
        row_no++;
      }
    }
    wb.xlsx.writeBuffer(`Unfinished Job - ${moment().format('YYYY-MM-DD')}.xlsx`).then((buffer) => {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `Unfinished Job - ${moment().format('YYYY-MM-DD')}.xlsx`
      )
    })
  }

  function getUnfinishedJobReport() {
    axios.get(API_URL + `dashboard/unfinished_job_report`, {
      params: queryParams
    }).then((res) => {
      setFilterData({
        entities: res.data.docs,
        totalCount: res.data.totalDocs
      })
    }).catch(() => {

    })

    if (isGenereate) {
      axios.get(API_URL + `dashboard/unfinished_job_report`, {
        params: {...queryParams, pageNumber: 1, pageSize: 1000000 }
      }).then((res) => {
        setExcelData(res.data.docs)
      }).catch(() => {
  
      })
    }
  }
  useEffect(() => {
    getUnfinishedJobReport()
  }, [queryParams])

  useEffect(() => {
    if (isGenereate) {
      genereateExcel()
    }
  }, [excelData])

  return (
    <Card>
      <CardHeader title="Unfinished Job">
        <CardHeaderToolbar>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          onSubmit={(values) => {
            // queryParams.pageSize = 100000
            setQueryParamsBase({
              ...queryParams,
              pageNumber: 1,
              customer: values.customer,
              type: values.type
            })
          }}
        >
          {({ handleSubmit, setFieldValue, values }) => (
            <div className="mt-5">
              <Form className="form form-label-right">
                <div className="form-group row">
                  <div className="col-lg-3">
                    <FormLabel>Customer</FormLabel>
                    <SearchSelect
                      name="customer"
                      onInputChange={serSearchCustomer}
                      options={
                        customers
                          ? customers.map((item) => {
                            return {
                              label: item.customer_name,
                              value: item._id
                            };
                          })
                          : []
                      }
                      placeholder="All"
                      onChange={(opt) => {
                        setCustomer(opt);
                        setFieldValue("customer", (opt?.value) ? opt?.value : '')
                      }}
                      value={customer}
                      isClearable={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormLabel>Type</FormLabel>
                    <SearchSelect
                      options={typeOption}
                      onChange={(opt) => {
                        setFieldValue("type", (opt?.value) ? opt?.value : '')
                      }}
                      value={typeOption.filter((x) => x.value === values.type)}
                    />
                  </div>
                  <div className="col-lg-3 mt-8">
                    <button
                      type="button"
                      className="btn btn-primary bg-white border-primary text-primary"
                      onClick={(e) => { setIsGenereate(false); handleSubmit() }}
                    >
                      Search
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary bg-white border-primary text-primary ml-3"
                      onClick={(e) => { setIsGenereate(true); handleSubmit() }}
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

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
import { generateColumns } from "../../../utils/businessSource/tableDeps";
import { Formik, Form, Field } from "formik";
import { FormLabel } from "react-bootstrap";
import excel from "exceljs"
import { saveAs } from "file-saver"
import moment from "moment";
import { API_URL } from "../../../API_URL";
import axios from "axios";
import SearchSelect from "react-select";
import { Input } from "../../../../_metronic/_partials/controls";

export function BusinessSource() {
  const urlSearchParams = new URLSearchParams(useLocation().search);
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
      pageSize: 10,
      business_source: urlSearchParams.get("business_source") || "",
      month: urlSearchParams.get("month") ? [urlSearchParams.get("month")] : []
    };
    return initialFilter;
  };

  const [queryParams, setQueryParamsBase] = useState(filter());
  const [isGenereate, setIsGenereate] = useState(false);
  const [excelData, setExcelData] = useState([])
  const [initialValues, setInitialValues] = useState({
    business_source: urlSearchParams.get("business_source") || "",
    month: urlSearchParams.get("month") ? { label: urlSearchParams.get("month"), value: urlSearchParams.get("month")} : []
  });
  const [reportData, serReportData] = useState({
    totalCount: 0,
    entities: [],
    listLoading: false
  });

  const business_sourcies = [
    {
      label: 'All',
      value: ''
    },
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

  const monthOption = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]

  const years = (back = parseInt(moment().format("YYYY")) - 2021) => {
    const year = new Date().getFullYear();
    return Array.from({ length: back }, (v, i) => year - back + i + 1);
  }
  let yearOption = []
  years().filter((item) => {
    monthOption.filter((item2) => {
      if (new Date().getFullYear() == item) {
        if (item2 <= new Date().getMonth() + 1) {
          yearOption.push({
            label: `${item}-${item2}`, 
            value: `${item}-${item2}`
          })
        }
      } else {
        yearOption.push({
          label: `${item}-${item2}`, 
          value: `${item}-${item2}`
        })
      }
    })
  })

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
      'Business Source',
      'Customer Officer',
      'Contact Person',
      'Office Phone',
      'Cell Phone',
      'Email'
    ])
    ws.getRow(row_no).font = { bold:true }
    row_no++;

    for (let i = 0; i <= excelData.length; i++) {
      if (excelData[i]) {
        ws.addRow([
          excelData[i]?.customer_name,
          excelData[i]?.business_source,
          excelData[i]?.customer_officer_id?.displayname,
          excelData[i]?.contact_person[0]?.contact_name,
          excelData[i]?.office_number,
          excelData[i]?.mobile_number,
          excelData[i]?.email
        ])
        row_no++;
      }
    }
    wb.xlsx.writeBuffer(`Business Source - ${moment().format('YYYY-MM-DD')}.xlsx`).then((buffer) => {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `Business Source - ${moment().format('YYYY-MM-DD')}.xlsx`
      )
    })
  }

  function getBusinessSourceReport() {
    axios.get(API_URL + `dashboard/business_source_report`, {
      params: queryParams
    }).then((res) => {
      setFilterData({
        entities: res.data.docs,
        totalCount: res.data.totalDocs
      })
    }).catch(() => {

    })

    if (isGenereate) {
      axios.get(API_URL + `dashboard/business_source_report`, {
        params: {...queryParams, pageNumber: 1, pageSize: 1000000 }
      }).then((res) => {
        setExcelData(res.data.docs)
      }).catch(() => {
  
      })
    }
  }
  useEffect(() => {
    getBusinessSourceReport()
  }, [queryParams])

  useEffect(() => {
    if (isGenereate) {
      genereateExcel()
    }
  }, [excelData])

  function getOnlyValueFromArr(data) {
    let returnData = []
    if (data && data.length > 0) {
        data.filter((item) => {
            returnData.push(item.value)
        })
    }
    return returnData
  }

  return (
    <Card>
      <CardHeader title="Business Source">
        <CardHeaderToolbar>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          onSubmit={(values) => {
            setQueryParamsBase({
              ...queryParams,
              pageNumber: 1,
              business_source: values.business_source,
              month: (values.month.length > 0) ? getOnlyValueFromArr(values.month) : []
            })
          }}
        >
          {({ handleSubmit, setFieldValue, values }) => (
            <div className="mt-5">
              <Form className="form form-label-right">
                <div className="form-group row">
                  <div className="col-lg-3">
                    <FormLabel>Business Source</FormLabel>
                      <SearchSelect
                          name="business_source"
                          options={business_sourcies}
                          onChange={(opt) => {
                              setFieldValue("business_source", opt?.value);
                          }}
                          value={business_sourcies.filter((item) => item.value === values.business_source)[0]}
                      />
                  </div>
                  <div className="col-lg-3">
                    <FormLabel>Month</FormLabel>
                    <SearchSelect
                        name="month"
                        options={yearOption}
                        placeholder="All"
                        onChange={(opt) => {
                            setFieldValue("month", (opt) ? opt : []);
                        }}
                        isClearable={true}
                        isMulti
                        value={values.month}
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

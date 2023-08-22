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
import { generateColumns } from "../../../utils/customerReferrals/tableDeps";
import { Formik, Form, Field } from "formik";
import { FormLabel } from "react-bootstrap";
import excel from "exceljs"
import { saveAs } from "file-saver"
import moment from "moment";
import { API_URL } from "../../../API_URL";
import axios from "axios";
import SearchSelect from "react-select";
import { Input } from "../../../../_metronic/_partials/controls";

export function CustomerReferrals() {
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
  const [initialValues, setInitialValues] = useState({
    customer_name: '',
    customer_referrals: ''
  });
  const [reportData, serReportData] = useState({
    totalCount: 0,
    entities: [],
    listLoading: false
  });

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
      'Referrals By',
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
          excelData[i]?.recommend_by,
          excelData[i]?.customer_officer_id?.displayname,
          excelData[i]?.contact_person[0]?.contact_name,
          excelData[i]?.office_number,
          excelData[i]?.mobile_number,
          excelData[i]?.email
        ])
        row_no++;
      }
    }
    wb.xlsx.writeBuffer(`Customer Referrals - ${moment().format('YYYY-MM-DD')}.xlsx`).then((buffer) => {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `Customer Referrals - ${moment().format('YYYY-MM-DD')}.xlsx`
      )
    })
  }

  function getCustomerReferralsReport() {
    axios.get(API_URL + `dashboard/customer_referrals_report`, {
      params: queryParams
    }).then((res) => {
      setFilterData({
        entities: res.data.docs,
        totalCount: res.data.totalDocs
      })
    }).catch(() => {

    })

    if (isGenereate) {
      axios.get(API_URL + `dashboard/customer_referrals_report`, {
        params: {...queryParams, pageNumber: 1, pageSize: 1000000 }
      }).then((res) => {
        setExcelData(res.data.docs)
      }).catch(() => {
  
      })
    }
  }
  useEffect(() => {
    getCustomerReferralsReport()
  }, [queryParams])

  useEffect(() => {
    if (isGenereate) {
      genereateExcel()
    }
  }, [excelData])

  return (
    <Card>
      <CardHeader title="Customer Referrals">
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
              customer_name: values.customer_name,
              customer_referrals: values.customer_referrals
            })
          }}
        >
          {({ handleSubmit, setFieldValue, values }) => (
            <div className="mt-5">
              <Form className="form form-label-right">
                <div className="form-group row">
                  <div className="col-lg-3">
                    <Field
                      withFeedbackLabel={false}
                      name="customer_name"
                      component={Input}
                      label="Customer"
                    />
                  </div>
                  <div className="col-lg-3">
                    <Field
                      withFeedbackLabel={false}
                      name="customer_referrals"
                      component={Input}
                      label="Customer Referrals"
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

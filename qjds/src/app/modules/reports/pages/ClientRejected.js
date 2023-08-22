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
import { generateColumns } from "../../../utils/clientRejected/tableDeps";
import { Input } from "../../../../_metronic/_partials/controls";
import * as actions from "../../../modules/sets/_redux/rejectReason/rejectReasonActions";
import { Formik, Form, Field } from "formik";
import { FormLabel } from "react-bootstrap";
import * as Yup from "yup";
import excel from "exceljs"
import { saveAs } from "file-saver"
import moment from "moment";
import { API_URL } from "../../../../app/API_URL";
import axios from "axios";
import SearchSelect from "react-select";
import { Avatar } from "@material-ui/core";

export function ClientRejected() {
  const history = useHistory();
  const dispatch = useDispatch()
  const columns = generateColumns(history, false);
  const filter = () => {
    const initialFilter = {
      filter: {},
      sortOrder: "desc", // asc||desc
      sortField: "total",
      search: '',
      pageNumber: 1,
      pageSize: 10
    };
    return initialFilter;
  };

  const [queryParams, setQueryParamsBase] = useState(filter());
  const [isGenereate, setIsGenereate] = useState(false);
  const [excelData, setExcelData] = useState([])
  const [users, setusers] = useState([]);
  const [rejectReasonOption, setRejectReasonOption] = useState([])
  const [initialValues, setInitialValues] = useState({
    customer_officer: '',
    reject_reason: '',
    type: '',
    period: ''
  });
  const [reportData, serReportData] = useState({
    totalCount: 0,
    entities: [],
    listLoading: false
  });
  const type = [
    {
      label: 'Quotation',
      value: 'quote'
    },{
      label: 'Contract',
      value: 'contract'
    }
  ]

  const { rejectReasons = [] } = useSelector(
    (state) => ({
      rejectReasons: state.rejectReasons.entities,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (rejectReasons) {
      let options = []
      rejectReasons.filter((item) => {
        options.push({
          label: item.reject_reason,
          value: item._id,
        })
      })
      options.push({
        label: 'Other',
        value: 'OTHER',
      })
      setRejectReasonOption(options)
    }
  }, [rejectReasons])

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
      'Contract / Quotation No.',
      'Customer',
      'Contact Person',
      'Contact No.',
      'Amount',
      'Customer Officer',
      'Rejected Date',
      'Reject Reason'
    ])
    ws.getCell(`E${row_no}`).alignment = { vertical: 'middle', horizontal: 'right' }
    ws.getRow(row_no).font = { bold:true }

    row_no++;

    for (let i = 0; i <= excelData.length; i++) {
      if (excelData[i]) {
        ws.addRow([
          excelData[i]?.q_c_number,
          excelData[i]?.customer_id?.customer_name,
          excelData[i]?.contact_person?.contact_name,
          excelData[i]?.contact_person?.office_number,
          parseFloat(excelData[i]?.total).toFixed(2),
          excelData[i]?.customer_id?.customer_officer[0]?.displayname,
          (excelData[i]?.client_reject_date) ? moment(excelData[i].client_reject_date).format("DD/MM/YYYY") : '',
          excelData[i]?.reject_reason
        ])
        ws.getCell(`E${row_no}`).alignment = { vertical: 'middle', horizontal: 'right' }
        row_no++;
      }
    }
    wb.xlsx.writeBuffer(`Client Rejected - ${moment().format('YYYY-MM-DD')}.xlsx`).then((buffer) => {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `Client Rejected - ${moment().format('YYYY-MM-DD')}.xlsx`
      )
    })
  }

  function getClientRejectedReport() {
    axios.get(API_URL + `dashboard/client_reject_report`, {
      params: queryParams
    }).then((res) => {
      setFilterData({
        entities: res.data.docs,
        totalCount: res.data.totalDocs
      })
    }).catch(() => {

    })

    if (isGenereate) {
      axios.get(API_URL + `dashboard/client_reject_report`, {
        params: {...queryParams, pageNumber: 1, pageSize: 1000000 }
      }).then((res) => {
        setExcelData(res.data.docs)
      }).catch(() => {
  
      })
    }
  }
  useEffect(() => {
    getClientRejectedReport()
  }, [queryParams])

  async function getUsers() {
    const data = await axios.get(API_URL + "users?all=true");
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
          value: x?._id,
          name: x?.displayname ? x?.displayname : x.username,
        };
      });
    setusers(salesDeptUsers);
  }

  useEffect(() => {
    getUsers();
    dispatch(actions.fetchRejectReasons({
      filter: {},
      sortOrder: "desc",
      sortField: "createdAt",
      pageNumber: 1,
      pageSize: 100000,
      status: true
    }));
  }, [])

  useEffect(() => {
    if (isGenereate) {
      genereateExcel()
    }
  }, [excelData])

  return (
    <Card>
      <CardHeader title="Client Rejected">
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
              customer_officer: values.customer_officer,
              reject_reason: values.reject_reason,
              type: values.type,
              period: values.period
            })
          }}
        >
          {({ handleSubmit, setFieldValue, values }) => (
            <div className="mt-5">
              <Form className="form form-label-right">
                <div className="form-group row">
                  <div className="col-lg-3">
                    <FormLabel>Customer Officer</FormLabel>
                    <SearchSelect
                      options={users}
                      placeholder="All"
                      onChange={(opt) => {
                        setFieldValue("customer_officer", (opt?.value) ? opt?.value : '')
                      }}
                      isClearable={true}
                      value={users.filter((x) => x.value === values.customer_officer)}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormLabel>Reject Reason</FormLabel>
                    <SearchSelect
                      options={rejectReasonOption}
                      placeholder="All"
                      onChange={(opt) => {
                        setFieldValue("reject_reason", (opt?.value) ? opt?.value : '')
                      }}
                      isClearable={true}
                      value={rejectReasonOption.filter((x) => x.value === values.reject_reason)}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormLabel>Period</FormLabel>
                    <input
                      type="month"
                      className="form-control"
                      name="period"
                      onChange={(e) => 
                        setFieldValue("period", (e?.target?.value) ? e.target.value : '')
                      }
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

                  <div className="col-lg-3 mt-3">
                    <FormLabel>Type</FormLabel>
                    <SearchSelect
                      options={type}
                      placeholder="All"
                      onChange={(opt) => {
                        setFieldValue("type", (opt?.value) ? opt?.value : '')
                      }}
                      isClearable={true}
                      value={type.filter((x) => x.value === values.type)}
                    />
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

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
import { generateColumns } from "../../../utils/sales/tableDeps";
import { Input } from "../../../../_metronic/_partials/controls";
import * as actions from "../../../modules/Admin/_redux/users/usersActions";
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

export function SalesBusiness() {
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
      pageSize: 10,
      from: new Date(),
      to: new Date()
    };
    return initialFilter;
  };

  const [queryParams, setQueryParamsBase] = useState(filter());
  const [isGenereate, setIsGenereate] = useState(false);
  const [excelData, setExcelData] = useState([])
  const [users, setusers] = useState([]);
  const [initialValues, setInitialValues] = useState({
    from: '',
    to: ''
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
      { width: 25, alignment: { vertical: 'middle', horizontal: 'center' } }
    ]

    ws.addRow([
      'Contract / Quotation No.',
      'Client Name',
      'status',
      'Amount'
    ])
    ws.getCell(`D${row_no}`).alignment = { vertical: 'middle', horizontal: 'right' }
    ws.getRow(row_no).font = { bold:true }
    row_no++;

    for (let i = 0; i <= excelData.length; i++) {
      if (excelData[i]) {
        ws.addRow([
          excelData[i].q_c_number,
          excelData[i].client_name,
          excelData[i].status,
          excelData[i].total
        ])
        ws.getCell(`D${row_no}`).alignment = { vertical: 'middle', horizontal: 'right' }
        row_no++;
      }
    }
    wb.xlsx.writeBuffer(`Sales Business - ${moment().format('YYYY-MM-DD')}.xlsx`).then((buffer) => {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `Sales Business - ${moment().format('YYYY-MM-DD')}.xlsx`
      )
    })
  }

  function getSalesReport(from, to) {
    axios.get(API_URL + `dashboard/sales_report`, {
      params: queryParams
    }).then((res) => {
      setFilterData({
        entities: res.data.docs,
        totalCount: res.data.totalDocs
      })
    }).catch(() => {

    })

    if (isGenereate) {
      axios.get(API_URL + `dashboard/sales_report`, {
        params: {...queryParams, pageNumber: 1, pageSize: 1000000 }
      }).then((res) => {
        setExcelData(res.data.docs)
      }).catch(() => {
  
      })
    }
  }
  useEffect(() => {
    getSalesReport()
  }, [queryParams])
  // useEffect(() => {
  //   if (isGenereate) {
  //     genereateExcel()
  //   }
  // }, [customers])

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
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params.to && params.from) {
      setTimeout(() => {
        setInitialValues({
          from: params.from,
          to: params.to,
          customer_office_worker_id: params.customer_office_worker_id
        })
        setQueryParamsBase({
          ...queryParams,
          from: moment(params.from).startOf('day').format('YYYY-MM-DD HH:mm'),
          to: moment(params.to).endOf('day').format('YYYY-MM-DD HH:mm'),
          customer_office_worker_id: params.customer_office_worker_id
        })
      }, 500);
    }
    getUsers();
  }, [])

  useEffect(() => {
    if (isGenereate) {
      genereateExcel()
    }
  }, [excelData])

  const NewCustomerSchema = Yup.object().shape({
    from: Yup.string().required("From date is required"),
    to: Yup.string().required("To date is required")
  });
  return (
    <Card>
      <CardHeader title="Sales Business">
        <CardHeaderToolbar>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <Formik
          enableReinitialize={true}
          validationSchema={NewCustomerSchema}
          initialValues={initialValues}
          onSubmit={(values) => {
            // queryParams.pageSize = 100000
            setQueryParamsBase({
              ...queryParams,
              pageNumber: 1,
              from: moment(values.from).startOf('day').format('YYYY-MM-DD HH:mm'),
              to: moment(values.to).endOf('day').format('YYYY-MM-DD HH:mm'),
              customer_office_worker_id: values.customer_office_worker_id
            })
            // getSalesReport(moment(values.from).startOf('day').format('YYYY-MM-DD HH:mm'), moment(values.to).endOf('day').format('YYYY-MM-DD HH:mm'))
          }}
        >
          {({ handleSubmit, setFieldValue, values }) => (
            <div className="mt-5">
              <Form className="form form-label-right">
                <div className="form-group row">
                  <div className="col-lg-3">
                    <FormLabel>Sales</FormLabel>
                    <SearchSelect
                      options={users}
                      placeholder="Select Service"
                      onChange={(opt) => {
                        setFieldValue("customer_office_worker_id", (opt?.value) ? opt.value : '');
                      }}
                      value={users.filter((x) => x.value === values.customer_office_worker_id)}
                      isClearable={true}
                    />
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

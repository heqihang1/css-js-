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
import * as actions from "../../../modules/Admin/_redux/users/usersActions";
import { generateColumns } from "../../../utils/overdue_report/tableDeps";
import { Input } from "../../../../_metronic/_partials/controls";
import { Formik, Form, Field } from "formik";
import { FormLabel } from "react-bootstrap";
import * as Yup from "yup";
import excel from "exceljs";
import { saveAs } from "file-saver";
import moment from "moment";
import { API_URL } from "../../../../app/API_URL";
import axios from "axios";
import SelectFilter from "react-select";
import { sortCaret } from "../../../../_metronic/_helpers";
import { formateAmount } from '../../../utils/utils'
import SearchSelect from "react-select";
import { Avatar } from "@material-ui/core";

export function OverdueAmount({ className }) {
  const history = useHistory();

  const filter = () => {
    const initialFilter = {
      filter: {},
      sortOrder: "desc", // asc||desc
      sortField: "createdAt",
      search: "",
      pageNumber: 1,
      pageSize: 10,
    };
    return initialFilter;
  };

  const [queryParams, setQueryParamsBase] = useState(filter());
  const [isGenereate, setIsGenereate] = useState(false);
  const [reportData, serReportData] = useState([]);
  const [users, setusers] = useState([]);
  const columns = generateColumns(history, false);
  const [selectedOfficer, setSelectedOfficer] = useState([])

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
    return {
      currentState: state.customers,
      customers: state.customers.entities
    };
  }, shallowEqual);
  // Products Redux state
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState({
    date: "",
    officer: "",
  })

  useEffect(() => {
    // eslint-disable-next-line
    //getOverdueInvoice(moment().startOf('day').format('YYYY-MM-DD HH:mm'))
    setInitialValues({
      date: moment().format('YYYY-MM-DD'),
      officer: ""
    })

    let officer_arr = []
    if (selectedOfficer && selectedOfficer.length > 0) {
      selectedOfficer.filter((item) => {
        officer_arr.push(item.value)
      })
    }
    setQueryParamsBase({
      ...queryParams,
      date: moment().startOf('day').format('YYYY-MM-DD HH:mm'),
      officers: officer_arr
    });
  }, []);

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
          'Invoice Number',
          'Customer Name',
          'Contact Person',
          'Cell Phone',
          'Overdue Date',
          'Overdue Amount'
      ])
      ws.getCell(`F${row_no}`).alignment = { vertical: 'middle', horizontal: 'right' }
      ws.getRow(row_no).font = { bold:true }
      row_no++;

      for (let i = 0; i <= reportData.length; i++) {
          if (reportData[i]) {
              ws.addRow([
                  reportData[i].invoice_no,
                  reportData[i].customer_name,
                  reportData[i].customer_contact_name,
                  reportData[i].customer_mobile_number,
                  moment(reportData[i].overdue_date).format('DD/MM/YYYY'),
                  formateAmount(reportData[i]?.amount - reportData[i]?.paid_amount)

              ])
              ws.getCell(`F${row_no}`).alignment = { vertical: 'middle', horizontal: 'right' }
              row_no++;
          }
      }
      wb.xlsx.writeBuffer(`Overdue Amount - ${moment().format('YYYY-MM-DD')}.xlsx`).then((buffer) => {
          saveAs(
              new Blob([buffer], { type: "application/octet-stream" }),
              `Overdue Amount - ${moment().format('YYYY-MM-DD')}.xlsx`
          )
      })
  }

  useEffect(() => {
      if (isGenereate) {
          genereateExcel()
      }
  }, [reportData])

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
    // delete queryParams.filter.customer_type
    // queryParams.filter.createdAt = { $gte: from, $lte: to };
    // queryParams.pageSize = 100000
    // dispatch(actions.findCustomers(queryParams));
    getUsers();
  }, []);

  const NewCustomerSchema = Yup.object().shape({
    date: Yup.string().required("Date is required")
  });

  function getOverdueInvoice() {
    axios.get(API_URL + `invoices/overdue`, { params: queryParams }).then((res)  => {      
      setFilterData({
        entities: res.data.docs,
        totalCount: res.data.totalDocs,
      });
    }).catch(() => {
      
    })

    if (isGenereate) {
      axios.get(API_URL + `invoices/overdue`, { params: {...queryParams, pageNumber: 1, pageSize: 1000000 } }).then((res)  => {      
        serReportData(res.data.docs)
      }).catch(() => {
        
      })
    }
  }

  useEffect(() => {
    getOverdueInvoice();
  }, [queryParams]);

  return (
    <Card>
      <CardHeader title="Overdue Amount">
        <CardHeaderToolbar></CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <Formik
          enableReinitialize={true}
          validationSchema={NewCustomerSchema}
          initialValues={initialValues}
          onSubmit={(values) => {
            let officer_arr = []
            if (selectedOfficer && selectedOfficer.length > 0) {
              selectedOfficer.filter((item) => {
                officer_arr.push(item.value)
              })
            }
            setQueryParamsBase({
              ...queryParams,
              pageNumber: 1,
              date: moment(values.date).startOf('day').format('YYYY-MM-DD HH:mm'),
              officers: officer_arr
            });
            //getOverdueInvoice(moment(values.date).startOf('day').format('YYYY-MM-DD HH:mm'))
          }}
        >
          {({ handleSubmit, setFieldValue, values }) => (
            <div className="mt-5">
              <Form className="form form-label-right">
                <div className="form-group row">
                  <div className="col-lg-4">
                    <FormLabel>Date <span className="indicatory">*</span></FormLabel>
                    <Field name="date" type="date" component={Input} />
                  </div>
                  <div className="col-lg-4">
                    <FormLabel>Officer</FormLabel>
                    <SearchSelect
                      options={users}
                      placeholder="Select Officer"
                      isMulti
                      onChange={(opt) => {setSelectedOfficer(opt)}}
                    />
                  </div>
                  <div className="col-lg-4 mt-8">
                    <button
                      type="button"
                      className="btn btn-primary bg-white border-primary text-primary"
                      onClick={(e) => { setIsGenereate(false); handleSubmit() } }
                    >                  
                      Search
                    </button>

                    <button
                      type="submit"
                      style={{ height: "max-content" }}
                      className="btn btn-primary ml-3"
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

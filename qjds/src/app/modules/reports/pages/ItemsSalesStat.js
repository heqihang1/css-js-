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
import { generateColumns } from "../../../utils/itemSaleStat/tableDeps";
import { Input } from "../../../../_metronic/_partials/controls";
import * as serviceActions from "../../sets/_redux/services/servicesActions";
import { Formik, Form, Field } from "formik";
import { FormLabel } from "react-bootstrap";
import * as Yup from "yup";
import excel from "exceljs"
import { saveAs } from "file-saver"
import moment from "moment";
import { API_URL } from "../../../../app/API_URL";
import axios from "axios";
import SearchSelect from "react-select";
import { formateAmount } from '../../../utils/utils'

export function ItemsSalesStat() {
  const history = useHistory();

  const columns = generateColumns(history, false);
  const filter = () => {
    const initialFilter = {
      filter: {},
      sortOrder: "desc", // asc||desc
      sortField: "total",
      search: '',
      pageNumber: 1,
      pageSize: 10,
    };
    return initialFilter;
  };

  const [queryParams, setQueryParamsBase] = useState(filter());
  const [isGenereate, setIsGenereate] = useState(false);
  const [initialValues, setInitialValues] = useState({
    from: '',
    to: ''
  });
  const [reportData, serReportData] = useState([]);
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
  const { currentState, customers, services } = useSelector((state) => {
    return { currentState: state.customers, customers: state.customers.entities, services: state.services.entities };
  }, shallowEqual);
  // Products Redux state
  const dispatch = useDispatch();

  const { totalCount, entities, listLoading } = currentState;
  const [selectedServices, setSelectedServices] = useState([])
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
      { width: 25, alignment: { vertical: 'middle', horizontal: 'center' } }
    ]

    ws.addRow([
      'Service',
      'Quatation/Contract No',
      'Customer',
      'Status',
      'Service Amount'
    ])
    ws.getRow(row_no).font = { bold:true }
    ws.getCell(`E${row_no}`).alignment = { vertical: 'middle', horizontal: 'right' }
    row_no++;

    for (let i = 0; i <= reportData?.length; i++) {
      if (reportData[i]) {
        ws.addRow([
          reportData[i].services[0]?.title,
          reportData[i].q_c_number,
          reportData[i].customer_name,
          reportData[i].status,
          formateAmount(reportData[i].total)
        ])
        ws.getCell(`E${row_no}`).alignment = { vertical: 'middle', horizontal: 'right' }
        row_no++;
      }
    }
    wb.xlsx.writeBuffer(`Items Sales Stat - ${moment().format('YYYY-MM-DD')}.xlsx`).then((buffer) => {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `Items Sales Stat - ${moment().format('YYYY-MM-DD')}.xlsx`
      )
    })
  }

  useEffect(() => {
    if (isGenereate) {
      genereateExcel()
    }
  }, [reportData])

  function getItemsSalesReport() {
    axios.get(API_URL + `dashboard/items_sales_stat_report`, { params: queryParams }).then((res) => {
      setFilterData({
        entities: res.data.docs,
        totalCount: res.data.totalDocs,
      });
    }).catch(() => {

    })

    if (isGenereate) {
      axios.get(API_URL + `dashboard/items_sales_stat_report`, { params: {...queryParams, pageNumber: 1, pageSize: 1000000 } }).then((res) => {
        serReportData(res.data.docs)
      }).catch(() => {
  
      })
    }
  }

  useEffect(() => {
    if (isGenereate) {
      genereateExcel()
    }
  }, [customers])

  useEffect(() => {
    getItemsSalesReport();
  }, [queryParams]);

  useEffect(() => {
    dispatch(serviceActions.fetchservices({ pageSize: 100000 }));
  }, [])

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params.to && params.from) {
      const services = [{
        label: params.service_name,
        value: params.service_id
      }]
      setSelectedServices(services)
      setInitialValues({
        from: params.from,
        to: params.to
      })
      //queryParams.pageSize = 100000
      let services_arr = []
      if (services && services?.length > 0) {
        services.filter((item) => {
          services_arr.push(item.value)
        })
      }
      setQueryParamsBase({
        ...queryParams,
        from: moment(params.from).startOf('day').format('YYYY-MM-DD HH:mm'),
        to: moment(params.to).endOf('day').format('YYYY-MM-DD HH:mm'),
        services: services_arr
      });
      //getItemsSalesReport(moment(params.from).startOf('day').format('YYYY-MM-DD HH:mm'), moment(params.to).endOf('day').format('YYYY-MM-DD HH:mm'), services)
    }
  }, [])

  const NewCustomerSchema = Yup.object().shape({
    from: Yup.string().required("From date is required"),
    to: Yup.string().required("To date is required")
  });
  return (
    <Card>
      <CardHeader title="Items Sales Stat">
        <CardHeaderToolbar>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <Formik
          enableReinitialize={true}
          validationSchema={NewCustomerSchema}
          initialValues={initialValues}
          onSubmit={(values) => {
            let services_arr = []
            if (selectedServices && selectedServices?.length > 0) {
              selectedServices.filter((item) => {
                services_arr.push(item.value)
              })
            }
            setQueryParamsBase({
              ...queryParams,
              pageNumber: 1,
              from: moment(values.from).startOf('day').format('YYYY-MM-DD HH:mm'),
              to: moment(values.to).endOf('day').format('YYYY-MM-DD HH:mm'),
              services: services_arr
            });
            //getItemsSalesReport(moment(values.from).startOf('day').format('YYYY-MM-DD HH:mm'), moment(values.to).endOf('day').format('YYYY-MM-DD HH:mm'), selectedServices)
          }}
        >
          {({ handleSubmit, setFieldValue, values }) => (
            <div className="mt-5">
              <Form className="form form-label-right">
                <div className="form-group row">
                  <div className="col-lg-4">
                    <FormLabel>Service</FormLabel>
                    <SearchSelect
                      options={
                        services
                          ? services.map((item) => ({
                            value: item._id,
                            label: item.service_name,
                          }))
                          : []
                      }
                      placeholder="Select Service"
                      isMulti
                      value={selectedServices}
                      onChange={(opt) => { setSelectedServices(opt) }}
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
                  <div className="col-lg-2 mt-8">
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
          entities={filterData.entities || []}
          paginationOptions={paginationOptions}
          defaultContact={defaultContact}
          setDefaultContact={setDefaultContact}
          hideFilter={true}
        />
      </CardBody>
    </Card>
  );
}

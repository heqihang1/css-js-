import React, { useEffect, useState, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { isEqual, isFunction } from "lodash";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../_metronic/_partials/controls";
import { fetchRights } from "../../../../redux/userRoleRightsSlice";
import { Table } from "../../../components/Table";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as uiHelpers from "../../customers/pages/ProductsUIHelpers";
import { generateColumns } from "../../../utils/salesPerfomance/tableDeps";
import { Input } from "../../../../_metronic/_partials/controls";
import { Formik, Form, Field } from "formik";
import { FormLabel } from "react-bootstrap";
import * as Yup from "yup";
import excel from "exceljs";
import { saveAs } from "file-saver";
import moment from "moment";
import { API_URL } from "../../../API_URL";
import axios from "axios";
import { formateAmount } from "../../../utils/utils";
import { Avatar } from "@material-ui/core";
import SelectFilter from "react-select";

export function SalesPerformance() {
  const history = useHistory();
  const [accessModules, setAccessModules] = React.useState([]);

  const status = [
    {
      label: "All",
      value: "",
    },
    {
      label: "Confirmed",
      value: "CONFIRMED",
    },
    {
      label: "Client Rejected",
      value: "CLIENT_REJECTED",
    }
  ];

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

  const types = [
    {
      label: "Customer",
      value: "CUSTOMER",
    },
    {
      label: "Quotation",
      value: "QUOTATION",
    },
    {
      label: "Contract",
      value: "CONTRACT",
    },
  ];

  const [users, setusers] = useState([]);
  const [queryParams, setQueryParamsBase] = useState(filter());
  const [isGenereate, setIsGenereate] = useState(false);
  const [selectedType, setSelectedType] = useState("CUSTOMER");
  const [selectedCustomerOfficer, setSelectedCustomerOfficer] = useState("");
  const [initialValues, setInitialValues] = useState({
    customer_officer: "",
    type: "",
  });
  const [reportData, serReportData] = useState([]);

  const columns = generateColumns(history, false, selectedType);

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
  const {
    user: { role },
    rights,
    currentState,
  } = useSelector(
    (state) => ({
      user: state.auth.user,
      rights: state.roleRights.rights,
      currentState: state.customers,
    }),
    shallowEqual
  );
  // Products Redux state
  const dispatch = useDispatch();

  const getRole = async (role) => {
    dispatch(fetchRights(role));
  };

  useEffect(() => {
    if (role) {
      getRole(role);
    }
    // eslint-disable-next-line
  }, [role]);

  useEffect(() => {
    if (rights) {
      setAccessModules(
        rights.map((module) => (module.can_read ? module.code : ""))
      );
    }
    // eslint-disable-next-line
  }, [rights]);

  const { totalCount, entities, listLoading } = currentState;
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

  useEffect(() => {
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
    getUsers();
  }, []);

  function genereateExcel() {
    setIsGenereate(false);
    const wb = new excel.Workbook();
    const ws = wb.addWorksheet("Sheet 1", {
      views: [{ showGridLines: false }],
    });

    let row_no = 1;

    ws.columns = [
      { width: 25, alignment: { vertical: "middle", horizontal: "center" } },
      { width: 25, alignment: { vertical: "middle", horizontal: "center" } },
      { width: 25, alignment: { vertical: "middle", horizontal: "center" } },
      { width: 25, alignment: { vertical: "middle", horizontal: "center" } },
      { width: 25, alignment: { vertical: "middle", horizontal: "center" } },
      { width: 25, alignment: { vertical: "middle", horizontal: "center" } },
      { width: 25, alignment: { vertical: "middle", horizontal: "center" } },
    ];

    let file_name = "";
    if (selectedType == "QUOTATION") {
      ws.addRow([
        "Quotation Number",
        "Customer",
        "Amount",
        "Created Date",
        "State",
      ]);
      ws.getRow(row_no).font = { bold:true }
      row_no++;

      for (let i = 0; i <= reportData.length; i++) {
        if (reportData[i]) {
          ws.addRow([
            reportData[i].quotation_no,
            reportData[i].customer_name,
            formateAmount(reportData[i].amount),
            reportData[i].createdAt
              ? moment(reportData[i].createdAt).format("DD/MM/YYYY HH:MM")
              : "",
            reportData[i].status,
          ]);
          row_no++;
        }
      }
      file_name = `${selectedCustomerOfficer}-Quotation-${moment().format(
        "YYYYMMDD"
      )}.xlsx`;
      wb.xlsx.writeBuffer(file_name).then((buffer) => {
        saveAs(
          new Blob([buffer], { type: "application/octet-stream" }),
          file_name
        );
      });
    } else if (selectedType == "CONTRACT") {
      ws.addRow([
        "Contract Number",
        "Customer",
        "Amount",
        "Created Date",
        "State",
      ]);
      ws.getRow(row_no).font = { bold:true }
      row_no++;

      for (let i = 0; i <= reportData.length; i++) {
        if (reportData[i]) {
          ws.addRow([
            reportData[i].contract_no,
            reportData[i].customer_name,
            formateAmount(reportData[i].contract_amount),
            reportData[i].createdAt
              ? moment(reportData[i].createdAt).format("DD/MM/YYYY HH:MM")
              : "",
            reportData[i].status,
          ]);
          row_no++;
        }
      }
      file_name = `${selectedCustomerOfficer}-Contract-${moment().format(
        "YYYYMMDD"
      )}.xlsx`;
      wb.xlsx.writeBuffer(file_name).then((buffer) => {
        saveAs(
          new Blob([buffer], { type: "application/octet-stream" }),
          file_name
        );
      });
    } else {
      ws.addRow([
        "Customer Type",
        "Customer",
        "Contact Person",
        "Office Phone",
        "Cell Phone",
        "Created Date",
      ]);
      ws.getRow(row_no).font = { bold:true }
      row_no++;

      for (let i = 0; i <= reportData.length; i++) {
        if (reportData[i]) {
          ws.addRow([
            reportData[i].customer_type,
            reportData[i].customer_name,
            reportData[i].contact_name,
            reportData[i].office_number,
            reportData[i].mobile_number,
            reportData[i].createdAt
              ? moment(reportData[i].createdAt).format("DD/MM/YYYY HH:MM")
              : "",
          ]);
          row_no++;
        }
      }
      file_name = `${selectedCustomerOfficer}-Customer-${moment().format(
        "YYYYMMDD"
      )}.xlsx`;
      wb.xlsx.writeBuffer(file_name).then((buffer) => {
        saveAs(
          new Blob([buffer], { type: "application/octet-stream" }),
          file_name
        );
      });
    }
  }

  function getSalesPerformance() {
    if (queryParams.customer_officer && queryParams.type) {
      axios
      .get(API_URL + `dashboard/sales_performance`, { params: queryParams })
      .then((res) => {
        setFilterData({
          entities: res.data.docs,
          totalCount: res.data.totalDocs,
        });
      })
      .catch(() => {});

      if (isGenereate) {
        axios
        .get(API_URL + `dashboard/sales_performance`, { params: {...queryParams, pageNumber: 1, pageSize: 1000000 } })
        .then((res) => {
          serReportData(res.data.docs);
        })
        .catch(() => {});
      }
    }
  }

  useEffect(() => {
    getSalesPerformance();
  }, [queryParams]);

  useEffect(() => {
    if (isGenereate) {
      genereateExcel();
    }
  }, [reportData]);

  const NewCustomerSchema = Yup.object().shape({
    customer_officer: Yup.string().required("Customer officer is required"),
    type: Yup.string().required("Type is required"),
  });
  return !accessModules.includes("SALES_PERFORMANCE_REPORT") ? null : (
    <Card>
      <CardHeader title="Sales Performance">
        <CardHeaderToolbar></CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <Formik
          enableReinitialize={true}
          validationSchema={NewCustomerSchema}
          initialValues={initialValues}
          onSubmit={(values) => {
            //queryParams.pageSize = 100000;
            //getSalesPerformance(values.customer_officer, values.type);
            setSelectedType(values.type)
            setQueryParamsBase({
              ...queryParams,
              pageNumber: 1,
              customer_officer: values.customer_officer,
              type: values.type,
              status: values.status,
              from: values.from,
              to: values.to
            });
          }}
        >
          {({ handleSubmit, setFieldValue, values, errors }) => (
            <div className="mt-5">
              <Form className="form form-label-right">
                <div className="form-group row">
                  <div className="col-lg-3">
                    <FormLabel>Customer Officer <span className="indicatory">*</span></FormLabel>
                    <SelectFilter
                      name="customer_officer"
                      options={users}
                      onChange={(opt) => {
                        setSelectedCustomerOfficer(opt.name);
                        setFieldValue("customer_officer", opt.value);
                      }}
                    />
                    {errors.customer_officer ? (
                      !values.customer_officer ? (
                        <div className="text-danger">
                          {errors.customer_officer}
                        </div>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col-lg-3">
                    <FormLabel>Type <span className="indicatory">*</span></FormLabel>
                    <SelectFilter
                      name="type"
                      options={types}
                      onChange={(opt) => {
                        setFieldValue("type", opt.value);
                      }}
                    />
                    {errors.type ? (
                      !values.type ? (
                        <div className="text-danger">
                          {errors.type}
                        </div>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col-lg-3">
                    <FormLabel>Status</FormLabel>
                    <SelectFilter
                      name="status"
                      options={status}
                      placeholder="All"
                      onChange={(opt) => {
                        setFieldValue("status", opt.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3"></div>
                  <div className="col-lg-3 mt-2">
                    <FormLabel>From</FormLabel>
                    <Field
                      name="from"
                      type="date"
                      component={Input}
                    />
                  </div>
                  <div className="col-lg-3 mt-2">
                    <FormLabel>To</FormLabel>
                    <Field
                      name="to"
                      type="date"
                      component={Input}
                    />
                  </div>
                  <div className="col-lg-2 mt-10">
                    <button
                      type="button"
                      className="btn btn-primary bg-white border-primary text-primary"
                      onClick={(e) => {
                        setIsGenereate(false);
                        handleSubmit();
                      }}
                    >
                      Search
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary bg-white border-primary text-primary ml-3"
                      onClick={(e) => {
                        setIsGenereate(true);
                        handleSubmit();
                      }}
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

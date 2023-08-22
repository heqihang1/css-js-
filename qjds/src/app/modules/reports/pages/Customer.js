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
import { generateColumns } from "../../../utils/customerReport/tableDeps";
import * as DisActions from "../../sets/_redux/districts/districtsActions";
import * as ComSecActions from "../../sets/_redux/commercialSector/commercialSectorActions";
import { Input } from "../../../../_metronic/_partials/controls";
import { Formik, Form, Field } from "formik";
import { FormLabel } from "react-bootstrap";
import * as Yup from "yup";
import excel from "exceljs"
import { saveAs } from "file-saver"
import moment from "moment";
import { API_URL } from "../../../API_URL";
import axios from "axios";
import SearchSelect from "react-select";
import { Avatar } from "@material-ui/core";

export function Customer() {
  const history = useHistory();
  const dispatch = useDispatch()
  const columns = generateColumns(history, false);
  const filter = () => {
    const initialFilter = {
      filter: {},
      sortOrder: "desc", // asc||desc
      sortField: "createdAt",
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
  const [initialValues, setInitialValues] = useState({
    customer_officer: '',
    type: '',
    district: '',
    commercial_sector: ''
  });
  const [reportData, serReportData] = useState({
    totalCount: 0,
    entities: [],
    listLoading: false
  });

  const typeOption = [
    {
      label: 'Personal',
      value: 'Personal'
    },
    {
      label: 'Company',
      value: 'Company'
    }
  ]

  const { districtsList, commercialSecList } = useSelector(
    (state) => ({
      districtsList: state?.districts?.entities || [],
      commercialSecList: state?.commercialSectors?.entities || []
    }),
    shallowEqual
  );

  const districtsOptions = districtsList?.map((x) => {
    return {
      label: x?.district_eng_name,
      value: x?._id,
    };
  });

  const commercialSecOptions = commercialSecList.map((x) => {
    return {
      label: x?.commercial_sector_name,
      value: x?._id,
    };
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

  function getCommercialSector(items) {
    let returnData = []
    if (items && items.length > 0) {
      items.filter((item) => {
        returnData.push(item.commercial_sector_name)
      })
    }
    return returnData.join(', ')
  }

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
      { width: 25, alignment: { vertical: 'middle', horizontal: 'center' } },
      { width: 25, alignment: { vertical: 'middle', horizontal: 'center' } },
      { width: 25, alignment: { vertical: 'middle', horizontal: 'center' } },
      { width: 25, alignment: { vertical: 'middle', horizontal: 'center' } },
      { width: 25, alignment: { vertical: 'middle', horizontal: 'center' } },
      { width: 25, alignment: { vertical: 'middle', horizontal: 'center' } },
      { width: 25, alignment: { vertical: 'middle', horizontal: 'center' } },
      { width: 25, alignment: { vertical: 'middle', horizontal: 'center' } },
      { width: 25, alignment: { vertical: 'middle', horizontal: 'center' } }
    ]

    ws.addRow([
      'Customer Name.',
      'Customer Type',
      'Commercial Sector',
      'Customer Officer',
      'Contact Person 1',
      'Office Phone 1',
      'Cell Phone 1',
      'Email 1',
      'Location 1',
      'Contact Person 2',
      'Office Phone 2',
      'Cell Phone 2',
      'Email 2',
      'Location 2'
    ])
    ws.getRow(row_no).font = { bold:true }
    row_no++;

    for (let i = 0; i <= excelData.length; i++) {
      if (excelData[i]) {
        ws.addRow([
          excelData[i]?.customer_name,
          excelData[i]?.customer_type,
          getCommercialSector(excelData[i]?.commercial_sector_details),
          excelData[i]?.user,
          excelData[i]?.contact[0]?.contact_name,
          excelData[i]?.contact[0]?.office_number,
          excelData[i]?.contact[0]?.mobile_number,
          excelData[i]?.contact[0]?.email,
          excelData[i]?.district[0]?.location_address,
          excelData[i]?.contact[1]?.contact_name,
          excelData[i]?.contact[1]?.office_number,
          excelData[i]?.contact[1]?.mobile_number,
          excelData[i]?.contact[1]?.email,
          excelData[i]?.district[1]?.location_address
        ])
        row_no++;
      }
    }
    wb.xlsx.writeBuffer(`Customer - ${moment().format('YYYY-MM-DD')}.xlsx`).then((buffer) => {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `Customer - ${moment().format('YYYY-MM-DD')}.xlsx`
      )
    })
  }

  function getCustomerReport() {
    axios.get(API_URL + `dashboard/customer_report`, {
      params: queryParams
    }).then((res) => {
      setFilterData({
        entities: res.data.docs,
        totalCount: res.data.totalDocs
      })
    }).catch(() => {

    })

    if (isGenereate) {
      axios.get(API_URL + `dashboard/customer_report`, {
        params: { ...queryParams, pageNumber: 1, pageSize: 1000000 }
      }).then((res) => {
        setExcelData(res.data.docs)
      }).catch(() => {

      })
    }
  }
  useEffect(() => {
    getCustomerReport()
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
    dispatch(DisActions.findAllDistrictsList());
    dispatch(ComSecActions.findAllCommercialSectorsList());
  }, [])

  useEffect(() => {
    if (isGenereate) {
      genereateExcel()
    }
  }, [excelData])

  return (
    <Card>
      <CardHeader title="Customer">
        <CardHeaderToolbar>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          onSubmit={(values) => {
            // queryParams.pageSize = 100000
            let commercial_sector_arr = []
            if (values.commercial_sector && values.commercial_sector.length > 0) {
              values.commercial_sector.filter((item) => {
                commercial_sector_arr.push(item.value)
              })
            }
            let district_arr = []
            if (values.district && values.district.length > 0) {
              values.district.filter((item) => {
                district_arr.push(item.value)
              })
            }
            setQueryParamsBase({
              ...queryParams,
              pageNumber: 1,
              customer_officer: values.customer_officer,
              type: values.type,
              commercial_sector: commercial_sector_arr,
              district: district_arr
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
                    <FormLabel>Type</FormLabel>
                    <SearchSelect
                      options={typeOption}
                      placeholder="All"
                      onChange={(opt) => {
                        setFieldValue("type", (opt?.value) ? opt?.value : '')
                      }}
                      isClearable={true}
                      value={typeOption.filter((x) => x.value === values.type)}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormLabel>District</FormLabel>
                    <SearchSelect
                      options={districtsOptions}
                      placeholder="All"
                      onChange={(opt) => {
                        setFieldValue("district", opt)
                      }}
                      isClearable={true}
                      isMulti={true}
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
                  <div className="col-lg-3 mt-2">
                    <FormLabel>Commercial Sector</FormLabel>
                    <SearchSelect
                      options={commercialSecOptions}
                      placeholder="All"
                      onChange={(opt) => {
                        setFieldValue("commercial_sector", opt)
                      }}
                      isClearable={true}
                      isMulti={true}
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

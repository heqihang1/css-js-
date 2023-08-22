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
import { generateColumns } from "../../../utils/uploadDocument/tableDeps";
import { Input } from "../../../../_metronic/_partials/controls";
import * as actions from "../../sets/_redux/rejectReason/rejectReasonActions";
import { Formik, Form, Field } from "formik";
import { FormLabel } from "react-bootstrap";
import * as Yup from "yup";
import excel from "exceljs";
import { saveAs } from "file-saver";
import moment from "moment";
import { API_URL } from "../../../API_URL";
import axios from "axios";
import SearchSelect from "react-select";


const type = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Quotation",
    value: "quote",
  },
  {
    label: "Contract",
    value: "contract",
  },
  {
    label: "Job Order",
    value: "job",
  },
];

export function UploadDocument() {
  const urlSearchParams = new URLSearchParams(useLocation().search);
  const history = useHistory();
  const dispatch = useDispatch();
  const columns = generateColumns(history, false);
  const filter = () => {
    const initialFilter = {
      filter: {},
      sortOrder: "desc", // asc||desc
      sortField: "total",
      search: "",
      pageNumber: 1,
      pageSize: 10,
      type: urlSearchParams.get("type") || ""
    };
    return initialFilter;
  };
  const [queryParams, setQueryParamsBase] = useState(filter());
  const [isGenereate, setIsGenereate] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [initialValues, setInitialValues] = useState({
    type: urlSearchParams.get("type") || "",
  });
  const [reportData, serReportData] = useState({
    totalCount: 0,
    entities: [],
    listLoading: false,
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
    ];

    ws.addRow([
      "Type",
      "No.",
      "Customer",
      "Contact Person",
      "Contact No.",
      "Customer Officer"
    ]);
    ws.getRow(row_no).font = { bold:true }
    row_no++;

    for (let i = 0; i <= excelData.length; i++) {
      if (excelData[i]) {
        ws.addRow([
          excelData[i]?.type,
          excelData[i]?.contract_quotation_no,
          excelData[i]?.client_name,
          excelData[i]?.contact_person?.contact_name ? excelData[i]?.contact_person?.contact_name : excelData[i]?.contact_person,
          excelData[i]?.contact_person?.office_number ? excelData[i]?.contact_person?.office_number : excelData[i]?.customer_contact_no,
          excelData[i]?.customer_officer
        ]);
        row_no++;
      }
    }
    wb.xlsx
      .writeBuffer(`Upload Document - ${moment().format("YYYY-MM-DD")}.xlsx`)
      .then((buffer) => {
        saveAs(
          new Blob([buffer], { type: "application/octet-stream" }),
          `Upload Document - ${moment().format("YYYY-MM-DD")}.xlsx`
        );
      });
  }

  function getUploadedDocumentReport() {
    if (isGenereate) {
      axios
        .get(API_URL + `dashboard/upload_document_report`, {
          params: { ...queryParams, type: initialValues.type, pageNumber: 1, pageSize: 1000000 },
        })
        .then((res) => {
          setExcelData(res.data.docs);
        })
        .catch(() => { });
    } else {
      axios
        .get(API_URL + `dashboard/upload_document_report`, {
          params: { ...queryParams, type: initialValues.type },
        })
        .then((res) => {
          setFilterData({
            entities: res.data.docs,
            totalCount: res.data.totalDocs,
          });
        })
        .catch(() => { });
    }
  }
  useEffect(() => {
    getUploadedDocumentReport();
  }, [queryParams]);

  useEffect(() => {
    dispatch(
      actions.fetchRejectReasons({
        filter: {},
        sortOrder: "desc",
        sortField: "createdAt",
        pageNumber: 1,
        pageSize: 100000,
        status: true,
      })
    );
  }, []);

  useEffect(() => {
    if (isGenereate) {
      genereateExcel();
    }
  }, [excelData]);

  return (
    <Card>
      <CardHeader title="Upload Document Reminder">
        <CardHeaderToolbar></CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          onSubmit={(values) => {
            // queryParams.pageSize = 100000
            setInitialValues({ type: values.type })
            setQueryParamsBase({
              ...queryParams,
              pageNumber: 1,
              type: values.type,
            });
          }}
        >
          {({ handleSubmit, setFieldValue, values }) => (
            <div className="mt-5">
              <Form className="form form-label-right">
                <div className="form-group row">
                  <div className="col-lg-3 mt-3">                    
                    <FormLabel>Type</FormLabel>
                    <SearchSelect
                      options={type}
                      placeholder="All"
                      onChange={(opt) => {
                        setFieldValue("type", opt?.value ? opt?.value : "");
                      }}
                      isClearable={values.type}
                      value={type.filter((x) => x.value === values.type)}
                    />
                  </div>
                  <div className="col-lg-3 mt-8 d-flex align-items-end">
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

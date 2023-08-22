// 销售报表
import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { isEqual, isFunction } from "lodash";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../_metronic/_partials/controls";
import { Formik, Form, Field } from "formik";
import { FormLabel } from "react-bootstrap";
import SearchSelect from "react-select";
import { Table } from "../../../components/Table";
import { Input } from "../../../../_metronic/_partials/controls";
import { getHeaderColumns } from "../../../utils/salesInvoice/tableDeps";
import * as uiHelpers from "../../customers/pages/ProductsUIHelpers";
import { API_URL } from "../../../API_URL";
import { Avatar } from "@material-ui/core";
import excel from "exceljs"
import { saveAs } from "file-saver"
import moment from "moment"
import axios from "axios";

export function SalesInvoice() {
  const history = useHistory()
  const headerColumns = getHeaderColumns(history, false)
  const start = moment().startOf('months').format('YYYY-MM-DD')
  const end = moment().endOf('months').format('YYYY-MM-DD')

  //status下拉列表枚举值
  const enumStatus = [
    { value: 1, label: 'Payments Pending' },
    { value: 2, label: 'Partial Payment' },
    { value: 3, label: 'Paid' },
  ]
  const filter = () => {
    const init = {
      sortOrder: "desc",   //asc||desc排序顺序
      sortField: "job_no", //排序字段
      pageNumber: 1,
      pageSize: 10,
      from: start,
      to: end,
    }
    return init
  }

  const [queryParams, setQueryParamsBase] = useState(filter())  //查询参数
  const [initialValues, setInitialValues] = useState({
    customer_id_arr: [],
    status_arr: [],
    startDate: start,
    endDate: end,
  })
  const [isGenerate, setIsGenerate] = useState(false)   //是否生成xlsx表格
  const [excelData, setExcelData] = useState([])
  const [listLoading, setListLoading] = useState(false)
  const [filterData, setFilterData] = useState({ entities: [], totalCount: 0 })
  const [customer, setCustomer] = useState([])   //Customer数据

  useEffect(() => {
    getCustomerInfo()
  }, [])

  //获取 Customer Officer列表数据
  const getCustomerInfo = async () => {
    const res = await axios.get(API_URL + "users?all=true");
    const resArr = res?.data.users
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
    setCustomer(resArr)
  }

  useEffect(() => {
    getTableData()
  }, [queryParams])

  // 获取table数据
  const getTableData = () => {
    setListLoading(true)
    axios.get(API_URL + `invoices/sales-report`, { params: queryParams })
      .then((res) => {
        if (res?.status === 200) {
          setFilterData({
            entities: res.data.docs,
            totalCount: res.data.totalDocs
          })
          setListLoading(false)
        }
      }).catch((err) => { })

    if (isGenerate) {
      axios.get(API_URL + `invoices/sales-report`, {
        params: { ...queryParams, pageNumber: 1, pageSize: 1000000 }
      }).then((res) => {
        if (res?.status === 200) {
          setExcelData(res.data.docs)
        }
      }).catch((err) => { })
    }
  }

  useEffect(() => {
    if (isGenerate) {
      excelChange()   //导出数据变化重新下载新数据
    }
  }, [excelData])

  // 导出 excel事件
  const excelChange = () => {
    setIsGenerate(false)
    const wb = new excel.Workbook()
    const ws = wb.addWorksheet("Sheet 1", { views: [{ showGridLines: false }] })
    let row_no = 1
    ws.columns = [
      { width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
      { width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
      { width: 25, alignment: { vertical: 'middle', horizontal: 'center' } },
      { width: 40, alignment: { vertical: 'middle', horizontal: 'center' } },
      { width: 25, alignment: { vertical: 'middle', horizontal: 'center' } },
      { width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
      { width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
    ]
    ws.addRow([
      'Invoice Date',
      'Invoice No.',
      'Quotation/Contract No.',
      'Customer Name',
      'Amount',
      'Sales',
      'Invoice Status'
    ])
    ws.getRow(row_no).font = { bold: true }
    ws.getCell(`E${row_no}`).alignment = { vertical: 'middle', horizontal: 'right' }
    row_no++;

    let amounts = 0
    for (let i = 0; i <= excelData.length; i++) {
      if (excelData.length !== i) {
        amounts += Number(excelData[i]?.amount.toFixed(2))
      }
      ws.addRow([
        (excelData[i]?.date) ? moment(excelData[i]?.date).format("DD/MM/YYYY") : '',
        excelData[i]?.invoice_no,
        excelData[i]?.quote_contract_no,
        excelData[i]?.customer_id[0].customer_name,
        excelData[i]?.amount ? excelData[i]?.amount.toFixed(2) : amounts.toFixed(2),
        excelData[i]?.customer_id[0].customer_officer[0].displayname,
        excelData[i]?.status
      ])
      ws.getCell(`E${row_no}`).alignment = { vertical: 'middle', horizontal: 'right' }
      row_no++;
    }

    wb.xlsx.writeBuffer(`Sales Invoice - ${moment().format('YYYY-MM-DD')}.xlsx`).then((buffer) => {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `Sales Invoice - ${moment().format('YYYY-MM-DD')}.xlsx`
      )
    })
  }

  //分页参数
  const paginationOptions = {
    custom: true,
    totalSize: filterData.totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    page: queryParams.pageNumber,
    sizePerPage: queryParams.pageSize,
  }

  // 分页查询
  const setQueryParams = useCallback((next) => {
    setQueryParamsBase((prev) => {
      if (isFunction(next)) {
        next = next(prev)
      }
      if (isEqual(prev, next)) {
        return prev
      }
      return next
    })
  }, [])

  return (
    <Card>
      <CardHeader title="Sales Invoice">
        <CardHeaderToolbar />
      </CardHeader>
      <CardBody>
        <Formik
          enableReinitialize={true}  //控制 formik是否应在更改时重置表单 initialValues
          initialValues={initialValues}
          onSubmit={(values) => {
            setQueryParamsBase({
              ...queryParams,
              pageNumber: 1,
              customer_id_arr: values.customerName ? values.customerName.map(i => i.value) : [],
              status_arr: values.status ? values.status.map(i => i.label) : [],
              from: values.startDate,
              to: values.endDate,
            })
          }}
        >
          {({ handleSubmit, setFieldValue, values }) => {
            return (
              <Form className="form form-label-right">
                <div className="form-group row" style={{ marginTop: '-12px' }}>
                  <div className="col-lg-3">
                    <FormLabel>Customer Officer</FormLabel>
                    <SearchSelect
                      name="customerName"
                      placeholder="All"
                      options={customer}
                      onChange={(opt) => {
                        setFieldValue("customerName", (opt) ? opt : []);
                      }}
                      isClearable={true}
                      isMulti
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormLabel>Status</FormLabel>
                    <SearchSelect
                      name="status"
                      options={enumStatus}
                      placeholder="All"
                      onChange={(opt) => {
                        setFieldValue("status", (opt) ? opt : []);
                      }}
                      isClearable={true}  //为选择的组件定义一个 id前缀
                      isMulti             //覆盖内置逻辑以检测选项是否被禁用
                    />
                  </div>
                </div>
                <div className="form-group row" style={{ marginTop: '-12px' }}>
                  <div className="col-lg-3">
                    <FormLabel>From</FormLabel>
                    <Field
                      name="startDate"
                      type="date"
                      component={Input}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormLabel>To</FormLabel>
                    <Field
                      name="endDate"
                      type="date"
                      component={Input}
                    />
                  </div>
                  {/* 查询事件 */}
                  <div className="col-lg-3 mt-8">
                    <button
                      type="button"
                      className="btn btn-primary ml-3"
                      onClick={(e) => { setIsGenerate(false); handleSubmit() }}
                    >
                      Search
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary ml-3"
                      onClick={(e) => { setIsGenerate(true); handleSubmit() }}
                    >
                      Generate
                    </button>
                  </div>
                </div>
              </Form>
            )
          }}
        </Formik>
        <Table
          setQueryParams={setQueryParams}
          columns={headerColumns}
          listLoading={listLoading}
          entities={filterData.entities}
          paginationOptions={paginationOptions}
          hideFilter={true}
        />
      </CardBody>
    </Card>
  )
}
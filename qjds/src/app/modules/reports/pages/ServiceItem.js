import React, {useState, useEffect} from "react";
import { Formik, Form, Field } from "formik";
import { FormLabel } from "react-bootstrap";
import { Card, CardBody, CardHeader, CardHeaderToolbar } from "../../../../_metronic/_partials/controls";
import * as actions from "../../invoices/_redux/invoice/invoiceActions";
import * as customersActions from "../../customers/_redux/customers/customersActions";
import { Input } from "../../../../_metronic/_partials/controls";
import * as serviceActions from "../../sets/_redux/services/servicesActions";
import excel from "exceljs"
import { saveAs } from "file-saver"
import { useDispatch } from "react-redux";
import { invoiceStatuses } from "../../invoices/partials/statuses";
import * as Yup from "yup";
import moment from "moment";
import { shallowEqual, useSelector } from "react-redux";
import SearchSelect from "react-select";
import axios from "axios";
import { API_URL } from "../../../API_URL";
import { LocalConvenienceStoreOutlined } from "@material-ui/icons";

export function ServiceItem() {
  const dispatch = useDispatch();
  const [reportData, serReportData] = useState([]);
  const [isGenereateReport, setIsGenereateReport] = useState(false)
  const [loading, setLoading] = useState(false)
  const [postData, setPostData] = useState({})

    const typeOption = [
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
        }
    ];

    const years = (back = parseInt(moment().format("YYYY")) - 2019) => {
        const year = new Date().getFullYear();
        return Array.from({ length: back }, (v, i) => year - back + i + 1);
    }
    const yearOption = years().map((item) => {
        return {
            label: item, value: item
        }
    })
    
    const monthOption = [
        {
            label: '01',
            value: '01'
        },
        {
            label: '02',
            value: '02'
        },
        {
            label: '03',
            value: '03'
        },
        {
            label: '04',
            value: '04'
        },
        {
            label: '05',
            value: '05'
        },
        {
            label: '06',
            value: '06'
        },
        {
            label: '07',
            value: '07'
        },
        {
            label: '08',
            value: '08'
        },
        {
            label: '09',
            value: '09'
        },
        {
            label: '10',
            value: '10'
        },
        {
            label: '11',
            value: '11'
        },
        {
            label: '12',
            value: '12'
        }
    ]

  const {
    services
  } = useSelector(
    (state) => ({
      services: state.services.entities
    }),
    shallowEqual
  );

  function genereateSalesItem(data) {
    
    const wb = new excel.Workbook()
    const ws = wb.addWorksheet("Sheet 1", { views: [{ showGridLines: false }] })

    let row_no = 1

    ws.columns = [
        { width: 30, alignment: { vertical: 'middle', horizontal: 'center' } }
    ]

    let headerRow = ['Service Name']
    for (let j = 0; j < postData.year.length; j++) {
        for (let k = 0; k < postData.month.length; k++) {
            headerRow.push(`${postData.month[k]}-${postData.year[j]}`)
            headerRow.push('')
        }
        headerRow.push(`${postData.year[j]} Total`)
        headerRow.push(``)
    }
    ws.addRow(headerRow)
    ws.getRow(row_no).font = { bold:true }
    ws.getRow(row_no).alignment = { vertical: 'middle', horizontal: 'center' }
    row_no++;

    let headerRow2 = ['']
    for (let j = 0; j < postData.year.length; j++) {
        for (let k = 0; k < postData.month.length; k++) {
            headerRow2.push(`QTY`)
            headerRow2.push('Amount')
        }
        headerRow2.push(`QTY`)
        headerRow2.push('Amount')
    }
    ws.addRow(headerRow2)
    ws.getRow(row_no).alignment = { vertical: 'middle', horizontal: 'right' }
    row_no++;

    let grandTotalRow = []
    let uniqueArr = []
    for (let i = 0; i < data.length; i++) {
        let serviceArr = data[i].serviceData
        let rorData = [data[i].service_name]
        let last_year = ''
        let total_year_amount = 0
        let total_year_qty = 0
        for (let k = 0; k < serviceArr.length; k++) {
            if (last_year && last_year != serviceArr[k].year) {
                rorData.push(total_year_qty)
                rorData.push(total_year_amount)
                if (uniqueArr.includes(last_year)) {
                    grandTotalRow = grandTotalRow.map((item) => {
                        if (item.period == last_year) {
                            item.totalAmount = item.totalAmount + total_year_amount
                            item.totalQty = item.totalQty + total_year_qty
                        }
                        return item
                    })
                } else {
                    grandTotalRow.push({
                        period: last_year,
                        totalAmount: total_year_amount,
                        totalQty: total_year_qty
                    })   
                    uniqueArr.push(last_year)
                }
            }
            rorData.push(serviceArr[k].qty)
            rorData.push(serviceArr[k].amount)
            if (uniqueArr.includes(serviceArr[k].period)) {
                grandTotalRow = grandTotalRow.map((item) => {
                    if (item.period == serviceArr[k].period) {
                        item.totalAmount = item.totalAmount + serviceArr[k].amount
                        item.totalQty = item.totalQty + serviceArr[k].qty
                    }
                    return item
                })
            } else {
                grandTotalRow.push({
                    period: serviceArr[k].period,
                    totalAmount: serviceArr[k].amount,
                    totalQty: serviceArr[k].qty
                })
                uniqueArr.push(serviceArr[k].period)
            }
            last_year = serviceArr[k].year
            total_year_qty = total_year_qty + serviceArr[k].qty
            total_year_amount = total_year_amount + serviceArr[k].amount
            if (serviceArr.length === k + 1) {
                rorData.push(total_year_qty)
                rorData.push(total_year_amount)
                if (uniqueArr.includes(serviceArr[k].year)) {
                    grandTotalRow = grandTotalRow.map((item) => {
                        if (item.period == serviceArr[k].year) {
                            item.totalAmount = item.totalAmount + total_year_amount
                            item.totalQty = item.totalQty + total_year_qty
                        }
                        return item
                    })
                } else {
                    grandTotalRow.push({
                        period: serviceArr[k].year,
                        totalAmount: total_year_amount,
                        totalQty: total_year_qty
                    })
                    uniqueArr.push(serviceArr[k].year)
                }
            }
        }
        ws.addRow(rorData)
        row_no++;
    }

    let totalRow = ['Total']
    for (let z = 0; z < grandTotalRow.length; z++) {
        totalRow.push(grandTotalRow[z].totalQty)
        totalRow.push(grandTotalRow[z].totalAmount)
    }
    ws.addRow(totalRow)
    ws.getRow(row_no).font = { bold:true }
    ws.getRow(row_no).alignment = { vertical: 'middle', horizontal: 'right' }

    let merge_flag = true
    for (let v = 0; v < ws._rows[0]._cells.length; v++) {
        let row_data = ws._rows[0]._cells[v]
        if (row_data._address != 'A1') {
            if (merge_flag) {
                let next_row_data = ws._rows[0]._cells[v+1]
                if (next_row_data) {
                    ws.mergeCells(`${row_data._address}:${next_row_data._address}`)
                }
                merge_flag = false
            } else {
                merge_flag = true
            }
        }
    }

    wb.xlsx.writeBuffer(`Service Item - ${moment().format('YYYY-MM-DD')}.xlsx`).then((buffer) => {
        setLoading(false)
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `Service Item - ${moment().format('YYYY-MM-DD')}.xlsx`
      )
    })
  }

  function getOnlyValueFromArr(data) {
    let returnData = []
    if (data && data.length > 0) {
        data.filter((item) => {
            returnData.push(item.value)
        })
    }
    return returnData
  }

  function getServiceItem(values) {
    let postData = {...values}
    postData.month = (values.month.length > 0) ? getOnlyValueFromArr(values.month).sort(function(a, b){return a - b}) : getOnlyValueFromArr(monthOption)
    postData.service_item = (values.service_item.length > 0) ? getOnlyValueFromArr(values.service_item) : ''
    postData.year = getOnlyValueFromArr(values.year).sort(function(a, b){return a - b})
    //console.log('postData', postData)
    setLoading(true)
    axios.get(API_URL + `dashboard/service_item_report`, {
        params: postData
    }).then((res) => {
        setPostData(postData)
        serReportData(res.data.docs)
    }).catch(() => {

    })
  }

  useEffect(() => {
    if (isGenereateReport) {
        genereateSalesItem(reportData)
        setIsGenereateReport(false)
    }
  }, [reportData])

  useEffect(() => {
    dispatch(serviceActions.fetchservices({ pageSize: 100000 }));
  }, [])

  const ServiceItemSchema = Yup.object().shape({
    year: Yup.string().required("Year is required")
  });

  return (
    
    <Card>
        <CardHeader title="Service Item">
            <CardHeaderToolbar>
            </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
            <Formik
                enableReinitialize={true}
                validationSchema={ServiceItemSchema}
                initialValues={{
                    year: [{label: new Date().getFullYear(), value: new Date().getFullYear()}],
                    month: [],
                    service_item: [],
                    type: ''
                }}
                onSubmit={(values) => {
                    getServiceItem(values)
                }}
            >
                {({ handleSubmit, errors, values, setFieldValue }) => (
                    <div>
                        <Form className="form form-label-right">
                            <div className="form-group row">
                                <div className="col-lg-3">
                                    <FormLabel>Type</FormLabel>
                                    <SearchSelect
                                        name="type"
                                        options={typeOption}
                                        onChange={(opt) => {
                                            setFieldValue("type", opt?.value);
                                        }}
                                        value={typeOption.filter((item) => item.value === values.type)[0]}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <FormLabel>Year <span className="indicatory">*</span></FormLabel>
                                    <SearchSelect
                                        name="year"
                                        options={yearOption}
                                        placeholder="Select Year"
                                        onChange={(opt) => {
                                            setFieldValue("year", (opt) ? opt : []);
                                        }}
                                        isClearable={true}
                                        isMulti
                                        value={values.year}
                                    />
                                    {errors.year ? (
                                        values.year == 0 ? (
                                        <div className="text-danger">
                                            {errors.year}
                                        </div>
                                        ) : (
                                        ""
                                        )
                                    ) : (
                                        ""
                                    )}
                                </div>
                                <div className="col-lg-3">
                                    <FormLabel>Month</FormLabel>
                                    <SearchSelect
                                        name="month"
                                        options={monthOption}
                                        placeholder="All"
                                        onChange={(opt) => {
                                            setFieldValue("month", (opt) ? opt : []);
                                        }}
                                        isClearable={true}
                                        isMulti
                                    />
                                </div>
                                <div className="col-lg-3"></div>
                                <div className="col-lg-9 mt-3">
                                    <FormLabel>Service Item</FormLabel>
                                    <SearchSelect
                                        name="service_item"
                                        options={
                                            services
                                            ? services.map((x) => {
                                                return {
                                                label: x?.service_name,
                                                value: x?._id,
                                                };
                                            })
                                            : []
                                        }
                                        placeholder="All"
                                        onChange={(opt) => {
                                            setFieldValue("service_item", (opt) ? opt : []);
                                        }}
                                        isClearable={true}
                                        isMulti
                                    />
                                </div>
                                <div className="col-lg-3 mt-3">
                                    { (loading) ? <button
                                        type="submit"
                                        className="btn btn-primary bg-white border-primary text-primary mt-8"
                                        disabled
                                    >
                                        <span className="spinner spinner-lg spinner-warning"></span>{" "}
                                        <span className="ml-10"> Generate</span>
                                    </button> : <button
                                        type="submit"
                                        className="btn btn-primary bg-white border-primary text-primary mt-8"
                                        onClick={(e) => { setIsGenereateReport(true); handleSubmit() } }
                                    >
                                        Generate
                                    </button> }
                                </div>
                            </div>
                        </Form>
                    </div>
                )}
            </Formik>
        </CardBody>
    </Card>
  );
}

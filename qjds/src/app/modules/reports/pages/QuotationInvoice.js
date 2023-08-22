import React, {useState, useEffect} from "react";
import { Formik, Form, Field } from "formik";
import { FormLabel } from "react-bootstrap";
import { Card, CardBody } from "../../../../_metronic/_partials/controls";
import * as actions from "../../invoices/_redux/invoice/invoiceActions";
import * as customersActions from "../../customers/_redux/customers/customersActions";
import { Input } from "../../../../_metronic/_partials/controls";
import JSZip from 'jszip';
import excel from "exceljs";
import { saveAs } from "file-saver";
import { useDispatch } from "react-redux";
import { invoiceStatuses } from "../../invoices/partials/statuses";
import * as Yup from "yup";
import moment from "moment";
import { shallowEqual, useSelector } from "react-redux";
import SearchSelect from "react-select";
import axios from "axios";
import { API_URL } from "../../../API_URL";
import GenereateInvoicePDF from "../../../components/InvoicePDF";
var FileSaver = require('file-saver');

export function QuotationInvoice() {
  const dispatch = useDispatch();
  const [customerOptions, setCustomerOptions] = useState([]);
  const [searchCustomer, serSearchCustomer] = useState("");
  const [isDonwload, setIsDownload] = useState('');
  const [reportData, serReportData] = useState([]);
  const [downloadInvoiceData, setDownloadInvoiceData] = useState('');
  const [loading, setLoading] = useState(false)

  const {
    customers
  } = useSelector(
    (state) => ({
      customers: state.customers.entities
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(
      customersActions.findCustomers({
        filter: {},
        sortOrder: "desc",
        sortField: "createdAt",
        pageNumber: 1,
        pageSize: 100,
      })
    );
  }, [])

  useEffect(() => {
    dispatch(
      customersActions.findCustomers({
        filter: {},
        sortOrder: "desc",
        sortField: "createdAt",
        search: searchCustomer,
        pageNumber: 1,
        pageSize: 100,
      })
    );
  }, [searchCustomer]);

  useEffect(() => {
    if (customers) {
      setCustomerOptions(
        customers.map((customer, index) => ({
          value: customer._id,
          label: customer.customer_name
        }))
      );
    }
  }, [customers]);

  function getServices(itemData) {
    let servicesArr = []
    if (itemData && itemData.length > 0) {
      itemData.filter((item) => {
        if (item?.title) {
          servicesArr.push(item.title)
        }
      })
    }
    return servicesArr.join(', ')
  }

  function genereateInvoice(data) {
    console.log(data);
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
      { width: 25, alignment: { vertical: "middle", horizontal: "center" } },
      { width: 25, alignment: { vertical: "middle", horizontal: "center" } },
      { width: 25, alignment: { vertical: "middle", horizontal: "center" } },
      { width: 25, alignment: { vertical: "middle", horizontal: "center" } },
    ];

    ws.addRow([
      "Invoice Date",
      "Invoice No",
      "Contract/Quotation Number",
      "Customer Name",
      "Amount",
      'Services',
      "Paid",
      "Payment Method",
      "Sales",
      "Part Time",
      "Over Due Date",
    ]);
    ws.getRow(row_no).font = { bold:true }
    ws.getCell(`E${row_no}`).alignment = { vertical: 'middle', horizontal: 'right' }
    row_no++;

    for (let i = 0; i <= data.length; i++) {
      if (data[i]) {
        if (moment(data[i].date).format("DD") !== "01") {
          ws.addRow([
            data[i].date ? moment(data[i].date).format("DD/MM/YYYY") : "",
            data[i].invoice_no,
            data[i].quote_contract_no,
            data[i].customer_id?.customer_name,
            data[i].amount,
            getServices(data[i].services),
            data[i].status == invoiceStatuses.PAID ? "Y" : "N",
            data[i].payment_term_id?.payment_method_name,
            data[i].customer_id?.customer_officer,
            data[i].part_time ? "Y" : "N",
            data[i].date && data[i].payment_term_id?.over_due_day
              ? moment(data[i].date, "YYYY-MM-DD")
                .add("days", data[i].payment_term_id?.over_due_day)
                .format("DD/MM/YYYY")
              : data[i].date
                ? moment(data[i].date).format("DD/MM/YYYY")
                : "",
          ]);
          ws.getCell(`E${row_no}`).alignment = { vertical: 'middle', horizontal: 'right' }
          row_no++;
        }
      }
    }
    wb.xlsx
      .writeBuffer(`Quotation Invoice - ${moment().format("YYYY-MM-DD")}.xlsx`)
      .then((buffer) => {
        saveAs(
          new Blob([buffer], { type: "application/octet-stream" }),
          `Quotation Invoice - ${moment().format("YYYY-MM-DD")}.xlsx`
        );
      });
  }

  function donwloadInvoice(data, loopCount, invoiceData) {
    if (data.length == loopCount) {
      const zip = new JSZip();
      invoiceData.filter((item) => {
        zip.file(`${item.file_name}`, item.content);
      })
      zip.generateAsync({ type: 'blob' }).then(function (content) {
        FileSaver.saveAs(content, 'QotationInvoice.zip');
      });
      setLoading(false)
    } else {
      if (data[loopCount] && moment(data[loopCount].date).format("DD") !== "01") {
        setDownloadInvoiceData(data[loopCount])
        setTimeout(() => {
          let post_data = {
            html: document.getElementById("invoice-pdf-component")
              ? document.getElementById("invoice-pdf-component").innerHTML
              : "",
            url: `${window.location.origin}/pdf/invoice`,
            invoice_no: data[loopCount].invoice_no,
            is_chinese: false
          };
          axios
          .post(API_URL + "/pdf/invoice", post_data, {
            responseType: "blob",
            headers: { Accept: "application/pdf" },
          })
          .then((res) => {
            invoiceData.push({
              file_name: `${data[loopCount].invoice_no}.pdf`,
              content: new Blob([res.data], { type: "application/pdf" })
            })
            donwloadInvoice(data, loopCount+1, invoiceData)
          });
        }, 500)
      } else {
        donwloadInvoice(data, loopCount+1, invoiceData)
      }
    }
  }

  function getInvoices(values) {
    dispatch(actions.fetchReportInvoices('JC', values.from, values.to, values?.customer, isDonwload)).then(
      (res) => {
        serReportData(res.data.docs)
        //genereateInvoice(res.data.docs)
      }
    );
  }

  useEffect(() => {
    if (isDonwload == 'yes') {
      setLoading(true)
      donwloadInvoice(reportData, 0, [])
    } else if (isDonwload == 'no') {
      genereateInvoice(reportData)
    }
    setIsDownload('')
  }, [reportData])

  const QuotationInvoiceSchema = Yup.object().shape({
    from: Yup.string().required("From date is required"),
    to: Yup.string().required("To date is required"),
  });

  return (
    <>
      <Formik
        enableReinitialize={true}
        validationSchema={QuotationInvoiceSchema}
        initialValues={{
          from: "",
          to: "",
        }}
        onSubmit={(values) => {
          getInvoices(values);
        }}
      >
        {({ handleSubmit, errors, values, setFieldValue }) => (
          <div className="d-flex flex-wrap">
            <div className="col-12 col-lg-9">
              <Card>
                <CardBody>
                  <div className="mt-5">
                    <Form className="form form-label-right">
                      <div className="form-group row">
                        <div className="col-lg-6">
                          <FormLabel>From <span className="indicatory">*</span></FormLabel>
                          <Field name="from" type="date" component={Input} />
                        </div>
                        <div className="col-lg-6">
                          <FormLabel>To <span className="indicatory">*</span></FormLabel>
                          <Field name="to" type="date" component={Input} />
                        </div>
                        <div className="col-lg-6 mt-5">
                          <FormLabel>Customer</FormLabel>
                          <SearchSelect
                              name="customer"
                              options={customerOptions}
                              onInputChange={serSearchCustomer}
                              placeholder="Select Customer"
                              onChange={(opt) => {
                                setFieldValue("customer", opt?.value);
                              }}
                              isClearable={true}
                            />
                        </div>
                        <div className="col-lg-6 text-right mt-15">
                          {loading ? (
                            <button
                              type="button"
                              className="btn btn-default border bg-white border-dark text-dark"
                              disabled
                            >
                              <span className="spinner spinner-lg spinner-warning"></span>{" "}
                              <span className="ml-10"> Download</span>
                            </button>
                          ) : (
                            <button
                              type="submit"
                              className="btn btn-primary bg-white border-primary text-primary"
                              onClick={(e) => { setIsDownload('yes'); handleSubmit() } }
                            >
                              Download
                            </button>
                          )}
                          
                          <button
                            type="submit"
                            className="btn btn-primary bg-white border-primary text-primary ml-5"
                            onClick={(e) => { setIsDownload('no'); handleSubmit() } }
                          >
                            Generate
                          </button>
                        </div>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        )}
      </Formik>

      {downloadInvoiceData ? (
        <span style={{ display: "none" }}>
          <GenereateInvoicePDF isChinese={false} data={downloadInvoiceData || null} />
        </span>
      ) : (
        ""
      )}
    </>
  );
}

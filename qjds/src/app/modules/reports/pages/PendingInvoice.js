import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { FormLabel, Spinner } from "react-bootstrap";
import { Card, CardBody } from "../../../../_metronic/_partials/controls";
import * as actions from "../../invoices/_redux/invoice/invoiceActions";
import { fetchRights } from "../../../../redux/userRoleRightsSlice"
import * as customersActions from "../../customers/_redux/customers/customersActions";
import { Input } from "../../../../_metronic/_partials/controls";
import excel from "exceljs"
import { saveAs } from "file-saver"
import { useDispatch } from "react-redux";
import { invoiceStatuses } from "../../invoices/partials/statuses";
import * as Yup from "yup";
import moment from "moment";
import { shallowEqual, useSelector } from "react-redux";
import SearchSelect from "react-select";

export function PendingInvoice() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true)
  const [accessModules, setAccessModules] = React.useState([]);

  const {
    user: { role },
    rights,
    invoices
  } = useSelector(
    (state) => ({
      user: state.auth.user,
      rights: state.roleRights.rights,
      invoices: state.invoice.entities
    }),
    shallowEqual
  );

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

  useEffect(() => {
    dispatch(actions.fetchPendingInvoices())
  }, [])

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

  function generalExcel() {
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
      { width: 25, alignment: { vertical: 'middle', horizontal: 'center' } }
    ]

    ws.addRow([
      'Invoice Date',
      'Invoice No',
      'Contract/Quotation Number',
      'Customer Name',
      'Amount',
      'Services',
      'Payment Method',
      'Sales',
      'Part Time',
      'Created Date'
    ])
    ws.getRow(row_no).font = { bold:true }
    ws.getCell(`E${row_no}`).alignment = { vertical: 'middle', horizontal: 'right' }
    row_no++;

    for (let i = 0; i <= invoices.length; i++) {
      if (invoices[i]) {
        ws.addRow([
          (invoices[i].date) ? moment(invoices[i].date).format("DD/MM/YYYY") : '',
          invoices[i].invoice_no,
          invoices[i].quote_contract_no,
          invoices[i].customer_id?.customer_name,
          invoices[i].amount,
          getServices(invoices[i].services),
          invoices[i].payment_term_id?.payment_method_name,
          invoices[i].customer_id?.customer_officer,
          (invoices[i].part_time) ? 'Y' : 'N',
          (invoices[i].createdAt) ? moment(invoices[i].createdAt).format("DD/MM/YYYY") : ''
        ])
        ws.getCell(`E${row_no}`).alignment = { vertical: 'middle', horizontal: 'right' }
        row_no++;
      }
    }
    wb.xlsx.writeBuffer(`Pending Invoice - ${moment().format('YYYY-MM-DD')}.xlsx`).then((buffer) => {
      setLoading(false)
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `Pending Invoice - ${moment().format('YYYY-MM-DD')}.xlsx`
      )
    })
  }

  useEffect(() => {
    console.log('invoices', invoices)
    if (invoices && invoices.length > 0 && accessModules.includes("PENDING_INVOICE_REPORT")) {
      generalExcel()
    }
  }, [invoices])

  return (
    <>
      <div className="row">
        <div className="col-md-12 text-center">
          {(loading) ? <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner> : ''}
        </div>
      </div>
    </>
  );
}

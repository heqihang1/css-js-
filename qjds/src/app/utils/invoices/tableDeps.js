import React from "react";
import * as columnFormatters from "./column-formatters";
import { sortCaret } from "../../../_metronic/_helpers";
import moment from "moment";
export const generateColumns = (
  history,
  actions = true,
  { paidInvoice = (id) => {}, deleteInvoice = (id) => {}, unpaid = (id) => {} } = {}
) => {
  let columns = [
    {
      dataField: "invoice_no",
      text: "INVOICE NUMBER",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "quote_contract_no",
      text: "Quotation/\nContract No",
      sort: true,
      style: { width: "150px" },
      sortCaret: sortCaret,
    },
    {
      dataField: "customer_id[0].customer_name",
      text: "Customer",
      sort: true,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { width: "350px", wordBreak: "break-all", verticalAlign: "top" };
      },
      classes: 'text-wrap'
    },
    {
      dataField: "amount",
      text: "AMOUNT",
      align: 'right',
      headerAlign: 'right',
      sort: true,
      sortCaret: sortCaret,
      formatter: (cell) => {
        return `$${Number(cell).toFixed(2)}`;
      },
    },
    {
      dataField: "customer_id[0].customer_officer_id",
      text: "",
      sort: false,
      formatter: columnFormatters.AvatarColumnFormatter,
    },
    {
      dataField: "job_start_date",
      text: "Job Date",
      sort: true,
      sortCaret: sortCaret,
      formatter: (cell, row) => {
        return cell ? (
          <span style={{ color: row.color }}>
            {moment(cell).format("DD/MM/YYYY")}
          </span>
        ) : (
          ""
        );
      },
    },
    {
      dataField: "date", // createdAt
      text: "Invoice Date",
      sort: true,
      sortCaret: sortCaret,
      formatter: (cell, row) => {
        return cell ? (
          <span style={{ color: row.color }}>
            {moment(cell).format("DD/MM/YYYY")}
          </span>
        ) : (
          ""
        );
      },
    },
    // {
    //   dataField: "price",
    //   text: "DATE VERIFIED",
    //   sort: true,
    //   sortCaret: sortCaret,
    //   formatter: columnFormatters.PriceColumnFormatter,
    // },
    {
      dataField: "status",
      text: "STATUS",
      sort: true,
      sortCaret: sortCaret,
      formatter: (cell) => {
        return cell === "Approval denied" ? "Reject" : cell;
      },
    },
    // {
    //   dataField: "condition",
    //   text: "PRIVIEW",
    //   sort: true,
    //   sortCaret: sortCaret,
    //   formatter: columnFormatters.PriceColumnFormatter,
    // },
    // {
    //   dataField: "condition",
    //   text: "COPY",
    //   sort: true,
    //   sortCaret: sortCaret,
    //   formatter: columnFormatters.PriceColumnFormatter,
    // },
  ];

  if (actions) {
    columns.push({
      dataField: "action",
      text: "行动",

      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        reuse: (id) => {
          history.push(`/invoices/${id}/re-use`);
        },
        copy: (id) => {
          history.push(`/invoices/${id}/clone`);
        },
        preview: (id) => {
          // history.push(`/invoices/${id}/details`);
          window.open(`/invoices/${id}/details`);
        },
        paidInvoice: (id) => {
          paidInvoice(id);
        },
        deleteInvoice: (id) => {
          deleteInvoice(id);
        },
        unpaid: (id) => {
          unpaid(id);
        },
        edit: (id) => {
          history.push(`/invoices/${id}/edit`);
        },
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "100px",
      },
    });
  }

  return columns;
};

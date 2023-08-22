// 销售报表 columns
import React from "react";
import * as columnFormatters from "./column-formatters"
import { sortCaret } from "../../../_metronic/_helpers"
import moment from 'moment'

export const getHeaderColumns = (
  history,
  actions = true,
  {
    deleteQuote = (id) => { },
    confirmQuote = (id) => { },
    reuseQuote = (id) => { },
  } = {}
) => {
  let columns = [
    {
      dataField: "date",
      text: "Invoice Date",
      sort: true,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { verticalAlign: "top" }
      },
      formatter: (cell, row) => {
        return cell ? (
          <span style={{ color: row.color }}>
            {moment(cell).format("DD/MM/YYYY")}
          </span>
        ) : (
          ""
        )
      },
    },
    {
      dataField: "invoice_no",
      text: "Invoice No.",
      sort: true,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { verticalAlign: "top" }
      },
    },
    {
      dataField: "quote_contract_no",
      text: "Quotation/\nContract No.",
      sort: true,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { verticalAlign: "top" }
      },
    },
    {
      dataField: "customer_id[0].customer_name",
      text: "Customer Name",
      sort: true,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { verticalAlign: "top" }
      },
    },
    {
      dataField: "amount",
      text: "Amount",
      sort: true,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { verticalAlign: "top" }
      },
      formatter: (cell, row) => {
        return cell ? (
          <span>{cell.toFixed(2)}</span>
        ) : (
          ""
        )
      },
    },
    {
      dataField: "customer_id[0].customer_officer[0].profile_pic",
      text: "",
      sort: false,
      formatter: columnFormatters.AvatarColumnFormatter,
      headerStyle: () => {
        return { verticalAlign: "top" }
      },
    },
  ]
  return columns
}
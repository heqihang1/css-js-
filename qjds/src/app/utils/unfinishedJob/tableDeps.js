import * as columnFormatters from "./column-formatters";
import { sortCaret } from "../../../_metronic/_helpers";
export const generateColumns = (
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
      dataField: "customer_name",
      text: "Customer",
      sort: true,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { width: "350px", wordBreak: "break-all", verticalAlign: "top" };
      },
      classes: 'text-wrap'
    },
    {
      dataField: "contract_id",
      text: "Type",
      sort: true,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { verticalAlign: "top" };
      },
      formatter: (cell, row) => {
        return (row.contract_id) ? "Contract" : 'Quotation';
      },
    },
    {
      dataField: "quote_contract_no",
      text: "Quotation/\nContract No",
      sort: true,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { verticalAlign: "top" };
      },
    },
    {
      dataField: "job_no",
      text: "Job Order No.",
      sort: true,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { verticalAlign: "top" };
      },
    },
    {
      dataField: "status",
      text: "Job Status",
      sort: true,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { verticalAlign: "top" };
      },
    }
  ];
  return columns;
};

import * as columnFormatters from "./column-formatters";
import { sortCaret } from "../../../_metronic/_helpers";
export const generateColumns = (
  history,
  actions = true
) => {
  let columns = [
    {
      dataField: "customer_type",
      text: "",
      sort: true,
      sortCaret: sortCaret,
      formatter: columnFormatters.CompanyPersonalFormatter,
    },
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
      dataField: "job_no",
      text: "Job Order Number",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "q_c_number",
      text: "Quotation/\nContract No",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "expected_job_date",
      text: "Expected Job Date",
      sort: true,
      sortCaret: sortCaret,     
      formatter: columnFormatters.DateColumnFormatter,
    },
    {
      dataField: "district_name",
      text: "District",
      sort: true,
      sortCaret: sortCaret
    },
    {
      dataField: "worker",
      text: "Worker",
      sort: true,
      sortCaret: sortCaret,
    }
  ];
  return columns;
};

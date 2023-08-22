import * as columnFormatters from "./column-formatters";
import { sortCaret } from "../../../_metronic/_helpers";
export const generateColumns = (
  history,
  actions = true,
  {
    deleteQuote = (id) => {},
    confirmQuote = (id) => {},
    reuseQuote = (id) => {},
  } = {}
) => {
  let columns = [
    {
      dataField: "service_name",
      text: "Service",
      sort: true,
      sortCaret: sortCaret,
      formatter: columnFormatters.ServiceColumnFormatter,
      headerStyle: () => {
        return { width: "350px", wordBreak: "break-all", verticalAlign: "top" };
      },
      classes: 'text-wrap'
    },
    {
      dataField: "q_c_number",
      text: "Quotation/\nContract No",
      sort: true,
      sortCaret: sortCaret,
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
      dataField: "status",
      text: "Status",
      sort: true,
      sortCaret: sortCaret
    },
    {
      dataField: "total",
      text: "Service Amount",
      sort: true,
      align: 'right',
      headerAlign: 'right',
      sortCaret: sortCaret,
      formatter: columnFormatters.PriceColumnFormatter,
    }
  ];
  return columns;
};

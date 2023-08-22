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
      dataField: "customer_id.customer_name",
      text: "Customer",
      sort: true,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { width: "350px", wordBreak: "break-all", verticalAlign: "top" };
      },
      classes: 'text-wrap'
    },
    {
      dataField: "contract_no",
      text: "Quotation/\nContract No",
      sort: true,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { verticalAlign: "top" };
      },
    },
    {
      dataField: "contract_end_date",
      text: "End Date",
      sort: true,
      sortCaret: sortCaret,
      formatter: columnFormatters.DateColumnFormatter,
      headerStyle: () => {
        return { verticalAlign: "top" };
      },
    },
    {
      dataField: "customer_id.customer_officer_id.displayname",
      text: "Sales",
      sort: true,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { width: "280px", wordBreak: "break-all", verticalAlign: "top" };
      },
    },
    {
      dataField: "status",
      text: "status",
      sort: true,
      sortCaret: sortCaret,     
      headerStyle: () => {
        return { verticalAlign: "top" };
      },
    },
        
  ];
  return columns;
};

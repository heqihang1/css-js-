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
  const columns = [
    {
      dataField: "invoice_no",
      text: "Invoice Number",
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
      dataField: "customer_contact_name",
      text: "Contact Person",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "customer_mobile_number",
      text: "Cell phone",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "overdue_date",
      text: "Overdue Date",
      sort: true,
      sortCaret: sortCaret,
      formatter: columnFormatters.DateColumnFormatter
    },
    {
      dataField: "amount",
      text: "Overdue Amount",
      sort: true,
      align: 'right',
      headerAlign: 'right',
      sortCaret: sortCaret,
      formatter: columnFormatters.PriceColumnFormatter
    },
  ];
  return columns;
};

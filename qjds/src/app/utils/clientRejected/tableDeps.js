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
      dataField: "customer_id.customer_officer[0].profile_pic",
      text: "",
      sort: true,
      sortCaret: sortCaret,
      formatter: columnFormatters.AvatarColumnFormatter,
      headerStyle: () => {
        return { verticalAlign: "top" };
      },
    },
    {
      dataField: "q_c_number",
      text: "Quotation/\nContract No",
      sort: true,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { verticalAlign: "top" };
      },
    },
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
      dataField: "contact_person.contact_name",
      text: "Contact Person",
      sort: true,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { verticalAlign: "top" };
      },
    },
    {
      dataField: "contact_person.office_number",
      text: "Contact No.",
      sort: true,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { verticalAlign: "top" };
      },
    },
    {
      dataField: "client_reject_date",
      text: "Rejected Date",
      sort: true,
      sortCaret: sortCaret,
      formatter: columnFormatters.DateColumnFormatter,
      headerStyle: () => {
        return { verticalAlign: "top" };
      },
    },
    {
      dataField: "total",
      text: "Amount",
      align: 'right',
      headerAlign: 'right',
      sort: true,
      sortCaret: sortCaret,
      formatter: columnFormatters.PriceColumnFormatter,
      headerStyle: () => {
        return { verticalAlign: "top" };
      },
    }
  ];
  return columns;
};

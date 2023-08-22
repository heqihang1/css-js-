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
      dataField: "customer_officer_data.profile_pic",
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
      dataField: "client_name",
      text: "Client's name",
      sort: true,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { width: "350px", wordBreak: "break-all", verticalAlign: "top" };
      },
      classes: 'text-wrap'

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
    {
      dataField: "total",
      text: "Amount",
      sort: true,
      sortCaret: sortCaret,
      align: 'right',
      headerAlign: 'right',
      formatter: columnFormatters.PriceColumnFormatter,
      headerStyle: () => {
        return { verticalAlign: "top" };
      },
    }
  ];
  return columns;
};

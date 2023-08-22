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
      dataField: "recommend_by",
      text: "Referrals By",
      sort: true,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { verticalAlign: "top" };
      },
    },
    {
      dataField: "createdAt",
      text: "Created Date",
      sort: true,
      sortCaret: sortCaret,
      formatter: columnFormatters.DateColumnFormatter
    }
  ];
  return columns;
};

import * as columnFormatters from "./column-formatters";
import { sortCaret } from "../../../../_metronic/_helpers";
export const generateColumns = (history, actions = true) => {
  let columns = [
    {
      dataField: "quotation_no",
      text: "Quotation Number",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "customer_id.customer_name",
      text: "Client's name",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "customer_office_worker",
      text: "Customer Officer",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "amount",
      text: "Amount",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "remark_id.remark_name",
      text: "Remark",
    },
  ];

  if (actions) {
    columns.push({
      dataField: "action",
      text: "行动",
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        preview: (id) => {
          // history.push(`/quotes/${id}/details`);
          window.open(`/quotes/${id}/details`)
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

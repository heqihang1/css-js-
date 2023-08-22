import * as columnFormatters from "./column-formatters";
import { sortCaret } from "../../../../_metronic/_helpers";
export const generateColumns = (history, actions = true) => {
  let columns = [
    {
      dataField: "payment_method_name",
      text: "Payment Method Name",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "over_due_day",
      text: "Payment Due Day",
      sort: true,
      sortCaret: sortCaret,
    },
  ];

  if (actions) {
    columns.push({
      dataField: "action",
      text: "行动",
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        remove: (id) => {
          history.push(`/sets/payment-item/${id}/delete`);
        },
        edit: (id) => {
          history.push(`/sets/payment-item/${id}/edit`);
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

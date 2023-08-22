import * as columnFormatters from "./column-formatters";
import { sortCaret } from "../../../../_metronic/_helpers";
export const generateColumns = (history, actions = true) => {
  let columns = [
    {
      dataField: "service_name",
      text: "Service name",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "service_price",
      text: "Price per square foot",
      sort: true,
      align: 'right',
      headerAlign: 'right',
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
          history.push(`/sets/service-item/${id}/delete`);
        },
        edit: (id) => {
          history.push(`/sets/service-item/${id}/edit`);
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

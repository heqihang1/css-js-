import * as columnFormatters from "./column-formatters";
import { sortCaret } from "../../../../_metronic/_helpers";
export const generateColumns = (history, actions = true) => {
  let columns = [
    {
      dataField: "rolename",
      text: "Role",
      sort: true,
      sortCaret: sortCaret,
    },
    // {
    //   dataField: "rights",
    //   text: "can access",
    //   sort: true,
    //   sortCaret: sortCaret,
    //   formatter: columnFormatters.BadgesColumnFormatter,
    // },
    {
      dataField: "createdAt",
      text: "Registered on",
      sort: true,
      sortCaret: sortCaret,
      formatter: columnFormatters.DateColumnFormatter,
    },
  ];

  if (actions) {
    columns.push({
      dataField: "action",
      text: "行动",
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        openEditProductPage: (id) => {
          history.push(`/admin/roles/${id}/edit`);
        },
        openDeleteProductDialog: (id) => {
          history.push(`/admin/roles/${id}/delete`);
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

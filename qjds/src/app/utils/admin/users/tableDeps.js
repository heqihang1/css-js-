import * as columnFormatters from "./column-formatters";
import { sortCaret } from "../../../../_metronic/_helpers";
export const generateColumns = (history, actions = true) => {
  let columns = [
    {
      dataField: "color",
      text:'',
      sortCaret: sortCaret,
      formatter: columnFormatters.ColorColumnFormatter,
    },
    // {
    //   dataField: "username",
    //   text: "Username",
    //   sort: true,
    //   sortCaret: sortCaret,
    // },
    {
      dataField: "",
      text: "",
      sort: true,
      formatter: columnFormatters.AvatarColumnFormatter,
    },
    {
      dataField: "displayname",
      text: "Name",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "email",
      text: "Email",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "role",
      text: "Role",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "department",
      text: "Department",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "status",
      text: "status",
      sort: true,
      sortCaret: sortCaret,
      formatter: columnFormatters.StatusColumnFormatter,
    },
    {
      dataField: "hotline",
      text: "hotline",
      sort: true,
      sortCaret: sortCaret,
    },
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
          history.push(`/admin/users/${id}/edit`);
        },
        openDeleteProductDialog: (id) => {
          history.push(`/admin/users/${id}/delete`);
        },
        openActivateUserDialog: (id) => {
          history.push(`/admin/users/${id}/activate`);
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

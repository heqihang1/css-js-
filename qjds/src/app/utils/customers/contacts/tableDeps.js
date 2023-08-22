import * as columnFormatters from "./column-formatters";
import { sortCaret } from "../../../../_metronic/_helpers";
export const generateColumns = (history, actions = true, opneModal) => {
  let columns = [
    {
      dataField: "contact_name",
      text: "Contact name",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "office_number",
      text: "OFFICE/HOME PHONE (Ext.)",
      sort: true,
      sortCaret: sortCaret,
      formatter: (cell, row) => {
        return `${row.office_number} ${row?.ext ? `(${row.ext})` : ""}`;
      },
    },
    {
      dataField: "mobile_number",
      text: "CELL PHONE",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "email",
      text: "email",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "location_id.location_name",
      text: "location",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "contact_position",
      text: "contact position",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "fax_number",
      text: "fax number",
      sort: true,
      sortCaret: sortCaret,
    },
  ];

  if (actions) {
    columns.push({
      dataField: "action",
      text: "行动",
      formatter: columnFormatters.ActionEditColumnFormatter,
      formatExtraData: {
        openDeleteProductDialog: (doc, doc2) => {
          console.log("doc", doc, doc2);
          opneModal(doc, "delete");
        },
        openEditProductPage: (doc, doc2) => {
          console.log("doc", doc, doc2);
          opneModal(doc, "edit");
        },
      },
      classes: "text-right pr-0 mb-10",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "100px",
      },
    });
  }

  return columns;
};

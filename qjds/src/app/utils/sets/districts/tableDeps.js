import * as columnFormatters from "./column-formatters";
import { sortCaret } from "../../../../_metronic/_helpers";
export const generateColumns = (history, actions = true) => {
  let columns = [
    {
      dataField: "district_eng_name",
      text: "District (Eng)",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "district_chi_name",
      text: "District (Chi)",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "status",
      text: "Status",
      sort: true,
      sortCaret: sortCaret,
      formatter: (field) => {
        return field === true ? "ACTIVE" : "INACTIVE";
      },
    },
  ];

  if (actions) {
    columns.push({
      dataField: "action",
      text: "行动",
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        remove: (id, district) => {
          history.push(`/sets/districts/${id}/delete?district=${district}`);
        },
        approve: (id, district) => {
          history.push(`/sets/districts/${id}/approve?district=${district}`);
        },
        edit: (id) => {
          history.push(`/sets/districts/${id}/edit`);
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

import React from "react";
import * as columnFormatters from "./column-formatters";
import { sortCaret } from "../../../_metronic/_helpers";
export const generateColumns = (
  history,
  actions = true,
  {
    deleteSalesRemark = (id) => { }
  } = {}
) => {
  let columns = [
    {
      dataField: "created_by.displayname",
      text: "Customer Officer",
      sort: true,
      sortCaret: sortCaret,
      formatter: (cellVal, row) => {
        return (row.is_deleted) ? <span className="text-muted">{row?.created_by?.displayname}</span> : (row?.color) ? <span style={{color: row.color}}>{row?.created_by?.displayname}</span> : row?.created_by?.displayname
      },
    },
    {
      dataField: "remark",
      text: "Remark",
      sort: true,
      // headerStyle: { maxWidth: 250 },
      // style: { whiteSpace: "initial" },
      sortCaret: sortCaret,
      formatter: (cellVal, row) => {
        return (row.is_deleted) ? <s className="text-muted">{row?.remark}</s> : (row?.color) ? <span style={{color: row.color}}>{row?.remark}</span> : row?.remark
      },
    },
    {
      dataField: "createdAt",
      text: "Date",
      sort: true,
      sortCaret: sortCaret,
      formatter: columnFormatters.DateColumnFormatter
    }
  ];

  if (actions) {
    columns.push({
      dataField: "action",
      text: "Action",
      formatter: columnFormatters.ActionsColumnFormatter,
      headerStyle: () => {
        return { verticalAlign: "top" };
      },
      formatExtraData: {
        deleteSalesRemark: (id) => {
          deleteSalesRemark(id);
        }
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

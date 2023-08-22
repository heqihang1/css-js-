import * as columnFormatters from "./column-formatters";
import { sortCaret } from "../../../../_metronic/_helpers";
export const generateColumns = (history, actions = true) => {
  let columns = [
    {
      dataField: "carPlateNumber",
      text: "Car Plate Number",
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
        remove: (id, carPlateNumber) => {
          history.push(
            `/sets/teams/${id}/delete?carPlateNumber=${carPlateNumber}`
          );
        },
        approve: (id, carPlateNumber) => {
          history.push(
            `/sets/teams/${id}/approve?carPlateNumber=${carPlateNumber}`
          );
        },
        edit: (id) => {
          history.push(`/sets/teams/${id}/edit`);
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

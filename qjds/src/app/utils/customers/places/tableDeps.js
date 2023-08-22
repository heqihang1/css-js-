import * as columnFormatters from "./column-formatters";
import { sortCaret } from "../../../../_metronic/_helpers";
export const generateColumns = (history, actions = true, opneModal) => {
  let columns = [
    {
      dataField: "location_name",
      text: "location name",
      sort: true,
      sortCaret: sortCaret,
    },
    // {
    //   dataField: "district.district_eng_name",
    //   text: "District",
    //   sort: true,
    //   sortCaret: sortCaret,
    // },
    {
      dataField: "district.district_eng_name",
      text: "District",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "location_address",
      text: "Location address",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "feet",
      text: "Feet",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "location_remark",
      text: "Location remark",
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
        openDeleteProductDialog: (doc) => {
          console.log(doc, "doc");
          opneModal(doc, "delete");
        },
        openEditProductPage: (doc) => {
          console.log(doc, "doc");
          opneModal(doc, "edit");
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

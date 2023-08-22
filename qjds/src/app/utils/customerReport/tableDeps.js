import * as columnFormatters from "./column-formatters";
import { sortCaret } from "../../../_metronic/_helpers";
export const generateColumns = (
  history,
  actions = true,
  {
    deleteQuote = (id) => { },
    confirmQuote = (id) => { },
    reuseQuote = (id) => { },
  } = {}
) => {
  let columns = [
    {
      dataField: "customer_type",
      text: "",
      sort: true,
      sortCaret: sortCaret,
      formatter: columnFormatters.CompanyPersonalFormatter,
    },
    {
      dataField: "customer_name",
      text: "Customer Name",
      sort: true,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { width: "350px", wordBreak: "break-all", verticalAlign: "top" };
      },
      classes: 'text-wrap'
    },
    {
      dataField: "district[0].district.district_eng_name",
      text: "District",
      sort: false,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { verticalAlign: "top" };
      },
    },
    {
      dataField: "contact_person_details.contact_name",
      text: "Contact Person",
      sort: true,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { verticalAlign: "top" };
      },
    },
    {
      dataField: "contact_person_details.office_number",
      text: "Contact No.",
      sort: true,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { verticalAlign: "top" };
      },
    },
    {
      dataField: "createdAt",
      text: "Created Date",
      sort: true,
      sortCaret: sortCaret,
      formatter: columnFormatters.DateColumnFormatter,
      headerStyle: () => {
        return { verticalAlign: "top" };
      },
    }
  ];
  return columns;
};

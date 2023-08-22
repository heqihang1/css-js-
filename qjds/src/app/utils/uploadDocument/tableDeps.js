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
      dataField: "type",
      text: "Type",
      sort: true,
      sortCaret: sortCaret,
      // formatter: columnFormatters.AvatarColumnFormatter,
      headerStyle: () => {
        return { verticalAlign: "top" };
      },
    },
    {
      dataField: "contract_quotation_no",
      text: "Quotation/\nContract/\nJob No",
      sort: true,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { verticalAlign: "top" };
      },
    },
    {
      dataField: "client_name",
      text: "Customer",
      sort: true,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { width: "350px", wordBreak: "break-all", verticalAlign: "top" };
      },
      classes: 'text-wrap'
    },
    {
      dataField: "contact_person.contact_name",
      text: "Contact Person",
      sort: true,
      formatter: (cell, row) => {
        return cell ? cell : row?.contact_person
      },
      sortCaret: sortCaret,
      headerStyle: () => {
        return { verticalAlign: "top" };
      },
    },
    {
      dataField: "contact_person.office_number",
      text: "Contact No.",
      sort: true,
      formatter: (cell, row) => {
        return cell ? cell : row?.customer_contact_no
      },
      sortCaret: sortCaret,
      headerStyle: () => {
        return { verticalAlign: "top" };
      },
    },
  ];
  return columns;
};

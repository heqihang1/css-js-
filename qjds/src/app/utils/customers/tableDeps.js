import * as columnFormatters from "./column-formatters";
import { sortCaret } from "../../../_metronic/_helpers";
export const generateColumns = (history, actions = true) => {
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
      text: "Client name",
      sort: true,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { width: "350px", wordBreak: "break-all", verticalAlign: "top" };
      },
      classes: 'text-wrap'
    },
    {
      dataField: "contact_person[0].contact_name",
      text: "Contact Person",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "office_number",
      text: "Office Phone",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "mobile_number",
      text: "Cell phone",
      sort: true,
      sortCaret: sortCaret,
    },
    // {
    //   dataField: "customer_officer",
    //   text: "Commissioner",
    //   sort: true,
    //   sortCaret: sortCaret,
    // },
    {
      dataField: "avatar",
      text: "",
      sort: true,
      sortCaret: sortCaret,
      formatter: columnFormatters.AvatarColumnFormatter,
    },
  ];

  if (actions) {
    columns.push({
      dataField: "action",
      text: "行动",
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        openEditProductPage: (id) => {
          history.push(`/customers/${id}/edit`);
        },
        openDeleteProductDialog: (id) => {
          history.push(`/customers/${id}/delete`);
        },
        openDetailsPage: (id) => {
          history.push(`/customers/${id}/details`);
        },
        openCreateContract: (id) => {
          history.push(`/contracts/new?id=${id}`);
        },
        openCreateQuote: (id) => {
          history.push(`/quotes/new?id=${id}`);
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

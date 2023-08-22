import * as columnFormatters from "./column-formatters";
import { sortCaret } from "../../../_metronic/_helpers";
export const generateColumns = (
  history,
  actions = true,
  {
    deleteQuote = (id) => {},
    confirmQuote = (id) => {},
    reuseQuote = (id) => {},
    uploadDocument = (id) => {},
    rejectQuote = (id) => {},
    approveS=(id)=>{},
    rejectS=(id)=>{}
  } = {}
) => {
  let columns = [
    {
      dataField: "quotation_no",
      text: "Quotation Number",
      sort: true,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { verticalAlign: "top" };
      },
    },
    {
      dataField: "customer_id.customer_name",
      text: "Client's name",
      sort: true,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { width: "350px", wordBreak: "break-all", verticalAlign: "top" };
      },
      classes: 'text-wrap'
    }
  ];

  if (!window.location.pathname.includes("/job")) {
    columns.push({
      dataField: "amount",
      text: "Amount",
      sort: true,
      align: 'right',
      headerAlign: 'right',
      sortCaret: sortCaret,
      formatter: columnFormatters.PriceColumnFormatter,
      headerStyle: () => {
        return { verticalAlign: "top" };
      },
    })
  }

  columns.push({
    dataField: "createdAt",
    text: "Date Created",
    sort: true,
    sortCaret: sortCaret,
    formatter: columnFormatters.DateColumnFormatter,
    headerStyle: () => {
      return { verticalAlign: "top" };
    },
  })
  columns.push({
    dataField: "status",
    text: "STATE",
    sort: true,
    sortCaret: sortCaret,
    formatter: (cellVal, row) => {
      return row?.status === "Approval denied" ? "Reject" : row?.status;
    },
    headerStyle: () => {
      return { verticalAlign: "top" };
    },
  })
  columns.push({
    dataField: "customer_id.customer_officer_id.profile_pic",
    text: "",
    sort: true,
    formatter: columnFormatters.AvatarColumnFormatter,
    headerStyle: () => {
      return { verticalAlign: "top" };
    },
  })

  if (actions) {
    columns.push({
      dataField: "action",
      text: "行动",
      formatter: columnFormatters.ActionsColumnFormatter,
      headerStyle: () => {
        return { verticalAlign: "top" };
      },
      formatExtraData: {
        reuse: (id) => {
          // history.push(`/quotes/${id}/re-use`);
          reuseQuote(id);
        },
        copy: (id) => {
          history.push(`/quotes/${id}/clone`);
        },
        preview: (id) => {
          // history.push(`/quotes/${id}/details`);
          if (window.location.pathname.includes("/job")) {
            window.open(`/quotes/${id}/details/job`);
          } else {
            window.open(`/quotes/${id}/details`);
          }
        },
        deleteQuote: (id) => {
          deleteQuote(id);
        },
        edit: (id) => {
          history.push(`/quotes/${id}/edit`);
        },
        confirm: (id) => {
          confirmQuote(id);
        },
        reject: (id) => {
          rejectQuote(id);
        },
        uploadDocument: (id) => {
          uploadDocument(id);
        },
        approveS:(id)=>{
          approveS(id)
        },
        rejectS:(id)=>{
          rejectS(id)
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

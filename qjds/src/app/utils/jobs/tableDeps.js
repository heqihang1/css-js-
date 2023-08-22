import * as columnFormatters from "./column-formatters";
import { sortCaret } from "../../../_metronic/_helpers";
export const generateColumns = (
  history,
  actions = true,
  { rescheduleJobOrder, cancelJobOrder, uploadDocument }
) => {
  let columns = [
    {
      dataField: "job_no",
      text: "Job Order No",
      sort: true,
      sortCaret: sortCaret,
      formatter: (field, row) => {
        return row?.isAdditional === true ? `*${field}` : field;
      },
    },
    {
      dataField: "quote_contract_no",
      text: "Quotation/\nContract No",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "customer_id[0].customer_name",
      text: "Customer Name",
      sort: true,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { width: "350px", wordBreak: "break-all", verticalAlign: "top" };
      },
      classes: 'text-wrap'
    },
    {
      dataField: "worker",
      text: "Worker",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "expected_job_date",
      text: "Expected Job Date",
      sort: true,
      sortCaret: sortCaret,
      formatter: columnFormatters.DateColumnFormatter,
    },
  ];

  if (
    window.location.pathname.includes("/pending") ||
    window.location.pathname.includes("/rejected")
  ) {
    columns.push({
      dataField: "",
      text: "Type",
      sort: true,
      sortCaret: sortCaret,
      formatter: columnFormatters.TypeColumnFormatter,
    });
    columns.push({
      dataField: "status",
      text: "Status",
      sort: true,
      sortCaret: sortCaret,
    });
  } else if (window.location.pathname.includes("/arraged-job")) {
    columns.push({
      dataField: "team[0].carPlateNumber",
      text: "Team",
      sort: true,
      sortCaret: sortCaret,
    });
    columns.push({
      dataField: "status",
      text: "Status",
      sort: true,
      sortCaret: sortCaret,
    });
  } else {
    columns.push({
      dataField: "status",
      text: "Status",
      sort: true,
      sortCaret: sortCaret,
    });
  }

  if (actions) {
    columns.push({
      dataField: "action",
      text: "行动",
      formatter: columnFormatters.ActionsColumnFormatter(),
      formatExtraData: {
        reuse: (id) => {
          history.push(`/contracts/${id}/re-use`);
        },
        copy: (id) => {
          history.push(`/contracts/${id}/clone`);
        },
        preview: (id) => {
          window.open(`/jobs/${id}/details`);
        },
        rescheduleJobOrder: (id) => {
          rescheduleJobOrder(id);
        },
        cancelJobOrder: (id) => {
          cancelJobOrder(id);
        },
        uploadDocument: (id, flag) => {
          uploadDocument(id, flag);
        },
        edit: (id) => {
          history.push(`/jobs/${id}/edit`);
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

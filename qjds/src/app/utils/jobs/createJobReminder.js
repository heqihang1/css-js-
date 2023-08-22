import * as columnFormatters from "./column-formatters";
import { sortCaret } from "../../../_metronic/_helpers";
export const generateColumns = (
  history,
  actions = true,
  { rescheduleJobOrder, cancelJobOrder, uploadDocument }
) => {
  let columns = [
    {
      dataField: "contract_no",
      text: "Contract No.",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "client_name",
      text: "Client Name",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "createdAt",
      text: "Date Created",
      sort: true,
      sortCaret: sortCaret,
      formatter: columnFormatters.DateColumnFormatter,
    },
    {
      dataField: "next_remind_month",
      text: "Next Reminder Month",
      sort: true,
      sortCaret: sortCaret,
    },
  ];

  if (actions) {
    columns.push({
      dataField: "action",
      text: "行动",
      formatter: columnFormatters.CreateJobReminderActionFormatter(),
      formatExtraData: {
        preview: (id) => {
          window.open(`/contracts/${id}/details/job`);
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

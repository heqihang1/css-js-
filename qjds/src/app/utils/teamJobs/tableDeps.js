import React from "react";
import * as columnFormatters from "./column-formatters";
import { sortCaret } from "../../../_metronic/_helpers";
export const generateColumns = () => {
  let columns = [
    {
      dataField: "job_no",
      text: "Job Order No",
      sort: true,
      sortCaret: sortCaret,
      formatter: (field, row) => {
        return (
          <div
            onClick={() => {
              window.open(`/jobs/${row?._id}/details`);
            }}
          >
            {field}
          </div>
        );
      },
    },
    {
      dataField: "quote_contract_no",
      text: "Quotation/Contract No",
      sort: true,
      sortCaret: sortCaret,
      formatter: (field, row) => {
        return (
          <div
            onClick={() => {
              window.open(`/jobs/${row?._id}/details`);
            }}
          >
            {field}
          </div>
        );
      },
    },
    {
      dataField: "working_location.district.district_eng_name",
      text: "District",
      sort: true,
      sortCaret: sortCaret,
      formatter: (field, row) => {
        return (
          <div
            onClick={() => {
              window.open(`/jobs/${row?._id}/details`);
            }}
          >
            {field}
          </div>
        );
      },
    },
    {
      dataField: "worker",
      text: "Worker",
      sort: true,
      sortCaret: sortCaret,
      formatter: (field, row) => {
        return (
          <div
            onClick={() => {
              window.open(`/jobs/${row?._id}/details`);
            }}
          >
            {field}
          </div>
        );
      },
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

  return columns;
};

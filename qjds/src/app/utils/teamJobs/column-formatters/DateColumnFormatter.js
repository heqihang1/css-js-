import React from "react";
import moment from "moment";
export const DateColumnFormatter = (time, row) => {
  return (
    <span
      style={{ color: row.color }}
      onClick={() => {
        window.open(`/jobs/${row?._id}/details`);
      }}
    >
      {time ? moment(time).format("DD/MM/YYYY HH:mm") : ""}
    </span>
  );
};

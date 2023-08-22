import React from "react";
import moment from "moment";

export const DateColumnFormatter = (time, row) => {
  return (
    <span style={{ color: row.color }}>
      {(time) ? moment(time).format("DD/MM/YYYY") : ''}
    </span>
  );
};

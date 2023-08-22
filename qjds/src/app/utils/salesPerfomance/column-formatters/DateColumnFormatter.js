import React from "react";
import moment from "moment";
export const DateColumnFormatter = (time, row) => {
  return (
    <span style={{ color: row.color }}>
        {moment(time).format('DD/MM/YYYY HH:MM')}
    </span>
  );
};

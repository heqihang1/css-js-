import React from "react";
import moment from "moment";
export const DateColumnFormatter = (time, row) => {
  return (
    <span className={(row.is_deleted) ? 'text-muted' : ''} style={{color: (!row.is_deleted && row.color) ? row.color : ''}}>
      {time ? moment(time).format("DD/MM/YYYY HH:mm") : ""}
    </span>
  );
};

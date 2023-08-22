import React from "react";
export const TypeColumnFormatter = (type, row) => {
  function getType(item) {
    if (item.re_schedule_by) {
      return 'Re-schedule'
    } else if (item.cancel_by) {
      return 'Cancel'
    } else {
      return 'Official'
    }
  }
  return (
    <span style={{ color: row.color }}>
      {getType(row)}
    </span>
  );
};

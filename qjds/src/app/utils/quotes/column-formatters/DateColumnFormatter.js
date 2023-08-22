import React from "react";

export const DateColumnFormatter = (time, row) => {
  return (
    <span style={{ color: row.color }}>
      {Intl.DateTimeFormat("en-GB", {
        dateStyle: "short",
        timeStyle: "short",
      })
        .format(new Date(time))}
    </span>
  );
};

import React from "react";

export const StatusColumnFormatter = (cellContent, { status }) => (
  <div
    className={`rounded-circle`}
    style={{
      height: "9px",
      width: "9px",
      backgroundColor: status === true ? "rgb(0,170,0)" : "red",
    }}
  ></div>
);

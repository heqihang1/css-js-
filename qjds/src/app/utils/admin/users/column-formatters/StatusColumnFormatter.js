import React from "react";
import { userStatuses } from "../../../../modules/Admin/partials/userStatuses";

export const StatusColumnFormatter = (cellContent, { status }) => (
  <div className="d-flex align-items-center">
    <div
      className={`rounded-circle`}
      style={{
        height: "5px",
        width: "5px",
        backgroundColor:
          status === userStatuses.ACTIVE
            ? "rgb(0,170,0)"
            : status === userStatuses.DELETED
            ? "red"
            : "orange",
      }}
    ></div>
    <div
      className="ml-2 font-weight-bold"
      style={{
        color:
          status === userStatuses.ACTIVE
            ? "rgb(0,170,0)"
            : status === userStatuses.DELETED
            ? "red"
            : "orange",
      }}
    >
      {status}
    </div>
  </div>
);

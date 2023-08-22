import React from "react";

export default function Card({ title, children }) {
  return (
    <div className="card card-custom card-stretch w-100">
      <div className="card-header" style={{ minHeight: "50px" }}>
        <div className="card-title h-100">
          <h6>{title}</h6>
        </div>
      </div>
      <div className="card-body w-100 p-5">{children}</div>
    </div>
  );
}

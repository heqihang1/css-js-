import React from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";

export const CompanyPersonalFormatter = (cellContent, row) => (
  <div className="d-flex align-items-center">
      <span className="svg-icon svg-icon-md svg-icon-primary">
        {(row?.customer_type.toLowerCase() == 'personal') ? <SVG src={toAbsoluteUrl("/media/svg/icons/General/User.svg")} /> : ''}
        {(row?.customer_type.toLowerCase() == 'company') ? <SVG src={toAbsoluteUrl("/media/svg/icons/Home/Building.svg")} /> : ''}
      </span>
  </div>
);

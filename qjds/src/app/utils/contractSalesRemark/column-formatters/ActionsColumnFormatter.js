/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import { quoteStatuses } from "../../../modules/quotes/partials/statuses";
import { checkPermission } from "../../utils";

export const ActionsColumnFormatter = (
  cellContent,
  row,
  rowIndex,
  { deleteSalesRemark } = {}
) => (
  <div className="d-sm-flex flex-sm-row justify-content-end">
    { (row.is_deleted) ? <span className="text-muted">Deleted</span> : <OverlayTrigger
      overlay={<Tooltip id="products-delete-tooltip">Delete</Tooltip>}
    >
      <a
        className="btn btn-icon btn-light btn-hover-danger btn-sm"
        onClick={() => deleteSalesRemark(row._id)}
      >
        <span className="svg-icon svg-icon-md svg-icon-danger">
          <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
        </span>
      </a>
    </OverlayTrigger> }

  </div>
);

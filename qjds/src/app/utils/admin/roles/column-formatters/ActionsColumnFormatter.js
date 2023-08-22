/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import { checkPermission } from "../../../utils";

export const ActionsColumnFormatter = (
  cellContent,
  row,
  rowIndex,
  { openEditProductPage, openDeleteProductDialog }
) => (
  <div className="d-sm-flex flex-sm-row justify-content-end">
    {checkPermission('ROLE', 'can_edit') && (
    <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">Edit role</Tooltip>}
    >
      <a
        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
        onClick={() => openEditProductPage(row._id)}
      >
        <span className="svg-icon svg-icon-md svg-icon-primary">
          <SVG
            src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
          />
        </span>
      </a>
    </OverlayTrigger>
    )}

    {/* <OverlayTrigger
      overlay={<Tooltip id="products-delete-tooltip">Delete user</Tooltip>}
    >
      <a
        className="btn btn-icon btn-light btn-hover-danger btn-sm"
        onClick={() => openDeleteProductDialog(row._id)}
      >
        <span className="svg-icon svg-icon-md svg-icon-danger">
          <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
        </span>
      </a>
    </OverlayTrigger> */}
  </div>
);

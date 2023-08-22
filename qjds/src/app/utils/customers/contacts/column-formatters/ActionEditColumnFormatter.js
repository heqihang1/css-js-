/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import { checkPermission } from "../../../utils";

export const ActionEditColumnFormatter = (
  cellContent,
  row,
  rowIndex,
  { openDeleteProductDialog, openEditProductPage }
) => {
  return (
    <div className="d-sm-flex flex-sm-row justify-content-end">
      {checkPermission('CONTRACT', 'can_edit') && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Edit Contact</Tooltip>}
        >
          <a
            className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
            onClick={() => openEditProductPage(row)}
          >
            <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
              />
            </span>
          </a>
        </OverlayTrigger>
      )}

    {checkPermission('CONTRACT', 'can_delete') && (
      <OverlayTrigger
        overlay={<Tooltip id="products-delete-tooltip">Delete Contact</Tooltip>}
      >
        <a
          className="btn btn-icon btn-light btn-hover-danger btn-sm"
          onClick={() => openDeleteProductDialog(row)}
        >
          <span className="svg-icon svg-icon-md svg-icon-danger">
            <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
          </span>
        </a>
      </OverlayTrigger>
    )}
    </div>
  );
};

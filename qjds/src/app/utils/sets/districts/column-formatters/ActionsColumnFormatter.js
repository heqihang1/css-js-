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
  { edit, remove, approve }
) => (
  <div className="d-sm-flex flex-sm-row justify-content-end">
    {checkPermission("DISTRICTS", "can_edit") && (
      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">Edit</Tooltip>}
      >
        <a
          className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
          onClick={() => edit(row._id)}
        >
          <span className="svg-icon svg-icon-md svg-icon-primary">
            <SVG
              src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
            />
          </span>
        </a>
      </OverlayTrigger>
    )}

    {checkPermission("DISTRICTS", "can_delete") &&
      (row?.status === true ? (
        <OverlayTrigger
          overlay={<Tooltip id="products-delete-tooltip">Inactive</Tooltip>}
        >
          <a
            className="btn btn-icon btn-light btn-hover-danger btn-sm"
            onClick={() => remove(row._id, row?.district_eng_name)}
          >
            <span className="svg-icon svg-icon-md svg-icon-danger">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Navigation/Close.svg")}
              />
            </span>
          </a>
        </OverlayTrigger>
      ) : (
        <OverlayTrigger
          overlay={<Tooltip id="products-delete-tooltip">Active</Tooltip>}
        >
          <a
            className="btn btn-icon btn-light btn-hover-success btn-sm"
            onClick={() => approve(row._id, row?.district_eng_name)}
          >
            <span className="svg-icon svg-icon-md svg-icon-success">
              <SVG
                src={toAbsoluteUrl(
                  "/media/svg/icons/Navigation/Double-check.svg"
                )}
              />
            </span>
          </a>
        </OverlayTrigger>
      ))}
  </div>
);

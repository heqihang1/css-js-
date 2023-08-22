/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import { jobStatuses } from "../../../modules/jobs/partials/statuses";
import { checkPermission } from "../../utils";

export const ActionsColumnFormatter = () => (
    cellContent,
    row,
    rowIndex,
    { preview, copy, reuse, rescheduleJobOrder, cancelJobOrder, uploadDocument }
) => {
  return ( 
    <div className="d-sm-flex flex-sm-row justify-content-end">
      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">Preview</Tooltip>}
      >
        <a
          className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
          onClick={() => preview(row._id)}
        >
          <span className="svg-icon svg-icon-md svg-icon-primary">
            <SVG
              src={toAbsoluteUrl("/media/svg/icons/General/Expand-arrows.svg")}
            />
          </span>
        </a>
      </OverlayTrigger>

      {!window.location.pathname.includes("/all") && checkPermission('JOB', 'can_edit') && (row.status === jobStatuses.ARRAGED || row.status === jobStatuses.REJECTED || row.status === jobStatuses.PENDING || row.status === jobStatuses.APPROVED) && (
        <>
          <OverlayTrigger
            overlay={<Tooltip id="products-edit-tooltip">Re-Schedule</Tooltip>}
          >
            <a
              className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
              onClick={() => rescheduleJobOrder(row._id)}
            >
              <span className="svg-icon svg-icon-md svg-icon-primary">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
                />
              </span>
            </a>
          </OverlayTrigger>

          <OverlayTrigger
            overlay={
              <Tooltip id="products-delete-tooltip">Cancel</Tooltip>
            }
          >
            <a
              className="btn btn-icon btn-light btn-hover-danger btn-sm"
              onClick={() => cancelJobOrder(row._id)}
            >
              <span className="svg-icon svg-icon-md svg-icon-danger">
                <SVG src={toAbsoluteUrl("/media/svg/icons/Navigation/Close.svg")} />
              </span>
            </a>
          </OverlayTrigger>
        </>
      )}

      {window.location.pathname.includes("/arraged-job") && checkPermission('JOB', 'can_edit') && (
          <OverlayTrigger
            overlay={
              <Tooltip id="products-delete-tooltip">
                  Upload Signed Job Order
              </Tooltip>
            }
          >
            <a
              className="btn btn-icon btn-light btn-sm ml-3"
              onClick={() => uploadDocument(row._id)}
            >
              <span className="svg-icon svg-icon-md">
                <SVG
                  src={toAbsoluteUrl(
                    "/media/svg/icons/Files/Upload.svg"
                  )}
                />
              </span>
            </a>
          </OverlayTrigger>
        )}

    </div>
  )
}

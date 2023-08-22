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
  { preview, approveS,copy,rejectS, reuse, deleteQuote, edit, confirm, uploadDocument, reject } = {
    
  }
) => {
  
  return (
  <div className="d-sm-flex flex-sm-row justify-content-end">
{window.location.pathname.includes('/special-pending')&&(    
<OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">Approve</Tooltip>}
    >
      <a
        className="btn btn-icon btn-light btn-hover-primary btn-sm ml-3"
        onClick={() => approveS(row._id)}
      >
            <span className="svg-icon svg-icon-md svg-icon-success">
              <SVG
                src={toAbsoluteUrl(
                  "/media/svg/icons/Navigation/Double-check.svg"
                )}
              />
            </span>
      </a>
    </OverlayTrigger>)}
{window.location.pathname.includes('/special-pending')&&(
      <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">Reject</Tooltip>}
    >
      <a
        className="btn btn-icon btn-light btn-hover-primary btn-sm ml-3"
        onClick={() =>rejectS(row._id)}
      >
            <span className="svg-icon svg-icon-md svg-icon-danger">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Navigation/Close.svg")}
              />
            </span>
      </a>
    </OverlayTrigger>
)}
    <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">Preview</Tooltip>}
    >
      <a
        className="btn btn-icon btn-light btn-hover-primary btn-sm ml-3"
        onClick={() => preview(row._id)}
      >
        <span className="svg-icon svg-icon-md svg-icon-primary">
          <SVG
            src={toAbsoluteUrl("/media/svg/icons/General/Expand-arrows.svg")}
          />
        </span>
      </a>
    </OverlayTrigger>

    {!window.location.pathname.includes("/job") && checkPermission('QUOTATION', 'can_add') && (
    <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">Copy</Tooltip>}
    >
      <a
        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
        onClick={() => copy(row._id)}
      >
        <span className="svg-icon svg-icon-md svg-icon-primary">
          <SVG src={toAbsoluteUrl("/media/svg/icons/General/Duplicate.svg")} />
        </span>
      </a>
    </OverlayTrigger>
    )}

{!window.location.pathname.includes("/job") && checkPermission('QUOTATION', 'can_approval') && (
    <OverlayTrigger overlay={<Tooltip id="re-use-tooltip">Reuse</Tooltip>}>
      <a
        className="btn btn-icon btn-light btn-hover-danger btn-sm"
        onClick={() => reuse(row._id)}
      >
        <span className="svg-icon svg-icon-md svg-icon-danger">
          <SVG src={toAbsoluteUrl("/media/svg/icons/General/Clip.svg")} />
        </span>
      </a>
    </OverlayTrigger>
    )}

    {!window.location.pathname.includes("/all") &&
      (row.status === quoteStatuses.PENDING ||
        row.status === quoteStatuses.REJECTED || row.status === quoteStatuses.CLIENT_REJECTED) && (checkPermission('QUOTATION', 'can_edit')) && (
        <>
          <OverlayTrigger
            overlay={
              <Tooltip id="products-edit-tooltip">Edit Quotation</Tooltip>
            }
          >
            <a
              className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
              onClick={() => edit(row._id)}
            >
              <span className="svg-icon svg-icon-md svg-icon-primary">
                <SVG
                  src={toAbsoluteUrl(
                    "/media/svg/icons/Communication/Write.svg"
                  )}
                />
              </span>
            </a>
          </OverlayTrigger>

        </>
      )}

    {!window.location.pathname.includes("/all") &&
      (row.status === quoteStatuses.PENDING ||
        row.status === quoteStatuses.REJECTED || row.status === quoteStatuses.CLIENT_REJECTED) && (checkPermission('QUOTATION', 'can_delete')) && (
        <>

          <OverlayTrigger
            overlay={
              <Tooltip id="products-delete-tooltip">Delete Quotation</Tooltip>
            }
          >
            <a
              className="btn btn-icon btn-light btn-hover-danger btn-sm"
              onClick={() => deleteQuote(row._id)}
            >
              <span className="svg-icon svg-icon-md svg-icon-danger">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")}
                />
              </span>
            </a>
          </OverlayTrigger>
        </>
      )}

    {row.status === quoteStatuses.APPROVED &&
      window.location.pathname.includes("/on-confirm") && checkPermission('QUOTATION', 'can_confirm') && (
        <OverlayTrigger
          overlay={
            <Tooltip id="products-delete-tooltip">Confirm Quotation</Tooltip>
          }
        >
          <a
            className="btn btn-icon btn-light btn-hover-danger btn-sm ml-3"
            onClick={() => confirm(row._id)}
          >
            <span className="svg-icon svg-icon-md svg-icon-danger">
              <SVG
                src={toAbsoluteUrl(
                  "/media/svg/icons/Navigation/Double-check.svg"
                )}
              />
            </span>
          </a>
        </OverlayTrigger>
      )}

    {row.status === quoteStatuses.APPROVED &&
      window.location.pathname.includes("/on-confirm") && (
        <OverlayTrigger
          overlay={
            <Tooltip id="products-delete-tooltip">Reject</Tooltip>
          }
        >
          <a
            className="btn btn-icon btn-light btn-hover-danger btn-sm ml-3"
            onClick={() => reject(row._id)}
          >
            <span className="svg-icon svg-icon-md svg-icon-danger">
              <SVG
                src={toAbsoluteUrl(
                  "/media/svg/icons/Navigation/Close.svg"
                )}
              />
            </span>
          </a>
        </OverlayTrigger>
      )}

    {(row.status === quoteStatuses.CONFIRMED || row.status === quoteStatuses.PENDING_PAYMENT || row.status === quoteStatuses.SPECIAL_PENDING) &&
        (window.location.pathname.includes("/confirmed") || window.location.pathname.includes("/special-pending") || window.location.pathname.includes("/job")) && checkPermission('QUOTATION', 'can_edit') && (
          <OverlayTrigger
            overlay={
              <Tooltip id="products-delete-tooltip">
                Upload Signed Document
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
)};

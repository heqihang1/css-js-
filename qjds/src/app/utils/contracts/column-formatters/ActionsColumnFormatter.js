/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import { contractStatuses } from "../../../modules/contracts/partials/statuses";
import { checkPermission } from "../../utils";
import { useIntl } from "react-intl";
import { set } from "lodash";

export const ActionsColumnFormatter = (
  previewText,
  copyText,
  reUseText,
  editContractText,
  deleteContractText,
  confirmContractText
) => (
  cellContent,
  row,
  rowIndex,
  { handleClick,approveT,rejectT,preview, copy, reuse, edit, deleteContract, confirm, uploadDocument, reject }
) => {
  
  return (
    <div className="d-sm-flex flex-sm-row justify-content-end">
      {window.location.pathname.includes('/special-pending')&&(    
    <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">Approve</Tooltip>}
      
    >
      <a
        className="btn btn-icon btn-light btn-hover-primary btn-sm ml-3"
        onClick={() =>approveT(row._id)}
      >
            <span className="svg-icon svg-icon-md svg-icon-success" >
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
        onClick={() =>rejectT(row._id) }
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
        overlay={<Tooltip id="products-edit-tooltip">{previewText}</Tooltip>}
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

      {!window.location.pathname.includes("/job") && checkPermission('CONTRACT', 'can_add') && (
      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">{copyText}</Tooltip>}
      >
        <a
          className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
          onClick={() => copy(row._id)}
        >
          <span className="svg-icon svg-icon-md svg-icon-primary">
            <SVG
              src={toAbsoluteUrl("/media/svg/icons/General/Duplicate.svg")}
            />
          </span>
        </a>
      </OverlayTrigger>
      )}

    {!window.location.pathname.includes("/job") && checkPermission('CONTRACT', 'can_approval') && (
      <OverlayTrigger
        overlay={<Tooltip id="re-use-tooltip">{reUseText}</Tooltip>}
      >
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
        (row.status === contractStatuses.PENDING ||
          row.status === contractStatuses.REJECTED || row.status === contractStatuses.CLIENT_REJECTED) && (checkPermission('CONTRACT', 'can_edit')) && (
          <>
            <OverlayTrigger
              overlay={
                <Tooltip id="products-edit-tooltip">{editContractText}</Tooltip>
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
        (row.status === contractStatuses.PENDING ||
          row.status === contractStatuses.REJECTED || row.status === contractStatuses.CLIENT_REJECTED) && checkPermission('CONTRACT', 'can_delete') && (
          <>
            
            <OverlayTrigger
              overlay={
                <Tooltip id="products-delete-tooltip">
                  {deleteContractText}
                </Tooltip>
              }
            >
              <a
                className="btn btn-icon btn-light btn-hover-danger btn-sm"
                onClick={() => deleteContract(row._id)}
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

      {row.status === contractStatuses.APPROVED &&
        window.location.pathname.includes("/on-confirm") && checkPermission('CONTRACT', 'can_confirm') && (
          <OverlayTrigger
            overlay={
              <Tooltip id="products-delete-tooltip">
                {confirmContractText}
              </Tooltip>
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

    {row.status === contractStatuses.APPROVED &&
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


      {(row.status === contractStatuses.CONFIRMED || row.status === contractStatuses.PENDING_PAYMENT || row.status === contractStatuses.SPECIAL_PENDING) &&
        (window.location.pathname.includes("/confirmed") || window.location.pathname.includes("/special-pending") || window.location.pathname.includes("/job")) && checkPermission('CONTRACT', 'can_edit') && (
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
  );
};

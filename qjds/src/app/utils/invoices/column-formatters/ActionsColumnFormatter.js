/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import { invoiceStatuses } from "../../../modules/invoices/partials/statuses";
import { checkPermission } from "../../utils";

export const ActionsColumnFormatter = (
  cellContent,
  row,
  rowIndex,
  { preview, copy, reuse, paidInvoice, deleteInvoice, edit, unpaid }
) => (
  <div className="d-sm-flex flex-sm-row justify-content-end">
    {((window.location.pathname.includes("/all")) || row.status === invoiceStatuses.REJECT || row.status === invoiceStatuses.WAITING || row.status === invoiceStatuses.PENDING || row.status === invoiceStatuses.PARTIAL_PAYMENT || row.status === invoiceStatuses.PAID) ? 
    <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">Preview</Tooltip>}
    >
      <a
        className="btn btn-icon btn-light btn-hover-primary btn-sm"
        onClick={() => preview(row._id)}
      >
        <span className="svg-icon svg-icon-md svg-icon-primary">
          <SVG
            src={toAbsoluteUrl("/media/svg/icons/General/Expand-arrows.svg")}
          />
        </span>
      </a>
    </OverlayTrigger> : ''}

    {((window.location.pathname.includes("/all") || row.status === invoiceStatuses.PENDING || row.status === invoiceStatuses.PARTIAL_PAYMENT || row.status === invoiceStatuses.PAID) && (checkPermission('INVOICE', 'can_add'))) ? 
    <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">Copy</Tooltip>}
    >
      <a
        className="btn btn-icon btn-light btn-hover-primary btn-sm ml-3"
        onClick={() => copy(row._id)}
      >
        <span className="svg-icon svg-icon-md svg-icon-primary">
          <SVG
            src={toAbsoluteUrl("/media/svg/icons/General/Duplicate.svg")}
          />
        </span>
      </a>
    </OverlayTrigger> : ''}

    {((!window.location.pathname.includes("/all")) && (row.status === invoiceStatuses.REJECT || row.status === invoiceStatuses.WAITING) && (checkPermission('INVOICE', 'can_edit'))) ? 
    <OverlayTrigger
      overlay={
        <Tooltip id="products-edit-tooltip">Edit Invoice</Tooltip>
      }
    >
      <a
        className="btn btn-icon btn-light btn-hover-primary btn-sm ml-3"
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
    </OverlayTrigger> : ''}

    {((!window.location.pathname.includes("/all")) && (row.status === invoiceStatuses.PENDING || row.status === invoiceStatuses.PARTIAL_PAYMENT) && (checkPermission('INVOICE', 'can_confirm'))) ? <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">Paid</Tooltip>}
      >
        <a
          className="btn btn-icon btn-light btn-hover-primary btn-sm ml-3"
          onClick={() => paidInvoice(row._id)}
        >
          <span className="svg-icon svg-icon-md svg-icon-primary">
            <SVG
              src={toAbsoluteUrl("/media/svg/icons/Navigation/Check.svg")}
            />
          </span>
        </a>
    </OverlayTrigger> : ''}

    {((!window.location.pathname.includes("/all")) && (row.status === invoiceStatuses.WAITING || row.status === invoiceStatuses.REJECT) && (checkPermission('INVOICE', 'can_delete'))) ? <OverlayTrigger
      overlay={
        <Tooltip id="products-delete-tooltip">Delete Invoice</Tooltip>
      }
    >
      <a
        className="btn btn-icon btn-light btn-hover-danger btn-sm ml-3"
        onClick={() => deleteInvoice(row._id)}
      >
        <span className="svg-icon svg-icon-md svg-icon-danger">
          <SVG
            src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")}
          />
        </span>
      </a>
    </OverlayTrigger> : ''}

    {(!window.location.pathname.includes("/all") && row.status === invoiceStatuses.PAID && (checkPermission('INVOICE', 'can_confirm'))) ? <OverlayTrigger
      overlay={<Tooltip id="products-delete-tooltip">Unpaid</Tooltip>}
    >
      <a
        className="btn btn-icon btn-light btn-hover-danger btn-sm ml-3"
        onClick={() => unpaid(row._id)}
      >
        <span className="svg-icon svg-icon-md svg-icon-danger">
          <SVG
            src={toAbsoluteUrl("/media/svg/icons/Navigation/Left 3.svg")}
          />
        </span>
      </a>
    </OverlayTrigger> : ''}

  </div>
);

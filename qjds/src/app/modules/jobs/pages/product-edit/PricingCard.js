/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { Field } from "formik";
import { Select } from "../../../../../_metronic/_partials/controls";
import { Editor } from "../../../../components/Editor";
import SearchSelect from "react-select";

export default function PricingCard({
  disabled = false,
  item,
  itemIndex,
  removeItem,
  services = [],
  setService,
  setDescription,
}) {
  const { id } = useParams();

  function removeItemData(id, itemIndex) {
    if (document.getElementById(`Project_${itemIndex}`)) {
      document.getElementById(`Project_${itemIndex}`).focus()
    }
    setTimeout(() => {
      removeItem(id)
    }, 300)
  }

  return (
    <div className="d-flex  flex-wrap">
      <div className="col-lg-11 d-flex flex-column">
        {!id && (
          <div className="form-group row">
            <div className="col-lg-12">
              <label>Project</label>
              <SearchSelect
                value={
                  item?.service?._id
                    ? services
                        ?.filter((x) => x?._id === item?.service?._id)
                        .map((x) => {
                          return {
                            label: x.service_name,
                            value: x._id,
                          };
                        })[0]
                    : ""
                }
                options={
                  services
                    ? services.map((x) => {
                        return {
                          label: x?.service_name,
                          value: x?._id,
                        };
                      })
                    : []
                }
                placeholder="Project"
                onChange={(opt) => {
                  setService(item.id, opt.value);
                }}
                id={`Project_${itemIndex}`}
              />
            </div>
          </div>
        )}
        <div className="form-group row flex-content-between">
          <div className="col-lg-12">
            <label>Description</label>
            <Editor
              onChange={(name, newContent) =>
                setDescription(item.id, newContent, itemIndex)
              }
              placeholder={""}
              initContent={item?.desc?.replaceAll("\r\n", "<br />")}
            />
          </div>
        </div>
      </div>
      <div className="col-lg-1 d-flex flex-column justify-content-between pt-10 pb-10">
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Delete</Tooltip>}
        >
          <a
            className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3 mb-6"
            onClick={() => removeItemData(item.id, itemIndex)}
          >
            <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Communication/Delete.svg")}
              />
            </span>
          </a>
        </OverlayTrigger>
      </div>
    </div>
  );
}

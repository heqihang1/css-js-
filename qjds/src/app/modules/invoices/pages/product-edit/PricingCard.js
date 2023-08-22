/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import SearchSelect from "react-select";
import { FormLabel } from "react-bootstrap";
import { Editor } from "../../../../components/Editor";

let timer;
export default function PricingCard({
  disabled = false,
  item,
  itemIndex,
  removeItem,
  setServiceData,
  // services
}) {
  const [amount, setAmount] = useState(item.amount)
  const [description, setDescription] = useState(item.description)
  const [title, setTitle] = useState(item.title)
  const [isHtmlMode, setIsHtmlMode] = useState(item?.htmlMode)

  useEffect(() => {
    const itemEdited = { id: item.id, amount: amount, description: description, title: title, htmlMode: isHtmlMode }
    setServiceData(itemEdited, itemIndex)
  }, [amount, description, title, isHtmlMode])

  function removeItemData(id, itemIndex) {
    if (document.getElementById(`costPrice_${itemIndex}`)) {
      document.getElementById(`costPrice_${itemIndex}`).focus()
    }
    setTimeout(() => {
      removeItem(id)
    }, 500)
  }

  return (
    <div className="d-flex  flex-wrap align-items-center">
      <div className="col-lg-10 d-flex flex-column">
        <div className="form-group row">
          <div className="col-lg-8">
            <label><b>Service Title</b> <span className="indicatory">*</span></label>
            {item.htmlMode ? <div>
              {title}
            </div> : <input
              className="form-control"
              name="title"
              type="text"
              defaultValue={title}
              onChange={(e) => {
                const debounce = function (e, d) {
                  if (timer) {
                    clearTimeout(timer);
                  }
                  timer = setTimeout(() => {
                    setTitle(e)
                  }, d);
                };
                debounce(e.target.value, 500)
              }}
            />}
          </div>
          <div className="col-lg-4">
            <label><b>Amount</b> <span className="indicatory">*</span></label>
            {item.htmlMode ? <div>
              ${amount?.toFixed(2) || 0}
            </div> : <div class="input-group mb-2">
              <div class="input-group-prepend">
                <div class="input-group-text">$</div>
              </div>
              <input type="number" min={1} className="form-control"
                // onBlur={(e) => setAmount(e.target.value)}
                onChange={(e) => {
                  const debounce = function (e, d) {
                    if (timer) {
                      clearTimeout(timer);
                    }
                    timer = setTimeout(() => {
                      setAmount(e)
                    }, d);
                  };
                  debounce(e.target.value, 500)
                }}
                defaultValue={amount}
                id={`costPrice_${itemIndex}`}
              />
            </div>}
          </div>
        </div>
        <div className="form-group row flex-content-between">
          <div className="col-lg-12">
            <label><b>Description</b> <span className="indicatory">*</span></label>
            {/* <textarea
              className="form-control"
              rows="5"
              name="description"
              type="text"
              value={description}
              onInput={(e) => setDescription(e.target.value)}
            /> */}
            {item.htmlMode ? <div dangerouslySetInnerHTML={{
              __html: (description?.replaceAll("\r\n", "<br />")),
            }}>
            </div> : <Editor
              onChange={(name, newContent) =>
                setDescription(newContent)
              }
              placeholder={""}
              initContent={description?.replaceAll("\r\n", "<br />").replaceAll("\n", "<br />")}
            />}
          </div>
        </div>
      </div>

      <div className="col-lg-1 d-flex flex-column">
        {item.htmlMode ? <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Edit</Tooltip>}
        >
          <a
            className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3 mb-6"
            onClick={() => setIsHtmlMode(false)}
          >
            <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
              />
            </span>
          </a>
        </OverlayTrigger> : ''}
        {!disabled ? <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Delete</Tooltip>}
        >
          <a
            className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3 mb-6"
            onClick={() => {
              removeItemData(item.id, itemIndex);
            }}
          >
            <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Communication/Delete.svg")}
              />
            </span>
          </a>
        </OverlayTrigger> : ''}
      </div>
    </div>
  );
}

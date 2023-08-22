/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { Field } from "formik";
import { Select } from "../../../../../_metronic/_partials/controls";
import { Editor } from "../../../../components/Editor";
import SearchSelect from "react-select";
import JoditEditor from "jodit-react";

let timer;
export default function PricingCard({
  disabled = false,
  item,
  itemIndex,
  removeItem,
  services = [],
  setPrice,
  setService,
  setFeet,
  setDiscount,
  setDescription,
  setOffer,
  editItem,
  selServices,
  setservices
}) {
  const [selectedService, setSelectedService] = useState(null)
  const [serviceFeet, setServiceFeet] = useState("")
  const [serviceDiscount, setServiceDiscount] = useState("")
  const [servicePrice, setServicePrice] = useState("")
  const [serviceDescription, setServiceDescription] = useState("")
  const [serviceOffer, setServiceOffer] = useState("")

  function removeItemData(id, itemIndex) {
    if (document.getElementById(`costPrice_${itemIndex}`)) {
      document.getElementById(`costPrice_${itemIndex}`).focus()
    }
    setTimeout(() => {
      removeItem(id)
    }, 300)
  }

  const debounce = function (e, d) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      setservices(e)
    }, d);
  };

  useEffect(() => {
    setServiceFeet(item.feet)
    setServiceDiscount(item.discount)
    setServicePrice(item.price)
    setSelectedService(item.service)
    setServiceDescription(item.desc)
    setServiceOffer(item.offer)
    // eslint-disable-next-line
  }, [item])

  const getAmount = () => {
    const service = services.find((x) => x._id === selectedService)
    let amount = (serviceFeet || 0) * (servicePrice || 0) * ((100 - (serviceDiscount || 0)) / 100);
    if (service && service.service_minimum_consumption && amount < service.service_minimum_consumption) {
      amount = parseInt(service.service_minimum_consumption)
    }
    return amount
  };

  useEffect(() => {
    const newItemData = { ...item, feet: serviceFeet || 0, discount: serviceDiscount || 0, price: servicePrice || 0, service: selectedService, desc: serviceDescription, offer: serviceOffer, amount: getAmount() }
    const newData = selServices.map((ee) => {
      if (ee.id === item.id) {
        return newItemData
      }
      return ee
    })
    debounce(newData, 400)
    // eslint-disable-next-line
  }, [serviceFeet, serviceDescription, serviceDiscount, serviceOffer, servicePrice, selectedService])

  return (
    <div className="d-flex  flex-wrap">
      <div className="col-lg-11 d-flex flex-column">
        <div className="form-group row">
          <div className="col-lg-3">
            <label><b>Project</b> <span className="indicatory">*</span></label>
            {item.htmlMode ? <div>
              {item?.service?.service_name}
            </div> : <SearchSelect
              // value={
              //   selectedService?._id
              //     ? services
              //       ?.filter((x) => x?._id === selectedService?._id)
              //       .map((x) => {
              //         return {
              //           label: x.service_name,
              //           value: x._id,
              //         };
              //       })[0]
              //     : ""
              // }
              value={(selectedService) ? { label: selectedService.service_name, value: selectedService._id } : ''}
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
                const selectedValue = services.find((myserv) => myserv._id === opt.value)
                setSelectedService(selectedValue)
                setServicePrice(selectedValue?.service_price)
                setServiceDescription(selectedValue?.service_content)
                // setService(item.id, opt.value);
              }}
            />}
          </div>
          <div className="col-lg-3">
            <label><b>Feet</b> <span className="indicatory">*</span></label>
            {item.htmlMode ? <div>
              {item?.feet}
            </div> : <input
              type="number"
              className="form-control"
              defaultValue={0}
              // value={item?.feet}
              value={serviceFeet}
              min={0}
              // onInput={(e) => setFeet(item.id, e.target.value)}
              onChange={(e) => setServiceFeet(e.target.value)}
            />}
          </div>
          <div className="col-lg-3">
            <label><b>Discount %</b> <span className="indicatory">*</span></label>
            {item.htmlMode ? <div>
              {item?.discount}
            </div> : <input
              type="number"
              className="form-control"
              defaultValue={0}
              // value={item?.discount}
              value={serviceDiscount}
              min={0}
              onChange={(e) => setServiceDiscount(e.target.value)}
            // onInput={(e) => setDiscount(item.id, e.target.value)}
            />}
          </div>
          <div className="col-lg-3">
            <label><b>Amount</b> <span className="indicatory">*</span></label>
            {item.htmlMode ? <div>
              ${item?.amount?.toFixed(2) || 0}
            </div> : <div class="input-group mb-2">
              <div class="input-group-prepend">
                <div class="input-group-text">$</div>
              </div>
              <input
                type="text"
                className="form-control"
                value={`${getAmount()?.toFixed(2) || 0}`}
              />
            </div>}
          </div>
        </div>
        <div className="form-group row flex-content-between">
          <div className="col-lg-3">
            <label><b>cost price</b> <span className="indicatory">*</span></label>
            {item.htmlMode ? <div>
              {item?.price}
            </div> : <div class="input-group mb-2">
              <div class="input-group-prepend">
                <div class="input-group-text">$</div>
              </div>
              <input
                // onInput={(e) => setPrice(item.id, e.target.value)}
                min={0}
                type="number"
                className="form-control"
                // value={item.price}
                value={servicePrice}
                id={`costPrice_${itemIndex}`}
                onChange={(e) => setServicePrice(e.target.value)}
              />
            </div>}
          </div>
        </div>
        <div className="form-group row flex-content-between">
          <div className="col-lg-12">
            <label><b>Description</b> <span className="indicatory">*</span></label>
            {item.htmlMode ? <div dangerouslySetInnerHTML={{
              __html: (item?.desc?.replaceAll("\r\n", "<br />")),
            }}>
            </div> : <JoditEditor
              // onChange={(name, newContent) =>
              //   setDescription(item.id, newContent, itemIndex)
              // }
              onChange={(newContent) =>
                setServiceDescription(newContent)
                // setDescription(item.id, newContent, itemIndex)
              }
              placeholder={""}
              // initContent={item?.desc?.replaceAll("\r\n", "<br />")}
              value={serviceDescription?.replaceAll("\r\n", "<br />")}
            />}
          </div>
        </div>
        <div className="form-group row flex-content-between">
          <div className="col-lg-12">
            <label><b>Offer (will not display on job order)</b></label>
            {item.htmlMode ? <div dangerouslySetInnerHTML={{
              __html: (item?.offer?.replaceAll("\r\n", "<br />")),
            }}>
            </div> : <JoditEditor
              // onChange={(name, newContent) =>
              //   setOffer(item.id, newContent, itemIndex)
              // }
              onChange={(newContent) => {
                setServiceOffer(newContent)
              }}
              placeholder={""}
              // initContent={item?.offer?.replaceAll("\r\n", "<br />")}
              value={serviceOffer?.replaceAll("\r\n", "<br />")}
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
            onClick={() => editItem(item.id, false)}
          >
            <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
              />
            </span>
          </a>
        </OverlayTrigger> : ''}
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

/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
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
  setService,
  setFeet,
  setDiscount,
  calculations,
  showAmountOption,
  setDescription,
  setOffer,
  setCalc,
  setShowAmount,
  setPrice,
  editItem,
  selServices,
  setservices,
  setTableArr,
  tableArr
}) {

  const [selectedService, setSelectedService] = useState(null)
  const [serviceFeet, setServiceFeet] = useState("")
  const [serviceDiscount, setServiceDiscount] = useState("")
  const [servicePrice, setServicePrice] = useState("")
  const [serviceDescription, setServiceDescription] = useState("")
  const [serviceOffer, setServiceOffer] = useState("")

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

  function removeItemData(id, itemIndex) {
    if (document.getElementById(`costPrice_${itemIndex}`)) {
      document.getElementById(`costPrice_${itemIndex}`).focus()
    }
    setTimeout(() => {
      removeItem(id, itemIndex, item.time_id)
    }, 300)
  }

  /* 
    以下 newData下的逻辑是旧版本的逻辑，不存在time_id字段
    如要上线新版本的合约逻辑，切记一定把注释内容进行覆盖
  */
  useEffect(() => {
    const newItemData = {
      ...item,
      feet: serviceFeet || 0,
      discount: serviceDiscount || 0,
      price: servicePrice || 0,
      service: selectedService,
      desc: serviceDescription,
      offer: serviceOffer,
      amount: getAmount(),
    }
    const newData = selServices.map((ee) => {
      if (ee.id === item.id) {    // 新版本合约才有的逻辑 ee.time_id === item.time_id
        return newItemData
      }
      return ee
    })
    debounce(newData, 400)
    // eslint-disable-next-line
  }, [serviceFeet, serviceDescription, serviceDiscount, serviceOffer, servicePrice, selectedService])

  const getAmount = () => {
    const service = services.find((x) => x._id === selectedService)
    let amount = (serviceFeet || 0) * (servicePrice || 0) * ((100 - (serviceDiscount || 0)) / 100);
    if (service && service.service_minimum_consumption && amount < service.service_minimum_consumption) {
      amount = parseInt(service.service_minimum_consumption)
    }
    return amount
  };

  // 选择服务事件
  const serviceChange = (opt) => {

    const selectedValue = services.find((myserv) => myserv._id === opt.value)

    setSelectedService(selectedValue)
    setServicePrice(selectedValue?.service_price)
    setServiceDescription(selectedValue?.service_content)
    // setService(item.id, opt.value);
  }

  useEffect(() => {
    const services_set = [{
      id: item.id,
      service_id: selectedService?._id,
      service_name: selectedService?.service_name,
      time_id: item.time_id,
      count: item.calculation == 'Per month'
        ? 12 : item.calculation == 'Quarterly'
          ? 4 : item.calculation == 'Every half year'
            ? 2 : item.calculation == 'per year'
              ? 1 : ''
    }]

    const newInfo = tableArr.map((ee) => {
      if (ee.length > 1) {
        const list = []
        ee.map((v) => {
          if (v.time_id === item.time_id) {
            list.push(services_set[0])
          } else {
            list.push(v)
          }
        })
        return list
      } else {
        if (ee.map(item => item.time_id).indexOf(item.time_id) > -1) {
          return services_set
        }
      }
      return ee
    })

    change(newInfo)
    // change(newInfo, 400)
  }, [selectedService])

  // const change = function (e, d) {
  //   if (timer) {
  //     clearTimeout(timer);
  //   }
  //   timer = setTimeout(() => {
  //     setTableArr(e)
  //   }, d);
  // };

  const change = function (e) {
    new Promise((resolve, reject) => (
      resolve()
    )).finally(() => {
      setTableArr(e)
    })
  };

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
              onChange={serviceChange}
            />}
          </div>
          <div className="col-lg-3">
            <label><b>Feet</b> <span className="indicatory">*</span></label>
            {item.htmlMode ? <div>
              {item?.feet}
            </div> : <input
              type="number"
              className="form-control"
              min={0}
              defaultValue={0}
              // value={item?.feet}
              value={serviceFeet}
              // onInput={(e) => setFeet(item.id, e.target.value)}
              onChange={(e) => setServiceFeet(e.target.value)}
            />}
          </div>
          <div className="col-lg-3">
            <label><b>Discount %</b> <span className="indicatory">*</span></label>
            {item.htmlMode ? <div>
              {item?.discount || 0}
            </div> : <input
              type="number"
              className="form-control"
              min={0}
              // value={item?.discount}
              value={serviceDiscount}
              defaultValue={0}
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
                type="number"
                className="form-control"
                // value={item?.price}
                value={servicePrice}
                min={0}
                id={`costPrice_${itemIndex}`}
                onChange={(e) => setServicePrice(e.target.value)}
              // onChange={(e) => setPrice(item.id, e.target.value)}
              />
            </div>}
          </div>
          <div className="col-lg-4">
            <label><b>Calculation</b></label>
            {item.htmlMode ? <div>
              {item?.calculation}
            </div> : <Select
              name={item.id + "calculation"}
              disabled={disabled}
              onChange={(e) => setCalc(item.time_id, e.target.value)}
            >
              {calculations.map((calc, index) => (
                <option
                  key={index}
                  value={calc}
                  selected={item?.calculation === calc}
                >
                  {calc}
                </option>
              ))}
            </Select>}
          </div>
          <div className="col-lg-4">
            <label><b>Show Amount</b></label>
            {item.htmlMode ? <div>
              {item?.show_amount}
            </div> : <Select
              name={item.id + "show_amount"}
              disabled={disabled}
              onChange={(e) => setShowAmount(item.id, e.target.value)}
            >
              {showAmountOption.map((showAmount, index) => (
                <option
                  key={index}
                  value={showAmount}
                  selected={item?.show_amount === showAmount}
                >
                  {showAmount}
                </option>
              ))}
            </Select>}
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
              onChange={(newContent) =>
                // setOffer(item.id, newContent, itemIndex)
                setServiceOffer(newContent)
              }
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


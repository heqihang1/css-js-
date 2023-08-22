import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../../../_metronic/_partials/controls";
import ReactHTMLParser from "react-html-parser";
import Signature from "../../../../components/Signature";
import { formateAmount } from "../../../../utils/utils";
import InvoicePDF from "../../../../components/InvoicePDF";

export default function Info({ productForEdit, isChinese = false, isEdit }) {
  return (
    <>
      {/* <Card>
        <CardHeader>
          <div className="form-group row justify-content-between mt-6">
            <div className="col-4 col-lg-4">
              <p className="">
                <img
                  src="/media/details_logo.png"
                  className="img-fluid h-8"
                  alt="Image logo"
                  style={{ width: "60%" }}
                />
              </p>
              <p className="h3 mt-8">Invoice To:</p>
              <p className="">{productForEdit.contact_person?.contact_name}</p>
              <p className="">{productForEdit.customer_id?.customer_name}</p>
              <p className="">
                {productForEdit.address && productForEdit.address.length > 0
                  ? productForEdit.address[0].location_address
                  : ""}
              </p>
              <p className="">
                Phone: {productForEdit.contact_person?.office_number}
              </p>
              <p className="">Email: {productForEdit.contact_person?.email}</p>
            </div>
            <div className="col-lg-4 justify-content-between">
              <p className="h1">INVOICE</p>
              <p className="mt-5">
                Invoice No: <b>{productForEdit.invoice_no}</b>
              </p>
              <p className="">
                Date:{" "}
                <b>
                  <span className="text-dark font-weight-bold">
                    {" "}
                    {Intl.DateTimeFormat("en-GB", {
                      dateStyle: "medium",
                    })
                      .format(new Date(productForEdit.date || Date.now()))
                      .replace(/\//g, " ")}
                  </span>
                </b>
              </p>
              <p className="">
                <hr></hr>
              </p>
              <p className="">
                Contract / Quotation No:{" "}
                <b>{productForEdit.quote_contract_no}</b>
              </p>
              <p className="">
                Job Date / Period:{" "}
                {productForEdit.job_start_date &&
                productForEdit.job_end_date ? (
                  <span className="text-dark font-weight-bold">
                    {Intl.DateTimeFormat("en-GB", {
                      dateStyle: "medium",
                    })
                      .format(
                        new Date(productForEdit.job_start_date || Date.now())
                      )
                      .replace(/\//g, " ")}
                    To{" "}
                    {Intl.DateTimeFormat("en-GB", {
                      dateStyle: "medium",
                    })
                      .format(
                        new Date(productForEdit.job_end_date || Date.now())
                      )
                      .replace(/\//g, " ")}
                  </span>
                ) : (
                  ""
                )}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="border-bottom border-secondary border-4 p-4 pt-5 row justify-content-between">
            <p className="h4 text-secondary">Service Item(S)</p>
            <p className="h4 text-secondary">Amount</p>
          </div>
          <div className="mt-3">
            {productForEdit?.services.map((service, id) => (
              <div
                key={id}
                className="row justify-content-between align-items-center pl-4 pr-4"
              >
                <div className="col-lg-4">{service?.title}</div>
                <div className="">
                  <p className="text-secondary">
                    {formateAmount(service.price)}
                  </p>
                </div>
              </div>
            ))}
            <hr></hr>
          </div>
          <p className="text-right">
            <b>Total Amount: </b>
            {formateAmount(productForEdit.amount)}
          </p>
          <div className="border-bottom border-2 pt-8 pb-3">
            <p className="h4 text-secondary">Payment terms:</p>
          </div>
          <div className="mt-5">
            <div className="">
              <div
                className="text-secondary"
                dangerouslySetInnerHTML={{
                  __html: productForEdit.payment_term_id?.payment_method_content?.replaceAll(
                    "\\r\\n",
                    "<br />"
                  ),
                }}
              />
            </div>
          </div>

          <div className="row justify-content-between mt-10">
            <div className="col-lg-4 border-bottom border-2">
              <p>
                For and behalf of<br></br>MasterClean Hygiene Solution Limited
              </p>
              <div className="col-4 col-lg-8">
                <Signature />
              </div>
            </div>
            <div className="col-lg-4 mr-20">
              <p></p>
              <p></p>
            </div>
          </div>
          <div className="row justify-content-between mt-10">
            <p className="col-lg-4">
              Authorized Company Chop <br />
              {Intl.DateTimeFormat("en-GB", {
                dateStyle: "medium",
              })
                .format(new Date(productForEdit.date || Date.now()))
                .replace(/\//g, " ")}
            </p>
            <p className="col-lg-4 mr-20"></p>
          </div>
          <div className="row justify-content-between mt-5">
            <div className="col-lg-5">
              <p>MasterClean Hygiene Solution Limited</p>
              <p>Hotline: (852) 3975 6300 Fax: (852) 2756 3141</p>
              <p>Website: www.masterclean.hk</p>
              <p>
                Flat J, 8/F, Wang Kwong Industrial Building, 45 Hung To Road,
                Kwun Tong, KLN
              </p>
            </div>
            <div className="col-7 col-lg-7">
              <img
                src={"/media/all-in-one.jpg"}
                width={"100%"}
                className="p-4"
              />
            </div>
          </div>
        </CardBody>
      </Card> */}

      <InvoicePDF data={productForEdit} isChinese={isChinese} isEdit={isEdit} />
    </>
  );
}

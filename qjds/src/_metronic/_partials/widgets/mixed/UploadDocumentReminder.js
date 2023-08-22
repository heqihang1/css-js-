/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { API_URL } from "../../../../app/API_URL";
import axios from "axios";
import { useHistory } from "react-router-dom";

export default function JobReminder({ className }) {
  const [data, setData] = useState([])
  const history = useHistory();

  useEffect(() => {
    axios.get(API_URL + "dashboard/upload_document_reminder").then((res) => {
      setData(res.data)
    })
  }, [])

  return (
    <div className={`card card-custom ${className}`}>
      {/* begin::Body */}
      <div className="card-header border-0 pt-5">
        <h3 className="card-title font-weight-bolder">Upload Document Reminder</h3>
        <div className="card-toolbar">
        </div>
      </div>
      <div className="card-body d-flex flex-column">
        {data.length === 0
          ? <div style={{ position: "absolute", top: "50%", left: "40%" }} className="text-black-50"><h5>No Data</h5></div>
          : (
            <table className="table">
              <thead>
                <tr>
                  <th scope="col" className="text-black-50">Type</th>
                  <th scope="col" className="text-black-50">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((item, index) => (
                  <tr className="my-3" key={index}>
                    <td className="h6 py-5">{item.type}</td>
                    <td className="h6 py-5 cursor-pointer"
                      onClick={() => {
                        if (item.type === "Quotation") {
                          history.push("/reports/upload-document-report?type=quote")
                        } else if (item.type === "Contract") {
                          history.push("/reports/upload-document-report?type=contract")
                        } else if (item.type === "Job Order") {
                          history.push("/reports/upload-document-report?type=job")
                        }
                      }}
                    >
                      {item.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </div>
      {/* end::Body */}
    </div>
  );
}

/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { API_URL } from "../../../../app/API_URL";
import axios from "axios";
import { useHistory } from "react-router-dom";

export default function ContractEnd({ className }) {
  const [data, setData] = useState([])
  const history = useHistory();

  // 动态获取当月为开始月份的七个月数据
  useEffect(() => {
    axios.get(API_URL + "dashboard/contract_end_upcoming").then((res) => {
      setData(res.data)
    })
  }, [])

  // 每项不同月份的 list点击跳转
  function redirectToReport(item) {
    history.push(`/reports/contract-end?from=${item.start}&to=${item.end}`)
  }

  return (
    <div className={`card card-custom ${className}`}>
      {/* begin::Body */}
      <div className="card-header border-0 pt-5">
        <h3 className="card-title font-weight-bolder">Coming End Contract</h3>
        <div className="card-toolbar"></div>
      </div>
      <div className="card-body d-flex flex-column">
        {data.length === 0
          ? <div style={{ position: "absolute", top: "50%", left: "40%" }} className="text-black-50"><h5>No Data</h5></div>
          : (
            <table className="table">
              <thead>
                <tr>
                  <th scope="col" className="text-black-50">Month</th>
                  <th scope="col" className="text-black-50">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((item, index) => (
                  <tr className="my-3 cursor-pointer" onClick={() => redirectToReport(item)} key={index}>
                    <td className="h6 py-5">{item.month}</td>
                    <td className="h6 py-5">{item.total}</td>
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

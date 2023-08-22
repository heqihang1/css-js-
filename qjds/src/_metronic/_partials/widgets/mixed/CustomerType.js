/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo, useEffect } from "react";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
import { useHtmlClassService } from "../../../layout";
import { API_URL } from "../../../../app/API_URL";
import axios from "axios";

export  default function CustomerType({
  className,
  id,
  title,
  percentage
}) {
  let chartnewCustomer
  const uiService = useHtmlClassService();
  const layoutProps = useMemo(() => {
    return {
      colorsGrayGray100: objectPath.get(
        uiService.config,
        "js.colors.gray.gray100"
      ),
      colorsGrayGray700: objectPath.get(
        uiService.config,
        "js.colors.gray.gray700"
      ),
      colorsThemeBaseSuccess: objectPath.get(
        uiService.config,
        "js.colors.theme.base.success"
      ),
      colorsThemeLightSuccess: objectPath.get(
        uiService.config,
        "js.colors.theme.light.success"
      ),
      fontFamily: objectPath.get(uiService.config, "js.fontFamily"),
    };
  }, [uiService]);

  const options = {
    series: [40, 50],
    chart: {
    height: 300,
    type: 'radialBar',
  },
  totalValue: 500,
  plotOptions: {
    radialBar: {
      dataLabels: {
        show: true,
        name: {
          show: true,
          fontSize: '22px',
        },
        value: {
          fontSize: '16px',
        },
        total: {
          show: true,
          label: 'Total' ,
          formatter: function (w) {
            // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
            return w.config.totalValue.toLocaleString()
          }         
        }
      }
    }
  },
  labels: ['Commercial', 'Personal'],
  };
  const setOPtions = (newApiData) => {  
    options.totalValue = newApiData.total
    options.series = [Number(newApiData.customersCompany), Number(newApiData.customersPersonal)]   
    const element = document.getElementById(id);
    if (!element) {
      return;
    }
    chartnewCustomer = new ApexCharts(element, options);
    chartnewCustomer.render();
  }
  useEffect(() => {
    axios.get(API_URL + "dashboard/customer_types").then((res)  => {      
      setOPtions(res.data)
    })
    return function cleanUp() {
      if (chartnewCustomer) {
        chartnewCustomer.destroy();
      }      
    };
  }, [layoutProps, percentage]);

  return (
    <div className={`card card-custom ${className}`}>
      {/* Header */}
      <div className="card-header border-0 pt-5">
        <h3 className="card-title font-weight-bolder ">{title}</h3>
        <div className="card-toolbar">
         
        </div>
      </div>
      {/* Body */}
      <div className="card-body d-flex flex-column">
        <div className="flex-grow-1">
          <div id={id} style={{ height: "200px" }}></div>
        </div>        
      </div>
      <div className="card-footer d-flex flex-row justify-content-around">
          <div className="d-flex flex-row align-items-center">
            <div className="rounded-circle bg-primary mr-2" style={{width: "15px", height: "15px"}}></div>
            <span>Commercial</span>
          </div>
          <div className="d-flex flex-row align-items-center">
            <div className="rounded-circle bg-success mr-2" style={{width: "15px", height: "15px"}}></div>
            <span>Personal</span>
          </div>          
      </div>
    </div>
  );
}


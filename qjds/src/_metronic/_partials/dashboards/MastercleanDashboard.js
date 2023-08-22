// Dashboard主页面
import React, { useEffect, useState } from "react";
import { StatsWidget12, OverdueAmount } from "../widgets";
import CustomerType from "../widgets/mixed/CustomerType"
import ContractEnd from "../widgets/mixed/ContractEnd"
import JobReminder from "../widgets/mixed/JobReminder"
import BusinessSource from "../widgets/mixed/BusinessSource"
import UploadDocumentReminder from "../widgets/mixed/UploadDocumentReminder"
import SalesBusiness from "../widgets/mixed/SalesBusiness"
import FutureJob from "../widgets/mixed/FutureJob"
import ItemSales from "../widgets/mixed/ItemSales"
import SalesPerformanceStat from "../widgets/mixed/SalesPerformanceStat"
import { checkPermission } from "../../../app/utils/utils";

export function MastercleanDashboard() {
  const [loader, setLoader] = useState(true)
  useEffect(() => {
    setLoader(false)
  }, [])
  return (
    <>
      {(!loader) ? <>
        <div className="row">
          {(checkPermission('OVERDUE_AMOUNT', 'can_read') || checkPermission('NEW_USER', 'can_read')) && (
            <div className="col-lg-6 col-xxl-4">
              {(checkPermission('OVERDUE_AMOUNT', 'can_read')) && (
                <OverdueAmount
                  className="card-stretch card-stretch-half gutter-b"
                  symbolShape="circle"
                  baseColor="success"
                />
              )}
              {checkPermission('NEW_USER', 'can_read') && (
                <StatsWidget12 className="card-stretch card-stretch-half gutter-b" />
              )}
            </div>
          )}
          {checkPermission('CUSTOMER_DASHBOARD', 'can_read') && (
            <div className="col-lg-6 col-xxl-4 order-1 order-xxl-1">
              <CustomerType
                className="card-stretch gutter-b"
                id="customer_type_widget"
                title={"Customer"}
              />
            </div>
          )}
          {checkPermission('COMING_AND_CONTRACT', 'can_read') && (
            <div className="col-lg-6 col-xxl-4 order-1 order-xxl-1">
              <ContractEnd className="card-stretch gutter-b" />
            </div>
          )}
        </div>

        <div className="row">
          {checkPermission('SALES_BUSINESS', 'can_read') && (
            <div className="col-4 gutter-b">
              <SalesBusiness />
            </div>
          )}
          {checkPermission('FUTURE_JOB_ORDER_QUANTITY', 'can_read') && (
            <div className="col-4 gutter-b">
              <FutureJob />
            </div>
          )}
          {checkPermission('ITEMS_SALES_STAT', 'can_read') && (
            <div className="col-4 gutter-b">
              <ItemSales id="sales_item_widget" title={"Items Sales Stat"} />
            </div>
          )}
        </div>

        {checkPermission('SALES_PERFORMANCE_STATS', 'can_read') && (
          <div className="row">
            <div className="col-12 gutter-b">
              <SalesPerformanceStat />
            </div>
          </div>
        )}

        <div className="row">
          {checkPermission('CREATE_JOB_REMINDER', 'can_read') && (
            <div className="col-4 gutter-b">
              <JobReminder />
            </div>
          )}
          {checkPermission('UPLOAD_DOCUMENT_REMINDER', 'can_read') && (
            <div className="col-4 gutter-b">
              <UploadDocumentReminder />
            </div>
          )}
          {checkPermission('BUSINESS_SOURCE', 'can_read') && (
            <div className="col-4 gutter-b">
              <BusinessSource />
            </div>
          )}
        </div> </> : ''}
    </>
  );
}
import React, { Suspense } from "react";
import { Switch } from "react-router-dom";
import { ContractInvoice } from "./ContractInvoice";
import { QuotationInvoice } from "./QuotationInvoice";
import { NewCustomer } from "./NewCustomer";
import { SalesBusiness } from "./SalesBusiness";
import { ItemsSalesStat } from "./ItemsSalesStat";
import { ComingEndContract } from "./ComingEndContract";
import { OverdueAmount } from "./Overdue";
import { FutureJobOrder } from "./FutureJobOrder";
import { SalesPerformance } from "./SalesPerformance";
import { PendingInvoice } from "./PendingInvoice";
import { ClientRejected } from "./ClientRejected";
import { TerminatedContract } from "./TerminatedContract";
import { Customer } from "./Customer";
import { UploadDocument } from "./UploadDocument";
import { ServiceItem } from "./ServiceItem"
import { UnfinishedJob } from "./UnfinishedJob";
import { CustomerReferrals } from "./CustomerReferrals";
import { BusinessSource } from "./BusinessSource";
import { SalesInvoice } from "./SalesInvoice";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";

export default function eCommercePage() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <ContentRoute
          path="/reports/contract-invoice"
          component={ContractInvoice}
        />
        <ContentRoute
          path="/reports/quotation-invoice"
          component={QuotationInvoice}
        />
        <ContentRoute path="/reports/new-customer" component={NewCustomer} />
        <ContentRoute
          path="/reports/sales-business"
          component={SalesBusiness}
        />
        <ContentRoute
          path="/reports/items-sales-stat"
          component={ItemsSalesStat}
        />
        <ContentRoute
          path="/reports/contract-end"
          component={ComingEndContract}
        />
        <ContentRoute
          path="/reports/overdue-amount"
          component={OverdueAmount}
        />
        <ContentRoute
          path="/reports/future-job-order"
          component={FutureJobOrder}
        />
        <ContentRoute
          path="/reports/pending-invoice"
          component={PendingInvoice}
        />
        <ContentRoute
          path="/reports/sales-performance"
          component={SalesPerformance}
        />
        <ContentRoute
          path="/reports/client-rejected"
          component={ClientRejected}
        />
        <ContentRoute
          path="/reports/terminated-contract"
          component={TerminatedContract}
        />
        <ContentRoute path="/reports/customer-report" component={Customer} />
        <ContentRoute
          path="/reports/upload-document-report"
          component={UploadDocument}
        />
        <ContentRoute
          path="/reports/service-item-report"
          component={ServiceItem}
        />
        <ContentRoute
          path="/reports/unfinished-job-report"
          component={UnfinishedJob}
        />
        <ContentRoute
          path="/reports/customer-referrals-report"
          component={CustomerReferrals}
        />
        <ContentRoute
          path="/reports/business-source-report"
          component={BusinessSource}
        />
        <ContentRoute
          path="/reports/sales-invoice-report"
          component={SalesInvoice}
        />
      </Switch>
    </Suspense>
  );
}

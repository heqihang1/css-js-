import React, { Suspense } from "react";
import { Switch } from "react-router-dom";
import { ProductsPage } from "./ProductsPage";
import { ProductEditForm } from "./product-edit/ProductEditForm";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { Details } from "../../invoices/pages/Details";
import { ProductsCard } from "./ProductsCard";
export default function eCommercePage() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <ContentRoute path="/invoices/new" component={ProductEditForm} />
        <ContentRoute path="/invoices/all" component={ProductsPage} />
        {/* <ContentRoute path="/invoices/:id/clone" component={ProductEdit} /> */}
        <ContentRoute path="/invoices/:id/edit" component={ProductEditForm} />
        <ContentRoute path="/invoices/:id/clone" component={ProductEditForm} />
        <ContentRoute path="/invoices/rejects" component={ProductsCard} />
        <ContentRoute path="/invoices/:id/details" component={Details} />
        <ContentRoute
          path="/invoices/pending-approval"
          component={ProductsCard}
        />
        <ContentRoute path="/invoices/paid-list" component={ProductsCard} />
        <ContentRoute
          path="/invoices/payments-pending"
          component={ProductsCard}
        />
        <ContentRoute path="/invoices" component={ProductsPage} />
      </Switch>
    </Suspense>
  );
}

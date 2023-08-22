import React, { Suspense } from "react";
import { Switch } from "react-router-dom";
import { ProductsPage } from "./ProductsPage";
// import { QoutesWaitingForClientConfirmation } from "./QuotesWaitingForClientConfirmation";
import { ProductEdit } from "./product-edit/ProductEdit";
import { Details } from "./Details";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { ProductsCard } from "./ProductsCard";

export default function Quotes() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <ContentRoute path="/quotes/new" component={ProductEdit} />
        <ContentRoute path="/quotes/:id/edit" component={ProductEdit} />
        <ContentRoute path="/quotes/:id/clone" component={ProductEdit} />
        <ContentRoute path="/quotes/:id/details" component={Details} />
        <ContentRoute path="/quotes/rejects" component={ProductsCard} />
        <ContentRoute path="/quotes/client-reject" component={ProductsCard} />
        <ContentRoute
          path="/quotes/pending-approval"
          component={ProductsCard}
        />
        <ContentRoute path="/quotes/on-confirm" component={ProductsCard} />
        {/* <ContentRoute path="/quotes/on-confirm" component={QoutesWaitingForClientConfirmation} /> */}
        <ContentRoute path="/quotes/all" component={ProductsPage} />
        <ContentRoute path="/quotes" exact component={ProductsPage} />
        <ContentRoute path="/quotes/confirmed" component={ProductsCard} />
        <ContentRoute path="/quotes/job" component={ProductsPage} />
        <ContentRoute path="/quotes/special-pending" component={ProductsPage} />
      </Switch>
    </Suspense>
  );
}

import React, { Suspense } from "react";
import { Switch } from "react-router-dom";
import { ProductsPage } from "./ProductsPage";
import { ProductEdit } from "./product-edit/ProductEdit";
import {Details } from "./Details";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";

export default function Customers() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <ContentRoute path="/customers/new" component={ProductEdit} />
        <ContentRoute path="/customers/:id/details" component={Details} />
        <ContentRoute
          path="/customers/:id/edit"
          component={ProductEdit}
        />

        <ContentRoute path="/customers" component={ProductsPage} />
      </Switch>
    </Suspense>
  );
}

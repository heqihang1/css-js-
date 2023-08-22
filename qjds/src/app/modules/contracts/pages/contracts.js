import React, { Suspense } from "react";
import { Switch } from "react-router-dom";
import { ProductsPage } from "./ProductsPage";
import { ProductEdit } from "./product-edit/ProductEdit";
import { Details } from "./Details";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { ProductsCard } from "../../Admin/pages/users/ProductsCard";

export default function Contracts() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <ContentRoute path="/contracts/new" component={ProductEdit} />
        <ContentRoute path="/contracts/old-new" component={ProductEdit} />
        <ContentRoute path="/contracts/:id/clone" component={ProductEdit} />
        <ContentRoute path="/contracts/:id/details" component={Details} />
        <ContentRoute path="/contracts/:id/edit" component={ProductEdit} />
        <ContentRoute path="/contracts/rejects" component={ProductsPage} />
        <ContentRoute path="/contracts/client-reject" component={ProductsPage} />
        <ContentRoute
          path="/contracts/pending-approval"
          component={ProductsPage}
        />
        <ContentRoute path="/contracts/on-confirm" component={ProductsPage} />
        <ContentRoute path="/contracts/all" component={ProductsPage} />
        {/* 合约待确认页面 -- 注意：子路径必须在/contracts根路径前面 */}
        <ContentRoute path="/contracts/:id/to-be-confirm/:flag" component={ProductEdit} />
        <ContentRoute path="/contracts" component={ProductsPage} />
        <ContentRoute path="/contracts/confirmed" component={ProductsPage} />
        <ContentRoute path="/contracts/job" component={ProductsPage} />
        <ContentRoute path="/contracts/terminated" component={ProductsPage} />
        <ContentRoute path="/contracts/special-pending" component={ProductsPage} />
      </Switch>
    </Suspense>
  );
}

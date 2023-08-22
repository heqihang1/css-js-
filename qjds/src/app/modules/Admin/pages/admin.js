import React, { Suspense } from "react";
import { Switch } from "react-router-dom";
import { ProductsPage as UsersPage } from "./users/ProductsPage";
import { ProductsPage as RolesPage } from "./roles/ProductsPage";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { ProductEdit as UserEdit } from "./users/product-edit/ProductEdit";
import { ProductEdit as RoleEdit } from "./roles/product-edit/ProductEdit";

export default function Admin() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <ContentRoute path="/admin/users/new" component={UserEdit} />
        <ContentRoute path="/admin/roles/new" component={RoleEdit} />
        <ContentRoute path="/admin/users/:id/edit" component={UserEdit} />
        <ContentRoute path="/admin/roles/:id/edit" component={RoleEdit} />
        <ContentRoute path="/admin/users" component={UsersPage} />
        <ContentRoute path="/admin/roles" component={RolesPage} />
      </Switch>
    </Suspense>
  );
}

import React, {useState} from "react";
import { Route } from "react-router-dom";
import { ProductsLoadingDialog } from "./products-loading-dialog/ProductsLoadingDialog";
import { ProductDeleteDialog } from "./product-delete-dialog/ProductDeleteDialog";
import { ProductsDeleteDialog } from "./products-delete-dialog/ProductsDeleteDialog";
import { ProductsFetchDialog } from "./products-fetch-dialog/ProductsFetchDialog";
import { ProductsUpdateStatusDialog } from "./products-update-status-dialog/ProductsUpdateStatusDialog";
import { ProductsCard } from "./ProductsCard";

export function ProductsPage({ history }) {
  const [refreshPage, setRefreshPage] = useState(false)
  return (
    <>
      <ProductsLoadingDialog />
      <Route path="/sets/terms-and-conditions/deleteProducts">
        {({ history, match }) => (
          <ProductsDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/sets/terms-and-conditions");
            }}
          />
        )}
      </Route>
      <Route path="/sets/terms-and-conditions/:id/delete">
        {({ history, match }) => (
          <ProductDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/sets/terms-and-conditions");
              setRefreshPage(new Date())
            }}
          />
        )}
      </Route>
      <Route path="/sets/terms-and-conditions/fetch">
        {({ history, match }) => (
          <ProductsFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/sets/terms-and-conditions");
            }}
          />
        )}
      </Route>
      <Route path="/sets/terms-and-conditions/updateStatus">
        {({ history, match }) => (
          <ProductsUpdateStatusDialog
            show={match != null}
            onHide={() => {
              history.push("/sets/terms-and-conditions");
            }}
          />
        )}
      </Route>
      <ProductsCard refreshPage={refreshPage} />
    </>
  );
}

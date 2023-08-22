import React, {useState} from "react";
import { Route } from "react-router-dom";
import { ProductsLoadingDialog } from "./products-loading-dialog/ProductsLoadingDialog";
import { ProductDeleteDialog } from "./product-delete-dialog/ProductDeleteDialog";
import { ProductActivateDialog } from "./product-activate-dialog/ProductActivateDialog";
import { ProductsDeleteDialog } from "./products-delete-dialog/ProductsDeleteDialog";
import { ProductsFetchDialog } from "./products-fetch-dialog/ProductsFetchDialog";
import { ProductsUpdateStatusDialog } from "./products-update-status-dialog/ProductsUpdateStatusDialog";
import { ProductsCard } from "./ProductsCard";

export function ProductsPage({ history }) {
  const [refreshPage, setRefreshPage] = useState(false)
  return (
    <>
      <ProductsLoadingDialog />
      <Route path="/sets/reject-reason/deleteProducts">
        {({ history, match }) => (
          <ProductsDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/sets/reject-reason");
            }}
          />
        )}
      </Route>
      <Route path="/sets/reject-reason/:id/delete">
        {({ history, match }) => (
          <ProductDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/sets/reject-reason");
              setRefreshPage(new Date())
            }}
          />
        )}
      </Route>
      <Route path="/sets/reject-reason/:id/approve">
        {({ history, match }) => (
          <ProductActivateDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/sets/reject-reason");
              setRefreshPage(new Date())
            }}
          />
        )}
      </Route>
      <Route path="/sets/reject-reason/fetch">
        {({ history, match }) => (
          <ProductsFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/sets/reject-reason");
            }}
          />
        )}
      </Route>
      <Route path="/sets/reject-reason/updateStatus">
        {({ history, match }) => (
          <ProductsUpdateStatusDialog
            show={match != null}
            onHide={() => {
              history.push("/sets/reject-reason");
            }}
          />
        )}
      </Route>
      <ProductsCard refreshPage={refreshPage} />
    </>
  );
}

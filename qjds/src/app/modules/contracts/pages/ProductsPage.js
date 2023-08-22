import React from "react";
import { Route } from "react-router-dom";
import { ProductsLoadingDialog } from "./products-loading-dialog/ProductsLoadingDialog";
import { ReUseModal } from "./ReUseModal";
import { ProductsFetchDialog } from "./products-fetch-dialog/ProductsFetchDialog";
import { ProductsUpdateStatusDialog } from "./products-update-status-dialog/ProductsUpdateStatusDialog";
import { ProductsCard } from "./ProductsCard";
import { ProductDeleteDialog } from "./product-delete-dialog/ProductDeleteDialog";

export function ProductsPage({ history }) {
  return (
    <>
      <ProductsLoadingDialog />
      {/* <Route path="/contracts/:id/delete">
        {({ history, match }) => (
          <ProductDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              window.history.back();
            }}
            deleteSuccess={() => {
              history.push("/contracts/all");
            }}
          />
        )}
      </Route> */}
      <Route path="/contracts/:id/re-use">
        {({ history, match }) => (
          <ReUseModal
            show={match != null}
            contractReuseId={match && match.params.id}
            hideReuseContract={() => {
              history.push("/contracts/all");
            }}
          />
        )}
      </Route>
      {/* <Route path="/contracts/fetch">
        {({ history, match }) => (
          <ProductsFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/contracts/all");
            }}
          />
        )}
      </Route>
      <Route path="/contracts/updateStatus">
        {({ history, match }) => (
          <ProductsUpdateStatusDialog
            show={match != null}
            onHide={() => {
              history.push("/contracts/all");
            }}
          />
        )}
      </Route> */}
      <ProductsCard />
    </>
  );
}

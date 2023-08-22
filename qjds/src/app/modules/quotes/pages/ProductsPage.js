import React from "react";
import { Route } from "react-router-dom";
import { ProductsLoadingDialog } from "./products-loading-dialog/ProductsLoadingDialog";
import { ReUseModal } from "./ReUseModal";
import { ProductsFetchDialog } from "./products-fetch-dialog/ProductsFetchDialog";
import { ProductsUpdateStatusDialog } from "./products-update-status-dialog/ProductsUpdateStatusDialog";
import { ProductsCard } from "./ProductsCard";
// import { ConfirmModal } from "./ConfirmModal";

export function ProductsPage({ history }) {
  return (
    <>
      <ProductsLoadingDialog />
      {/* <Route path="/quotes/deleteProducts" exact>
        {({ history, match }) => {
          return (
            <ReUseModal
              show={match != null}
              onHide={() => {
                history.push("/quotes/all");
              }}
            />
          );
        }}
      </Route> */}
      {/* <Route path="/quotes/:id/re-use" exact>
        {({ history, match }) => (
          <ReUseModal
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/quotes/all");
            }}
          />
        )}
      </Route> */}
      {/* <Route path="/quotes/on-confirm/:id/confirm">
        {({ history, match }) => (
          <ConfirmModal
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/quotes/all");
            }}
          />
        )}
      </Route> */}
      {/* <Route path="/quotes/fetch" exact>
        {({ history, match }) => (
          <ProductsFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/quotes/all");
            }}
          />
        )}
      </Route>
      <Route path="/quotes/updateStatus" exact>
        {({ history, match }) => (
          <ProductsUpdateStatusDialog
            show={match != null}
            onHide={() => {
              history.push("/quotes/all");
            }}
          />
        )}
      </Route> */}
      <ProductsCard />
    </>
  );
}

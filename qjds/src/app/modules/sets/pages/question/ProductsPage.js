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
      <Route path="/sets/question/deleteProducts">
        {({ history, match }) => (
          <ProductsDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/sets/question");
            }}
          />
        )}
      </Route>
      <Route path="/sets/question/:id/delete">
        {({ history, match }) => (
          <ProductDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/sets/question");
              setRefreshPage(new Date())
            }}
          />
        )}
      </Route>
      <Route path="/sets/question/:id/approve">
        {({ history, match }) => (
          <ProductActivateDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/sets/question");
              setRefreshPage(new Date())
            }}
          />
        )}
      </Route>
      <Route path="/sets/question/fetch">
        {({ history, match }) => (
          <ProductsFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/sets/question");
            }}
          />
        )}
      </Route>
      <Route path="/sets/question/updateStatus">
        {({ history, match }) => (
          <ProductsUpdateStatusDialog
            show={match != null}
            onHide={() => {
              history.push("/sets/question");
            }}
          />
        )}
      </Route>
      <ProductsCard refreshPage={refreshPage} />
    </>
  );
}

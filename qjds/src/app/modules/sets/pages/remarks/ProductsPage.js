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
      <Route path="/sets/remarks/deleteProducts">
        {({ history, match }) => (
          <ProductsDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/sets/remarks");
            }}
          />
        )}
      </Route>
      <Route path="/sets/remarks/:id/delete">
        {({ history, match }) => (
          <ProductDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/sets/remarks");
              setRefreshPage(new Date())
            }}
          />
        )}
      </Route>
      <Route path="/sets/remarks/fetch">
        {({ history, match }) => (
          <ProductsFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/sets/remarks");
            }}
          />
        )}
      </Route>
      <Route path="/sets/remarks/updateStatus">
        {({ history, match }) => (
          <ProductsUpdateStatusDialog
            show={match != null}
            onHide={() => {
              history.push("/sets/remarks");
            }}
          />
        )}
      </Route>
      <ProductsCard refreshPage={refreshPage} />
    </>
  );
}

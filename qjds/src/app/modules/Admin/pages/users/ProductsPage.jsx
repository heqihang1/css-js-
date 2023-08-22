import React, {useState} from "react";
import { Route } from "react-router-dom";
import { ProductDeleteDialog } from "./product-delete-dialog/ProductDeleteDialog";
import { ProductActivateDialog } from "./ProductActivatedDialog";
import { ProductsLoadingDialog } from "./products-loading-dialog/ProductsLoadingDialog";
import { ProductsCard } from "./ProductsCard";

export function ProductsPage({ history }) {
  const [refreshPage, setRefreshPage] = useState(false)
  return (
    <>
      <ProductsLoadingDialog />
      <Route path="/admin/users/:id/delete">
        {({ history, match }) => (
          <ProductDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/admin/users");
              setRefreshPage(new Date())
            }}
          />
        )}
      </Route>
      <Route path="/admin/users/:id/activate">
        {({ history, match }) => (
          <ProductActivateDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/admin/users");
              setRefreshPage(new Date())
            }}
          />
        )}
      </Route>
      <ProductsCard refreshPage={refreshPage} />
    </>
  );
}

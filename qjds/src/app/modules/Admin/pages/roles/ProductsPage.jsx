import React from "react";
import { ProductsLoadingDialog } from "./products-loading-dialog/ProductsLoadingDialog";
import { ProductsCard } from "./ProductsCard";

export function ProductsPage() {
  return (
    <>
      <ProductsLoadingDialog />
      <ProductsCard />
    </>
  );
}

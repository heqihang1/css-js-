/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { shallowEqual, useSelector } from "react-redux";
import * as actions from "../_redux/customers/customersActions";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../_metronic/_partials/controls";
import { ProductEditForm } from "./product-edit/ProductEditForm";
import { useSubheader } from "../../../../_metronic/layout";
import { ModalProgressBar } from "../../../../_metronic/_partials/controls";
import PlacesTable from "./tables/Places";
import ContactsTable from "./tables/Contacts";
import QuotesTable from "./tables/Qoutes";
import ContractsTable from "./tables/Contracts";

const initProduct = {
  customer: {
    customer_type: "",
    customer_name: "",
    email: "",
    office_number: "",
    fax_number: "",
    mobile_number: "",
    customer_officer: "",
  },
  location: [
    {
      location_address: "",
      location_name: "",
    },
  ],
  contact: [
    {
      email: "",
      contact_name: "",
      contact_address: "",
      contact_position: "",
      office_number: "",
      mobile_number: "",
      fax_number: "",
    },
  ],
};

export function Details({
  history,
  match: {
    params: { id },
  },
}) {
  // Subheader
  const suhbeader = useSubheader();
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const { actionsLoading, productForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.customers.actionsLoading,
      productForEdit: state.customers.customerForEdit,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(actions.fetchCustomer(id));
  }, [id, dispatch]);
  console.log("customer_id 0", id);
  useEffect(() => {
    let _title = "Customer details";

    setTitle(_title);
    suhbeader.setTitle(_title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productForEdit, id]);

  const btnRef = useRef();
  // const saveProductClick = () => {
  //   if (btnRef && btnRef.current) {
  //     btnRef.current.click();
  //   }
  // };

  const backToProductsList = () => {
    history.push(`/customers`);
  };

  return (
    <>
      <Card>
        {actionsLoading && <ModalProgressBar />}
        <CardHeader title={title}>
          <CardHeaderToolbar>
            <button
              type="button"
              onClick={backToProductsList}
              className="btn btn-light"
            >
              <i className="fa fa-arrow-left"></i>
              Back
            </button>
            {/* {`  `}
            <button className="btn btn-light ml-2">
              <i className="fa fa-redo"></i>
              Reset
            </button>
            {`  `}
            <button
              type="submit"
              className="btn btn-primary ml-2"
              onClick={saveProductClick}
            >
              Save
            </button> */}
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <div className="mt-5">
            <ProductEditForm
              actionsLoading={actionsLoading}
              product={productForEdit || initProduct}
              btnRef={btnRef}
              disabled={true}
              // customer_id={id}
            />
          </div>
        </CardBody>
      </Card>
      <PlacesTable />
      <ContactsTable customer_id={id} />
      <QuotesTable />
      <ContractsTable />
    </>
  );
}

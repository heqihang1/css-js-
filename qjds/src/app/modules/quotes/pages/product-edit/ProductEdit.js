/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { shallowEqual, useSelector } from "react-redux";
import * as actions from "../../_redux/quotes/quotesActions";
import * as customersActions from "../../../customers/_redux/customers/customersActions";
import * as userActions from "../../../Admin/_redux/users/usersActions";
// sets actions
import * as remarkActions from "../../../sets/_redux/remarks/remarksActions";
import * as serviceActions from "../../../sets/_redux/services/servicesActions";
import * as paymentActions from "../../../sets/_redux/payment-items/paymentMethodActions";
import { ProductEditForm } from "./ProductEditForm";
import SuccessErrorAlert from "../../../../components/SuccessErrorAlert";
import { useLocation } from "react-router-dom";

const initProduct = {};

export function ProductEdit({
  history,
  match: {
    params: { id },
  },
}) {
  const [loader, setLoader] = useState(false);
  const [searchCustomer, serSearchCustomer] = useState("");
  const location = useLocation();
  const isClonePage = Boolean(window.location.pathname.includes("clone"));

  const dispatch = useDispatch();
  const params = new URLSearchParams(location.search);

  // const layoutDispatch = useContext(LayoutContext.Dispatch);
  const {
    actionsLoading,
    productForEdit,
    customers,
    paymentMethods,
    remarks,
    services,
    users,
  } = useSelector(
    (state) => ({
      actionsLoading: state.quotations.actionsLoading,
      productForEdit: state.quotations.quotationForEdit,
      customers: state.customers.entities,
      paymentMethods: state.paymentMethods.entities,
      remarks: state.remarks.entities,
      services: state.services.entities,
      users: state.users.entities,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(actions.fetchquotation(id));
    dispatch(userActions.findusers({ pageSize: 1000 }));
    dispatch(paymentActions.findpaymentMethods({ pageSize: 1000, excludeFields: true }));
    dispatch(remarkActions.fetchRemarks({ pageSize: 1000 }));
    dispatch(serviceActions.fetchservices({ pageSize: 100000 }));
  }, [id, dispatch]);

  useEffect(() => {
    //if (searchCustomer !== "") {
      dispatch(
        customersActions.findCustomers({
          filter: {},
          sortOrder: "desc",
          sortField: "createdAt",
          search: searchCustomer,
          pageNumber: 1,
          pageSize: 100,
          customer_id: productForEdit?.customer_id?._id
        })
      );
    //}
    // eslint-disable-next-line
  }, [searchCustomer]);

  useEffect(() => {
    if (productForEdit?.customer_id?.customer_name) {
      dispatch(
        customersActions.findCustomers({
          pageSize: 100,
          search: productForEdit?.customer_id?.customer_name,
          customer_id: productForEdit?.customer_id?._id
        })
      );
    }
    // eslint-disable-next-line
  }, [productForEdit]);

  const saveProduct = (values) => {
    if (isClonePage) {
      setLoader(true);
      dispatch(actions.createquotation({ ...values, id })).then(
        (res) => {
          setisSuccess({
            success: 2,
            message: "Quotation created successfully",
          });
          setTimeout(() => {
            setisSuccess({ success: 0, message: "" });
            backToProductsList();
            setLoader(false);
          }, 3000);
        },
        (err) => {
          setLoader(false);
          let myerr = err.response.data.message;
          console.log(myerr.response);
          setisSuccess({
            success: 1,
            message: myerr || "An unknown error occured",
          });
          setTimeout(() => {
            setisSuccess({ success: 0, message: "" });
          }, 5000);
        }
      );
    } else if (!isClonePage && !id) {
      setLoader(true);
      dispatch(actions.createquotation(values)).then(
        (res) => {
          setisSuccess({
            success: 2,
            message: "Quotation created successfully",
          });
          setTimeout(() => {
            setisSuccess({ success: 0, message: "" });
            backToProductsList();
            setLoader(false);
          }, 3000);
        },
        (err) => {
          setLoader(false);
          let myerr = err.response.data.message;
          console.log(myerr.response);
          setisSuccess({
            success: 1,
            message: myerr || "An unknown error occured",
          });
          setTimeout(() => {
            setisSuccess({ success: 0, message: "" });
          }, 5000);
        }
      );
    } else {
      setLoader(true);
      dispatch(actions.updatequotation({ ...values, id })).then(
        (res) => {
          setisSuccess({
            success: 2,
            message: "Quote updated successfully",
          });
          setTimeout(() => {
            setisSuccess({ success: 0, message: "" });
            history.push(`/quotes/${id}/details`);
            setLoader(false);
          }, 3000);
        },
        (err) => {
          setLoader(false);
          let myerr = err.response.data.message;
          console.log(myerr.response);
          setisSuccess({
            success: 1,
            message: myerr || "An unknow error occured",
          });
          setTimeout(() => {
            setisSuccess({ success: 0, message: "" });
          }, 5000);
        }
      );
    }
  };

  const backToProductsList = () => {
    history.push(`/quotes`);
  };
  const [isSuccess, setisSuccess] = useState({ success: 0, message: "" });

  return (
    <>
      {isSuccess.success !== 0 && (
        <SuccessErrorAlert isSuccess={isSuccess} setisSuccess={setisSuccess} />
      )}
      <ProductEditForm
        actionsLoading={actionsLoading}
        product={id ? productForEdit || initProduct : initProduct}
        saveProduct={saveProduct}
        customers={customers}
        serSearchCustomer={serSearchCustomer}
        users={users}
        loader={loader}
        paymentMethods={paymentMethods}
        remarks={remarks}
        services={services?.filter((x) => x.status === true)}
        location={location}
        productForEdit={productForEdit}
      />
    </>
  );
}

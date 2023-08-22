/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { shallowEqual, useSelector } from "react-redux";
import * as actions from "../../_redux/contracts/contractsActions";
import * as customersActions from "../../../customers/_redux/customers/customersActions";
import * as userActions from "../../../Admin/_redux/users/usersActions";
// sets actions
import * as remarkActions from "../../../sets/_redux/remarks/remarksActions";
import * as serviceActions from "../../../sets/_redux/services/servicesActions";
import * as paymentActions from "../../../sets/_redux/payment-items/paymentMethodActions";
import * as teamActions from "../../../sets/_redux/teams/teamsActions";
import { ProductEditForm } from "./ProductEditForm";
import { ToBeConfirm } from "./ToBeConfirm";
import SuccessErrorAlert from "../../../../components/SuccessErrorAlert";
import { useSubheader } from "../../../../../_metronic/layout";
import { useIntl } from "react-intl";

const initProduct = {};

export function ProductEdit({
  history,
  match: {
    params: { id, flag },
  },
}) {
  const intl = useIntl();
  const [searchCustomer, serSearchCustomer] = useState("");
  const dispatch = useDispatch();
  // const layoutDispatch = useContext(LayoutContext.Dispatch);
  const {
    actionsLoading,
    productForEdit,
    customers,
    paymentMethods,
    remarks,
    services,
    users,
    teams,
  } = useSelector(
    (state) => ({
      actionsLoading: state.contracts.actionsLoading,
      productForEdit: state.contracts.contractForEdit,
      customers: state.customers.entities,
      paymentMethods: state.paymentMethods.entities,
      remarks: state.remarks.entities,
      services: state.services.entities,
      users: state.users.entities,
      teams: state.teams.entities
    }),
    shallowEqual
  );

  const suhbeader = useSubheader();
  const [loader, setLoader] = useState(false);
  const isClonePage = Boolean(window.location.pathname.includes("clone"));

  // Tabs
  const [title, setTitle] = useState("");

  useEffect(() => {
    let _title = id ? "" : intl.formatMessage({ id: "CONTRACTS.NEW_CONTRACT" });
    if (productForEdit && id) {
      _title = isClonePage
        ? `${intl.formatMessage({ id: "CONTRACTS.COPY_CONTRACT" })} '${productForEdit.contract_no
        }'`
        : `${intl.formatMessage({ id: "CONTRACTS.EDIT_CONTRACT" })} '${productForEdit.contract_no
        }'`;
    }
    setTitle(_title);
    suhbeader.setTitle(_title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productForEdit, id]);

  useEffect(() => {
    dispatch(actions.fetchcontract(id));
    dispatch(userActions.findusers({ pageSize: 1000 }));
    dispatch(paymentActions.findpaymentMethods({ pageSize: 1000, excludeFields: true }));
    dispatch(remarkActions.fetchRemarks({ pageSize: 1000 }));
    dispatch(serviceActions.fetchservices({ pageSize: 1000 }));
    dispatch(teamActions.fetchTeams(id));
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
      dispatch(actions.createcontract({ ...values, id })).then(
        (res) => {
          setisSuccess({
            success: 2,
            message: intl.formatMessage({
              id: "CONTRACTS.CREATED_SUCCESSFULLY",
            }),
          });
          setTimeout(() => {
            setisSuccess({ success: 0, message: "" });
            backToProductsList();
            setLoader(false);
          }, 3000);
        },
        (err) => {
          let myerr = err.response.data.message;
          setLoader(false);
          setisSuccess({
            success: 1,
            message:
              myerr ||
              intl.formatMessage({
                id: "UNKNOWN_ERROR_OCCURED",
              }),
          });
          setTimeout(() => {
            setisSuccess({ success: 0, message: "" });
          }, 5000);
        }
      );
    } else if (!isClonePage && !id) {
      setLoader(true);
      dispatch(actions.createcontract(values)).then(
        (res) => {
          setisSuccess({
            success: 2,
            message: intl.formatMessage({
              id: "CONTRACTS.CREATED_SUCCESSFULLY",
            }),
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
          setisSuccess({
            success: 1,
            message:
              myerr ||
              intl.formatMessage({
                id: "UNKNOWN_ERROR_OCCURED",
              }),
          });
          setTimeout(() => {
            setisSuccess({ success: 0, message: "" });
          }, 5000);
        }
      );
    } else {
      setLoader(true);
      dispatch(actions.updatecontract({ ...values, id })).then(
        (res) => {
          setisSuccess({
            success: 2,
            message: intl.formatMessage({
              id: "CONTRACTS.UPDATED_SUCCESSFULLY",
            }),
          });
          setTimeout(() => {
            setisSuccess({ success: 0, message: "" });
            history.push(`/contracts/${id}/details`);
            setLoader(false);
          }, 3000);
        },
        (err) => {
          let myerr = err.response.data.message;
          setLoader(false);
          setisSuccess({
            success: 1,
            message:
              myerr ||
              intl.formatMessage({
                id: "UNKNOWN_ERROR_OCCURED",
              }),
          });
          setTimeout(() => {
            setisSuccess({ success: 0, message: "" });
          }, 5000);
        }
      );
    }
  };

  const backToProductsList = () => {
    history.push(`/contracts`);
  };
  const [isSuccess, setisSuccess] = useState({ success: 0, message: "" });

  return (
    <>
      {flag ? (
        <ToBeConfirm
          actionsLoading={actionsLoading}
          product={productForEdit}
          teams={teams}
        />
      ) : (
        <>
          {isSuccess.success !== 0 && (
            <SuccessErrorAlert isSuccess={isSuccess} setisSuccess={setisSuccess} />
          )}
          <ProductEditForm
            actionsLoading={actionsLoading}
            product={id ? productForEdit || initProduct : initProduct}
            saveProduct={saveProduct}
            loader={loader}
            customers={customers}
            serSearchCustomer={serSearchCustomer}
            users={users}
            paymentMethods={paymentMethods}
            remarks={remarks}
            services={services?.filter((x) => x.status === true)}
          />
        </>
      )}
    </>
  );
}

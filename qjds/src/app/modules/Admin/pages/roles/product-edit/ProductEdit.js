/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { shallowEqual, useSelector } from "react-redux";
import * as actions from "../../../_redux/roles/rolesActions";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { ProductEditForm } from "./ProductEditForm";
import { useSubheader } from "../../../../../../_metronic/layout";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import SuccessErrorAlert from "../../../../../components/SuccessErrorAlert";
import { fetchRights } from "../../../../../../redux/userRoleRightsSlice";

const initProduct = {
  rolename: "",
};

export function ProductEdit({ history, match: { params: { id } } }) {
  // Subheader
  const suhbeader = useSubheader();
  const dispatch = useDispatch();

  const [loader, setLoader] = useState(false);
  const [title, setTitle] = useState("");
  const [isSuccess, setisSuccess] = useState({ success: 0, message: "This" });

  const {
    user: { role },
    actionsLoading,
    productForEdit,
    rights,
  } = useSelector((state) => ({
      actionsLoading: state.roles.actionsLoading,
      productForEdit: state.roles.roleForEdit,
      rights: state.roleRights.rights,
      user: state.auth.user,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (id) {
      dispatch(actions.fetchrole(id));
      console.log(productForEdit);
    }
  }, [id, dispatch]);

  useEffect(() => {
    let _title = id ? "" : "New Role";
    if (productForEdit && id) {
      _title = `Edit Role (${productForEdit.rolename})`;
    }
    setTitle(_title);
    suhbeader.setTitle(_title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productForEdit, id]);

  const saveProduct = (values) => {
    if (!id) {
      setLoader(true);
      dispatch(actions.createrole(values)).then((res) => {
          setLoader(false);
          setisSuccess({
            success: 2,
            message: "Role created successfully",
          });
          setTimeout(() => {
            setisSuccess({ success: 0, message: "" });
            backToProductsList();
          }, 3000);
        },
        (err) => {
          setLoader(false);
          let myerr = err.response.data.message;
          setisSuccess({ success: 1, message: myerr });
          setTimeout(() => {
            setisSuccess({ success: 0, message: "" });
          }, 5000);
        }
      );
    } else {
      setLoader(true);
      dispatch(actions.updaterole(values)).then((res) => {
          setLoader(false);
          setisSuccess({
            success: 2,
            message: "Role updated successfully",
          });
          dispatch(fetchRights(role));
          setTimeout(() => {
            setisSuccess({ success: 0, message: "" });
            backToProductsList();
          }, 3000);
        },
        (err) => {
          setLoader(false);
          let myerr = err.response.data.message;
          setisSuccess({ success: 1, message: myerr });
          setTimeout(() => {
            setisSuccess({ success: 0, message: "" });
          }, 5000);
        }
      );
    }
  };

  useEffect(() => {
    if (rights) {
      localStorage.setItem("rights", JSON.stringify(rights));
    }
  }, [rights]);

  const btnRef = useRef();
  const saveProductClick = () => {
    if (btnRef && btnRef.current) {
      btnRef.current.click();
    }
  };
  const btnResRef = useRef();
  const resetClick = () => {
    if (btnResRef && btnResRef.current) {
      btnResRef.current.click();
    }
  };

  const backToProductsList = () => {
    history.push(`/admin/roles`);
  };

  return (
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
          <button
            type="submit"
            className="btn btn-primary ml-2"
            onClick={saveProductClick}
            disabled={loader}
          >
            Save
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        {isSuccess.success !== 0 && (
          <SuccessErrorAlert
            isSuccess={isSuccess}
            setisSuccess={setisSuccess}
          />
        )}
        <div className="mt-5">
          <ProductEditForm
            actionsLoading={actionsLoading}
            product={productForEdit || initProduct}
            btnRef={btnRef}
            btnResRef={btnResRef}
            id={id}
            saveProduct={saveProduct}
          />
        </div>
      </CardBody>
    </Card>
  );
}

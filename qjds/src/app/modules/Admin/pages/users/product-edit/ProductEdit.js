/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { shallowEqual, useSelector } from "react-redux";
import * as actions from "../../../_redux/users/usersActions";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { useSubheader } from "../../../../../../_metronic/layout";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import SuccessErrorAlert from "../../../../../components/SuccessErrorAlert";
import Registration from "./Registration";

export function ProductEdit({
  history,
  match: {
    params: { id },
  },
}) {
  // Subheader
  const suhbeader = useSubheader();

  // Tabs
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();
  // const layoutDispatch = useContext(LayoutContext.Dispatch);
  const { actionsLoading, productForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.users.actionsLoading,
      productForEdit: state.users.userForEdit,
    }),
    shallowEqual
  );

  const [isSuccess, setisSuccess] = useState({ success: 0, message: "" });
  useEffect(() => {
    dispatch(actions.fetchuser(id));
  }, [dispatch, id]);

  useEffect(() => {
    let _title = id ? "" : "New User";
    if (productForEdit && id) {
      _title = `Edit user '${productForEdit.username}'`;
    }

    setTitle(_title);
    suhbeader.setTitle(_title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productForEdit, id]);

  const btnRef = useRef();
  const resetRef = useRef();
  const resetFormClick = () => {
    if (resetRef && resetRef.current) {
      resetRef.current.click();
    }
  };
  const saveProductClick = () => {
    if (btnRef && btnRef.current) {
      btnRef.current.click();
    }
  };

  const backToProductsList = () => {
    history.push(`/admin/users`);
  };

  return (
    <div className="w-50">
      <Card>
        {actionsLoading && <ModalProgressBar />}
        <CardHeader title={title}>
        </CardHeader>
        <CardBody>
          {isSuccess.success !== 0 && (
            <SuccessErrorAlert
              isSuccess={isSuccess}
              setisSuccess={setisSuccess}
            />
          )}
          <div className="mt-5">
            <Registration
              btnRef={btnRef}
              resetRef={resetRef}
              productForEdit={productForEdit}
            />
          </div>
        </CardBody>
        <CardFooter>
          <CardHeaderToolbar>
            <button
              type="button"
              onClick={backToProductsList}
              className="btn btn-light"
            >
              <i className="fa fa-arrow-left"></i>
              Back
            </button>
            {`  `}
            <button className="btn btn-light ml-2" onClick={resetFormClick}>
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
            </button>
          </CardHeaderToolbar>
        </CardFooter>
      </Card>
    </div>
  );
}

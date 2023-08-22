/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { shallowEqual, useSelector } from "react-redux";
import * as actions from "../../_redux/customers/customersActions";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import { ProductEditForm } from "./ProductEditForm";
import { useSubheader } from "../../../../../_metronic/layout";
import { ModalProgressBar } from "../../../../../_metronic/_partials/controls";
import SuccessErrorAlert from "../../../../components/SuccessErrorAlert";
import PlacesTable from "../tables/Places";
import ContactsTable from "../tables/Contacts";
import {
  addLocation,
  editLocation,
  addContact,
  deleteLocation,
  editContact,
} from "../../_redux/customers/customersCrud";

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

export function ProductEdit({
  history,
  match: {
    params: { id },
  },
}) {
  const { user } = useSelector((state) => state.auth, shallowEqual);
  initProduct.customer.customer_officer = user?.displayname
    ? user?.displayname
    : user.username;
  // Subheader
  const suhbeader = useSubheader();

  // Tabs
  const [loader, setLoader] = useState(false);
  const [locLoader, setLocLoader] = useState(false);
  const [custLoader, setCustLoader] = useState(false);
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();
  // const layoutDispatch = useContext(LayoutContext.Dispatch);
  const { actionsLoading, productForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.customers.actionsLoading,
      productForEdit: state.customers.customerForEdit,
    }),
    shallowEqual
  );

  const [isSuccess, setisSuccess] = useState({ success: 0, message: "" });
  useEffect(() => {
    dispatch(actions.fetchCustomer(id));
  }, [dispatch, id]);

  useEffect(() => {
    let _title = id ? "" : "New customer";
    if (productForEdit && id) {
      _title = `Edit customer '${productForEdit.customer.customer_name}'`;
    }

    setTitle(_title);
    suhbeader.setTitle(_title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productForEdit, id]);

  const saveProduct = (values) => {
    if (!id) {
      setLoader(true);
      dispatch(actions.createCustomer(values)).then(
        (res) => {
          setisSuccess({
            success: 2,
            message: "Customer created successfully",
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
      dispatch(
        actions.updateCustomer({
          ...values,
          _id: id,
          loc_id: productForEdit.location[0]._id,
          cont_id: productForEdit.contact[0]._id,
        })
      ).then(
        (res) => {
          setisSuccess({
            success: 2,
            message: "Customer updated successfully",
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
    }
  };

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
    history.push(`/customers`);
  };

  const saveLoc = async (location) => {
    setLocLoader(true);
    await addLocation(location, id)
      .then((res) => {
        setLocLoader(false);
        dispatch(actions.fetchCustomer(id));
      })
      .catch((err) => {
        setLocLoader(false);
      });
  };
  const editLoc = async (location, location_id) => {
    await editLocation(location, location_id)
      .then((res) => {
        dispatch(actions.fetchCustomer(id));
        setLocLoader(false);
      })
      .catch((err) => {
        setLocLoader(false);
      });
  };
  const deleteLoc = async (location_id) => {
    await deleteLocation(location_id)
      .then((res) => {
        dispatch(actions.fetchCustomer(id));
      })
      .catch((err) => {});
  };
  const saveContact = async (contact, contact_id) => {
    setCustLoader(true);
    await addContact(contact, contact_id)
      .then((res) => {
        dispatch(actions.fetchCustomer(id));
        setCustLoader(false);
      })
      .catch((err) => {
        setCustLoader(false);
      });
  };
  const editCont = async (contact, contact_id) => {
    setCustLoader(true);
    await editContact(contact, contact_id)
      .then((res) => {
        setCustLoader(false);
        dispatch(actions.fetchCustomer(id));
      })
      .catch((err) => {
        setCustLoader(false);
      });
  };
  const [locationOptions, setLocationOptions] = useState({});

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
              resetRef={resetRef}
              saveProduct={saveProduct}
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
              disabled={loader}
            >
              Save
            </button>
          </CardHeaderToolbar>
        </CardFooter>
      </Card>
      {id && (
        <>
          <PlacesTable
            edit
            saveLoc={saveLoc}
            editLoc={editLoc}
            locLoader={locLoader}
            deleteLoc={deleteLoc}
            setLocationOptions={setLocationOptions}
          />
          <ContactsTable
            edit={id}
            customer_id={id}
            custLoader={custLoader}
            saveContact={saveContact}
            locationOptions={locationOptions}
            editCont={editCont}
          />
        </>
      )}
    </>
  );
}

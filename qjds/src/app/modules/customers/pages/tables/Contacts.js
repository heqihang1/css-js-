import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import * as uiHelpers from "../ProductsUIHelpers";
import { useDispatch } from "react-redux";
import { Table } from "../../../../components/Table";
// import * as actions from "../../_redux/customers/customersActions";
import { generateColumns } from "../../../../utils/customers/contacts/tableDeps";
import { isEqual, isFunction, isObject } from "lodash";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../../../_metronic/_partials/controls";
import Axios from "axios";
import { API_URL } from "../../../../API_URL";
import ConatctEditDelete from "./ConatctEditDelete";
import CreateContact from "./CreateContact";

export default function ContactsTable({
  edit = false,
  saveLoc = null,
  customer_id,
  custLoader,
  locationOptions,
  saveContact,
  getcontacts,
  editCont,
}) {
  const [doc, setDoc] = useState(null);
  const [type, setType] = useState("edit");
  const [show, setShow] = useState(false);

  const history = useHistory();
  const dispatch = useDispatch();

  const opneModal = (doc, type, loc) => {
    setType(type);
    setDoc(doc);
    setShow(true);
  };

  const onHide = () => {
    setShow(false);
  };
  const columns = generateColumns(history, edit, opneModal);
  const filter = () => {
    const initialFilter = {
      filter: {},
      sortOrder: "desc", // asc||desc
      sortField: "createdAt",
      pageNumber: 1,
      pageSize: 10,
    };

    return initialFilter;
  };

  const { productForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.customers.actionsLoading,
      productForEdit: state.customers.customerForEdit,
    }),
    shallowEqual
  );

  const [queryParams, setQueryParamsBase] = useState(filter());
  const setQueryParams = useCallback((nextQueryParams) => {
    setQueryParamsBase((prevQueryParams) => {
      if (isFunction(nextQueryParams)) {
        nextQueryParams = nextQueryParams(prevQueryParams);
      }

      if (isEqual(prevQueryParams, nextQueryParams)) {
        return prevQueryParams;
      }

      return nextQueryParams;
    });
  }, []);

  const [contacts, setcontacts] = useState({ totalDocs: 0, docs: [] });
  const [defaultContact, setDefaultContact] = useState({
    totalDocs: 0,
    docs: [],
  });
  function getcontacts() {
    let ids = productForEdit.contact.map((contact) => contact._id);
    Axios.get(API_URL + "customers/customer/contacts", {
      params: {
        ...queryParams,
        ids: ids.join(","),
      },
    }).then((data) => {
      setcontacts(data.data);
      setDefaultContact(data.data);
    });
  }
  useEffect(() => {
    productForEdit && getcontacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams, dispatch, productForEdit]);
  const { totalDocs, docs } = contacts;

  const paginationOptions = {
    custom: true,
    totalSize: totalDocs,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: queryParams.pageSize,
    page: queryParams.pageNumber,
  };

  const handleSearch = (searchTerm) => {
    const docs = defaultContact.docs.filter((item) => {
      console.log("item", item);
      return Object.values(item).some((val) => {
        if (isObject(val)) {
          return Object.values(val).some((item) => {
            return String(item)
              .toLowerCase()
              .includes(searchTerm);
          });
        }
        return String(val)
          .toLowerCase()
          .includes(searchTerm);
      });
    });

    const totalDocs = docs.length;

    setcontacts({ totalDocs, docs });
  };

  return (
    <>
      <Card>
        <CardHeader title="Contacts List"></CardHeader>
        <CardBody>
          <Table
            queryParams={queryParams}
            setQueryParams={setQueryParams}
            columns={columns}
            handleSearch={(query) =>
              setQueryParamsBase({ ...queryParams, search: query, pageNumber: 1 })
            }
            listLoading={false}
            entities={docs}
            paginationOptions={paginationOptions}
            defaultContact={defaultContact}
            setDefaultContact={setDefaultContact}
          />
          {edit ? (
            <CreateContact
              customer_id={customer_id}
              custLoader={custLoader}
              getcontacts={getcontacts}
              locationOptions={locationOptions}
              saveContact={saveContact}
            />
          ) : null}
        </CardBody>
      </Card>
      <ConatctEditDelete
        show={show}
        type={type}
        doc={doc}
        custLoader={custLoader}
        onHide={onHide}
        locationOptions={locationOptions}
        getcontacts={getcontacts}
        editCont={editCont}
      />
    </>
  );
}

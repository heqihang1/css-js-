import React, { useEffect, useState, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { isArray, isEqual, isFunction, isObject } from "lodash";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../_metronic/_partials/controls";
import { Table } from "../../../components/Table";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as uiHelpers from "./ProductsUIHelpers";
import * as actions from "../_redux/customers/customersActions";
import { generateColumns } from "../../../utils/customers/tableDeps";
import { searchData } from "../../../utils/utils";
import { checkPermission } from "../../../utils/utils";
// import { debounce } from '../../../../app/utils/utils'
export function ProductsCard(props) {
  const location = useLocation();
  const history = useHistory();

  const columns = generateColumns(history);
  const filter = () => {
    const initialFilter = {
      filter: {},
      sortOrder: "desc", // asc||desc
      sortField: "_id",
      search: '',
      pageNumber: 1,
      pageSize: 10,
    };

    return initialFilter;
  };

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
  const { currentState } = useSelector((state) => {
    return { currentState: state.customers };
  }, shallowEqual);
  // Products Redux state
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.findCustomersList(queryParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams, dispatch]);

  const { totalCount, entities, listLoading } = currentState;
  useEffect(() => {
    setFilterData({ entities, totalCount });
  }, [entities]);
  const [filterData, setFilterData] = useState({ entities: [], totalCount: 0 });
  // Table pagination properties
  const { totalDocs, docs } = contacts;

  const paginationOptions = {
    custom: true,
    totalSize: filterData.totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: queryParams.pageSize,
    page: queryParams.pageNumber,
  };

  useEffect(() => {
    if (props.refreshPage) {
      dispatch(actions.findCustomersList(queryParams));
    }
  }, [props.refreshPage])

  // const handleSearch = (searchTerm) => {
  //   const docs = entities.filter((item) => {
  //     return Object.values(item).some((val) =>
  //       String(val)
  //         .toLowerCase()
  //         .includes(searchTerm.toLowerCase())
  //     );
  //   });
  //   const totalCount = docs.length;
  //   setFilterData({ totalCount, entities: docs });
  // };

  return (
    <Card>
      <CardHeader title="Customers list">
        <CardHeaderToolbar>
          {checkPermission('CUSTOMER', 'can_add') && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => history.push("/customers/new")}
            >
              New Customer
            </button>
          )}
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <Table
          typeFilter={true}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          showCustomerTypeFilter={true}
          columns={columns}
          listLoading={listLoading}
          entities={filterData.entities}
          handleSearch={(query) =>
            setQueryParamsBase({ ...queryParams, search: query, pageNumber: 1 })
          }
          handleChangeCustomerType={(e) => {
            setQueryParamsBase({
              ...queryParams,
              customer_type: e?.value,
              pageNumber: 1,
            });
          }}
          paginationOptions={paginationOptions}
          defaultContact={defaultContact}
          setDefaultContact={setDefaultContact}
        />
      </CardBody>
    </Card>
  );
}

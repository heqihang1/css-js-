import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { isEqual, isFunction } from "lodash";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as uiHelpers from "../../../quotes/pages/ProductsUIHelpers";
import * as actions from "../../../quotes/_redux/quotes/quotesActions";
import { generateColumns } from "../../../../utils/customers/quotes/tableDeps";
import {
  CardHeader,
  Card,
  CardBody,
} from "../../../../../_metronic/_partials/controls";
import { Table } from "../../../../components/Table";

export default function QuotesTable() {
  const history = useHistory();
  const columns = generateColumns(history);
  const filter = () => {
    const initialFilter = {
      filter: {},
      sortOrder: "desc", // asc||desc
      sortField: "createdAt", // sortField
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

  const { currentState } = useSelector(
    (state) => ({ currentState: state.quotations }),
    shallowEqual
  );
  // Products Redux state
  const dispatch = useDispatch();
  useEffect(() => {
    productForEdit &&
      dispatch(
        actions.findcustomerquotations(queryParams, productForEdit.customer._id)
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams, dispatch, productForEdit]);
  const { totalCount, entities, listLoading } = currentState;

  // Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: queryParams.pageSize,
    page: queryParams.pageNumber,
  };

  return (
    <Card>
      <CardHeader title="Quotation" />
      <CardBody>
        <Table
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          columns={columns}
          listLoading={listLoading}
          entities={entities}
          paginationOptions={paginationOptions}
          typeFilter
        />
      </CardBody>
    </Card>
  );
}

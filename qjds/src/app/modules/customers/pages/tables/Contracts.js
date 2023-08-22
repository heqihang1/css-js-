import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import * as uiHelpers from "../ProductsUIHelpers";
import { useDispatch } from "react-redux";
import { Table } from "../../../../components/Table";
import * as actions from "../../../contracts/_redux/contracts/contractsActions";
import { generateColumns } from "../../../../utils/customers/contracts/tableDeps";
import { isEqual, isFunction } from "lodash";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../../../_metronic/_partials/controls";

export default function ContractsTable() {
  const history = useHistory();
  const columns = generateColumns(history);
  const filter = () => {
    const initialFilter = {
      filter: {},
      sortOrder: "asc", // asc||desc
      sortField: columns[0].dataField,
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

  const dispatch = useDispatch();
  const { currentState } = useSelector(
    (state) => ({ currentState: state.contracts }),
    shallowEqual
  );
  useEffect(() => {
    productForEdit &&
      dispatch(
        actions.findCustomercontracts(queryParams, productForEdit.customer._id)
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams, dispatch, productForEdit]);
  const { totalCount, entities, listLoading } = currentState;

  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: queryParams.pageSize,
    page: queryParams.pageNumber,
  };
  return (
    <Card>
      <CardHeader title="Contracts"></CardHeader>
      <CardBody>
        <Table
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          columns={columns}
          listLoading={listLoading}
          entities={entities}
          paginationOptions={paginationOptions}
        />
      </CardBody>
    </Card>
  );
}

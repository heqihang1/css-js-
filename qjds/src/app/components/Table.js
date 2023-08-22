import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
} from "../../_metronic/_helpers";
import { Pagination } from "../../_metronic/_partials/controls";
import { Filter } from "./table/Filter";

export function Table({
  queryParams,
  setQueryParams,
  columns,
  listLoading,
  entities,
  handleSearch,
  handleChangeMonth,
  handleChangeDistrict,
  handleChangeCustomerType,
  handleChangeTeamStatus,
  handleChangeDistrictStatus,
  handleChangeCommSectorStatus,
  handleChangeUserStatus,
  paginationOptions,
  typeFilter = false,
  defaultContact,
  setDefaultContact,
  hideFilter,
  showNextReminderFilter = false,
  showDistrictFilter = false,
  showCustomerTypeFilter = false,
  showTeamStatusFilter = false,
  showDistrictStatusFilter = false,
  showCommSectorStatusFilter = false,
  showUserStatusFilter = false,
  districts = []
}) {
  const defaultSorted = [{ dataField: "id", order: "asc" }];
  return (
    <>
      <div className="row flex-row-reverse">
        {!hideFilter ? (
          <div className="col-2">
            <Filter
              queryParams={queryParams}
              setQueryParams={setQueryParams}
              columns={columns}
              typeFilter={typeFilter}
              defaultContact={defaultContact}
              setDefaultContact={setDefaultContact}
              handleSearch={handleSearch}
              filterFields={[...columns]
                .map((col) => ({ val: col.dataField, name: col.text }))
                .slice(0, columns.length - 1)}
            />
          </div>
        ) : null}
        {showNextReminderFilter ? (
          <div className="col-2">
            <Filter
              queryParams={queryParams}
              setQueryParams={setQueryParams}
              columns={columns}
              typeFilter={typeFilter}
              defaultContact={defaultContact}
              setDefaultContact={setDefaultContact}
              handleSearch={handleSearch}
              handleChangeMonth={handleChangeMonth}
              showNextReminderFilter={true}
              filterFields={[...columns]
                .map((col) => ({ val: col.dataField, name: col.text }))
                .slice(0, columns.length - 1)}
            />
          </div>
        ) : null}
        {showDistrictFilter ? (
          <div className="col-2">
            <Filter
              queryParams={queryParams}
              setQueryParams={setQueryParams}
              columns={columns}
              typeFilter={typeFilter}
              defaultContact={defaultContact}
              setDefaultContact={setDefaultContact}
              handleSearch={handleSearch}
              handleChangeDistrict={handleChangeDistrict}
              showDistrictFilter={true}
              districts={districts}
              filterFields={[...columns]
                .map((col) => ({ val: col.dataField, name: col.text }))
                .slice(0, columns.length - 1)}
            />
          </div>
        ) : null}
        {showCustomerTypeFilter ? (
          <div className="col-2">
            <Filter
              queryParams={queryParams}
              setQueryParams={setQueryParams}
              columns={columns}
              typeFilter={typeFilter}
              defaultContact={defaultContact}
              setDefaultContact={setDefaultContact}
              handleSearch={handleSearch}
              handleChangeCustomerType={handleChangeCustomerType}
              showCustomerTypeFilter={true}
              filterFields={[...columns]
                .map((col) => ({ val: col.dataField, name: col.text }))
                .slice(0, columns.length - 1)}
            />
          </div>
        ) : null}
        {showTeamStatusFilter ? (
          <div className="col-2">
            <Filter
              queryParams={queryParams}
              setQueryParams={setQueryParams}
              columns={columns}
              typeFilter={typeFilter}
              defaultContact={defaultContact}
              setDefaultContact={setDefaultContact}
              handleSearch={handleSearch}
              handleChangeTeamStatus={handleChangeTeamStatus}
              showTeamStatusFilter={true}
              filterFields={[...columns]
                .map((col) => ({ val: col.dataField, name: col.text }))
                .slice(0, columns.length - 1)}
            />
          </div>
        ) : null}
        {showDistrictStatusFilter ? (
          <div className="col-2">
            <Filter
              queryParams={queryParams}
              setQueryParams={setQueryParams}
              columns={columns}
              typeFilter={typeFilter}
              defaultContact={defaultContact}
              setDefaultContact={setDefaultContact}
              handleSearch={handleSearch}
              handleChangeDistrictStatus={handleChangeDistrictStatus}
              showDistrictStatusFilter={true}
              filterFields={[...columns]
                .map((col) => ({ val: col.dataField, name: col.text }))
                .slice(0, columns.length - 1)}
            />
          </div>
        ) : null}
        {showCommSectorStatusFilter ? (
          <div className="col-2">
            <Filter
              queryParams={queryParams}
              setQueryParams={setQueryParams}
              columns={columns}
              typeFilter={typeFilter}
              defaultContact={defaultContact}
              setDefaultContact={setDefaultContact}
              handleSearch={handleSearch}
              handleChangeCommSectorStatus={handleChangeCommSectorStatus}
              showCommSectorStatusFilter={true}
              filterFields={[...columns]
                .map((col) => ({ val: col.dataField, name: col.text }))
                .slice(0, columns.length - 1)}
            />
          </div>
        ) : null}
        {showUserStatusFilter ? (
          <div className="col-2">
            <Filter
              queryParams={queryParams}
              setQueryParams={setQueryParams}
              columns={columns}
              typeFilter={typeFilter}
              defaultContact={defaultContact}
              setDefaultContact={setDefaultContact}
              handleSearch={handleSearch}
              handleChangeUserStatus={handleChangeUserStatus}
              showUserStatusFilter={true}
              filterFields={[...columns]
                .map((col) => ({ val: col.dataField, name: col.text }))
                .slice(0, columns.length - 1)}
            />
          </div>
        ) : null}
      </div>

      <PaginationProvider pagination={paginationFactory(paginationOptions)}>
        {({ paginationProps, paginationTableProps }) => {
          return (
            <Pagination
              isLoading={listLoading}
              paginationProps={paginationProps}
            >
              <BootstrapTable
                wrapperClasses="table-responsive"
                classes="table table-head-custom table-vertical-center overflow-hidden"
                bootstrap4
                bordered={false}
                remote
                keyField="_id"
                data={entities === null ? [] : entities}
                columns={columns}
                defaultSorted={defaultSorted}   // 该数组允许您在首次渲染时定义默认排序列
                onTableChange={getHandlerTableChange(setQueryParams)}   // 分页排序触发事件
                {...paginationTableProps}
                // rowStyle={ { backgroundColor: 'pink' } || rowStyle }  // 自定义表格行背景样式
                // rowEvents={ rowEvents }  // 自定义表格行事件
                // selectRow={{mode: 'radio' || 'checkbox'}}  // 表格首列...更多多样配置前往git
              >
                <PleaseWaitMessage entities={entities} />
                <NoRecordsFoundMessage entities={entities} />
              </BootstrapTable>
            </Pagination>
          );
        }}
      </PaginationProvider>
    </>
  );
}

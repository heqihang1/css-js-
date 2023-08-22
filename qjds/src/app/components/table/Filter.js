import React, { useCallback } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useIntl } from "react-intl";
import SearchSelect from "react-select";
// import { debounce } from '../../../app/utils/utils'
let timer;

const userOptions = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "active" },
  { label: "Disactivated", value: "disactivated" },
];

const customerTypeOptions = [
  { label: "All", value: "ALL" },
  { label: "Company", value: "Company" },
  { label: "Personal", value: "Personal" },
];

const teamStatusOptions = [
  { label: "All", value: "ALL" },
  { label: "Active", value: true },
  { label: "Inactive", value: false },
];

const prepareFilter = (queryParams, values, filterFields) => {
  const { searchText, type } = values;
  const newQueryParams = { ...queryParams };
  if (window.location.href.includes("/users")) {
    let filter = {};
    // if (searchText && type) {
    //   filter[type] = { $regex: `${searchText}`, $options: "i" };
    // }
    if (type) {
      filter = {
        status: type,
      };
    }
    newQueryParams.filter = filter;
  }
  newQueryParams.search = searchText;
  return newQueryParams;
};

export function Filter({
  setQueryParams,
  queryParams,
  filterFields = [],
  handleSearch = () => {},
  handleChangeMonth = () => {},
  handleChangeDistrict = () => {},
  handleChangeCustomerType = () => {},
  handleChangeTeamStatus = () => {},
  handleChangeDistrictStatus = () => {},
  handleChangeCommSectorStatus = () => {},
  handleChangeUserStatus = () => {},
  typeFilter = false,
  showNextReminderFilter = false,
  showDistrictFilter = false,
  showCustomerTypeFilter = false,
  showTeamStatusFilter = false,
  showDistrictStatusFilter = false,
  showCommSectorStatusFilter = false,
  showUserStatusFilter = false,
  districts = [],
}) {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  const intl = useIntl();
  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(queryParams, values, filterFields);
    if (!isEqual(newQueryParams, queryParams)) {
      newQueryParams.pageNumber = 1;
      setQueryParams(newQueryParams);
    }
  };
  const debounce = function(e, d) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      handleSearch(e);
    }, d);
  };

  function getDistrict() {
    districts.unshift({label: 'All', value: 'ALL'})
    return districts
  }

  return (
    <>
      <Formik
        initialValues={{
          searchText: (params.quote_contract_no) ? params.quote_contract_no : '',
          type: window.location.href.includes("/users") ? "active" : "",
          next_remind_month: params.next_reminder_month,
        }}
        onSubmit={(values) => {
          applyFilter(values);
        }}
      >
        {({
          values,
          handleSubmit,
          handleBlur,
          handleChange,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit} className="form form-label-right">
            <div className="form-group">
              {(showNextReminderFilter) ? <div>
                <input
                  type="month"
                  className="form-control"
                  name="next_remind_month"
                  onBlur={handleBlur}
                  onChange={handleChangeMonth}
                  defaultValue={values.next_remind_month}
                />
                <small className="form-text text-muted">
                  <b>Filter</b> Next Reminder Month
                </small>
              </div> : '' }
              {(showDistrictFilter) ? <div>
                <SearchSelect
                  name="district"
                  options={getDistrict()}
                  onChange={handleChangeDistrict}
                  placeholder="All"
                />
                <small className="form-text text-muted">
                  <b>Filter</b> District
                </small>
              </div> : '' }
              {(showCustomerTypeFilter) ? <div>
                <SearchSelect
                  name="customer_type"
                  options={customerTypeOptions}
                  onChange={handleChangeCustomerType}
                  placeholder="All"
                />
                <small className="form-text text-muted">
                  <b>Filter</b> Customer Type
                </small>
              </div> : '' }
              {(showTeamStatusFilter) ? <div>
                <SearchSelect
                  name="team_status"
                  options={teamStatusOptions}
                  onChange={handleChangeTeamStatus}
                  placeholder="Active"
                />
                <small className="form-text text-muted">
                  <b>Filter</b> Status
                </small>
              </div> : '' }
              {(showDistrictStatusFilter) ? <div>
                <SearchSelect
                  name="district_status"
                  options={teamStatusOptions}
                  onChange={handleChangeDistrictStatus}
                  placeholder="Active"
                />
                <small className="form-text text-muted">
                  <b>Filter</b> Status
                </small>
              </div> : '' }
              {(showCommSectorStatusFilter) ? <div>
                <SearchSelect
                  name="comm_sector_status"
                  options={teamStatusOptions}
                  onChange={handleChangeCommSectorStatus}
                  placeholder="Active"
                />
                <small className="form-text text-muted">
                  <b>Filter</b> Status
                </small>
              </div> : '' }
              {(showUserStatusFilter) ? <div>
                <SearchSelect
                  name="user_status"
                  options={userOptions}
                  onChange={handleChangeUserStatus}
                  placeholder="Active"
                />
                <small className="form-text text-muted">
                  <b>Filter</b> Status
                </small>
              </div> : '' }
              {(!showNextReminderFilter && !showDistrictFilter && !showCustomerTypeFilter && !showTeamStatusFilter && !showDistrictStatusFilter && !showCommSectorStatusFilter && !showUserStatusFilter) ? <div>
                <input
                  type="text"
                  className="form-control"
                  name="searchText"
                  placeholder={intl.formatMessage({
                    id: "ECOMMERCE.COMMON.SEARCH",
                  })}
                  onBlur={handleBlur}
                  defaultValue={values.searchText}
                  onKeyUp={(e) => {
                    debounce(e.target.value, 1000);
                  }}
                />
                <small className="form-text text-muted">
                  <b>
                    {intl.formatMessage({
                      id: "ECOMMERCE.COMMON.SEARCH",
                    })}
                  </b>{" "}
                  {intl.formatMessage({ id: "CONTRACTS.FIELDS" })}
                </small>
              </div> : ''}
            </div>
          </form>
        )}
      </Formik>
    </>
  );
}

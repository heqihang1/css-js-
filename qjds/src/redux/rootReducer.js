import { all } from "redux-saga/effects";
import { combineReducers } from "redux";

import * as auth from "../app/modules/Auth/_redux/authRedux";
import { customersSlice } from "../app/modules/customers/_redux/customers/customersSlice";
import { specificationsSlice } from "../app/modules/customers/_redux/specifications/specificationsSlice";
import { paymentMethodsSlice } from "../app/modules/sets/_redux/payment-items/paymentMethodSlice";
import { servicesSlice } from "../app/modules/sets/_redux/services/servicesSlice";
import { remarksSlice } from "../app/modules/sets/_redux/remarks/remarksSlice";
import { terms_conditionsSlice } from "../app/modules/sets/_redux/terms_conditions/terms_conditionsSlice";
import { teamSlice } from "../app/modules/sets/_redux/teams/teamsSlice";
import { quotationsSlice } from "../app/modules/quotes/_redux/quotes/quotesSlice";
import { contractsSlice } from "../app/modules/contracts/_redux/contracts/contractsSlice";
import { districtsSlice } from "../app/modules/sets/_redux/districts/districtSlice";
import { commercialSectorSlice } from "../app/modules/sets/_redux/commercialSector/commercialSectorSlice";
import { rejectReasonSlice } from "../app/modules/sets/_redux/rejectReason/rejectReasonSlice";
import { terminationReasonSlice } from "../app/modules/sets/_redux/terminationReason/terminationReasonSlice";
import { dashboardSlice } from "../app/modules/Dashboard/_redux/dashboard/dashboardSlice";
import { invoiceSlice } from "../app/modules/invoices/_redux/invoice/invoiceSlice";
import { usersSlice } from "../app/modules/Admin/_redux/users/usersSlice";
import { rolesSlice } from "../app/modules/Admin/_redux/roles/rolesSlice";
import { rightsReducer } from "./userRoleRightsSlice";
import { jobSlice } from "../app/modules/jobs/_redux/job/jobSlice";
import { salesRemarkSlice } from "../app/modules/quotes/_redux/quoteSalesRemark/salesRemarkSlice";
import { contractSalesRemarkSlice } from "../app/modules/contracts/_redux/contractsSalesRemark/salesRemarkSlice"
import { questionSlice } from "../app/modules/sets/_redux/question/questionSlice";

export const rootReducer = combineReducers({
  auth: auth.reducer,
  customers: customersSlice.reducer,
  remarks: remarksSlice.reducer,
  specifications: specificationsSlice.reducer,
  paymentMethods: paymentMethodsSlice.reducer,
  districts: districtsSlice.reducer,
  commercialSectors: commercialSectorSlice.reducer,
  rejectReasons: rejectReasonSlice.reducer,
  terminationReasons: terminationReasonSlice.reducer,
  terms_conditions: terms_conditionsSlice.reducer,
  teams: teamSlice.reducer,
  services: servicesSlice.reducer,
  quotations: quotationsSlice.reducer,
  contracts: contractsSlice.reducer,
  dashboard: dashboardSlice.reducer,
  invoice: invoiceSlice.reducer,
  users: usersSlice.reducer,
  roles: rolesSlice.reducer,
  roleRights: rightsReducer,
  job: jobSlice.reducer,
  quoteSalesRemark: salesRemarkSlice.reducer,
  contractSalesRemark: contractSalesRemarkSlice.reducer,
  questions: questionSlice.reducer,
});

export function* rootSaga() {
  yield all([auth.saga()]);
}

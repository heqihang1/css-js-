import React, { Suspense, lazy } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import { BuilderPage } from "./pages/BuilderPage";
import { MyPage } from "./pages/MyPage";
import { DashboardPage } from "./pages/DashboardPage";
import Admin from "./modules/Admin/pages/admin";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Quotes from "./modules/quotes/pages/quotes";
// const Customers = lazy(() => import("./modules/customers/pages/customers"));
// const Contracts = lazy(() => import("./modules/contracts/pages/contracts"));
// const Jobs = lazy(() => import("./modules/jobs/pages/jobs"));
// const Invoices = lazy(() => import("./modules/invoices/pages/invoices"));
// const Sets = lazy(() => import("./modules/sets/pages/sets"));
// const Reports = lazy(() => import("./modules/reports/pages/reports"));
// const UserProfilepage = lazy(() =>
//   import("./modules/UserProfile/UserProfilePage")
// );
import Customers from "./modules/customers/pages/customers";
import Contracts from "./modules/contracts/pages/contracts";
import Jobs from "./modules/jobs/pages/jobs";
import Invoices from "./modules/invoices/pages/invoices";
import Sets from "./modules/sets/pages/sets";
import Reports from "./modules/reports/pages/reports";
import UserProfilepage from "./modules/UserProfile/UserProfilePage";
import {
  CONTRACTS,
  CUSTOMERS,
  INVOICES,
  JOB_ORDERS,
  QUOTES,
  REPORTS,
  SETS_PAYMENT_METHODS,
  SETS_REMARKS,
  SETS_SERVICES,
  SETS_TERMS_CONDITIONS,
} from "./utils/moduleRights";
import { fetchRights } from "../redux/userRoleRightsSlice";

const GoogleMaterialPage = lazy(() =>
  import("./modules/GoogleMaterialExamples/GoogleMaterialPage")
);
const ReactBootstrapPage = lazy(() =>
  import("./modules/ReactBootstrapExamples/ReactBootstrapPage")
);

export default function BasePage() {
  // useEffect(() => {
  //   console.log('Base page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect
  const {
    user: { role },
    rights,
  } = useSelector(
    (state) => ({ user: state.auth.user, rights: state.roleRights.rights }),
    shallowEqual
  );

  const [accessModules, setAccessModules] = React.useState([]);
  let dispatch = useDispatch();
  const getRole = async (role) => {
    dispatch(fetchRights(role));
  };

  useEffect(() => {
    if (role) {
      getRole(role);
    }
  }, [role]);

  useEffect(() => {
    if (rights) {
      localStorage.setItem("rights", JSON.stringify(rights));
      setAccessModules(
        rights.map((module) => (module.can_read ? module.code : ""))
      );
    }
  }, [rights]);

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to="/dashboard" />
        }
        <ContentRoute path="/dashboard" component={DashboardPage} />
        <ContentRoute path="/builder" component={BuilderPage} />
        <ContentRoute path="/my-page" component={MyPage} />
        <Route path="/google-material" component={GoogleMaterialPage} />
        <Route path="/react-bootstrap" component={ReactBootstrapPage} />
        {/* {accessModules.includes("QUOTATION") && ( */}
        <Route path="/quotes" component={Quotes} />
        {/* )} */}
        {/* {accessModules.includes("CUSTOMER") && ( */}
          <Route path="/customers" component={Customers} />
        {/* )} */}
        {/* {accessModules.includes("CONTRACT") && ( */}
        <Route path="/contracts" component={Contracts} />
        {/* )} */}
        {/* {accessModules.includes("JOB") || 
        accessModules.includes("CREATE_JOB_REMINDER") || 
        accessModules.includes("WAITING_ARRANGEMENT_JOB_CALENDER") && ( */}
          <Route path="/jobs" component={Jobs} />
        {/* )} */}
        {/* {accessModules.includes("INVOICE") && ( */}
          <Route path="/invoices" component={Invoices} />
        {/* )} */}
        {/* {(accessModules.includes("PAYMENT_ITEM") ||
          accessModules.includes("DISTRICTS") ||
          accessModules.includes("COMMERCIAL_SECTOR") ||
          accessModules.includes("REJECT_REASON") ||
          accessModules.includes("TERMINATION_REASON") ||
          accessModules.includes("QUESTION") ||
          accessModules.includes("REMARK") ||
          accessModules.includes("SERVICE_ITEM") ||
          accessModules.includes("TERMS_AND_CONDITION") ||
          accessModules.includes("TEAMS")) && ( */}
            <Route path="/sets" component={Sets} />
          {/* )} */}
        <Route path="/user-profile" component={UserProfilepage} />
        {/* {(accessModules.includes("CONTRACT_INVOICE_REPORT") ||
          accessModules.includes("NEW_CUSTOMER_REPORT") ||
          accessModules.includes("PENDING_INVOICE_REPORT") ||
          accessModules.includes("SALES_BUSINESS_REPORT") ||
          accessModules.includes("ITEMS_SALES_STAT_REPORT") ||
          accessModules.includes("COMMING_END_REPORT") ||
          accessModules.includes("OVERDUE_AMOUNT_REPORT") ||
          accessModules.includes("FUTURE_JOB_ORDER_REPORT") ||
          accessModules.includes("SALES_PERFORMANCE_REPORT") ||
          accessModules.includes("CLIENT_REJECTED") ||
          accessModules.includes("TERMINATED_CONTRACT") ||
          accessModules.includes("UPLOAD_DOCUMENT_REPORT") ||
          accessModules.includes("SERVICE_ITEM_REPORT") ||
          accessModules.includes("UNFINISHED_JOB_REPORT") ||
          accessModules.includes("QUOTATION_INVOICE_REPORT")) && ( */}
            <Route path="/reports" component={Reports} />
          {/* )} */}
        {/* {(accessModules.includes("USER") || accessModules.includes("ROLE")) && ( */}
          <Route path="/admin" component={Admin} />
        {/* )} */}
        {/* <Redirect to="error/error-v1" /> */}
      </Switch>
    </Suspense>
  );
}

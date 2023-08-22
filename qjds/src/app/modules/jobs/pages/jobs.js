import React, { Suspense } from "react";
import { Switch } from "react-router-dom";
import { ProductsPage } from "./ProductsPage";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import JobsPendingCalendar from "./JobsPendingCalendarPage";
import JobsDetails from "./details";
import CreateJobReminder from "./CreateJobReminder";
import { ProductEdit } from "./product-edit/ProductEdit";
import AssignJob from "./AssignJob";
import AssignTeam from "./AssignTeam";

export default function eCommercePage() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <ContentRoute path="/jobs/all" component={ProductsPage} />
        <ContentRoute path="/jobs/pending" component={ProductsPage} />
        <ContentRoute path="/jobs/cancelled" component={ProductsPage} />
        <ContentRoute path="/jobs/create-job-reminder" component={CreateJobReminder} />
        <ContentRoute path="/jobs/waiting-arragement" component={ProductsPage} />
        <ContentRoute path="/jobs/rejected" component={ProductsPage} />
        <ContentRoute path="/jobs/arraged-job" component={ProductsPage} />
        <ContentRoute path="/jobs/finished" component={ProductsPage} />
        <ContentRoute path="/jobs/:id/details" component={JobsDetails} />
        <ContentRoute path="/jobs/:id/edit" component={ProductEdit} />
        <ContentRoute path="/jobs/assign" component={AssignJob} />
        <ContentRoute path="/jobs/team" component={AssignTeam} />

        {/* <ContentRoute path="/jobs/rejects" component={ProductsPage} />
        <ContentRoute
          path="/jobs/pending-calender"
          component={JobsPendingCalendar}
        />
        <ContentRoute path="/jobs/payment-waiting" component={ProductsPage} />
        <ContentRoute path="/jobs/done-jobs" component={ProductsPage} />
        <ContentRoute path="/jobs/finish-list" component={ProductsPage} /> */}
        {/* <ContentRoute path="/jobs" component={ProductsPage} /> */}
      </Switch>
    </Suspense>
  );
}

import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Contracts } from "./Contracts";
import { Quotations } from "./Quotations";
import { JobOrder } from "./JobOrder";
import { Invoice } from "./Invoice";
import { Questionnaire } from "./Questionnaire";

export default function PDFPages() {
  return (
    <Switch>
      <Redirect from="/pdf" exact={true} to="/pdf/contract" />
      <Route path="/pdf/contract" component={Contracts} />      
      <Route path="/pdf/quotation" component={Quotations} />      
      <Route path="/pdf/job-order" component={JobOrder} />
      <Route path="/pdf/invoice" component={Invoice} />
      <Route path="/pdf/questionnaire" component={Questionnaire} />      
    </Switch>
  );
}

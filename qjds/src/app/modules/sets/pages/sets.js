import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ProductsPage as PaymentPage } from "./payment-item/ProductsPage";
import { ProductEdit as PaymentEdit } from "./payment-item/product-edit/ProductEdit";
import { ProductsPage as RemarksPage } from "./remarks/ProductsPage";
import { ProductsPage as ServicePage } from "./service-item/ProductsPage";
import { ProductEdit as ServiceEdit } from "./service-item/product-edit/ProductEdit";
import { ProductsPage as TermsAndServicePage } from "./terms-services/ProductsPage";
import { ProductsPage as TeamsPage } from "./teams/ProductsPage";
import { ProductsPage as DistrictPage } from "./district/ProductsPage";
import { ProductsPage as CommercialPage } from "./commercialSector/ProductsPage"
import { ProductsPage as TerminationPage } from "./terminationReason/ProductsPage"
import { ProductsPage as RejectPage } from "./rejectReason/ProductsPage"
import { ProductsPage as QuestionPage } from "./question/ProductsPage"
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { RemarkEdit } from "./remarks/remark-edit/RemarkEdit";
import { ProductEdit as TermsEdit } from "./terms-services/product-edit/ProductEdit";
import { ProductEdit as TeamsEdit } from "./teams/product-edit/ProductEdit";
import { ProductEdit as DistrictEdit } from "./district/product-edit/ProductEdit";
import { ProductEdit as CommercialEdit } from "./commercialSector/product-edit/ProductEdit"
import { ProductEdit as TerminationEdit } from "./terminationReason/product-edit/ProductEdit"
import { ProductEdit as RejectEdit } from "./rejectReason/product-edit/ProductEdit"
import { ProductEdit as QuestionEdit } from "./question/product-edit/ProductEdit"

export default function eCommercePage() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from eCommerce root URL to /sets */
          <Redirect exact={true} from="/sets" to="/sets/payment-item" />
        }
        <ContentRoute path="/sets/payment-item/new" component={PaymentEdit} />
        <ContentRoute
          path="/sets/payment-item/:id/edit"
          component={PaymentEdit}
        />
        <ContentRoute path="/sets/payment-item" component={PaymentPage} />

        <ContentRoute path="/sets/service-item/new" component={ServiceEdit} />
        <ContentRoute
          path="/sets/service-item/:id/edit"
          component={ServiceEdit}
        />
        <ContentRoute path="/sets/service-item" component={ServicePage} />

        <ContentRoute
          path="/sets/terms-and-conditions/new"
          component={TermsEdit}
        />
        <ContentRoute
          path="/sets/terms-and-conditions/:id/edit"
          component={TermsEdit}
        />
        <ContentRoute
          path="/sets/terms-and-conditions"
          component={TermsAndServicePage}
        />

        <ContentRoute
          path="/sets/teams/new"
          component={TeamsEdit}
        />
        <ContentRoute
          path="/sets/teams/:id/edit"
          component={TeamsEdit}
        />
        <ContentRoute
          path="/sets/teams"
          component={TeamsPage}
        />

        <ContentRoute
          path="/sets/districts/new"
          component={DistrictEdit}
        />
        <ContentRoute
          path="/sets/districts/:id/edit"
          component={DistrictEdit}
        />
        <ContentRoute
          path="/sets/districts"
          component={DistrictPage}
        />

        <ContentRoute
          path="/sets/commercial-sector/:id/edit"
          component={CommercialEdit}
        />
        <ContentRoute
          path="/sets/commercial-sector/new"
          component={CommercialEdit}
        />
        <ContentRoute path="/sets/commercial-sector" component={CommercialPage} />

        <ContentRoute
          path="/sets/termination-reason/:id/edit"
          component={TerminationEdit}
        />
        <ContentRoute
          path="/sets/termination-reason/new"
          component={TerminationEdit}
        />
        <ContentRoute path="/sets/termination-reason" component={TerminationPage} />

        <ContentRoute
          path="/sets/reject-reason/:id/edit"
          component={RejectEdit}
        />
        <ContentRoute
          path="/sets/reject-reason/new"
          component={RejectEdit}
        />
        <ContentRoute path="/sets/reject-reason" component={RejectPage} />

        <ContentRoute
          path="/sets/question/:id/edit"
          component={QuestionEdit}
        />
        <ContentRoute
          path="/sets/question/new"
          component={QuestionEdit}
        />
        <ContentRoute path="/sets/question" component={QuestionPage} />

        <ContentRoute path="/sets/remarks/new" component={RemarkEdit} />
        <ContentRoute path="/sets/remarks/:id/edit" component={RemarkEdit} />
        <ContentRoute path="/sets/remarks" component={RemarksPage} />
      </Switch>
    </Suspense>
  );
}

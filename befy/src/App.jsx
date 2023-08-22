import React, { useRef, useEffect, history, useReducer } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { I18nextProvider, useTranslation } from 'react-i18next';
import Provider from "./reducer/useContent";
import Nav from "./Nav";
import WebFooter from './pages/Components/WebFooter/Footer';
import routesList from "./Route/Routes";
import Home from "./pages/home";
import "./i18n/config";
import "antd/dist/antd.css";

export default () => {
  const cssPrefix = CSS_PREFIX;
  return (
    <I18nextProvider>
      <Provider>
        <div className={`${cssPrefix}`} style={{ overflow: 'hidden', position: 'relative' }}>
          <BrowserRouter>
            <Nav />
            <Routes >
              <Route path={`*`} exact={true} element={<Home />} />
              {routesList.map((v, i) => {
                return <Route path={v.url} exact={true} element={v.element} key={v.key} />
              })}
            </Routes>
            <WebFooter />
          </BrowserRouter>
        </div>
      </Provider>
    </I18nextProvider>
  );
};

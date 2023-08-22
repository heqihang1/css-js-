// React18 只能兼容到IE11，不兼容11以下版本（IE11以下对很多优秀开源组件不兼容，同时也为了快速响应，暂不考虑IE11以下的）
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css"
// import "lib-flexible";
const root = createRoot(document.getElementById("root"));
root.render(<App />);

// React18以下 能兼容到IE9
// import React from "react";
// import ReactDOM from "react-dom";
// import App from "./App";
// ReactDOM.render(<App />, document.getElementById("root"));

if (module.hot) {
  module.hot.accept();
}

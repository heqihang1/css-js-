import React from "react";
import * as singleSpa from "single-spa";
import useSearchJson from "@/hooks/useSearchJson";
import qs from "qs";
import { Button, Result } from "antd";
export default (props = {}) => {
  const { msg = "" } = props;
  const searchJson = useSearchJson();
  return (
    <Result
      status="404"
      title="404"
      subTitle={"找不到页面"}
      extra={
        <Button
          type="primary"
          onClick={(e) => {
            let url = "/";
            let data = { ...searchJson };
            if (JSON.stringify(data) != "{}") {
              url += "?" + qs.stringify(data);
            }
            singleSpa.navigateToUrl(url);
          }}
        >
          Back Home
        </Button>
      }
    />
  );
};

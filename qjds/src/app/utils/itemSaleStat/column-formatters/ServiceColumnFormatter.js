import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

// export const ServiceColumnFormatter = (cellContent, row) => (
//   <OverlayTrigger overlay={<Tooltip id="products-edit-tooltip">{displayTooltip(row.services)}</Tooltip>}>
//     <span>{row.services[0].title}</span>
//   </OverlayTrigger>
// );
export const ServiceColumnFormatter = (
  cellContent,
  row
) => {
  function displayTooltip(services) {
    let service_arr = []
    services.filter((item, index) => {
      if (index > 0) {
        service_arr.push(item.title)
      }
    })
    return service_arr.join(', ')
  }
  return (
    (row && row.services && row.services.length > 0) ? <OverlayTrigger overlay={<Tooltip>{displayTooltip(row?.services)}</Tooltip>}>
        <span>{row?.services[0]?.title}</span>
    </OverlayTrigger> : ''
  )
};

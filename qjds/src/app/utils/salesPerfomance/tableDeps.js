import * as columnFormatters from "./column-formatters";
import { sortCaret } from "../../../_metronic/_helpers";
export const generateColumns = (
  history,
  actions = true,
  selectedType
) => {
  let columns = []
  if (selectedType == 'QUOTATION') {
    columns = [
      {
        dataField: "quotation_no",
        text: "Quotation Number",
        sort: true,
        sortCaret: sortCaret
      },
      {
        dataField: "customer_name",
        text: "Customer",
        sort: true,
        sortCaret: sortCaret,
        headerStyle: () => {
          return { width: "350px", wordBreak: "break-all", verticalAlign: "top" };
        },
        classes: 'text-wrap'
      },
      {
        dataField: "amount",
        text: "Amount",
        sort: true,
        sortCaret: sortCaret,
        formatter: columnFormatters.PriceColumnFormatter,
      },
      {
        dataField: "createdAt",
        text: "Created Date",
        sort: true,
        sortCaret: sortCaret,
        formatter: columnFormatters.DateColumnFormatter,
      },
      {
        dataField: "status",
        text: "State",
        sort: true,
        sortCaret: sortCaret,     
      }
    ];
  } else if (selectedType == 'CONTRACT') {
    columns = [
      {
        dataField: "contract_no",
        text: "Contract Number",
        sort: true,
        sortCaret: sortCaret
      },
      {
        dataField: "customer_name",
        text: "Customer",
        sort: true,
        sortCaret: sortCaret,
      },
      {
        dataField: "contract_amount",
        text: "Amount",
        sort: true,
        sortCaret: sortCaret,
        formatter: columnFormatters.PriceColumnFormatter,
      },
      {
        dataField: "createdAt",
        text: "Created Date",
        sort: true,
        sortCaret: sortCaret,
        formatter: columnFormatters.DateColumnFormatter,
      },
      {
        dataField: "status",
        text: "State",
        sort: true,
        sortCaret: sortCaret,     
      }
    ];
  } else {
    columns = [
      {
        dataField: "customer_type",
        text: "",
        sort: true,
        sortCaret: sortCaret,
        formatter: columnFormatters.CompanyPersonalFormatter,
      },
      {
        dataField: "customer_name",
        text: "Customer",
        sort: true,
        sortCaret: sortCaret,
      },
      {
        dataField: "contact_name",
        text: "Contact Person",
        sort: true,
        sortCaret: sortCaret,
      },
      {
        dataField: "office_number",
        text: "Office Phone",
        sort: true,
        sortCaret: sortCaret,
      },
      {
        dataField: "mobile_number",
        text: "Cell Phone",
        sort: true,
        sortCaret: sortCaret,     
      },
      {
        dataField: "createdAt",
        text: "Created Date",
        sort: true,
        sortCaret: sortCaret,
        formatter: columnFormatters.DateColumnFormatter,
      }
    ];
  }
  return columns;
};

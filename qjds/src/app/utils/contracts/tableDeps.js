import * as columnFormatters from "./column-formatters";
import { sortCaret } from "../../../_metronic/_helpers";
import { useIntl } from "react-intl";

export const GenerateColumns = (history, actions = true, { confirm, uploadDocument, deleteContract, rejectContract, approveT, rejectT }) => {
  const intl = useIntl();
  let columns = [
    {
      dataField: "contract_no",
      text: intl.formatMessage({ id: "CONTRACTS.CONTRACT_NO" }),
      sort: true,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { verticalAlign: "top" };
      },
    },
    {
      dataField: "client_name",
      text: intl.formatMessage({ id: "CONTRACTS.CLINTS_NAME" }),
      sort: true,
      sortCaret: sortCaret,
      headerStyle: () => {
        return { width: "350px", wordBreak: "break-all", verticalAlign: "top" };
      },
      classes: 'text-wrap'
    }
  ];

  if (!window.location.pathname.includes("/job")) {
    columns.push({
      dataField: "contract_amount",
      text: intl.formatMessage({ id: "CONTRACTS.AMOUNT" }),
      sort: true,
      sortCaret: sortCaret,
      align: 'right',
      headerAlign: 'right',
      formatter: (cell) => {
        return `$${cell?.toFixed(2)}`;
      },
      headerStyle: () => {
        return { verticalAlign: "top" };
      },
    })
  }

  columns.push({
    dataField: "createdAt",
    text: intl.formatMessage({ id: "CONTRACTS.DATE_CREATED" }),
    sort: true,
    sortCaret: sortCaret,
    formatter: columnFormatters.DateColumnFormatter,
    headerStyle: () => {
      return { verticalAlign: "top" };
    },
  })

  columns.push({
    dataField: "status",
    text: intl.formatMessage({ id: "CONTRACTS.STATE" }),
    sort: true,
    sortCaret: sortCaret,
    formatter: (cell) => {
      return cell === "Approval denied" ? "Reject" : cell;
    },
    headerStyle: () => {
      return { verticalAlign: "top" };
    },
  })

  columns.push({
    dataField: "customer_id.customer_officer_id.profile_pic",
    text: "",
    sort: true,
    formatter: columnFormatters.AvatarColumnFormatter,
    headerStyle: () => {
      return { verticalAlign: "top" };
    },
  })


  if (actions) {
    columns.push({
      dataField: "action",
      text: "行动",
      formatter: columnFormatters.ActionsColumnFormatter(
        intl.formatMessage({ id: "CONTRACTS.PREVIEW" }),
        intl.formatMessage({ id: "CONTRACTS.COPY" }),
        intl.formatMessage({ id: "CONTRACTS.REUSE" }),
        intl.formatMessage({ id: "CONTRACTS.EDIT_CONTRACT" }),
        intl.formatMessage({ id: "CONTRACTS.DELETE_CONTRACT" }),
        intl.formatMessage({ id: "CONTRACTS.CONFIRM_CONTRACT" }),

      ),
      headerStyle: () => {
        return { verticalAlign: "top" };
      },
      formatExtraData: {
        reuse: (id) => {
          history.push(`/contracts/${id}/re-use`);
        },
        copy: (id) => {
          history.push(`/contracts/${id}/clone`);
        },
        preview: (id) => {
          // history.push(`/contracts/${id}/details`);
          if (window.location.pathname.includes("/job")) {
            window.open(`/contracts/${id}/details/job`);
          } else {
            window.open(`/contracts/${id}/details`);
          }
        },
        deleteContract: (id) => {
          deleteContract(id)
        },
        edit: (id) => {
          history.push(`/contracts/${id}/edit`);
        },
        confirm: (id, flag = true) => {
          confirm(id);  // 原有弹窗逻辑
          // history.push(`/contracts/${id}/to-be-confirm/${flag}`);
        },
        reject: (id) => {
          rejectContract(id);
        },
        uploadDocument: (id) => {
          uploadDocument(id);
        },
        approveT: (id) => {
          approveT(id);
        },
        rejectT: (id) => {
          rejectT(id)
        }
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "100px",
      },
    });
  }

  return columns;
};

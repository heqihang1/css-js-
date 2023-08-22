import * as columnFormatters from "./column-formatters";
import { useDispatch } from "react-redux";
import { sortCaret } from "../../../../_metronic/_helpers";
import * as ComActions from "../../../modules/sets/_redux/rejectReason/rejectReasonActions";

export const GenerateColumns = (history, actions = true, 
  {
    refreshList = () => {},
  } = {}
) => {
  const dispatch = useDispatch();

  const approveProduct = (id) => {
    dispatch(ComActions.activateRejectReason(id)).then(() => {
      //dispatch(ComActions.fetchRejectReasons());
      refreshList()
    });
  };

  let columns = [
    {
      dataField: "reject_reason",
      text: "Reject Reason",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "status",
      text: "Status",
      sort: true,
      sortCaret: sortCaret,
      formatter: (field) => {
        return field === true ? "ACTIVE" : "INACTIVE";
      },
    },
  ];

  if (actions) {
    columns.push({
      dataField: "action",
      text: "行动",
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        remove: (id, rejectReason) => {
          history.push(
            `/sets/reject-reason/${id}/delete?rejectReason=${rejectReason}`
          );
        },
        approve: (id) => {
          approveProduct(id);
        },
        edit: (id) => {
          history.push(`/sets/reject-reason/${id}/edit`);
        },
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

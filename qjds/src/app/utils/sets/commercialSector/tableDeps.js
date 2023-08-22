import * as columnFormatters from "./column-formatters";
import { useDispatch } from "react-redux";
import { sortCaret } from "../../../../_metronic/_helpers";
import * as ComActions from "../../../modules/sets/_redux/commercialSector/commercialSectorActions";

export const GenerateColumns = (history, actions = true, 
  {
    refreshList = () => {},
  } = {}
) => {
  const dispatch = useDispatch();

  const approveProduct = (id) => {
    dispatch(ComActions.activateCommercialSector(id)).then(() => {
      //dispatch(ComActions.fetchCommercialSectors());
      refreshList()
    });
  };

  let columns = [
    {
      dataField: "commercial_sector_name",
      text: "Commercial Sector",
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
        remove: (id, commercialSector) => {
          history.push(
            `/sets/commercial-sector/${id}/delete?commercialSector=${commercialSector}`
          );
        },
        approve: (id, commercialSector) => {
          approveProduct(id);
          // history.push(
          //   `/sets/commercial-sector/${id}/approve?commercialSector=${commercialSector}`
          // );
        },
        edit: (id) => {
          history.push(`/sets/commercial-sector/${id}/edit`);
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

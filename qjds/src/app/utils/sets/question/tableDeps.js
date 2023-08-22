import * as columnFormatters from "./column-formatters";
import { useDispatch } from "react-redux";
import { sortCaret } from "../../../../_metronic/_helpers";
import * as ComActions from "../../../modules/sets/_redux/question/questionActions";

export const GenerateColumns = (history, actions = true, 
    {
      refreshList = () => {},
    } = {}
  ) => {
  const dispatch = useDispatch();

  const approveProduct = (id) => {
    dispatch(ComActions.activateQuestion(id)).then(() => {
      //dispatch(ComActions.fetchQuestions());
      refreshList()
    });
  };

  let columns = [
    {
      dataField: "question_title",
      text: "Question Title",
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
        remove: (id, question) => {
          history.push(
            `/sets/question/${id}/delete?question=${question}`
          );
        },
        approve: (id) => {
          approveProduct(id);
        },
        edit: (id) => {
          history.push(`/sets/question/${id}/edit`);
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

import React from "react";
import { MixedWidget14 } from "../../../_metronic/_partials/widgets";
import { Nav, Tab } from "react-bootstrap";
import * as actions from './_redux/dashboard/dashboardActions'
import { useDispatch ,useSelector} from "react-redux";
const BussinessAmount = () => {
  const dispatch = useDispatch()
  const { contracts,quotes } = useSelector((state) => state.dashboard);
  const [key, setKey] = React.useState("Today");
  const [data, setData] = React.useState(null);
  const [quotation, setQuationData] = React.useState(null);
  const [contract, setContractData] = React.useState(null);
  console.log(contracts,quotes)
  React.useEffect(() => {
    if (quotes) {
      const Quatation = quotes.data.find((item) => item.duration === key);
      setQuationData(Quatation);
    }
  }, [key, quotes]);
  React.useEffect(() => {
    if (contracts) {
      const Contract = contracts.data.find((item) => item.duration === key);
      setContractData(Contract);
    }
  }, [key, contracts]);
  React.useEffect(() => {
    dispatch(actions.getContractStats())
    dispatch(actions.getQuotesStats())
    // setData(demoData);
  }, [dispatch]);

  console.log(quotation, "quotation", contract);
  return (
    <React.Fragment>
      <div
        className="card-header border-0 pt-5 col-lg-12 "
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label font-weight-bolder text-dark">
            Bussiness Amount
          </span>
          {/* <span className="text-muted mt-3 font-weight-bold font-size-sm">
     More than 400+ new members
   </span> */}
        </h3>
        <div className="card-toolbar">
          <Tab.Container defaultActiveKey={key}>
            <Nav
              as="ul"
              onSelect={(_key) => setKey(_key)}
              className="nav nav-pills nav-pills-sm nav-dark-75"
            >
              <Nav.Item className="nav-item" as="li">
                <Nav.Link
                  eventKey="Today"
                  className={`nav-link py-2 px-4 ${
                    key === "Today" ? "active" : ""
                  }`}
                >
                  Today
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="nav-item" as="li">
                <Nav.Link
                  eventKey="7 Days"
                  className={`nav-link py-2 px-4 ${
                    key === "7 Days" ? "active" : ""
                  }`}
                >
                  7 Days
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="nav-item" as="li">
                <Nav.Link
                  eventKey="30 Days"
                  className={`nav-link py-2 px-4 ${
                    key === "30 Days" ? "active" : ""
                  }`}
                >
                  30 Days
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="nav-item" as="li">
                <Nav.Link
                  eventKey="This Month"
                  className={`nav-link py-2 px-4 ${
                    key === "This Month" ? "active" : ""
                  }`}
                >
                  This Month
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Tab.Container>
        </div>
      </div>

      {quotation && contract ? (
        <div  style={{ backgroundColor:"white" ,display:"flex"}}>
          <div className="col-lg-6">
            <MixedWidget14
              className="card-stretch gutter-b"
              id="kt_mixed_widget_145_chart"
              title={"Quotation"}
              subtitle1={`Confirmed Quotations/Created quotations: ${quotation.confirmed}/${quotation.created})`}
              subtitle2={`Confirmed Amount in Quatation : $${quotation.amount}`}
              percentage={quotation.created == 0? 0: parseInt(
                (quotation.confirmed / quotation.created) * 100
              )}
              route="/quotes/all"
            />
          </div>
          <div className="col-lg-6">
            <MixedWidget14
              className="card-stretch gutter-b"
              id="kt_mixed_widget_1456_chart"
              title={"Contract"}
              subtitle1={`Confirmed Contracts/Created Contracts : ${contract.confirmed}/${contract.created}`}
              subtitle2={`Confirmed Amount: $${contract.amount}`}
              percentage={contract.created == 0? 0: parseInt(
                (contract.confirmed / contract.created) * 100
              )}
              route="/contracts/all"

            />
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default BussinessAmount;

// <div className="row  card card-custom">
// <div className="card-header border-0 pt-5 col-lg-8">
//   <h3 className="card-title align-items-start flex-column">
//     <span className="card-label font-weight-bolder text-dark">
//       Bussiness Amount
//     </span>
//     {/* <span className="text-muted mt-3 font-weight-bold font-size-sm">
//     More than 400+ new members
//   </span> */}
//   </h3>
//   <div className="card-toolbar">
//     <Tab.Container defaultActiveKey={key}>
//       <Nav
//         as="ul"
//         onSelect={(_key) => setKey(_key)}
//         className="nav nav-pills nav-pills-sm nav-dark-75"
//       >
//         <Nav.Item className="nav-item" as="li">
//           <Nav.Link
//             eventKey="Today"
//             className={`nav-link py-2 px-4 ${
//               key === "Today" ? "active" : ""
//             }`}
//           >
//             Today
//           </Nav.Link>
//         </Nav.Item>
//         <Nav.Item className="nav-item" as="li">
//           <Nav.Link
//             eventKey="7 Days"
//             className={`nav-link py-2 px-4 ${
//               key === "7 Days" ? "active" : ""
//             }`}
//           >
//             7 Days
//           </Nav.Link>
//         </Nav.Item>
//         <Nav.Item className="nav-item" as="li">
//           <Nav.Link
//             eventKey="30 Days"
//             className={`nav-link py-2 px-4 ${
//               key === "30 Days" ? "active" : ""
//             }`}
//           >
//             30 Days
//           </Nav.Link>
//         </Nav.Item>
//         <Nav.Item className="nav-item" as="li">
//           <Nav.Link
//             eventKey="This Month"
//             className={`nav-link py-2 px-4 ${
//               key === "This Month" ? "active" : ""
//             }`}
//           >
//             This Month
//           </Nav.Link>
//         </Nav.Item>
//       </Nav>
//     </Tab.Container>
//   </div>
// </div>
// {quotation && contract ? (
//   <div className="row">
//     <div className="col-lg-4">
//       <MixedWidget14
//         className="card-stretch gutter-b"
//         id="kt_mixed_widget_145_chart"
//         title={"Quotation"}
//         subtitle1={`Confirmed Quotations/Created quotations: ${quotation.confirmed}/${quotation.created})`}
//         subtitle2={`Confirmed Amount in Quatation : $${quotation.amount}`}
//         percentage={parseInt(
//           (quotation.confirmed / quotation.created) * 100
//         )}
//       />
//     </div>
//     <div className="col-lg-4">
//       <MixedWidget14
//         className="card-stretch gutter-b"
//         id="kt_mixed_widget_1456_chart"
//         title={"Contract"}
//         subtitle1={`Confirmed Contracts/Created Contracts : ${contract.confirmed}/${contract.created}`}
//         subtitle2={`Confirmed Amount: $${contract.amount}`}
//         percentage={parseInt(
//           (contract.confirmed / contract.created) * 100
//         )}
//       />
//     </div>
//   </div>
// ) : null}
// </div>

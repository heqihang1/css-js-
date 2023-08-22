// to be config待确认组件
// 原始是弹窗形式：文件为 confirmModal.js
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { FormLabel, Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  CardFooter,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import SelectFilter from "react-select";
import * as actions from "../../_redux/contracts/contractsActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Field, Form, Formik } from "formik";
import { DragDropFile } from "../../../../components/DragAndDrop";
import moment from "moment";
import { getActiveTeams } from "../../../sets/_redux/teams/teamsCrud"
import "../../../../../_metronic/_assets/sass/layout/_quoteApp.scss";

export const ToBeConfirm = ({
  actionsLoading,
  product = {},
  teams = []
}) => {
  let {
    contract_no,   //编号
    contract_amount,  //费率
    contract_period,  //期限
    contract_start_date,
    contract_end_date,
    services_set,  // 服务工作单
    customer_id, // 地址
  } = product

  function getMonthBetween(start, end) {//传入的格式YYYY-MM
    var result = [];
    var s = start.split("-");
    var e = end.split("-");
    var min = new Date();
    var max = new Date();
    var yearMonthCode;
    var yearMonth;
    min.setFullYear(s[0], s[1] * 1 - 1, 1);//开始日期
    max.setFullYear(e[0], e[1] * 1 - 1, 1);//结束日期
    var curr = min;
    while (curr <= max) {
      yearMonthCode = moment(curr).format('YYYY-MM')
      var month = curr.getMonth();
      var year = curr.getFullYear();

      var str = curr.getFullYear() + "-" + (month);
      var s = curr.getFullYear() + "-0";
      if (str == s) {
        str = curr.getFullYear() + "-1";
      }
      var m = month + 1
      result.push({
        yearMonthCode: yearMonthCode,
        yearMonth: year + '年' + m + '月'
      });
      curr.setMonth(month + 1);
    }
    return result;
  }

  const start = moment().startOf('day').add(9, 'hours').format('YYYY-MM-DD HH:mm')  // 默认开始时间
  const end = moment().endOf('day').format('YYYY-MM-DD HH:mm') // 默认结束时间

  const [dataSource, setDataSource] = useState(product)   // 数据源
  const [worksheet, setWorksheet] = useState([])

  const startD = moment(contract_start_date).format('YYYY-MM-DD')
  const endD = moment(contract_end_date).format('YYYY-MM-DD')

  const history = useHistory();
  const inputRef = React.useRef();
  const dispatch = useDispatch();
  const [period, setPeriod] = useState('');  // Contract Period合同年限
  const [startDate, setStartDate] = useState(startD);
  const [endDate, setEndDate] = useState(endD);
  const [dragActive, setDragActive] = React.useState(false); // 拖动状态
  const [filesSelected, setFilesSelected] = React.useState([]);

  // 服务工作单
  const [jobTotal, setJobTotal] = useState(0)   // 工作单总数
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [len, setLen] = useState(getMonthBetween(startD, endD).length)  // 定义状态用户选择日期计算月份


  useEffect(() => {

    setPeriod((dataSource?.contract_period) ? dataSource?.contract_period : contract_period || '')

    const jobTotal = services_set?.reduce((pre, item) => {
      const mun = Math.max.apply(Math, item.map(c => c.count))
      if (len > 12) {
        const count = mun == 12 ? mun + (len - 12) : mun == 4 ? mun + (Math.floor(len / 3) - 4)
          : mun == 2 ? mun + (Math.floor(len / 6) - 2) : mun == 1 ? mun + (Math.floor(len / 12) - 1) : ''
        return count + pre
      } else {
        const count = mun == 12 ? len : mun == 4 ? (Math.floor(len / 3) > 0 ? Math.floor(len / 3) : '') : mun == 2
          ? (Math.floor(len / 6) > 0 ? Math.floor(len / 6) : '')
          : mun == 1 ? (Math.floor(len / 12) > 0 ? Math.floor(len / 12) : '') : ''
        return count + pre
      }
    }, 0)
    setJobTotal(jobTotal)

    // 组装服务名称结构 
    new Promise((resolve, reject) => (
      resolve()
    )).finally(() => {
      const as = services_set?.map((item, index) => {
        return {
          team: teams?.map(t => {
            return {
              value: t._id,
              label: t.carPlateNumber
            }
          }),  // 服务团队的id
          actual_job_date: start, // 服务的开始时间 
          end_job_date: end,  // 服务的结束时间
          worker: (worksheet && worksheet[index]?.worker) ?? null,  // 服务人数量
          service_ids: item,  // 服务名称
          area: customer_id?.location_id, // 地址数据数组
          areaType: worksheet && worksheet[index]?.areaType === false ? false : true,
          teamType: worksheet && worksheet[index]?.teamType === false ? false : true,
        }
      })
      setWorksheet(as)
    })

  }, [services_set, dataSource, jobTotal, len])



  // 校验规则
  const valid = () => {
    const list = []
    for (let i = 0; i < worksheet.length; i++) {
      const obj = worksheet[i]
      if (obj.worker && !obj.teamType && !obj.areaType) {
        list.push(true)
        // setIsModalOpen(true)
      }
    }
    if(list.length === worksheet.length){
      setIsModalOpen(true)
    }
  }

  // 通过选择日期的区间 -- 来计算工作单数量
  const countMax = (el) => {
    const mun = Math.max.apply(Math, el.service_ids.map(c => c.count))
    if (len > 12) {
      return mun == 12 ? mun + (len - 12) : mun == 4 ? mun + (Math.floor(len / 3) - 4)
        : mun == 2 ? mun + (Math.floor(len / 6) - 2) : mun == 1 ? mun + (Math.floor(len / 12) - 1) : ''
    }
    return mun == 12 ? len : mun == 4 ? (Math.floor(len / 3) > 0 ? Math.floor(len / 3) : '') : mun == 2
      ? (Math.floor(len / 6) > 0 ? Math.floor(len / 6) : '')
      : mun == 1 ? (Math.floor(len / 12) > 0 ? Math.floor(len / 12) : '') : ''
  }

  // 变更开始日期和结束日期时间，下方工作单随即变化
  const contractStartDateChange = (s) => {
    setStartDate(s)
    if (s && endDate) {
      dateChange(s, endDate)
    }
  }
  const contractEndDateChange = (e) => {
    setEndDate(e)
    if (startDate && e) {
      dateChange(startDate, e)
    }
  }
  const dateChange = (s, e) => {
    if (s && e) {
      const length = getMonthBetween(s, e).length
      setLen(length)
    }
  }


  // 提交事件
  const confirm = async () => {
    const services = worksheet.map(item => {
      return {
        team: item.team.map(child => child.value).toString(),
        worker: item.worker,
        end_job_date: item.end_job_date,
        actual_job_date: item.actual_job_date,
        // service_ids: item.service_ids.map(child => child.service_id),
        service_ids: item.service_ids.map(child => child.time_id),
        area: item.area.map(child => child.value).toString(),
      }
    })
    const params = {
      contract_period: Number(period) || 0,  //合同期限
      contract_start_date: startDate,
      contract_end_date: endDate,
      jobs: services
    }
    if (filesSelected.length > 0 && filesSelected[0]?.file[0]) {
      let file = filesSelected[0].file[0];
      params.signed_document = {
        file_name: file.name,
        document: await toBase64(file),
      };
    }

    // console.log('参数====>', params);

    dispatch(actions.separateConfirmContract(product._id, params)).then((res) => {
      setIsModalOpen(false)
      history.push(`/contracts`);
    });
  }

  // 服务时间选择
  const startDateTimeChange = (ind, start) => {
    worksheet[ind].actual_job_date = moment(start).format('YYYY-MM-DD HH:mm')
    setWorksheet([...worksheet])
  }
  const endDateTimeChange = (ind, end) => {
    worksheet[ind].end_job_date = moment(end).format('YYYY-MM-DD HH:mm')
    setWorksheet([...worksheet])
  }
  // 服务人数
  const workerChange = (ind, w) => {
    worksheet[ind].worker = w
    setWorksheet([...worksheet])
  }
  // 地址
  const locationChange = (ind, l) => {
    worksheet[ind].area = [l]
    worksheet[ind].areaType = false
    setWorksheet([...worksheet])
  }
  // 服务团队
  const teamChange = (ind, t) => {
    worksheet[ind].team = [t]
    worksheet[ind].teamType = false
    setWorksheet([...worksheet])
  }


  // 确认签署文件触发事件
  const handleDragChange = function (e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };
  let handleFiles = (file) => {
    setFilesSelected([
      // ...filesSelected,
      {
        filename: file[0].name,
        size: (file[0].size / 1000000).toFixed(2),
        file,
      },
    ]);
  };
  // 处理拖动事件
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  // 文件删除事件
  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };
  // 单击按钮时触发输入
  const onButtonClick = () => {
    inputRef.current.click();
  };
  let removeFile = (index) => {
    setFilesSelected(filesSelected.filter((_, i) => i !== index));
  };
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });


  return (
    <>
      <Card>
        <CardHeader title={'Confirm Contract'}>
        </CardHeader>
        <CardBody>

          <Formik
          // validationSchema={valid}
          >
            {({ errors }) => (
              <Form className="form form-label-right" onDragEnter={handleDrag}>

                <div className="form-group" style={{ fontWeight: 'bold' }}>
                  Contract Info
                </div>

                <div className="form-group row d-flex justify-content-between">
                  <div className="col-lg-5">
                    <Field
                      disabled
                      withFeedbackLabel={false}
                      name="contract_no"
                      component={Input}
                      label="Contract Number"
                      value={contract_no}
                    />
                  </div>
                  <div className="col-lg-5">
                    <Field
                      disabled
                      withFeedbackLabel={false}
                      name="amount"
                      component={Input}
                      label="The amounts are as follows"
                      value={"$ " + contract_amount}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-lg-5">
                    <label>Contract Period <span className="indicatory">*</span></label>
                    <input
                      type="number"
                      className="form-control"
                      value={period}
                      onChange={(e) => {
                        setPeriod(e.target.value);
                      }}
                    />
                  </div>
                </div>

                <div className="form-group row d-flex justify-content-between">
                  <div className="col-lg-5">
                    <Field
                      withFeedbackLabel={false}
                      name="startDate"
                      type="date"
                      component={Input}
                      label="Contract Start Date"
                      value={startDate}
                      onChange={(e) => {
                        contractStartDateChange(e.target.value)
                      }}
                    />
                  </div>
                  <div className="col-lg-5">
                    <Field
                      withFeedbackLabel={false}
                      name="endDate"
                      type="date"
                      component={Input}
                      label="Contract End Date"
                      value={endDate}
                      onChange={(e) => {
                        contractEndDateChange(e.target.value)
                      }}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-lg-5">
                    <FormLabel>Confirmed Signed Document</FormLabel>
                    <DragDropFile
                      utils={{
                        handleChange: handleDragChange,
                        handleDrag,
                        handleDrop,
                        onButtonClick,
                        inputRef,
                        dragActive,
                        files: filesSelected,
                        removeFile,
                      }}
                    />
                  </div>
                </div>

                {/* 以下合约拆解的服务工作单 */}
                <div className="form-group mt-16" style={{ fontWeight: 'bold' }}>
                  Job Info（ Total Job Quantity： {jobTotal} ）
                </div>

                {/* 服务内容名称 */}
                {worksheet?.map((item, index) => (
                  <div key={index}>
                    <div style={{ borderBottom: '1px solid #ccc', marginBottom: '14px' }}></div>

                    <div className="form-group">
                      <tr className="row d-flex">
                        <th className="col-lg-7">Service Name</th>
                        <th className="col-lg-3">Calculation</th>
                        {/* <th className="col-lg-2">Job Quantity： {Math.max.apply(Math, item?.service_ids.map(c => c.count)) || ''} </th> */}
                        {/* countMax */}
                        <th className="col-lg-2">Job Quantity： {countMax(item)} </th>
                      </tr>
                      {item?.service_ids.map((child, ind) => (
                        <tr className="row">
                          <td className="col-lg-7">{child.service_name}</td>
                          <td className="col-lg-3">
                            {child.count == 12 ? 'Per month' : child.count == 4 ? 'Quarterly'
                              : child.count == 2 ? 'Every half year' : child.count == 1 ? 'per year' : ''}
                          </td>
                        </tr>
                      ))}
                    </div>

                    <div className="form-group row d-flex justify-content-between">
                      <div className="col-lg-5 hiddenYM">
                        {item.actual_job_date.slice(5, 7) == 1
                          || item.actual_job_date.slice(5, 7) == 10
                          || item.actual_job_date.slice(5, 7) == 12
                          ? <div className="hiddenYM_s">----/-- </div>
                          : <div className="hiddenYM_s hiddenYM_p">----/-- </div>}
                        <label>Job Start Date</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          value={item.actual_job_date}
                          onChange={(e) => startDateTimeChange(index, e.target.value)}
                        />
                      </div>
                      <div className="col-lg-5 hiddenYM">
                        {item.end_job_date.slice(5, 7) == 1 || item.end_job_date.slice(5, 7) == 10
                          || item.end_job_date.slice(5, 7) == 12
                          ? <div className="hiddenYM_s">----/-- </div>
                          : <div className="hiddenYM_s hiddenYM_p">----/-- </div>}
                        <label>Job End Date</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          value={item.end_job_date}
                          onChange={(e) => endDateTimeChange(index, e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group row d-flex justify-content-between">
                      <div className="col-lg-5">
                        <label>Assign to Team <span className="indicatory">*</span></label>
                        <SelectFilter
                          name="team"
                          options={teams?.map(t => ({
                            value: t._id,
                            label: t.carPlateNumber
                          })) || item.team}
                          placeholder="Select Assign to Team"
                          onChange={(e) => teamChange(index, e)}
                        />
                        {item.teamType ? (
                          <div className="text-danger">
                            Assign to Team is required
                          </div>
                        ) : ''}
                      </div>
                      <div className="col-lg-5">
                        <label>Worker <span className="indicatory">*</span></label>
                        <input
                          type="number"
                          className="form-control"
                          value={item.worker}
                          onChange={(e) => workerChange(index, e.target.value)}
                        />
                        {!item.worker ? (
                          <div className="text-danger">
                            Worker is required
                          </div>
                        ) : ''}
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-lg-5">
                        <label>Working Location <span className="indicatory">*</span></label>
                        <SelectFilter
                          name="working_location"
                          options={item.area.map(l => ({
                            value: l._id,
                            label: `(${l.location_name}) ${l.location_address}`
                          }))}
                          placeholder="Select Working Location"
                          onChange={(e) => locationChange(index, e)}
                        />
                        {item.areaType ? (
                          <div className="text-danger">
                            Working Location is required
                          </div>
                        ) : ''}
                      </div>
                    </div>

                  </div>
                ))}
              </Form>
            )}
          </Formik>
        </CardBody>

        <CardFooter>
          <CardHeaderToolbar>
            <button
              type="button"
              className="btn btn-secondary btn-elevate"
              onClick={() => { history.push("/contracts/on-confirm") }}
            >
              Back
            </button>
            <button
              type="button"
              className="btn btn-primary btn-elevate ml-4"
              onClick={valid}
            >
              Confirm
            </button>
          </CardHeaderToolbar>
        </CardFooter>
      </Card>

      {/* 二次确认弹窗 */}
      <Modal
        show={isModalOpen}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
            Confirm
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This contract job order quantity is <b> {jobTotal} </b>, Are you sure confirm the contract?
        </Modal.Body>
        <Modal.Footer>
          <div>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-secondary btn-elevate"
            >
              Back
            </button>
            <button
              type="button"
              className="btn btn-primary btn-elevate ml-4"
              onClick={confirm}
            >
              Confirm
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};



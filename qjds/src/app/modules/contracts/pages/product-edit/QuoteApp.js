import React, { useState, useImperativeHandle, forwardRef, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../../../../../_metronic/_assets/sass/layout/_quoteApp.scss";
// 假数据
const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k + offset}-${new Date().getTime()}`,
    content: `item ${k + offset}`
  }));

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};
const grid = 8;

// item样式
const getItemStyle = (isDragging, draggableStyle) => ({
  // 基本样式风格
  userSelect: "none",
  // padding: grid * 1,
  // margin: `0 0 ${grid}px 0`,
  // 拖动改变颜色
  background: isDragging ? "#f9f9f9" : "#edeff7",
  // 样式我们需要应用在可拖拽对象上
  ...draggableStyle
});

// list样式
const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "#edeff7" : "#edeff7",
  border: '1px solid',
  borderTop: 'none',
  width: '100%'
});

const Quantity = forwardRef((props, ref) => {
  const [state, setState] = useState(props.tableArr);
  const [len, setLen] = useState(props.len);
  const { addNew } = props;
  useImperativeHandle(ref, () => {
    return {
      state,
      len
    }
  }, [state, len])

  useEffect(() => {
    setState(props.tableArr)
    setLen(props.len)

  }, [props.tableArr, props.len])

  function onDragEnd(result) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      addNew(newState)
    } else {
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      addNew(newState.filter(group => group.length))
    }
  }

  // 通过选择日期的区间与calculation的选择 -- 来计算工作单数量
  const countMax = (el) => {
    // {
    //   len > 12 ? (
    //     Math.max.apply(Math, el.map(c => c.count)) == 12
    //       ? Math.max.apply(Math, el.map(c => c.count)) + len - 12
    //       : Math.max.apply(Math, el.map(c => c.count)) == 4
    //         ? Math.max.apply(Math, el.map(c => c.count)) + Math.floor(len / 3) - 4
    //         : Math.max.apply(Math, el.map(c => c.count)) == 2
    //           ? Math.max.apply(Math, el.map(c => c.count)) + Math.floor(len / 6) - 2
    //           : Math.max.apply(Math, el.map(c => c.count)) == 1
    //             ? Math.max.apply(Math, el.map(c => c.count)) + Math.floor(len / 12) - 1 : ''
    //   ) : ''
    // }

    const mun = Math.max.apply(Math, el.map(c => c.count))
    if (len > 12) {
      return mun == 12 ? mun + (len - 12) : mun == 4 ? mun + (Math.floor(len / 3) - 4)
        : mun == 2 ? mun + (Math.floor(len / 6) - 2) : mun == 1 ? mun + (Math.floor(len / 12) - 1) : ''
    }
    return mun == 12 ? len : mun == 4 ? (Math.floor(len / 3) > 0 ? Math.floor(len / 3) : '') : mun == 2
      ? (Math.floor(len / 6) > 0 ? Math.floor(len / 6) : '')
      : mun == 1 ? (Math.floor(len / 12) > 0 ? Math.floor(len / 12) : '') : ''
  }


  return (
    <div>
      {/* <button
        type="button"
        onClick={() => {
          setState([...state, getItems(1)]);
        }}
      >
        Add new item
      </button> */}
      <div style={{ borderBottom: '1px solid' }}></div>
      <div>
        <DragDropContext onDragEnd={onDragEnd}>
          {state.map((el, ind) => {
            const code = el.findIndex(val => val.count)

            return <Droppable key={ind} droppableId={`${ind}`}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  {el.map((item, index) => {
                    return ((item.service_name && item.count) ? <Draggable
                      key={item.time_id + 'key'}
                      draggableId={item.time_id + 'key'}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                          className="item-droppable-props"
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: 'calc(100% - 30px)',
                              alignItems: "center"
                            }}
                          >
                            <div style={{ padding: '6px', paddingRight: '10px' }}>
                              {item.service_name}
                            </div>
                            {el.length > 1 ? <div
                              className="add-buttona"
                              onClick={() => {
                                const newState = JSON.parse(JSON.stringify(state));
                                newState[ind].splice(index, 1);
                                props.addNew([...newState.filter(group => group.length), [item]])
                              }}
                            ></div> : null}
                          </div>
                          <div className="max-number">
                            <div className="left-border" />
                            {index === code ? (
                              <div className="left-border-number">
                                {countMax(el)}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      )}
                    </Draggable> : null)
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          })}
        </DragDropContext>
      </div>
    </div>
  );
})

export default Quantity;

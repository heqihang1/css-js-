
const initState = {
  language: "zh"
}

// 状态
const actionType = {
  IMAGE_URL: "IMAGE_URL"
}
// dispatch
const reducer = (state, action, val) => {
  switch (action.type) {
    case actionType.IMAGE_URL:
      const js = JSON.parse(JSON.stringify(state))
      js.language = action.val
      // console.log(state, val);
      return js
    default:
      return state
  }
}
export {
  initState,
  reducer,
  actionType,
}
import React from 'react'
import { initState, reducer } from "./useReducer";


function useStore() {
  const [init, dispatch] = React.useReducer(reducer, initState)
  const [language, setLanguage] = React.useState("zh")
  // 定义注入数据以及方法
  return {
    init,
    language,
    dispatch,
    setLanguage,
  }
}
export default useStore
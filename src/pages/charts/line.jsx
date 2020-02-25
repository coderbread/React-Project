import React, { useEffect } from 'react'
import { Modal } from 'antd'

export default function Line(props) {
  useEffect(() => {
    let secondsToGo = 5
    const modal = Modal.info({
      title: '对不起，当前数据未满足图表所需...',
      content: `该窗口将在${secondsToGo}秒后关闭，并转到首页`,
      onOk: () => props.history.replace('/')
    })
    const timer = setInterval(() => {
      secondsToGo -= 1
      modal.update({
        content: `该窗口将在${secondsToGo}秒后关闭，并转到首页`,
      })
    }, 1000)
    setTimeout(() => {
      clearInterval(timer)
      modal.destroy()
      props.history.replace('/')
    }, secondsToGo * 1000)
    // eslint-disable-next-line 
  }, [])
  return (
    <div>
      
    </div>
  )
}

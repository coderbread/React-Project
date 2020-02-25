import React, { useState, useEffect, useRef } from 'react'
import { withRouter } from 'react-router-dom'
import './index.less'
import menuList from '../../config/menuConfig'
import dataFormat from '../../utils/dateFormat'
import memory from '../../utils/memory'
import storage from '../../utils/storage'
import { reqWeather } from '../../api'
import { Icon, Modal } from 'antd'
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1637136_aopcyzy4g.js',
})

function Header(props) {
  const [date, setDate] = useState('loading...')
  const [weatherData, setWeatherData] = useState({})
  const timerRef = useRef()

  useEffect(() => {
    getTime()
    return () => {
      timerRef.current && clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    getWeatherData()
  }, [])

  function getTime() {
    timerRef.current = setInterval(() => {
      setDate(dataFormat('yyyy年MM月dd日 hh:mm:ss', new Date()))
    }, 1000)
  }

  function getTitle() {
    const path = props.location.pathname
    let title
    menuList.forEach(item => {
      if (item.key === path) {
        title = item.title
      } else if (item.children) {
        const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
        if (cItem) {
          title = cItem.title
        }
      }
    })
    return title
  }

  function logout() {
    Modal.confirm({
      title: '确定退出吗?',
      content: '退出后需要重新登录...',
      onOk() {
        //删除内存和本地的user数据
        memory.user = {}
        storage.removeUser()
        //跳转到登录页
        props.history.replace('/login')
      }
    });
  }

  async function getWeatherData() {
    const response = await reqWeather('上海')
    const result = response.data.HeWeather6[0].now
    setWeatherData(result)
  }

  return (
    <div className="header">
      <div className="header-top">
        <span className="welcome">欢迎你，{memory.user.username}</span>|
        <span className="tuichu" onClick={logout}>
          <IconFont className="tuichu-icon" type="admintuichufffpx" />
          退出
        </span>
      </div>
      <div className="header-bottom">
        <div className="left">
          {/* 每次更新数据都会执行getTitle，之后用redux统一管理 */}
          &nbsp;&nbsp;{getTitle()}&nbsp;&nbsp;
            </div>
        <div className="right">
          <span>{date}</span>
          <IconFont className="tianqi-icon" type="admintianqi" />
          <span>{weatherData.cond_txt}  &nbsp;&nbsp;当前气温: {weatherData.tmp}℃</span>
        </div>
      </div>
    </div>
  )
}

export default withRouter(Header)
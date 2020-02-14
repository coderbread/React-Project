import axios from 'axios'
import { message } from 'antd'

//封装异步请求
export default function ajax(url, data = {}, type = 'GET') {
  //统一处理请求异常
  return new Promise((resolve, rej) => {
    let promise
    if (type === 'POST') {
      promise = axios.post(url, data)
    } else {
      promise = axios.get(url, {
        params: data
      })
    }
    promise.then(value => {
      resolve(value)
    }, error => {
      message.error('请求出错了！' + error.message)
    })
  })
}
// 入口文件
import React from 'react';
import ReactDOM from 'react-dom'

import App from './App'

import storage from './utils/storage';
import memory from './utils/memory';

//从loacl中读取user数据，再保存在内存中
const user = storage.getUser()
memory.user = user

ReactDOM.render(<App />, document.getElementById('root'))
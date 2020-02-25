import React, { Component } from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import 'antd/dist/antd.css'

//根组件
export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login}></Route>
          <Route path="/" component={Home}></Route>
        </Switch>
      </BrowserRouter>
    );
  }
}


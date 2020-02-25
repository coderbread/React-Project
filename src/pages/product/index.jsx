import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import ProductHome from './ProductHome'
import Detail from './Detail'
import AddUpdata from './AddUpdata'

import './index.less'

export default function Product() {
  return (
    <Switch>
      <Route exact path="/product"  component={ProductHome} />
      <Route path="/product/addupdate"  component={AddUpdata}/>
      <Route path="/product/detail" component={Detail} />
      <Redirect to="/product" />
    </Switch>
  )
}

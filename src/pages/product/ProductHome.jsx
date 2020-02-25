import React, { useState, useEffect, useRef } from 'react'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import { Card, Button, Select, Icon, Input, Table, message } from 'antd'
const Option = Select.Option
export default function ProductHome(props) {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [searchName, setSearchName] = useState('')
  const [searchType, setSearchType] = useState('productName')
  const pageNumRef = useRef()

  useEffect(() => {
    getProducts(1)
    // eslint-disable-next-line
  }, [])

  async function getProducts(pageNum) {
    pageNumRef.current = pageNum
    setIsLoading(true)
    let response
    if (searchName) {
      response = await reqSearchProducts({ pageNum, pageSize: 5, searchName, searchType })
    } else {
      response = await reqProducts(pageNum, 5)
    }
    if (response.data.status === 0) {
      const { total, list } = response.data.data
      setProducts(list)
      setTotal(total)
      setIsLoading(false)
    }
  }
  async function updateStatus(productId, status){
    const response =  await reqUpdateStatus(productId, status)
    if(response.data.status === 0){
      message.success('更新商品成功')
      getProducts(pageNumRef.current)
    }
  }

  const title = (
    <span>
      <Select value={searchType} style={{ width: 120 }} onChange={value => setSearchType(value)}>
        <Option value="productName">按名称搜索</Option>
        <Option value="productDesc">按描述搜索</Option>
      </Select>
      <Input placeholder="关键字" style={{ width: 160, margin: '0 4px 0 8px' }} value={searchName} onChange={e => setSearchName(e.target.value)} />
      <Button type="primary" onClick={() => getProducts(1)}>搜索</Button>
    </span>
  )
  const extra = (
    <Button type="primary" onClick={() => props.history.push('/product/addupdate')}>
      <Icon type="plus" />
      添加
    </Button>
  )
  const columns = [
    {
      title: '商品名称',
      dataIndex: 'name',
      width: 240
    },
    {
      title: '商品描述',
      dataIndex: 'desc',
      // ellipsis: true,
      width: 500
    },
    {
      title: '价格',
      dataIndex: 'price',
      render: (price) => ('￥' + price)
    },
    {
      title: '状态',
      width: 136,
      render: (product) => {
        const {_id, status} = product
        return (
          <span>
            <span style={{ marginRight: 8 }}>{status === 1 ? '在售' : '已下架'}</span>
            <Button
              ghost
              size="small"
              type="primary"
              onClick={() => updateStatus(_id, status === 1 ? 2 : 1)}
            >
              {status === 1 ? '下架' : '上架'}
            </Button>
          </span>
        )
      }
    },
    {
      title: '操作',
      render: (product) => (
        <div>
          <Button
            ghost
            size="small"
            type="primary"
            style={{ marginRight: 6 }}
            onClick={() => props.history.push('/product/detail', product)}
          >详情
          </Button>
          <Button 
            ghost 
            size="small" 
            type="primary" 
            onClick={() => props.history.push('/product/addupdate', product)}
          >修改</Button>
        </div>
      )
    }
  ]
  return (
    <Card title={title} extra={extra}>
      <Table
        bordered
        rowKey="_id"
        loading={isLoading}
        dataSource={products}
        columns={columns}
        pagination={{ total, defaultPageSize: 5, showQuickJumper: true, current: pageNumRef.current }}
        onChange={({ current }) => getProducts(current)}
      />
    </Card>
  )
}

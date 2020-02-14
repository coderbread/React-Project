import React, { useState, useEffect } from 'react'
import { reqCategories } from '../../api';
import { Card, Button, Icon, Table, message } from 'antd'

export default function Category() {
  const [columns] = useState(function getInitialState() {
    return initColumns()
  })
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [parentId, setParentId] = useState('0')
  const [parentName, setParentName] = useState('')

  useEffect(() => {
    getCategories(parentId)
  }, [parentId])

  function showSubcategories(category){

  }
  function initColumns() {
    return ([
      {
        title: '分类名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '分类操作',
        width: '300px',
        dataIndex: '',
        key: 'action',
        render: (category) => (
          <div>
            <Button ghost type="primary">修改分类</Button>&nbsp;&nbsp;&nbsp;&nbsp;
            <Button ghost type="primary" onClick={() => { showSubcategories(category) }}>查看子分类</Button>
          </div>
        )
      }
    ])
  }
  async function getCategories(_id) {
    setIsLoading(true)
    const response = await reqCategories(_id)
    setIsLoading(false)
    if (response.status === 200) {
      const result = response.data.data
      if (_id === '0') {
        setCategories(result)
      } else {
        setSubCategories(result)
      }
    } else {
      message.error('获取分类列表失败')
    }
  }

  return (
    <div>
      <Card
        title="一级分类列表"
        extra={
          <Button type="primary">
            <Icon type="plus" />
            添加
          </Button>}
        style={{ width: '100%' }}>
        <Table
          rowKey="_id"
          bordered
          loading={isLoading}
          dataSource={categories}
          columns={columns}
          pagination={{ defaultPageSize: 5, showQuickJumper: true }} />
      </Card>
    </div>
  )
}

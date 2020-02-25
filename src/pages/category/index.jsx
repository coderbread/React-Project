import React, { useState, useEffect } from 'react'
import { reqCategories, reqAddCategory, reqUpdateCategory } from '../../api';
import { Card, Button, Icon, Table, message, Modal, Form, Select, Input } from 'antd'
const { Item } = Form
const { Option } = Select

function Category(props) {
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const state = useState('0')
  const [parentId, setParentId] = state
  const [parentName, setParentName] = useState('')
  const [currentCategory, setCurrentCategory] = useState({})
  const [visibleStatus, setVisibleStatus] = useState(0)
  const [confirmLoading, setConfirmLoading] = useState(false)

  useEffect(() => {
    getCategories(parentId)
  }, [parentId])

  function showCategories() {
    setParentId('0')
    setParentName('')
    setSubCategories([])
  }
  function showSubcategories(category) {
    setParentName(category.name)
    setParentId(category._id)
  }
  async function getCategories(parentId) {
    setIsLoading(true)
    const response = await reqCategories(parentId)
    setIsLoading(false)
    if (response.status === 200) {
      const result = response.data.data
      if (parentId === '0') {
        setCategories(result)
      } else {
        setSubCategories(result)
      }
    } else {
      message.error('获取分类列表失败')
    }
  }
  function handleCancel() {
    props.form.resetFields()
    setVisibleStatus(0)
  }
  function showAddModal() {
    console.log()
    setVisibleStatus(1)
  }
  function addCategory() {
    props.form.validateFields(async (err, values) => {
      if(!err){
        setConfirmLoading(true)
        const { parentId, categoryName } = values
        props.form.resetFields()//清除掉input里的默认值
        await reqAddCategory(parentId, categoryName)
        setTimeout(() => {
          if (parentId === state[0]) {
            getCategories(parentId)
          }
          setConfirmLoading(false)
          //清除掉input里的默认值
          props.form.resetFields()
          setVisibleStatus(0)
          message.success('添加成功')
        }, 500)
      }
    })
  }
  function showUpdateModal(category) {
    setCurrentCategory(category)
    setVisibleStatus(2)
  }
  function updateCategory() {
    props.form.validateFields(async (err, values) => {
      if(!err){
        setConfirmLoading(true)
        const categoryId = currentCategory._id
        const {categoryName} = values
        props.form.resetFields()//清除掉input里的默认值
        await reqUpdateCategory(categoryId, categoryName)
        setTimeout(() => {
          getCategories(parentId)
          setConfirmLoading(false)
          setVisibleStatus(0)
          message.success('更新成功')
        }, 500)
      }
    })
  }

  const title = parentId === '0' ? '一级分类列表' : (
    <>
      <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={showCategories}>一级分类标签</span>
      <Icon type="double-right" style={{ marginLeft: 10, marginRight: 10 }} />
      <span>{parentName}</span>
    </>
  )
  const extra = (
    <Button type="primary" onClick={showAddModal}>
      <Icon type="plus" />
      添加
    </Button>
  )
  const columns = [
    {
      title: '分类名',
      dataIndex: 'name',
    },
    {
      title: '分类操作',
      width: '360px',
      dataIndex: '',
      render: (category) => (
        <div>
          <Button 
            ghost 
            type="primary" 
            onClick={() => { showUpdateModal(category) }}
          >
            修改分类
          </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
          {parentId === '0' ? <Button ghost type="primary" onClick={() => { showSubcategories(category) }}>查看子分类</Button> : null}
        </div>
      )
    }
  ]

  return (
    <div>
      <Card
        title={title}
        extra={extra}
        style={{ width: '100%' }}
      >
        <Table
          rowKey="_id"
          bordered
          loading={isLoading}
          dataSource={parentId === '0' ? categories : subCategories}
          columns={columns}
          pagination={{ defaultPageSize: 6, showQuickJumper: true }}
        />
      </Card>
      <Modal
        title="添加分类"
        visible={visibleStatus === 1}
        onOk={addCategory}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form>
          <Item>
            {
              props.form.getFieldDecorator('parentId', {
                initialValue: parentId
              })(
                <Select>
                  <Option value="0">一级分类</Option>
                  {categories.map(item => (
                    <Option 
                      value={item._id}
                      key={item._id}
                    >{item.name}</Option>
                  ))}
                </Select>
              )
            }
          </Item>
          <Item>
            {
              props.form.getFieldDecorator('categoryName', {
                initialValue: '',
                rules: [
                  {required: true, message: '分类名不能为空'}
                ]
              })(
                <Input placeholder="请输入分类名称" />
              )
            }
          </Item>
        </Form>
      </Modal>
      <Modal
        title="更新分类名"
        visible={visibleStatus === 2}
        onOk={updateCategory}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form>
          <Item>
            {
              props.form.getFieldDecorator('categoryName', {
                initialValue: currentCategory.name,
                rules: [
                  { required: true, message: '分类名不能为空' }
                ]
              })(
                <Input placeholder="请输入分类名称" />
              )
            }
          </Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Form.create()(Category)

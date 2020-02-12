import ajax from './ajax'
//包含应用中所有接口请求函数的模块
//1.登录
export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST')

//2.添加用户
export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST')

//3.更新用户

//4.获取所有用户列表

//5.删除用户

//6.获取一级或某个二级分类列表
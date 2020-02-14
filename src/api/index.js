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
export const reqCategories = (parentId) => ajax('/manage/category/list', { parentId })
//7.添加分类
export const reqAddCategory = (parentId, categoryName) => ajax('/manage/category/add', { parentId, categoryName }, 'POST')
//8.更新分类名
export const reqUpdateCategory = (parentId, categoryName) => ajax('/manage/category/update', { parentId, categoryName }, 'POST')
//x.jsonp 获取天气信息
export const reqWeather = (city) => ajax(
    `https://free-api.heweather.net/s6/weather/now?location=${city}&key=747f2766f2104f80a97593f6dce69a49`
)

//包含应用中所有接口请求函数的模块
import ajax from './ajax'

//1.登录
export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST')

//2.添加用户
export const reqAddOrUpdateUser = (user) => ajax('/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')

//3.获取所有用户列表
export const reqUserList = () => ajax('/manage/user/list')

//4.删除用户
export const reqDeleteUser = (userId) => ajax('/manage/user/delete', {userId}, 'POST')

//5.获取一级或某个二级分类列表
export const reqCategories = (parentId) => ajax('/manage/category/list', { parentId })

//6.添加分类
export const reqAddCategory = (parentId, categoryName) => ajax('/manage/category/add', { parentId, categoryName }, 'POST')

//7.更新分类名
export const reqUpdateCategory = (categoryId, categoryName) => ajax('/manage/category/update', { categoryId, categoryName }, 'POST')

//8.删除图片
export const reqDeleteImg = (name) => ajax('/manage/img/delete', { name }, 'POST')

//9.添加或修改商品
export const reqAddOrUpdateProduct = (product) => ajax('/manage/product/' + (product.id ? 'update' : 'add'), product, 'POST')

//10.获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list', { pageNum, pageSize })

//11.搜索商品分类列表
//tips: searchType: productName || productDesc
export const reqSearchProducts = ({ pageNum, pageSize, searchName, searchType }) => ajax('/manage/product/search', { pageNum, pageSize, [searchType]: searchName })

//12.根据商品id获取分类名
export const reqCategory = (categoryId) => ajax('/manage/category/info', { categoryId })

//13.上架和下架商品
export const reqUpdateStatus = (productId, status) => ajax('/manage/product/updateStatus', { productId, status }, 'POST')

//15.获取所有角色列表
export const reqRoles = () => ajax('/manage/role/list')

//14.添加角色
export const reqAddRole = (roleName) => ajax('/manage/role/add', { roleName }, 'POST')

//15.设置/更新角色权限
export const reqUpdateRole = (role) => ajax('/manage/role/update', role, 'POST')

//xx.获取天气信息 支持jsonp
export const reqWeather = (city) => ajax(
    `https://free-api.heweather.net/s6/weather/now?location=${city}&key=747f2766f2104f80a97593f6dce69a49`
)

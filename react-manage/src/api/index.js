/*
要求: 能根据接口文档定义接口请求
包含应用中所有接口请求函数的模块
每个函数的返回值都是promise

基本要求: 能根据接口文档定义接口请求函数
 */

 import request from './request';
 import {message} from 'antd';
 import jsonp from 'jsonp';
 import ipConfig from '../../server/index';

 const BASE = ipConfig.apiHost; // 根据环境切换不同的ip

 // 写箭头函数的原因是 不用加 {} 并且 return
 export const reqLogin = (username,password) => request(BASE + '/login',{username,password},'POST')
// json请求的接口请求函数
export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
      const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
      // 发送jsonp请求
      jsonp(url, {}, (err, data) => {
        console.log('jsonp()', err, data)
        // 如果成功了
        if (!err && data.status==='success') {
          // 取出需要的数据
          const {dayPictureUrl, weather,temperature} = data.results[0].weather_data[1]
          resolve({dayPictureUrl, weather,temperature})
        } else {
          // 如果失败了
          message.error('获取天气信息失败!')
        }
  
      })
    })
}
// 获取一级/二级分类的列表
export const reqCategorys = (parentId) => request(BASE + '/manage/category/list', {parentId})

// 添加分类
export const reqAddCategory = (categoryName, parentId) => request(BASE + '/manage/category/add', {categoryName, parentId}, 'POST')

// 更新分类
export const reqUpdateCategory = ({categoryId, categoryName}) => request(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST')

// 获取所有角色的列表
export const reqRoles = () => request(BASE + '/manage/role/list')

// 添加角色
export const reqAddRole = (roleName) => request(BASE + '/manage/role/add', {roleName}, 'POST')

// 添加角色
export const reqUpdateRole = (role) => request(BASE + '/manage/role/update', role, 'POST')

// 获取所有用户的列表
export const reqUsers = () => request(BASE + '/manage/user/list')

// 删除指定用户
export const reqDeleteUser = (userId) => request(BASE + '/manage/user/delete', {userId}, 'POST')

// 添加/更新用户
export const reqAddOrUpdateUser = (user) => request(BASE + '/manage/user/'+(user._id ? 'update' : 'add'), user, 'POST')
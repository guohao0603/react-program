/*
    能发送异步ajax请求的函数模块
    封装axios库
    函数的返回值是promise对象
    1.优化1：统一处理请求异常？
        在外层包一个自己创建的promise对象
        在请求出错时，不reject(error),而是显示错误提示
    2.优化2：异步得到不是response，而是response.data
        在请求成功resolve时：resolve(response.data)
*/

import axios from 'axios';
import {message} from 'antd';


// http request拦截器 添加一个请求拦截器

axios.interceptors.request.use(
    config => {
        config.headers['accessToken'] = window.localStorage.getItem("accessToken") || "9lOdusGT6rq"
        config.headers['clientId'] = 'admin'
        config.headers['grantType'] = 'password'
        config.headers['Accept'] = 'application/json'
        config.headers['clientSecret'] = 'Dz69lOdusGT6rqhU'
        config.headers['Content-Type'] = 'application/json'
        return config;
    },
    error => {
        console.log('request interceptors onreject')
        return Promise.reject(error);
    }
)



export default function request(url, data = {}, type = 'GET'){
    return new Promise((resolve,reject)=>{
        let promise;
        // 1.执行异步请求
        if (type === 'GET') {
            let values = {
                ...data
            }
            promise = axios.get(url, { // 配置对象
                params: values    // 指定请求参数
            })
        }else if (type === 'POST') {
            let values = {
                ...data
            }
            promise = axios.post(url, values)
        }
        //2.如果成功了，调用resolve(value)
        promise.then(response =>{
            resolve(response.data)
        }).catch(error =>{
            message.error('请求出错了:'+error.message)
        })
    })
}
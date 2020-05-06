import React,{Component} from 'react';
import {withRouter} from 'react-router-dom'
import { Modal} from 'antd'
import './index.less';
import {isAuthenticated,logout} from '../../utils/Session';
import LinkButton from '../linkButton';
import menuList from '../../config/menuConfig';
import {formateDate} from '../../utils/dateUtils';
import {reqWeather} from '../../api';
 class Header extends Component{
    constructor (props) {
        super(props)

        this.state = {
            currentTime: formateDate(Date.now()), // 当前时间字符串
            dayPictureUrl: '', // 白天天气图片url
            weather: '', // 天气的文本
            temperature: '' // 当前温度
        }
    }
    // 获取当前时间
    getTime = () => {
        // 每隔1s获取当前时间, 并更新状态数据currentTime
        this.intervalId = setInterval(() => {
          const currentTime = formateDate(Date.now())
          console.log(currentTime)
          this.setState({currentTime})
        }, 1000)
    }
    // 获取当前天气
    getWeather = async () => {
        // 调用接口请求异步获取数据
        const {dayPictureUrl, weather,temperature} = await reqWeather('长治')
        // 更新状态
        this.setState({dayPictureUrl, weather,temperature})
    }
    // 获取当前页面标题
    getTitle = ()=>{
        let path = this.props.location.pathname;
        let title;
        menuList.map((item)=>{
           if (item.key === path) {
                title = item.title;
           }else if (!!item.children) {
                 // 在所有子item中查找匹配的
                const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                // 如果有值才说明有匹配的
                if(cItem) {
                // 取出它的title
                title = cItem.title
                }
           }
        })
        return title;
    }
    // 退出登录
    logout = ()=> {
         // 显示确认框
        Modal.confirm({
            content: '确定退出吗?',
            onOk: () => {
            console.log('OK', this)
            // 删除保存的user数据
            logout();
    
            // 跳转到login
            this.props.history.replace('/login')
            }
        })
    }

    componentDidMount () {
        this.getTime();
        this.getWeather();
    }
    // 当前组件卸载之前调用
    componentWillUnmount () {
        // 清除定时器
        clearInterval(this.intervalId)
    }
    render () {
        
        const {username} = JSON.parse(isAuthenticated())
       
        const title = this.getTitle();
        const {currentTime,dayPictureUrl,weather,temperature} = this.state;
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎, {username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                    </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather"/>
                        <span>{weather}</span>
                        <span className='header-bottom-right-temp'>{temperature}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header);
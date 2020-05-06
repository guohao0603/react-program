/*
    后台管理的路由组件
*/
import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'
import { Layout } from 'antd';
import LeftNav from '../../components/leftnav';
import Header from '../../components/header';
import ContentMenu from '../../components/contentMenu';
import {isAuthenticated} from  '../../utils/Session'

const {Footer, Sider, Content } = Layout;

export default class Admin extends Component {
    render () {
        if(!isAuthenticated()) {
            // 自动跳转到登陆(在render()中)
            return <Redirect to='/login'/>
        }
        return (
            <Layout style={{minHeight: '100%'}}>
                <Sider>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header/>
                    <Content style={{margin:'20px',
                        backgroundColor:'#ffffff',
                        minHeight: document.documentElement.clientHeight - 149
                    }}>
                        <ContentMenu/>
                    </Content>
                    <Footer style={{textAlign:'center',color:'#cccccc'}}>推荐使用谷歌浏览器,页面获得更佳操作</Footer>
                </Layout>
            </Layout>
        )
    }
}
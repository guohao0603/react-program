/*
    登录的路由组件
*/
import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'
import './login.less';
import logo from '../../assets/images/w.jpg';
import { Form, Icon, Input, Button,message} from 'antd';
import {reqLogin} from '../../api';
import {authenticateSuccess,isAuthenticated} from  '../../utils/Session'

const Item = Form.Item; // 不能卸载import之前
class Login extends Component {

    handleSubmit = (event)=> {
        event.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            // 校验成功
            if (!err) {
                const {username,password} = values;
                const result = await reqLogin(username,password)
                if (result.status===0 ) {
                    const user = result.data
                    authenticateSuccess(JSON.stringify(user));
                    message.success('登录成功');
                    this.props.history.replace('/');
                }else if (result.status === 1){
                    message.error(result.msg)
                }
            }else {
                console.log('校验失败')
            }
        })

    }
    validatePwd = (rule, value, callback)=>{
        if (!value) {
            callback('密码必须输入')
        }else if (value.length <= 4){
            callback('密码长度不能小于4')
        }else if (value.length >12){
            callback('密码长度不能大于12')
        }else if (!/^[a-zA-Z0-9]+$/.test(value)){
            callback('密码必须是英文数字下划线')
        }else {
            callback()
        }
    }

    render () {
        // 判断用户是否登录
        if (isAuthenticated()) {
            return <Redirect to='/'/>
        }
        // !!isAuthenticated() ? this.props.history.replace('/') : this.props.history.replace('/login')
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='login'>
                <header className='login-header'>
                    <img src={logo} alt="logo"/>
                    <div className='login-header-content'>后台管理系统</div>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Item>
                            {getFieldDecorator('username', {
                                    rules: [
                                        { required: true, whitespace: true, message: '用户名必须输入'},
                                        { min: 4, message: '用户名至少4位'},
                                        { max: 12, message: '用户名最多12位'},
                                        { pattern: /^[a-zA-Z0-9]+$/, message:'用户名必须是英文数字下划线'}
                                    ]
                                    
                                })(
                                    <Input
                                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="用户名"
                                    />
                                )
                            }
                        </Item>
                        <Item>
                        {getFieldDecorator('password', 
                            {
                                rules: [
                                    {validator: this.validatePwd}
                                ]
                            })(
                                    <Input
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type="password"
                                        placeholder="密码"
                                    />
                                )
                            }
                        </Item>
                        <Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Item>
                    </Form>
                </section>
            </div>
        )
    }
}

const WrapLogin = Form.create()(Login);
export default WrapLogin;
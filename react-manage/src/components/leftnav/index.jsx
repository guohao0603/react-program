import React,{Component} from 'react';
import {Link,withRouter} from 'react-router-dom';
import './index.less';
import logo from '../../assets/images/w.jpg';
import { Menu, Icon} from 'antd';
import menuList from '../../config/menuConfig';
import {isAuthenticated} from '../../utils/Session'

const { SubMenu } = Menu;
class leftNav extends Component {
    /*
        渲染菜单节点
    */
   /*
    getMenuNodes_map = (menuList) => {
        return menuList.map(item => {
            if (!item.children) {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon}/>
                            <span>{item.title}</span>
                        </Link>
                  </Menu.Item>
                )
            }else {
                return (
                    <SubMenu
                        key={item.key}
                        title={
                        <span>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </span>
                        }
                    > 
                       {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }
        })
    }
    */

    // 判断当前登录用户对item是否有权限
    hasAuth = (item)=>{
        const {key,isPublic} = item
        const sessionUser = JSON.parse(isAuthenticated())
        
        const menus = sessionUser.role.menus
        const username = sessionUser.username

        /*
            1.如果当前用户是admin
            2.如果当前item是公开的
            3.如果当前用户有此item的权限：key在menu中

        */
       if (username === 'admin' || isPublic || menus.indexOf(key)!==-1) {
           return true
       }else if (item.children) {
           return !!item.children.find(child => menus.indexOf(child.key)!==-1)
       }
       return false
    }
    getMenuNodes = (menuList) =>{
        const path = this.props.location.pathname;
        return menuList.reduce((pre,item)=>{
            // 如果当前用户有item对应得权限，才需要显示对应得菜单项
            if (this.hasAuth(item)){
                // 向pre添加<Menu.Item>
                if (!item.children) {
                    pre.push(
                        (
                            <Menu.Item key={item.key}>
                                <Link to={item.key}>
                                    <Icon type={item.icon}/>
                                    <span>{item.title}</span>
                                </Link>
                            </Menu.Item>
                        )
                    )
                }else {
                    // 查找一个与当前请求路径匹配的字Item
                    const cItem = item.children.find((cItem)=>{return cItem.key === path});
                    // 如果存在当前item的子列表需要打开
                    if (cItem) {
                        this.openKey = item.key;
                    }
                    pre.push(
                        (
                            <SubMenu
                                key={item.key}
                                title={
                                <span>
                                    <Icon type={item.icon} />
                                    <span>{item.title}</span>
                                </span>
                                }
                            > 
                            {this.getMenuNodes(item.children)}
                            </SubMenu>
                        )
                    )
                }
            }
            return pre;
        },[])
    }
    UNSAFE_componentWillMount () {
        this.menuNodes = this.getMenuNodes(menuList)
    }

    render () {
       const path = this.props.location.pathname;
       const openKey = this.openKey;
        return (
            <div className='left-nav'>
                <Link to='/' className='left-nav-header'>
                    <img src={logo} alt="logo"/>
                    <div className='left-nav-content'>后台管理</div>
                </Link>
                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                >
                    {
                      this.menuNodes
                    }
                 </Menu>
            </div>
        )
    }
}

export default withRouter(leftNav)
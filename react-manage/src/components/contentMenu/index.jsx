import React,{Component} from 'react';
import { withRouter, Switch, Redirect,Route} from 'react-router-dom';
import LoadableComponent from '../../utils/LoadableComponent';

//参数一定要是函数，否则不会懒加载，只会代码拆分
const Home = LoadableComponent(()=>import('$views/home/home'))  
// import Home from 'views/home/home'
const Category = LoadableComponent(()=>import('$views/category/category'))  
const Product = LoadableComponent(()=>import('$views/product/product'))  
const Role = LoadableComponent(()=>import('$views/role/role'))  
const User = LoadableComponent(()=>import('$views/user/user'))  
const Bar = LoadableComponent(()=>import('$views/charts/bar'))  
const Line = LoadableComponent(()=>import('$views/charts/line'))  
const Pie = LoadableComponent(()=>import('$views/charts/pie'))  
const NotFound = LoadableComponent(()=>import('$views/notFound/notFound'))

class ContentMenu extends Component {
    render () {
        return (
            <div>
                <Switch>
                    {/* exact 精确匹配 只要是 / 就转到 /home */}
                    <Redirect exact from='/' exact to='/home'/> 
                    <Route  path='/home' component={Home}/>
                    <Route  path='/category' component={Category}/>
                    <Route  path='/product' component={Product}/>
                    <Route  path='/role' component={Role}/>
                    <Route  path='/user' component={User}/>
                    <Route  path='/charts/bar' component={Bar}/>
                    <Route  path='/charts/line' component={Line}/>
                    <Route  path='/charts/pie' component={Pie}/>
                    {/* 如果上面的都没匹配到就匹配404页面 */}
                    <Route component={NotFound}/>
                </Switch>
            </div>
        )
    }
}

export default ContentMenu;

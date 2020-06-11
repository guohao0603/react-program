import React,{Component} from 'react';
import {Switch,Route, Redirect} from 'react-router-dom';
import ProductHome from './home';
import ProductAddUpdate from './addUpdate';
import ProductDetail from './detail';


export default class Product extends Component{
    render () {
        return (
            <Switch>
                {/* 路径完全匹配 exact */}
                <Route exact path='/product' component={ProductHome}/>
                <Route exact path='/product/addUpdate' component={ProductAddUpdate}/>
                <Route exact path='/product/detail' component={ProductDetail}/>
                <Redirect to='/product'/>
            </Switch>
        )
    }
}
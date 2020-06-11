import React,{Component} from 'react';
import LinkButton from '../../components/linkButton';
import './productDetail.less';
import {reqCategory} from '../../api';
import {BASE_IMG_URL} from '../../utils/constants';
import {
    Card,
    Icon,
    List,
    Button,
    message
} from 'antd';
const {Item} = List;
/*
    Product详情子路由
*/
export default class ProductDetail extends Component {
    constructor(props){
        super(props)
        this.state = {
            cName1:'', // 一级分类名称
            cName2:'' // 二级分类名称
        }

    }
    

   
    async componentDidMount () {
        const {pCategoryId,categoryId} = this.props.location.state;
        
        if (pCategoryId === '0') {
           const result =await reqCategory(categoryId)
           const {name} = result.data
           this.setState({
               cName1:name
           })
        }else {
            /*
            // 通过多个await 方式发送多个请求：后面一个请求是在前面一个请求成功返回之后才发送
           const result1 = await reqCategory(pCategoryId)
           const cName1 = result1.data.name
           const result2 = await reqCategory(categoryId)
           const cName2 = result2.data.name
           */
          // 一次发送多个请求，只有都成功了，才正常处理
          const results =await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])
          const cName1 = results[0].data.name
          const cName2 = results[1].data.name
          this.setState({
               cName1,
               cName2
           })
        }
       
    }

    
    render () {
        // const {product} = this
        // 更新商品 传过来的数据
        const product = this.props.location.state;
       
        const {name,desc,price,detail,imgs} = product;
        const {cName1,cName2} =this.state;


        const title = (
            <span>
                <LinkButton onClick={()=> this.props.history.goBack()}>  
                    <Icon type='arrow-left' style={{fontSize:16}}></Icon>
                    <span style={{margin:'0 15px',color:'#000'}}>
                       商品详情
                    </span>
                </LinkButton>
            </span>
        )
        return (
            <Card title={title} className="product-detail">
                <List > 
                    <Item style={{justifyContent:'left'}}>
                        <span className="left">商品名称:</span>
                        <span>{name}</span>
                    </Item>
                    <Item style={{justifyContent:'left'}}>
                        <span className="left">商品价格:</span>
                        <span>{price}</span>
                    </Item>
                    <Item style={{justifyContent:'left'}}>
                        <span className="left">商品描述:</span>
                        <span>{desc}</span>
                    </Item>
                    <Item style={{justifyContent:'left'}}>
                        <span className="left">所属分类:</span>
                        <span>{cName1}{cName2 ? '---->'+cName2 : ''}</span>
                    </Item>
                    <Item style={{justifyContent:'left'}}>
                        <span className="left">商品图片:</span>
                        <span>
                           {
                               imgs.map((item,index)=>{
                                   return (
                                    <img 
                                        key={index}
                                        src={BASE_IMG_URL+item} 
                                        alt="img"
                                        className='product-img'
                                    />
                                   )
                               })
                           }
                        </span>
                    </Item>
                    <Item style={{justifyContent:'left'}}>
                        <span className="left">商品详情:</span>
                        <span dangerouslySetInnerHTML={{__html:detail}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}
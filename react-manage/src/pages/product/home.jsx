import React,{Component} from 'react';
import LinkButton from '../../components/linkButton';
import {reqProduts,reqSearchProducts,reqProductStatus} from '../../api';
import {Card,Select,Input,Button,Icon,Table, message} from 'antd';
import {PAGE_SIZE} from '../../utils/constants';
const Option = Select.Option;
/*
    Product首页子路由
*/
export default class ProductHome extends Component {
    constructor(props){
        super(props)
        this.state = {
            products: [], // 商品的数组
            total:0, // 商品总数量
            loading:false, // 是否正在加载中
            searchName:'', // 搜索的关键字
            searchType: 'productName', //根据哪个字段搜索

        }
    }
    initColumns = ()=>{
      this.columns = [
            {
              title: '商品名称',
              dataIndex: 'name'
            },
            {
              title: '商品描述',
              dataIndex: 'desc'
            },
            {
              title: '价格',
              dataIndex: 'price',
              render: (price) => '¥' + price 
            },
            {
              width: 100,  
              title: '状态',
            //   dataIndex: 'status',
              render:(product) => {
                  const {status,_id} = product
                  return (
                     <span>
                         <Button 
                            type='primary'
                            onClick={()=>{this.updateStatus(_id,status === 1? 2 : 1)}}
                         >
                             {status === 1 ? '下架' : '上架'}
                         </Button>
                         <span>{status === 1 ? '在售' : '以下架'}</span>
                     </span>
                  )
              }
            },
            {
              width: 100,
              title:'操作',
              render:(product) =>{
                  return (
                    <span>
                        <LinkButton onClick={()=> this.props.history.push('/product/detail',product)}>详情</LinkButton>
                        <LinkButton onClick={() => this.props.history.push('/product/addUpdate',product)}>修改</LinkButton>
                    </span>
                  )
              }
            }
          ]
    }
    // 更改商品状态
    updateStatus =async (productId,status)=>{
        const result = await reqProductStatus(productId,status)
        if (result.status === 0) {
            message.success('切换状态成功')
            this.getProducts(this.pageNum)
        }else {
            message.error('切换状态失败')
        }
    }
    // 搜索获取商品数据
    getSearchProducts=async (pageNum)=> {
        this.pageNum = pageNum
        this.setState({loading:true})
        const {searchName,searchType} = this.state
        let result
        if (searchName) {
            result =await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
        }else {
            message.warning('请输入搜索关键字')
        }
        this.setState({loading:false})
        if (result.status === 0) {
            const {total,list} = result.data
            this.setState({
                total,
                products:list
            })
        }
    }
    // 获取商品数据
    getProducts = async (pageNum)=> {
        this.pageNum = pageNum
        this.setState({loading:true})
        const result = await reqProduts(pageNum,PAGE_SIZE)
        this.setState({loading:false})
        if (result.status === 0) {
            const {total,list} = result.data
            this.setState({
                total,
                products:list
            })
        }
        
    }
    UNSAFE_componentWillMount(){
        this.initColumns()
    }
    componentDidMount () {
        this.getProducts(1)
    }
    render () {
        const {total,products,loading,searchName,searchType} = this.state;
        const title = (
            <span>
                <Select value={searchType} style={{width:150}} onChange={value => this.setState({searchType: value})}>
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input 
                    value={searchName} 
                    placeholder='关键字' 
                    style={{width:150,margin:'0 15px'}}
                    onChange={event => this.setState({searchName:event.target.value})}
                />
                <Button type='primary' onClick={()=>this.getSearchProducts(1)}>搜索</Button>
            </span>
        )
        const extra = (
            <Button type='primary' onClick={() => this.props.history.push('/product/addUpdate')}>
                <Icon type='plus'/>
                添加商品
            </Button>
        )
       
        return (
            <Card title={title} extra={extra}>
                <Table 
                    bordered
                    rowKey='_id' 
                    dataSource={products} 
                    columns={this.columns}
                    loading={loading}
                    pagination={{
                        total,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: (pageNum) => {this.getProducts(pageNum)}
                    }}
                />
            </Card>    
        )
    }
}
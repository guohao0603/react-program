import React,{Component} from 'react';
import LinkButton from '../../components/linkButton';
import PicturesWall from './picturesWall';
import RichTextEditor from './richTextEditor';
import {reqCategorys,reqAddOrUpdateProduct} from '../../api';
import {
    Card,
    Form,
    Input,
    Icon,
    Cascader,
    Button,
    message
} from 'antd';
const {Item} = Form;
const {TextArea} = Input;
/*
    Product添加和修改子路由
*/

 class ProductAddUpdate extends Component {

    constructor(props){
        super(props)
        this.state = {
            options:[]
        }
        this.pw = React.createRef()
        this.editor = React.createRef()
    }
    initOptions = async (categorys)=>{
       // 根据categorys生成options数组
        const options = categorys.map((item,index)=>{
           return {label:item.name,value:item._id,isLeaf: false}
        })
        // 如果是一个二级分类商品的更新
        const {isUpdate,product} = this
        const {pCategoryId,categoryId} = product
        if (isUpdate && pCategoryId !== '0') {
            // 获取对应的二级分类的列表
            const subCategorys = await this.getCategorys(pCategoryId)
            console.info('subcategorys',subCategorys)
            // 生成二级下拉列表的options
            const childOptions = subCategorys.map((item)=>{
                return {
                    label:item.name,
                    value:item._id,
                    isLeaf:true
                }
            })
            // 找到当前商品对应的一级optinos对象
            const targetOptions = options.find(option => option.value === pCategoryId)
            // 关联对应的一级option上
            targetOptions.children = childOptions
        }

        // 更新options状态
        this.setState({
            options
        })
        
    }
    /*
        异步获取一级/二级分类列表，并显示
        async函数的返回值是一个新的promise对象，promise的结果和值由async的结果来决定
    */
    getCategorys = async (parentId)=>{
        // 发异步ajax请求, 获取数据
        const result = await reqCategorys(parentId)
        if (result.status === 0) {
            const categorys = result.data;
            // 如果是一级分类列表
            if (parentId === '0') {
                this.initOptions(categorys)
            }else { // 二级列表
                return categorys; // 返回二级列表 ==>当前async函数返回的promise就会成功并且value为categorys
            }
        }
    }
    // 提交数据
    submit = ()=> {
        this.props.form.validateFields(async (error,values)=>{
            if (!error) {
                console.log(values)
                const {name,desc,price,categoryIds} = values
                let pCategoryId,categoryId
                if (categoryIds.length === 1) {
                    pCategoryId = '0'
                    categoryId = categoryIds[0]
                }else {
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }
                const imgs = this.pw.current.getImgs()
                const detail = this.editor.current.getDetail()
                const product = {name,desc,price,pCategoryId,categoryId,imgs,detail}
                // 如果是更新，需要添加_id 
                if (this.isUpdate){
                    product._id = this.product._id
                }
                // 调用接口
                const result = await reqAddOrUpdateProduct(product)
                if (result.status ===0) {
                    message.success(`${this.isUpdate ? '更新' : '添加'}商品成功`)
                    this.props.history.goBack()
                }else {
                    message.error(`${this.isUpdate ? '更新' : '添加'}商品失败`)
                }
            }
        })
    }
    // 价格校验
    validatePrice = (rule, value, callback)=>{
        if (!(value*1>0)){
            callback('价格必须大于0')
        }
        else {
            callback()
        }
    }
    // 加载分类
    loadData = async selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        // targetOption 和 this.state.options 映射 改变 targetOption this.state.options 相应改变
        targetOption.loading = true;
        // 根据一级分类id加载二级分类
        const subCategorys =await this.getCategorys(targetOption.value)
        targetOption.loading = false;
        // 确保有二级分类 走if 否则 else
        if (subCategorys && subCategorys.length>0) {
            targetOption.children = subCategorys.map((item)=>{
                return {label:item.name,value:item._id,isLeaf:true}
            })
        }else {
            targetOption.isLeaf = true;
        }
        // 更新 options
        this.setState({
              options: [...this.state.options],
        });
      };

      
      UNSAFE_componentWillMount () {
          // 更新商品 传过来的数据
          const product = this.props.location.state;
          this.isUpdate = !!product;
          this.product = product || {};
      }
      componentDidMount () {
          this.getCategorys('0')
      }

    render () {
        const {isUpdate,product} = this;
        const {pCategoryId,categoryId,imgs,detail} = product;
      
        // 用来接收级联分类id数组
        const categoryIds = [];
        if (isUpdate) {
            if (pCategoryId === '0') {
                // 商品是一个一级分类商品
                categoryIds.push(categoryId)
            }else {
                // 商品是一个二级分类商品
                categoryIds.push(pCategoryId);
                categoryIds.push(categoryId);
            }
            
        }
        const title = (
            <span>
                <LinkButton onClick={()=> this.props.history.goBack()}>  
                    <Icon type='arrow-left' style={{fontSize:16}}></Icon>
                    <span style={{margin:'0 15px',color:'#000'}}>
                        {isUpdate ? '更新商品' : '添加商品'}
                    </span>
                </LinkButton>
            </span>
        )
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
          };
          const { getFieldDecorator } = this.props.form;
        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label="商品名称">
                        {getFieldDecorator('name', {
                            initialValue: product.name,
                            rules: [
                                {
                                    required: true,
                                    message: '必须输入商品名称',
                                },
                            ],
                        })(<Input placeholder="请输入商品名称" />)}
                    </Item>
                    <Item label="商品描述">
                        {getFieldDecorator('desc', {
                            initialValue: product.desc,
                            rules: [
                                {
                                    required: true,
                                    message: '必须输入商品描述',
                                },
                            ],
                        })(<TextArea placeholder="请输入商品描述" autoSize={{minRows:2,maxRows:6}}/>)}
                    </Item>
                    <Item label="商品价格">
                        {getFieldDecorator('price', {
                            initialValue: product.price,
                            rules: [
                                {
                                    required: true,
                                    message: '必须输入商品价格',
                                },
                                {validator: this.validatePrice}
                            ],
                        })(<Input type='number' placeholder="请输入商品价格" addonAfter='元'/>)}
                    </Item>
                    <Item label="商品分类">
                        {getFieldDecorator('categoryIds', {
                            initialValue: categoryIds,
                            rules: [
                                {
                                    required: true,
                                    message: '必须输入商品分类',
                                }
                            ],
                        })( <Cascader
                                placeholder='请指定商品分类'
                                options={this.state.options} // 需要显示的列表数据
                                loadData={this.loadData}// 当选择某个列表项，加载下一列表的监听回调
                        />)}
                    </Item>
                    <Item label='商品图片'>
                        <PicturesWall imgs={imgs} ref={this.pw}/>
                    </Item>
                    <Item label='商品详情' labelCol={{span:2}} wrapperCol={{span:20}}>
                        <RichTextEditor ref={this.editor} detail={detail}/>
                    </Item>
                    <Item>
                        <Button type='primary' onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}
export default Form.create()(ProductAddUpdate)
/*
1.子组件调用父组件的方法：将父组件的方法以函数属性的形式传递给子组件。
  子组件就可以调用
2.父组件调用子组件的方法：在父组件中通过ref得到子组件标签对象
  (也就是组件对象)，调用其方法
*/
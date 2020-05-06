### 目录结构
```shell
react-manage        # 项目根目录
|-- server              # 配置文件
|   |-- dev.env.js      # 开发环境配置
|   |-- index.js        # 根据NODE_ENV引入配置
|   |-- prod.env.js     # 生产环境配置
|   |-- test.env.js     # 测试环境配置
|-- src                 # 项目代码目录
|   |-- api             # 请求接口文件
|    ---- index.js      # 接口详情
|    ---- request.js    # 请求工具
|   |-- assets          # 静态资源目录
|   |-- components      # react 公用组件目录
|   |-- config          # react 配置
|    ---- menuConfig    # 菜单 配置
|    ---- Route.js      # 路由 配置
|   |-- pages           # react 路由文件
|   |-- utils           # 工具配置
|   |-- App.js          # 入口文件 配置
|   |-- index.html      # 页面模板 
|   |-- index.js        # 项目入口文件
|-- api-doc             # api文档
|-- package.json        # package.json
|-- README.md           # readme
|-- webpack.build.js    # 生产环境配置
|-- webpack.config.js   # 基础配置
|-- webpack.dev.js      # 开发环境配置

```

### 运行（nodejs 8.0+）
```bash
  npm run dev #(开发版本访问：http://localhost:4000/)
```

### 文档
[redux](http://cn.redux.js.org/docs/react-redux/api.html)
[react](http://wiki.jikexueyuan.com/project/react/)
[react-route](http://react-guide.github.io/react-router-cn/)
[webpack](http://webpack.github.io/docs/configuration.html)
[antd](https://3x.ant.design/docs/react/introduce-cn)
[es6](http://es6.ruanyifeng.com/)


### 项目截图
![](https://user-images.githubusercontent.com/36063573/81181634-5254f580-8fdf-11ea-9331-414d4a2e0b43.png)


<img src="./static/home.png" alt="" width=800>


<img src="./static/category.png" alt="" width=800>


<img src="./static/user.png" alt="" width=800>


<img src="./static/role.png" alt="" width=800>


<img src="./static/chart.png" alt="" width=800>

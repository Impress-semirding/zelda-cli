# Zelda-cli

## usage

### prepare

* npm i zelda-cli -g

### use

* 创建新项目 `zelda new app`，加参数 `--no-install` 不自动安装 node_modules

* 在当前目录下创建新项目 `zelda init`，加参数 `--no-install` 不自动安装 node_modules

* 创建指定文件 `zelda generate`，简写 `zelda g`

* 创建 model 文件 `zelda g model xxx`，默认包含 service 和 effect 等内容，加参数 `--no-tpl` 生成精简版的 model

* 创建 service 文件 `zelda g service xxx`

* 创建 route 文件 `zelda g route xxx`，加参数 `--no-css` 不生成对应的 CSS 文件

* 创建 component 文件 `zelda g component xxx`，加参数 `--no-css` 不生成对应的 CSS 文件，加参数 `--no-state` 生成 stateless 组件

* 创建 zatlas 项目 `zelda link config.json`，简写 `zelda l config.json`，加参数 `--no-install` 不自动安装 node_modules

* 在 zatlas 项目中增加页面 `zelda merge config.json`，简写 `zelda m config.json`

* 在 node 代码中使用：

  * `npm link zelda-cli`

  * `import { init, link } from 'zelda-cli'`

  * `init({dest: '/path/to/dest', install: false })`

  * `link({ config: 'config object or config path', dest: '/path/to/dest', install: false })`

## feature

### boilerplate

* 使用 roadhogx 替换 roadhog

  * 支持更多 webpack 配置项

  * 优化打包配置

  * 新增 buildDll 功能

  * 默认目录添加 alias

  * 支持动态组件导入，[用法](https://facebook.github.io/react/blog/2017/05/18/whats-new-in-create-react-app.html#code-splitting-with-dynamic-import)

* 更新 react 和其他 npm 依赖

* 使用 [eslint-config-alloy](https://github.com/AlloyTeam/eslint-config-alloy) 代替 eslint-config-airbnb

* 增加 format 命令，使用 prettier-eslint 格式化代码

* 增加针对测试环境的打包脚本

* 调整 webpack.config.js 配置

* 调整 .roadhogrc 配置

* 调整打包脚本配置

  * 增加针对测试环境的打包

  * 资源文件统一加 hash

  * 自动分离 node_modules 代码

  * 自动生成 index.html

* 增加 meta.js 文件，统一管理接口相关信息

* 可以针对不同环境变量定义 API 接口地址

* 修改 index.js，默认使用 browserHistory 模式，增加错误处理

* 修改 utils/request.js，增加默认请求配置

* 修改默认 services 文件，从 meta.js 读取配置

* 修改默认 models 文件，增加超时逻辑等处理

* 修改默认 components 文件，使用 PureComponent，增加 prop-types 相关内容

* generate model 时增加参数 --no-tpl 可以选择是否需要生成模板

* generate 方法增加生成 service 文件功能

### ztalas

* 新增 link 命令，缩写 l，传参 config.json，如 `zelda l config.json`

* 增加了 zatlas 的 boilerplate 目录

* 首先类似 init 命令生成 zatlas 目录结构

* 然后解析 config.json 通过 zelda-ast 方法生成 zatlas 对应组件和路由

* 写入 config.json 中的相应配置到 zatlas 的对应 model 中

* 支持通过 node module 方式调用 link 方法

* zelda-ast 增加了 zelda 类型处理，可生成组件容器，基类组件，图表实例组件

* zelda-ast 增加了不同类型组件的模板

* zelda-ast 模板引擎更换到 ejs

* zelda-ast 引入 prettier 自动格式化

* * 新增 merge 命令，缩写 m，传参 config.json，如 `zelda m config.json`

## todo

* 改造 dva

* 更新 react-router 版本

* 多路由配置

* material-ui / ant-design 集成

* 优化 webpack 性能

* 提取更多可配置项

* 简化 mock 方式

* zetlas 全链路集成

* zatlas 组件交互格式确定

* zelda-ast 增加 zatlas 工程操作方法

* zatlas model 层自动处理

* zatlas 再次编辑功能

* zatlas 配置重新导出

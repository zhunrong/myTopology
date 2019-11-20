# 拓扑图底层

[使用示例](http://shsnc_big_screen.gitee.io/graphics)

## **API**

### 一、核心

1. 画布

   + 类名：`Canvas`
   + 参数：options: Object
      - `container`: ***HTMLElement*** 放置画布的容器元素
      - `scale`?: ***number*** 画布缩放值
      - `maxScale`?: ***number*** 最大缩放值
      - `minScale`?: ***number*** 最小缩放值
      - `mode`?: ***string*** 交互模式
      - `animate`?: ***boolean*** 开启动画，使用连线动画时，需要设置为`true`
      - `renderType`?: ***string*** 渲染类型，默认为`DOM`用于渲染DOM类型的节点，如果要渲染canvas节点需要设置为`CANVAS` 
   + 属性：
      - `interactionMode`：当前交互模式
      - `renderType`：节点渲染类型
      - `stage`：画布舞台（根节点）
      - ...
   + 实例方法：
      - `setZoom(scale: number): void` 设置画布缩放
      - `setMode(mode: string): void` 设置交互模式
      - `destroy(): void` 销毁
      - `addNode(node: Node): void` 添加节点
      - `removeNode(node: Node, destroy: boolean = true): void` 删除节点,destroy参数表示是否销毁节点
      - `setNodeTop(node: Node): void` 将节点置顶显示
      - `getActiveNodes(): Node[]` 获取激活的节点列表
      - `getActiveEdges(): Edge[]` 获取激活的连线列表
      - `removeAllNode(destroy: boolean = true): void` 删除所有节点
      - `addEdge(edge: Edge): void` 添加连线
      - `removeEdge(edge: Edge): void` 删除连线
      - `zoomIn(focus?: Vector2d): void` 画布放大,focus表示缩放中心
      - `zoomOut(focus?: Vector2d): void` 画布缩小
      - `use(plugin: Plugin): void` 使用插件
      - `start(): void` 开始绘制
      - `stop(): void` 停止绘制
   + 静态方法：
      - `registerMode`：注册自定义模式

2. 节点

   1. 节点（抽象类）

      + 类名：`Node`
      + 参数：options: Object

         - `x`?: ***number*** 横坐标
         - `y`?: ***number*** 纵坐标
         - `id`?: ***any*** id
         - `text`?: ***string*** 显示文本
         - `data?`: ***any*** 用户数据

   2. 矩形节点（抽象类）

      + 类名：`RectNode`
      + 继承：`Node`
      + 参数：options: Object

         - `width`?: ***number*** 宽度
         - `height`?: ***number*** 高度
         - `minWidth`?: ***number*** 最小宽度
         - `minHeight`?:  ***number*** 最小高度
         - 其他参数参考`Node`

   3. 圆形节点（抽象类）

      + 类名：`CircleNode`
      + 继承：`Node`
      + 参数：options: Object

         - `radius`?: ***number*** 半径
         - `minRadius`?: ***number*** 最小半径
         - 其他参数参考`Node`

   2. 矩形-DOM节点

      + 类名：`RectDomNode`
      + 继承：`RectNode`
      + 参数：options: Object

         - 参考`RectNode`参数

   2. 矩形-DOM节点组
   3. 矩形-CANVAS节点
   4. ...

3. 连线

---

### 二、交互

1. 模式

---

### 三、插件

1. 右键菜单

2. 鹰眼地图
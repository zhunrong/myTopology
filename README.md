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

   4. 矩形-DOM节点

      + 类名：`RectDomNode`
      + 继承：`RectNode`
      + 参数：options: Object

         - 参考`RectNode`参数

   5. 矩形-DOM节点组

      + 类名：`RectDomGroup`
      + 继承：`RectDomNode`
      + 参数：options: Object
         
         - `isExpanded`?: ***boolean*** 是否展开
         - 其他参数参考`RectDomNode`

   6. 矩形-CANVAS节点
   7. 矩形-CANVAS节点组
   8. ...

3. 连线

   1. 连线（抽象类）

      + 类名：`Edge`
      + 参数：options: Object

         - `targetNode`: ***Node*** 靶节点
         - `sourceNode`: ***Node*** 源节点
         - `text`?: ***string*** 显示文本

   2. 直线

      + 类名：`Line`
      + 继承：`Edge`
      + 参数：options: Object

         - `dash`?: ***boolean*** 是否虚线
         - `arrow`?: ***boolean*** 显示单箭头
         - `doubleArrow`?: ***boolean*** 显示双箭头
         - `animateElement`?: ***Element*** 动画元素
         - `animateDuration`?: ***number*** 动画时间（毫秒）
         - 其他参数参考`Edge`

   3. 折线

      + 类名：`L`
      + 继承：`Edge`
      + 参数：options: Object

         - `dash`?: ***boolean*** 是否虚线
         - `arrow`?: ***boolean*** 显示单箭头
         - `doubleArrow`?: ***boolean*** 显示双箭头
         - `animateElement`?: ***Element*** 动画元素
         - `animateDuration`?: ***number*** 动画时间（毫秒）
         - 其他参数参考`Edge`

---

### 二、交互

1. 交互

   > 交互是指完成特定功能的用户动作

   0. 交互基类（抽象类）

      + 类名：`Interaction`
      + 参数：无

   1. 滚轮缩放

      + 类名：`WheelZoomInteraction`
      + 参数：无

   2. 鼠标拖拽释放

      + 类名：`DropInteraction`
      + 参数： 无

   3. 拖动画布

      + 类名：`MoveCanvasInteraction`
      + 参数：无

   4. 拖动节点或画布

      + 类名：`DragInteraction`
      + 参数：无
      + 前置依赖：`SelectInteraction`

   5. 选中节点或连线

      + 类名：`SelectInteraction`
      + 参数：无

   6. 节点连线（直线）

      + 类名：`CreateLineInteraction`
      + 参数：options: Object

         - `text`?: ***string*** 连线文本
         - `arrow`?: ***boolean*** 单箭头
         - `doubleArrow`?: ***boolean*** 双箭头
         - `dash`?: ***boolean*** 虚线

   7. 节点连线（折线）

      + 类名：`CreateLInteraction`
      + 参数：options: Object

         - `text`?: ***string*** 连线文本
         - `arrow`?: ***boolean*** 单箭头
         - `doubleArrow`?: ***boolean*** 双箭头
         - `dash`?: ***boolean*** 虚线

   8. 框选节点

      + 类名：`AreaPickInteraction`
      + 参数：无

   9. 右键菜单创建分组

      + 类名：`CreateGroupInteraction`
      + 参数：(`onCreate`?: () => Node)
      + 依赖插件：`ContextMenu`

   10. 折叠或展开节点

       + 类名：`CollapseAndExpandInteraction`
       + 参数：无

   11. 鼠标调整节点大小

       + 类名：`ResizeInteraction`
       + 参数：无

2. 模式

   > 模式是一组交互的集合

   1. 默认模式

      + 常量：`MODE_DEFAULT`
      + 交互组：
         
         1. `SelectInteraction`
         2. `DragInteraction`
         3. `DropInteraction`
         4. `WheelZoomInteraction`
         5. `CollapseAndExpandInteraction`

   2. 查看模式

      + 常量：`MODE_VIEW`
      + 交互组:

         1. `MoveCanvasInteraction`
         2. `WheelZoomInteraction`

   3. 连线模式（直线）

      + 常量：`MODE_CREATE_EDGE`
      + 交互组：

         1. `SelectInteraction`
         2. `WheelZoomInteraction`
         3. `CreateLineInteraction`
         4. `MoveCanvasInteraction`

   4. 连线模式（折线）

      + 常量：`MODE_CREATE_L`
      + 交互组：

         1. `SelectInteraction`
         2. `WheelZoomInteraction`
         3. `CreateLInteraction`
         4. `MoveCanvasInteraction`

   5. 框选模式

      + 常量：`MODE_AREA_PICK`
      + 交互组：

         1. `WheelZoomInteraction`
         2. `AreaPickInteraction`
         3. `CreateGroupInteraction`

   6. 边框模式

      + 常量：`MODE_BORDER`
      + 交互组：

         - `ResizeInteraction`
         - `WheelZoomInteraction`

---

### 三、插件

0. 插件基类（抽象类）

   + 类名：`Plugin`

1. 右键菜单

   + 类名：`ContextMenu`
   + 继承：`Plugin`
   + 参数：无

2. 鹰眼地图

   + 类名：`MiniMap`
   + 继承：`Plugin`
   + 参数：(`width` = 200, `height` = 200)
   + 实例方法：

      - `mount(container: HTMLElement): void` 挂载到容器元素内
      - `unmount(): void` 卸载
      - `destroy(): void` 销毁

### 四、布局

0. 布局基类（抽象类）

   + 类名：`Layout`
   + 参数：(`canvas`: Canvas)
   + 实例方法：

      - `layout(): void` 布局

1. 行列布局

   + 类名：`MatrixLayout`
   + 继承：`Layout`
   + 参数：(`canvas`: Canvas)
   + 属性：

      - `rows`: ***number*** 行数
      - `rowGap`: ***number*** 行间距
      - `columns`: ***number*** 列数
      - `columnGap`: ***number*** 列间距
      - `nodeRadius`: ***number*** 节点半径
      - `duration`: ***number*** 布局过渡时间（毫秒）

   + 实例方法：

      - 参考`Layout`方法

2. 环形布局

   + 类名：`CircularLayout`
   + 继承：`Layout`
   + 参数：(`canvas`: Canvas)
   + 属性：

      - `clockwise`: ***boolean*** 顺时针
      - `radius`: ***number*** 布局半径
      - `startAngle`: ***number*** 开始角度（弧度）
      - `endAngle`: ***number*** 结束角度（弧度）
      - `duration`: ***number*** 布局过渡时间（毫秒）
      - `gap`: ***number*** 节点间距
      - `nodeRadius`: ***number*** 节点半径

   + 实例方法：

      - 参考`Layout`方法

3. 力导布局

   + 类名：`ForceLayout`
   + 继承：`Layout`
   + 参数：(`canvas`: Canvas)
   + 属性：

      - `elasticity`: ***number*** 弹性系数，值越大，相连的节点越靠近
      - `attractive`: ***number*** 中心吸引系数，值越大，节点越靠近画布中心
      - `repulsion`: ***number*** 斥力系数，值越大，节点相距越远
      - `damping`: ***number*** 阻尼系数，值越大，节点速度衰减越快
      - `edgeLength`: ***number*** 连线自然长度
      - `animate`: ***number*** 是否开启布局动画，节点较多时，关闭动画可能会造成页面假死

   + 实例方法：

      - 参考`Layout`方法
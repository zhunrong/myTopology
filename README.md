# 拓扑图底层

[简单使用示例](http://zhunrong.gitee.io/static/topology/index.html)

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

      - `interactionMode`: ***string*** 当前交互模式
      - `renderType`: ***string*** 节点渲染类型
      - `rootNode`: ***Node*** 根节点
      - `stage`: ***Node*** 画布舞台（`rootNode`的别名）
      - `eventEmitter`: ***EventEmitter*** 事件模型
      - `plugins`: ***Plugin[]*** 插件列表
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

      - `registerMode(modeName: string, interactions: Interaction[])`：注册自定义模式

2. 节点

   1. 节点基类（抽象类）

      + 类名：`Node`
      + 参数：options: Object

         - `x`?: ***number*** 横坐标
         - `y`?: ***number*** 纵坐标
         - `id`?: ***any*** id
         - `text`?: ***string*** 显示文本
         - `data?`: ***any*** 用户数据

      + 属性：

         - `position`: ***Vector2d*** 位置
         - `id`: ***any*** id
         - `mounted`: ***boolean*** 是否已挂载
         - `visible`: ***boolean*** 是否可见
         - `miniMapVisible`: ***boolean*** 在鹰眼地图上是否可见
         - `text`: ***string*** 文本
         - `vertexes`: ***Vector2d[]*** 顶点坐标
         - `centerPoint`: ***Vector2d*** 几何中心
         - `boundingJoinPoints`: ***Vector2d[]*** 边界矩形上的连接点
         - `boundingRect`: ***Vector2d[]*** 同`vertexes`
         - `circumradius`: ***number*** 外接圆半径
         - `renderType`: ***string*** 渲染类型（只读）
         - `isGroup`: ***boolean*** 是否为组
         - `isExpanded`: ***boolean*** 是否展开
         - `canResize`: ***boolean*** 是否可以调节大小
         - `children`: ***Node[]*** 子节点
         - `parent`: ***Node | undefined*** 父节点
         - `edges`: ***Edge[]*** 相连的连线
         - `root`: ***Node*** 根节点
         - `depth`: ***number*** 节点深度

      + 实例方法：
         
         - `translate(offset: Vector2d): void` 移动节点以及其后代元素
         - `addEdge(edge: Edge): void` 添加连线
         - `removeEdge(edge: Edge): void` 删除连线
         - `addChild(child: Node): Node|undefined` 添加子节点
         - `removeChild(child: Node, destroy: boolean = true): boolean` 删除并且销毁子节点
         - `removeAllChild(destroy: boolean = true): void` 删除所有子节点
         - `hasChild(child: Node): boolean` 判断一个节点是否为子节点
         - `hasDescendant(descendant: Node): boolean` 判断一个节点是否为后代节点
         - `hasActiveAncestor(): boolean` 判断是否有激活的祖先节点
         - `getActiveChild(): Node[]` 获取激活状态的子节点列表
         - `getActiveDescendant(): Node[]` 获取激活状态的后代节点列表
         - `getDescendantDF(handler?: handler): Node[]` 遍历后代节点。1.深度优先；2.从右到左；3.从下到上
         - `getDescendantBF(handler?: handler): Node[]` 遍历后代节点。1.广度优先；
         2.从左到右；3.从上到下
         - `mount(force = false): void` 挂载
         - `unmount(): void` 卸载
         - `destroy(): void` 销毁

   2. 矩形节点（抽象类）

      + 类名：`RectNode`
      + 继承：`Node`
      + 参数：options: Object

         - `width`?: ***number*** 宽度
         - `height`?: ***number*** 高度
         - `minWidth`?: ***number*** 最小宽度
         - `minHeight`?:  ***number*** 最小高度
         - 其他参数参考`Node`

      + 属性：

         - 参考`Node`属性

      + 实例方法：

         - 参考`Node`方法

   3. 圆形节点（抽象类）

      + 类名：`CircleNode`
      + 继承：`Node`
      + 参数：options: Object

         - `radius`?: ***number*** 半径
         - `minRadius`?: ***number*** 最小半径
         - 其他参数参考`Node`

      + 属性：

         - 参考`Node`属性

      + 实例方法：

         - 参考`Node`方法

   4. 矩形-DOM节点

      + 类名：`RectDomNode`
      + 继承：`RectNode`
      + 参数：options: Object

         - 参考`RectNode`参数

      + 属性：

         - 参考`RectNode`属性

      + 实例方法：

         - 参考`RectNode`方法

   5. 矩形-DOM节点组

      + 类名：`RectDomGroup`
      + 继承：`RectDomNode`
      + 参数：options: Object
         
         - `isExpanded`?: ***boolean*** 是否展开
         - 其他参数参考`RectDomNode`

      + 属性：

         - 参考`RectNode`属性

      + 实例方法：

         - 参考`RectNode`方法

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

   6. 节点连线

      + 类名：`CreateEdgeInteraction`
      + 参数：(onCreate?: (sourceNode: Node, targetNode: Node) => Edge)

   7. 框选节点

      + 类名：`AreaPickInteraction`
      + 参数：无

   8. 右键菜单创建分组

      + 类名：`CreateGroupInteraction`
      + 参数：(`onCreate`?: () => Node)
      + 依赖插件：`ContextMenu`

   9. 折叠或展开节点

      + 类名：`CollapseAndExpandInteraction`
      + 参数：无

   10. 鼠标调整节点大小

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
         3. `CreateEdgeInteraction`
         4. `MoveCanvasInteraction`

   4. 连线模式（折线）

      + 常量：`MODE_CREATE_L`
      + 交互组：

         1. `SelectInteraction`
         2. `WheelZoomInteraction`
         3. `CreateEdgeInteraction`
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
   + 实例方法：
   
      - `install(canvas: Canvas): void` 安装
      - `destroy(): void` 销毁
      - `update(): void` 更新，画布重绘时，内部调用

1. 右键菜单

   + 类名：`ContextMenu`
   + 继承：`Plugin`
   + 参数：无
   + 属性：

      - `onContextMenu`: ***(instance: this, target: Node | Edge | null, nodes: Node[], edges: Edge[]) => IMenu[]*** 该属性是一个返回菜单数组的函数，鼠标右键时执行
      - `menu`: ***IMenu[]*** 菜单列表
         
         + `IMenu`(菜单项)字段

            - `label`: ***string***
            - `command`: ***string***
   
   + 实例方法

      - `show(menu: IMenu[] = [], left?: number, top?: number): void` 显示菜单，left,top为显示位置
      - `hide(): void` 隐藏

2. 鹰眼地图

   + 类名：`MiniMap`
   + 继承：`Plugin`
   + 参数：(`width` = 200, `height` = 200)
   + 实例方法：

      - `mount(container: HTMLElement): void` 挂载到容器元素内
      - `unmount(): void` 卸载
      - 其他方法参考`Plugin`

---

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

---

### 五、其他

1. 事件触发器

   + 类名：`EventEmitter`
   + 属性：

      - `events`: ***IEvents*** 事件池

   + 实例方法

      - `on(eventName: string, listener: (event?: any): void): void` 监听事件
      - `off(eventName: string, listener: (event?: any): void): void` 移除监听
      - `emit(eventName: string, params?: any): void` 触发事件

2. 二维向量

   + 类名：`Vector2d`
   + 实例属性：
    
      - `x`: ***number*** 横坐标
      - `y`: ***number*** 纵坐标
      - `magnitude`: ***number*** 模

   + 静态属性：

      - `xAxis`: ***Vector2d*** x轴单位向量
      - `yAxis`: ***Vector2d*** y轴单位向量

   + 实例方法：

      - `add(target: Vector2d): this` 矢量加
      - `substract(target: Vector2d): this` 矢量减
      - `dotProduct(target: Vector2d): number` 点积
      - `crossProduct(target: Vector2d): number` 叉积
      - `scale(scalar: number): this` 与标量相乘
      - `edge(target: Vector2d): Vector2d` 边缘向量
      - `perpendicular(): Vector2d` 正交向量
      - `normalize(): Vector2d` 单位向量
      - `normal(): Vector2d` 法向量
      - `cosAngle(target: Vector2d): number` 求与目标向量的夹角余弦值
      - `angle(target: Vector2d): number` 求与目标向量的夹角（弧度值）
      - `xAxisAngle(): number` 与x轴夹角(顺时针为正) [-Math.PI,Math.PI]
      - `rotate(deg: number): this` 旋转向量
      - `project(target: Vector2d): Vector2d` 在目标向量上的投影
      - `equal(target: Vector2d): boolean` 是否与目标向量相等
      - `copy(target: Vector2d): this` 复制目标向量
      - `clone(): Vector2d` 克隆当前向量

3. Math2d

   + 类名：`Math2d`
   + 静态方法：

      - `isPointInRect(P: Vector2d, rectPosition: Vector2d, width: number, height: number): boolean` 判断点是否在矩形内
      - `isPointInCircle(P: Vector2d, C: Vector2d, radius: number): boolean` 判断点是否在圆内
      - `isPointInTriangle(P: Vector2d, A: Vector2d, B: Vector2d, C: Vector2d): boolean` 判断点是否在三角形内
      - `isPointInPolygon(P: Vector2d, points: Vector2d[]): boolean` 判断点是否在多边形内
      - `isPointInLineSegment(P: Vector2d, lineSegment: [Vector2d, Vector2d], deviation: number = 0.01): boolean` 判断点是否在线段上
      - `isPointInPolyline(P: Vector2d, polyline: Vector2d[], deviation: number = 0.01): boolean` 判断点是否在多线段上
      - `isIntersect(line1: [Vector2d, Vector2d], line2: [Vector2d, Vector2d]): boolean` 判断两条线是否相交
      - `getLineIntersect(line1: [Vector2d, Vector2d], line2: [Vector2d, Vector2d]): Vector2d` 获取两条相交线段的交点
      - `getLinePoint(line: Vector2d[], ratio: number): Vector2d | null` 根据ratio,获取线段上点的坐标,起点为0,终点为1
      - `getPolyLineLength(line: Vector2d[]): number` 获取多线段的长度

4. canvas基本元素

   0. Element基类（抽象类）

      + 类名：`Element`
      + 属性：

         - `position`: ***Vector2d*** 位置
         - `offset`: ***Vector2d*** 偏移

      + 实例方法：

         - `render(ctx: CanvasRenderingContext2D): void` 渲染
         - `isPointIn(point: Vector2d): boolean` 判断点是否在图形内

   1. 矩形

      + 类名：`Rect`
      + 继承：`Element`
      + 属性：

         - `width`: ***number*** 宽
         - `height`: ***height*** 高
         - `fillStyle`: ***string***
         - `strokeStyle`: ***string***
         - 其他属性参考`Element`

      + 实例方法：

         - 参考`Element`

   2. 三角形

      + 类名：`Triangle`
      + 继承：`Element`
      + 属性：

         - `width`: ***number*** 宽
         - `height`: ***height*** 高
         - 其他属性参考`Element`

      + 实例方法：

         - 参考`Element`

   3. 图片

      + 类名：`Img`
      + 继承：`Element`
      + 属性：

         - `image`: ***CanvasImageSource | undefined***
         - 其他属性参考`Element`

      + 实例方法：

         - 参考`Element`

   4. 多线段

      + 类名：`Polyline`
      + 继承：`Element`
      + 属性：

         - `points`: ***Vector2d[]***
         - `lineWidth`: ***number***
         - 其他属性参考`Element`

      + 实例方法：

         - 参考`Element`

   5. 文字

      + 类名：`Text`
      + 继承：`Element`
      + 属性：

         - `text`: ***string***
         - `font`: ***string***
         - `backgroundColor`: ***string***
         - 其他属性参考`Element`

      + 实例方法：

         - 参考`Element`
      


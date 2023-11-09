<!--
 * @Author: LiuFengRui
 * @Date: 2021-11-08 15:41:12
 * @LastEditTime: 2023-08-01 15:25:33
 * @LastEditors: Please set LastEditors
 * @Description: 
-->
<template>
  <div class="wrapper" :style="{ height: `${configHeight}px` }">
    <div class="content_main" v-show="!activeManage">
      <div class="leftMenu">
        <div
          class="oneMenu"
          @click="areaSide.activeArea = !areaSide.activeArea"
          :style="{ background: areaSide.activeArea ? 'var(--my-bg-color-5)' : '' }"
        >
          <i class="iconfont icon-liebiao" />活动库
        </div>
        <div
          class="oneMenu"
          @click="areaSide.activeModel = !areaSide.activeModel"
          :style="{ background: areaSide.activeModel ? 'var(--my-bg-color-5)' : '' }"
        >
          <i class="iconfont icon-moxingguanli" />活动模型
        </div>
        <div
          class="oneMenu"
          @click="areaSide.attr = !areaSide.attr"
          :style="{ background: areaSide.attr ? 'var(--my-bg-color-5)' : '' }"
        >
          <i class="iconfont icon-xinxi" />属性
        </div>
      </div>
      <div :class="[areaSide.activeArea ? 'sideArea' : 'sideAreaFade']">
        <div class="topText2" v-show="areaSide.activeArea">
          <div class="inner">活动库</div>
          <i
            class="iconfont icon-tianjiawenjian"
            style="font-size: 20px; margin-right: 5px"
            title="添加活动"
            @click=";(activeVisible = true), (dialogInputActive = '')"
          />
        </div>
        <div class="Content" v-show="areaSide.activeArea">
          <el-tree
            :data="acticeList"
            :props="defaultProps"
            id="myTree"
            ref="myTree"
            node-key="tabId"
            @node-click="handleNodeClick"
            highlight-current
            :expand-on-click-node="false"
            :render-after-expand="false"
            :default-expand-all="true"
          >
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <img
                  src="@/assets/images/file1.png"
                  style="width: 15px; height: 15px; margin-right: 10px"
                  v-if="scope.node.level == 1"
                />
                <img
                  src="@/assets/images/file22.png"
                  style="width: 15px; height: 15px; margin-right: 10px"
                  v-if="scope.node.level == 2"
                />
                <img
                  src="@/assets/images/file3.png"
                  style="width: 15px; height: 15px; margin-right: 10px"
                  v-if="scope.node.level != 1 && scope.node.level != 2"
                />
                <span>{{ scope.node.label }}</span>
              </div>
            </template>
          </el-tree>
        </div>
      </div>
      <div class="sideArea2" :class="[areaSide.activeModel ? 'sideArea2' : 'sideAreaFade2']">
        <div class="topText2" style="display: flex" v-if="areaSide.activeModel">
          <div class="inner" style="margin-right: 1rem">活动模型</div>
          <i
            class="iconfont icon-tianjiawenjian"
            style="font-size: 20px; margin-right: 5px"
            title="添加类型"
            @click=";(dialogVisible = true), (dialogInput = '')"
          />
        </div>
        <div class="Content" v-if="areaSide.activeModel">
          <el-collapse v-model="activeNames">
            <el-collapse-item v-for="item in modelList" :title="item.name" :key="item.name" :name="item.name">
              <Draggable
                @end="end"
                @start="move"
                v-model="item.children"
                forceFallback="false"
                ghostClass="tt"
                :item-key="item.name"
              >
                <template #item="{ element }">
                  <div class="oneModel" @contextmenu.prevent="deleteModel(element.id, item)">
                    <div class="gragh">
                      <img
                        :id="element.id + '_img'"
                        :src="getImgUrl(element.ico + '.png')"
                        @dblclick="uploadImg(element, $event)"
                      />
                    </div>
                    <span>{{ element.name }}</span>
                  </div>
                </template>
              </Draggable>
              <div class="addActive" @click="openUploadDialog(item)">+</div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <div class="centerArea">
        <el-tabs
          v-model="editableTabsValue"
          type="card"
          class="demo-tabs"
          closable
          @tab-remove="removeTab"
          @tab-click="changeTab"
        >
          <el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title" :name="item.name">
            <template #label>
              <span class="custom-tabs-label">
                <img src="@/assets/images/editFile.png" style="margin-right: 5px; width: 20px; height: 20px" />
                <span>{{ item.title }}</span>
              </span>
            </template>
            <div class="centerContent" v-if="item.name == editableTabsValue">
              <div class="viewChoose">
                <img
                  src="@/assets/images/choose.png"
                  title="取消选择"
                  @click="chooseNode(item, 0)"
                  v-show="item.showParams.showChoose"
                />
                <img
                  src="@/assets/images/choose_off.png"
                  title="选择合并"
                  @click="chooseNode(item, 1)"
                  v-show="!item.showParams.showChoose"
                />
                <img src="@/assets/images/delete.png" title="删除节点" @click="deleteNode" />
                <img
                  src="@/assets/images/tool.png"
                  title="隐藏工具类"
                  @click="item.showParams.showTool = !item.showParams.showTool"
                  v-show="item.showParams.showTool"
                />
                <img
                  src="@/assets/images/tool_off.png"
                  title="展示工具类"
                  @click="item.showParams.showTool = !item.showParams.showTool"
                  v-show="!item.showParams.showTool"
                />
                <img
                  src="@/assets/images/post.png"
                  title="隐藏岗位类"
                  @click="item.showParams.showPost = !item.showParams.showPost"
                  v-show="item.showParams.showPost"
                />
                <img
                  src="@/assets/images/post_off.png"
                  title="展示岗位类"
                  @click="item.showParams.showPost = !item.showParams.showPost"
                  v-show="!item.showParams.showPost"
                />
              </div>
              <!-- :id="'efContainer_m' + item.name"  -->
              <div class="modelWrap">
                <div class="model" :id="'efContainer' + item.name">
                  <template v-for="node in item.nodeList" :key="node.id">
                    <flow-node
                      :node="node"
                      :activeElement="activeElement"
                      :showParams="item.showParams"
                      @clickNode="clickNode"
                      @uploadImgInner="uploadImgInner"
                      @setNode="setNode"
                      @changeNodeSite="changeNodeSite"
                    >
                    </flow-node>
                  </template>
                </div>
              </div>
              <div :class="[areaSide.attr ? 'attrbute' : 'attrbuteFade']">
                <!-- <div class="topText2" v-show="areaSide.attr">
                <div class="inner">属性</div>
              </div> -->
                <el-tabs v-model="editableTabsValue2" type="card" class="demo-tabs" v-show="areaSide.attr">
                  <el-tab-pane v-show="editableTabsValue2 == '1'" name="1" aria-hidden="auto">
                    <template #label>
                      <span class="custom-tabs-label">
                        <img src="@/assets/images/editFile.png" style="margin-right: 5px; width: 20px; height: 20px" />
                        <span>基础属性</span>
                      </span>
                    </template>
                    <div class="Content2" v-show="areaSide.attr">
                      <div class="oneInput">
                        <span>ID:</span>
                        <el-input type="text" size="small" disabled v-model="attrInfo.id" />
                      </div>
                      <div class="oneInput">
                        <span>类型:</span>
                        <el-input type="text" size="small" disabled v-model="attrInfo.type" />
                      </div>
                      <div class="oneInput">
                        <span>名称:</span>
                        <el-input
                          type="text"
                          size="small"
                          class="specil"
                          placeholder="请输入"
                          v-model="attrInfo.name"
                        />
                      </div>
                      <div class="oneInput">
                        <span class="specail">描述:</span>
                        <el-input size="small" v-model="attrInfo.des" :rows="2" type="textarea" placeholder="请输入" />
                      </div>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane
                    v-show="editableTabsValue2 == '2'"
                    aria-hidden="auto"
                    name="2"
                    v-if="!attrInfo.nohighAttr"
                  >
                    <template #label>
                      <span class="custom-tabs-label">
                        <img src="@/assets/images/editFile.png" style="margin-right: 5px; width: 20px; height: 20px" />
                        <span>高级属性</span>
                      </span>
                    </template>
                    <div class="Content2" v-show="areaSide.attr">
                      <div class="oneInput2">
                        <span>输入:</span>
                        <el-select v-model="attrInfo.input" size="small" multiple placeholder="请选择">
                          <el-option
                            style="padding-left: 1rem"
                            v-for="item in inputOptions"
                            :key="item"
                            :label="item"
                            :value="item"
                          />
                        </el-select>
                      </div>
                      <div class="oneInput2">
                        <span>输出:</span>
                        <el-select v-model="attrInfo.output" multiple size="small" placeholder="请选择">
                          <el-option
                            style="padding-left: 1rem"
                            v-for="item in outputOptions"
                            :key="item"
                            :label="item"
                            :value="item"
                          />
                        </el-select>
                      </div>
                      <div class="oneInput2">
                        <span>工具:</span>
                        <el-select v-model="attrInfo.tool" size="small" multiple placeholder="请选择">
                          <el-option
                            style="padding-left: 1rem"
                            v-for="item in toolOptions"
                            :key="item"
                            :label="item"
                            :value="item"
                          />
                        </el-select>
                      </div>
                      <div class="oneInput2">
                        <span>岗位:</span>
                        <el-select v-model="attrInfo.post" size="small" multiple placeholder="请选择">
                          <el-option
                            style="padding-left: 1rem"
                            v-for="item in postOptions"
                            :key="item"
                            :label="item"
                            :value="item"
                          />
                        </el-select>
                      </div>
                      <div class="oneInput2">
                        <span>前置活动:</span>
                        <el-select
                          v-model="attrInfo.frontActive"
                          size="small"
                          multiple
                          placeholder="请选择"
                          @change="selectAndLineNode(0, attrInfo.frontActive)"
                          @blur="jumpValite = false"
                          @remove-tag="deleteLineActive"
                        >
                          <el-option
                            style="padding-left: 1rem"
                            v-for="item in acticeSelectList"
                            :key="item.id"
                            :label="item.attrInfo.name ? item.attrInfo.name : item.id"
                            :value="item.id"
                          />
                        </el-select>
                      </div>
                      <div class="oneInput2">
                        <span>后置活动:</span>
                        <el-select
                          v-model="attrInfo.behindActive"
                          size="small"
                          multiple
                          placeholder="请选择"
                          @change="selectAndLineNode(1, attrInfo.behindActive)"
                          @blur="jumpValite = false"
                          @remove-tag="deleteLineActive2"
                        >
                          <el-option
                            style="padding-left: 1rem"
                            v-for="item in acticeSelectList"
                            :key="item.id"
                            :label="item.attrInfo.name ? item.attrInfo.name : item.id"
                            :value="item.id"
                          />
                        </el-select>
                      </div>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="rightMenu">
        <div class="oneMenu">
          <i class="iconfont icon-xiaoxi1"></i>
          交流
        </div>
        <div class="oneMenu">
          <i class="iconfont icon-bianji1"></i>
          变化
        </div>
        <div class="oneMenu">
          <i class="iconfont icon-a-tuandui4"></i>
          团队
        </div>
        <div class="oneMenu" @click="activeManage = true">
          <i class="iconfont icon-cangkuzidian"></i>
          活动库
        </div>
        <div class="oneMenuS" @click="saveParams">保存</div>
      </div>
    </div>
    <div class="content_bottom" v-show="!activeManage">
      <i class="iconfont icon-24gf-folderMinus" style="margin-right: 7px"></i>
      {{ acticeList.length }}个文件已添加
    </div>
    <el-dialog v-model="dialogVisible" title="添加类型" width="30%">
      <input type="text" placeholder="请输入" v-model="dialogInput" style="height: 2rem; width: calc(100% - 15px)" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="sureToSave"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="activeVisible" title="添加活动" width="30%">
      <input
        type="text"
        placeholder="请输入"
        v-model="dialogInputActive"
        style="height: 2rem; width: calc(100% - 15px)"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="activeVisible = false">取消</el-button>
          <el-button type="primary" @click="sureToSaveActive"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogVisible2" :title="flag ? '修改活动' : '添加活动'" width="30%">
      <div style="display: flex">
        <span>活动类型：</span>
        <input type="text" placeholder="请输入" v-model="dialogInput2" style="height: 2rem; width: 60%" />
      </div>
      <div style="margin-top: 2rem; display: flex">
        <span>活动图片：</span>
        <div class="activeImg" @click="getActiveFile" id="activeUploadImg">+</div>
        <input
          type="file"
          placeholder="请输入"
          @change="changeActive($event)"
          id="acticeFileupload"
          style="display: none"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取消</el-button>
          <el-button type="primary" @click="sureToSave2"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="visible" title="设置节点" width="30%">
      <div style="display: flex">
        <span>选择节点连线：</span>
        <el-select v-model="nodeSetting.line" size="small" placeholder="请选择">
          <el-option style="padding-left: 1rem" v-for="item in options" :key="item" :label="item" :value="item" />
        </el-select>
      </div>
      <div style="margin-top: 2rem; display: flex">
        <span>选择节点图片：</span>
        <div class="activeImg" @click="getActiveFileNode" id="nodeSettingUpload">+</div>
        <input
          type="file"
          placeholder="请输入"
          @change="changeActiveNode($event)"
          id="acticeFileuploadNode"
          style="display: none"
        />
      </div>
      <div style="margin-top: 2rem; display: flex">
        <span>选择文字颜色：</span>
        <el-color-picker v-model="attrInfo.color" show-alpha size="small" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="sureToSaveNode"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="activeManage" title="活动库管理" width="50%" :close-on-click-modal="false">
      <div class="oneButton" @click="showActiveAdd = true" v-show="!showActiveAdd">新增</div>
      <div class="dialogOneArea" style="height: 20rem" v-show="!showActiveAdd">
        <el-table :data="tableData" style="width: 100%; height: 100%" @row-click="rowClick" highlight-current-row>
          <el-table-column fixed prop="typeValue" label="软件类型" />
          <el-table-column prop="levelValue" label="安全等级" />
          <el-table-column prop="lanValue" label="语言" />
          <el-table-column fixed="right" label="操作">
            <template #default="scope">
              <span style="color: #409eff; cursor: pointer" @click="getDaTree(1, scope.row), (activeManage = false)"
                >编辑</span
              >
              <span style="color: red; cursor: pointer; margin-left: 1rem" @click="deleteActive(scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="dialogOneArea" v-show="showActiveAdd">
        <div class="activeInner">
          <span>软件类型：</span>
          <el-select style="width: 30%" v-model="activeSelect.type" size="small" placeholder="请选择">
            <el-option
              style="padding-left: 1rem"
              v-for="item in activeSelect.typeOption"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </div>
        <div class="activeInner">
          <span>安全等级：</span>
          <el-select style="width: 30%" v-model="activeSelect.level" size="small" placeholder="请选择">
            <el-option
              style="padding-left: 1rem"
              v-for="item in activeSelect.levelOption"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </div>
        <div class="activeInner">
          <span>语&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;言：</span>
          <el-select style="width: 30%" v-model="activeSelect.language" size="small" placeholder="请选择">
            <el-option
              style="padding-left: 1rem"
              v-for="item in activeSelect.lanOption"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </div>
      </div>

      <div class="dialogOneArea_n" v-show="!showActiveAdd && currentNum">
        检查结果：
        <p></p>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当前活动库存在{{ currentNum }}个活动，检查结果合格。
        <p></p>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1) 流程完善，不存在流程中断情况;
        <p></p>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2) 工具链完善，所有活动均配置工具;
      </div>
      <template #footer>
        <span class="dialog-footer" v-show="showActiveAdd">
          <el-button type="primary" @click="getDaTree(0), (activeManage = false)"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import flowNode from '../eventRoom/dragNode.vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import $ from 'jquery'
import Panzoom from 'panzoom'
import { jsPlumb } from 'jsplumb'

export default defineComponent({
  name: 'duty',
  components: { Draggable, flowNode },
  setup(props, context) {
    const state = reactive({
      configHeight: '',
      index: 13,
      activeManage: true,
      showActiveAdd: false,
      activeSelect: {
        type: 1,
        typeOption: [
          { value: '火箭飞控软件', key: 1 },
          { value: '综控器监控软件', key: 2 },
          { value: 'GNCC软件', key: 3 },
          { value: '卫星星务', key: 4 },
          { value: '应用软件', key: 5 },
        ],
        level: 1,
        levelOption: [
          { value: 'A级', key: 1 },
          { value: 'B级', key: 2 },
          { value: 'C级', key: 3 },
          { value: 'D级', key: 4 },
        ],
        language: 1,
        lanOption: [
          { value: 'C语言', key: 1 },
          { value: 'FPGA', key: 2 },
          { value: 'C++', key: 3 },
        ],
      },
      activeNames: '通用',
      tableData: [],
      dialogVisible: false,
      dialogVisible2: false,
      visible: false,
      activeVisible: false,
      flag: 0,
      //储存当前是哪一类型的
      currentModel: '',
      //对话框总输入框
      dialogInput: '',
      dialogInput2: '',
      dialogInputActive: '',
      tempImgURL: '',
      tabIndex: '1',
      editableTabsValue: '1',
      parentEditableTabsValue: '1',
      editableTabsValue2: '1',
      editableTabs: [],
      editableTabs2: [
        {
          title: '基础属性',
          name: '1',
        },
        {
          title: '高级属性',
          name: '2',
        },
      ],
      //存放展示区域的属性
      areaSide: {
        activeArea: true,
        activeModel: true,
        attr: true,
      },
      jsPlumb: null,
      jsplumbSetting: {
        // 动态锚点、位置自适应
        Anchors: [
          'Top',
          'TopCenter',
          'TopRight',
          'TopLeft',
          'Right',
          'RightMiddle',
          'Bottom',
          'BottomCenter',
          'BottomRight',
          'BottomLeft',
          'Left',
          'LeftMiddle',
        ],
        // 容器ID
        // Container: "efContainer",
        // 连线的样式，直线或者曲线等，可选值:  StateMachine、Flowchart，Bezier、Straight
        // Connector: ["Bezier", { curviness: 100 }],
        Connector: ['Straight', { stub: 0, gap: 1 }],
        // Connector: ['Flowchart', {stub: 30, gap: 1, alwaysRespectStubs: false, midpoint: 0.5, cornerRadius: 10}],
        // Connector: ['StateMachine', {margin: 5, curviness: 10, proximityLimit: 80}],
        // 鼠标不能拖动删除线
        ConnectionsDetachable: false,
        // 删除线的时候节点不删除
        DeleteEndpointsOnDetach: false,
        // location:0.5,
        /**
         * 连线的两端端点类型：圆形
         * radius: 圆的半径，越大圆越大
         */
        // Endpoint: [
        //   "Dot",
        //   { radius: 5, cssClass: "ef-dot", hoverClass: "ef-dot-hover" },
        // ],
        /**
         * 连线的两端端点类型：矩形
         * height: 矩形的高
         * width: 矩形的宽
         */
        // Endpoint: ['Rectangle', {height: 20, width: 20, cssClass: 'ef-rectangle', hoverClass: 'ef-rectangle-hover'}],
        /**
         * 图像端点
         */
        Endpoint: [
          'Image',
          {
            src: new URL(`../../../assets/images/spoint.png`, import.meta.url).href,
            cssClass: 'ef-img',
            hoverClass: 'ef-img-hover',
          },
        ],
        /**
         * 空白端点
         */
        // Endpoint: ["Blank", { Overlays: "" }],
        // Endpoints: [['Dot', {radius: 5, cssClass: 'ef-dot', hoverClass: 'ef-dot-hover'}], ['Rectangle', {height: 20, width: 20, cssClass: 'ef-rectangle', hoverClass: 'ef-rectangle-hover'}]],
        /**
         * 连线的两端端点样式
         * fill: 颜色值，如：#12aabb，为空不显示
         * outlineWidth: 外边线宽度
         */
        // EndpointStyle: { fill: "#1879ffa1", outlineWidth: 1 },
        EndpointStyle: {
          fill: '#fff',
          outlineWidth: 10,
          outlineStroke: '#00cdea',
          strokeWidth: 2,
        },
        hoverPaintStyle: {
          stroke: '#346f81',
        },
        connectorHoverStyle: {
          stroke: '#346f81',
        },
        // EndpointStyle: { fill: "#000", outlineWidth: 1 },
        // 是否打开jsPlumb的内部日志记录
        LogEnabled: true,
        /**
         * 连线的样式
         */
        PaintStyle: {
          // 线的颜色
          stroke: '#b4bdc5',
          // 线的粗细，值越大线越粗
          strokeWidth: 2,
          // 设置外边线的颜色，默认设置透明，这样别人就看不见了，点击线的时候可以不用精确点击，参考 https://blog.csdn.net/roymno2/article/details/72717101
          outlineStroke: 'transparent',
          // 线外边的宽，值越大，线的点击范围越大
          outlineWidth: 10,
        },

        DragOptions: { cursor: 'pointer', zIndex: 2000 },
        /**
         *  叠加 参考： https://www.jianshu.com/p/d9e9918fd928
         */
        Overlays: [
          // 箭头叠加
          [
            'Arrow',
            {
              width: 10, // 箭头尾部的宽度
              length: 8, // 从箭头的尾部到头部的距离
              location: 0.9, // 位置，建议使用0～1之间
              direction: 1, // 方向，默认值为1（表示向前），可选-1（表示向后）
              foldback: 0.623, // 折回，也就是尾翼的角度，默认0.623，当为1时，为正三角
              id: 'arrow',
            },
          ],
          // ['Diamond', {
          //     events: {
          //         dblclick: function (diamondOverlay, originalEvent) {
          //             console.log('double click on diamond overlay for : ' + diamondOverlay.component)
          //         }
          //     }
          // }],
          // [
          //   "Label",
          //   {
          //     label: "",
          //     location: 0.1,
          //     cssClass: "aLabel",
          //   },
          // ],
        ],
        // 绘制图的模式 svg、canvas
        RenderMode: 'canvas',
        // 鼠标滑过线的样式
        HoverPaintStyle: { stroke: '#b0b2b5', strokeWidth: 1 },
        // 滑过锚点效果
        // EndpointHoverStyle: {fill: 'red'},
        Scope: 'jsPlumb_DefaultScope', // 范围，具有相同scope的点才可连接
      },
      jsplumbSourceOptions: {
        // 设置可以拖拽的类名，只要鼠标移动到该类名上的DOM，就可以拖拽连线
        filter: '.flow-node-drag',
        // endpoint:'Blank',
        filterExclude: false,
        anchor: 'Continuous', //这个属性不需要添加锚点，自己就可以根据需要添加
        // 是否允许自己连接自己
        allowLoopback: true,
        maxConnections: -1,
        // onMaxConnections: function(info, e) {
        //   console.log(`超过了最大值连线: ${info.maxConnections}`);
        // },
        dropOptions: { hoverClass: 'ef-drop-hover' },
      },
      jsplumbTargetOptions: {
        // 设置可以拖拽的类名，只要鼠标移动到该类名上的DOM，就可以拖拽连线
        filter: '.flow-node-drag',
        // endpoint:'Blank',
        filterExclude: false,
        // 是否允许自己连接自己
        anchor: 'Continuous',
        allowLoopback: true,
        maxConnections: -1,
        dropOptions: { hoverClass: 'ef-drop-hover' },
      },
      modelList: [
        {
          id: Math.random().toString(36).substr(3, 8),
          name: '通用组件库',
          children: [
            {
              id: '11',
              type: '人工活动',
              name: '人工活动',
              ico: 'changfangxing',
              upload: '',
              // upload: "/src/assets/images/rect.png",
              // 自定义覆盖样式
              style: {},
            },
            {
              id: '12',
              type: '自动活动',
              name: '自动活动',
              ico: 'yuanjiao',
              // upload: "/src/assets/images/radiusRect.png",
              upload: '',
              // 自定义覆盖样式
              style: {},
            },
            {
              id: '13',
              type: '质量门',
              name: '质量门',
              ico: 'lingxing',
              // upload: "/src/assets/images/skewRect.png",
              upload: '',
              // 自定义覆盖样式
              style: {},
            },
          ],
        },
        {
          id: Math.random().toString(36).substr(3, 8),
          name: '类组件库',
          children: [],
        },
        {
          id: Math.random().toString(36).substr(3, 8),
          name: '部署组件库',
          children: [],
        },
        {
          id: Math.random().toString(36).substr(3, 8),
          name: '对象组件库',
          children: [],
        },
        {
          id: Math.random().toString(36).substr(3, 8),
          name: '用户组件库',
          children: [],
        },
      ],
      nodeMenu: { id: '', type: '', ico: '', name: '', style: {}, upload: '' },
      // data: { nodeList: [], lineList: [] },
      // 激活的元素、可能是节点、可能是连线
      activeElement: {
        // 可选值 node 、line
        type: undefined,
        // 节点ID
        nodeId: undefined,
        // 连线ID
        sourceId: undefined,
        targetId: undefined,
      },
      //属性相关信息
      attrInfo: {
        id: '',
        type: '',
        name: '',
        des: '',
        // color: "rgba(255, 255, 255, 0.68)",
        color: 'rgba(255, 255, 255, 0.68)',
        input: [],
        output: [],
        tool: [],
        post: [],
        frontActive: [],
        behindActive: [],
        nohighAttr: false,
      },
      //左侧活动列表
      acticeList: [
        {
          name: '火箭飞控活动列表',
          children: [],
          tabId: '1',
          id: '666',
          param: {
            title: '火箭飞控活动列表',
            name: '1',
            nodeList: [],
            lineList: [],
            showParams: {
              showPost: false,
              showTool: false,
              showChoose: false,
            },
          },
        },
      ],
      //设置节点
      nodeSetting: {
        line: '直线',
        upload: '',
      },
      //选择线条
      options: ['直线', '曲线', '折线'],
      inputOptions: ['输入1', '输入2', '输入3'],
      outputOptions: ['输出1', '输出2', '输出3'],
      toolOptions: [
        '领域需求结构化定义工具',
        '领域需求评审工具',
        '领域应用架构设计工具',
        '自动化用例设计工具',
        '领域架构评审工具',
        '安全架构评审工具',
        '领域算法设计工具',
        '算法设计评审工具',
      ],
      postOptions: ['需求分析师', '业务专家', '仿真工程师', '架构师', '算法设计师', '测试工程师'],
      //树形结构
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      jumpValite: false,
      divParams: { x: 0, y: 0, width: 0, height: 0, swidth: 0, sheight: 0 },
      currentTreeNode: {},
      panzoom: null,
      currentNum: 0,
    })
    const myTree = ref(null)
    const { proxy } = getCurrentInstance()

    const acticeSelectList = computed(() => {
      return state.editableTabs
        .filter((fil) => {
          return fil.name == state.editableTabsValue
        })[0]
        .nodeList?.filter((fil) => {
          return fil.id != state.activeElement.nodeId
        })
    })
    watch(
      () => state.attrInfo?.name,
      (newvalue) => {
        state.acticeList.some((val) => {
          let tree = methods.findNodeById(val, state.attrInfo?.id)
          if (tree) {
            tree.name = newvalue
          }
        })
      }
    )
    onMounted(() => {
      $('.oneModel').parent().addClass('oneModelWrap')

      methods.findAllActive()
      state.configHeight = window.innerHeight - 130
      window.addEventListener('resize', () => {
        state.configHeight = window.innerHeight - 130
      })
    })
    //保证页面挂载之后再执行
    nextTick(() => {})
    onUnmounted(() => {})
    // watch(() => state.nodeSetting.line,(newValue,oldValue) => {
    //   console.log(newValue)
    // });
    window.removeEventListener('resize', {})
    const methods = {
      getImgUrl(img) {
        return new URL(`../../../assets/images/${img}`, import.meta.url).href
      },
      findNodeById(node, id) {
        if (node.id === id) {
          return node
        }
        if (node.children) {
          for (var i = 0; i < node.children.length; i++) {
            var result = methods.findNodeById(node.children[i], id)
            if (result) {
              return result
            }
          }
        }
        return null
      },
      getUUID() {
        return Math.random().toString(36).substr(3, 10)
      },
      panzoomInit() {
        let current = state.editableTabs.filter((fil) => {
          return fil.name == state.editableTabsValue
        })
        const mainContainer = document.getElementById('efContainer' + current[0].name)
        mainContainer.oncontextmenu = function () {
          return false
        }
        // const mainContainer = document.getElementById("efContainer_m" + current[0].name)
        const mainContainerWrap = mainContainer.parentNode
        console.log(mainContainerWrap, '22222222222')
        state.panzoom = Panzoom(mainContainer, {
          smoothScroll: false,
          bounds: true,
          // autocenter: true,
          zoomDoubleClickSpeed: 1,
          // minZoom: 0.5,
          // maxZoom: 2,
        })
        // state.panzoom.pan(-100, -100)
        state.jsPlumb.mainContainerWrap = mainContainerWrap
        state.jsPlumb.pan = state.panzoom
        // mainContainer.addEventListener('wheel', state.panzoom.zoomWithWheel)
        state.panzoom.on('zoom', (e) => {
          const { scale } = e.getTransform()
          const x = state.jsPlumb.mainContainerWrap.clientWidth
          const y = state.jsPlumb.mainContainerWrap.clientHeight
          state.jsPlumb.pan.smoothZoom(x, y, scale)
          state.jsPlumb.setZoom(scale)
        })
        // state.panzoom.on("pan", (e) => {});
        // 平移时设置鼠标样式
        mainContainerWrap.style.cursor = 'grab'
        mainContainerWrap.addEventListener('mousedown', function wrapMousedown() {
          this.style.cursor = 'grabbing'
          mainContainerWrap.addEventListener('mouseout', function wrapMouseout() {
            this.style.cursor = 'grab'
          })
        })
        mainContainerWrap.addEventListener('mouseup', function wrapMouseup() {
          this.style.cursor = 'grab'
        })
      },
      getScale() {
        let scale1
        let container = state.jsPlumb.getContainer()
        if (state.jsPlumb.pan) {
          const { scale } = state.jsPlumb.pan.getTransform()
          scale1 = scale
        } else {
          const matrix = window.getComputedStyle(container).transform
          scale1 = matrix.split(', ')[3] * 1
        }
        state.jsPlumb.setZoom(scale1)
        return scale1
      },
      jsPlumbInit() {
        let current = state.editableTabs.filter((fil) => {
          return fil.name == state.editableTabsValue
        })
        console.log(current)
        // state.jsPlumb.setContainer(
        //       // document.getElementById("efContainer" + current[0].name)
        //       document.getElementById("modelWrap")
        //     );
        nextTick(() => {
          state.jsPlumb.ready(() => {
            // 导入默认配置
            // state.jsplumbSetting.Container = "efContainer" + current[0].name;
            state.jsplumbSetting.Container = 'efContainer' + current[0].name
            // state.jsplumbSetting.Container =  "modelWrap"
            state.jsPlumb.importDefaults(state.jsplumbSetting)
            // 会使整个jsPlumb立即重绘。
            // state.jsPlumb.setSuspendDrawing(false, true);
            // 初始化节点
            // methods.loadEasyFlow()
            state.jsPlumb.bind('mousedown', (conn, originalEvent) => {
              state.jsPlumb.bind('mousemove', (conn, originalEvent) => {
                let current = state.editableTabs.filter((fil) => {
                  return fil.name == state.editableTabsValue
                })

                var overlay = conn.getOverlay(conn.sourceId + '_' + conn.targetId + 'overlay')
                //计算当前位置的长度
                let myLocation =
                  // Math.sqrt(
                  //   originalEvent.offsetX * originalEvent.offsetX +
                  //     originalEvent.offsetY * originalEvent.offsetY
                  // ) / conn.connector.getLength();
                  (originalEvent.offsetX + originalEvent.offsetY) / conn.connector.getLength()
                // console.log(overlay.getLocation(), conn.connector.getLength(),myLocation,"wwwww");
                console.log(conn.connector.getLength(), 'wwwww', myLocation)
                if (overlay) {
                  // overlay.setLocation(myLocation)
                  conn.removeOverlay(conn.sourceId + '_' + conn.targetId + 'overlay')
                }
                conn.addOverlay([
                  'Custom',
                  {
                    create: function (component) {
                      return $(
                        "<div style='cursor:pointer;height:6px;width:6px;border-radius:15px;background:#e0e3e7;'></div>"
                      ).attr('id', conn.sourceId + '_' + conn.targetId)
                    },
                    location: myLocation,
                    id: conn.sourceId + '_' + conn.targetId + 'overlay',
                  },
                ])

                current[0].nodeList.map((data) => {
                  if (data.id == conn.sourceId) {
                    conn.setConnector(
                      data.nodeSetting.line == '直线'
                        ? ['Straight', { stub: 0, gap: 0 }]
                        : data.nodeSetting.line == '曲线'
                        ? ['Bezier', { curviness: myLocation * 200 }]
                        : // ?['StateMachine', {margin: 0, curviness:myLocation*20, proximityLimit: myLocation * 100}]
                          [
                            'Flowchart',
                            {
                              stub: 30,
                              gap: 0,
                              alwaysRespectStubs: false,
                              midpoint: myLocation,
                              cornerRadius: 10,
                            },
                          ]
                    )
                  }
                })
              })
            })

            state.jsPlumb.bind('mouseup', (conn, originalEvent) => {
              state.jsPlumb.unbind('mousemove')
              //先解决拖动过程中箭头丢失问题
              var overlay = conn.getOverlay('arrow')
              if (overlay) {
                // overlay.setLocation(myLocation)
                conn.removeOverlay('arrow')
              }
              conn.addOverlay([
                'Arrow',
                {
                  width: 10, // 箭头尾部的宽度
                  length: 8, // 从箭头的尾部到头部的距离
                  location: 0.9, // 位置，建议使用0～1之间
                  direction: 1, // 方向，默认值为1（表示向前），可选-1（表示向后）
                  foldback: 0.623, // 折回，也就是尾翼的角度，默认0.623，当为1时，为正三角
                  id: 'arrow',
                },
              ])
            })
            state.jsPlumb.bind('click', (conn, originalEvent) => {
              // state.activeElement.type = "line";
              // state.activeElement.sourceId = conn.sourceId;
              // state.activeElement.targetId = conn.targetId;
              // state.$refs.nodeForm.lineInit({
              //     from: conn.sourceId,
              //     to: conn.targetId,
              //     label: conn.getLabel()
              // })
              // console.log('dianjil')
            })
            // 连线
            state.jsPlumb.bind('connection', (evt) => {
              let current = state.editableTabs.filter((fil) => {
                return fil.name == state.editableTabsValue
              })
              let c = state.editableTabs.filter((fil) => {
                return fil.name == current[0].parentName
              })
              let temp = c.length ? methods.callbackFun(c[0]) : []
              let from = evt.source.id
              let to = evt.target.id
              current[0].lineList.push({ from: from, to: to })
              temp[0]?.lineList.push({ from: from, to: to })
              // }
              //修改连接线
            })
            state.jsPlumb.bind('connectionDrag', (evt) => {
              //拖动时的样式也变
            })
            // 删除连线回调
            state.jsPlumb.bind('connectionDetached', (evt) => {
              // methods.deleteLine(evt.sourceId, evt.targetId);
              // console.log('shanchulehuidiao')
            })

            // 改变线的连接节点
            state.jsPlumb.bind('connectionMoved', (evt) => {
              methods.changeLine(evt.originalSourceId, evt.originalTargetId)
            })
            // 连线右击
            state.jsPlumb.bind('contextmenu', (conn, evt) => {
              // methods.deleteLine(evt.sourceId, evt.targetId);
              console.log(conn, '2222222222222')
              state.jsPlumb.deleteConnection(conn)
              methods.deleteLine(conn.sourceId, conn.targetId)
            })

            // 连线
            state.jsPlumb.bind('beforeDrop', (evt) => {
              console.log(evt, 'beforeDropbeforeDrop')
              let from = evt.sourceId
              let to = evt.targetId
              if (from === to) {
                ElMessage.error('节点不支持连接自己')
                return false
              }
              if (methods.hasLine(from, to)) {
                if (state.jumpValite) {
                  return true
                }
                ElMessage.error('该关系已存在,不允许重复创建')
                return false
              }
              // if (methods.hashOppositeLine(from, to)) {
              //   ElMessage.error("不支持两个节点之间连线回环");
              //   return false;
              // }
              // ElMessage.success("连接成功");
              //拖拽连线时的样式
              let current = state.editableTabs.filter((fil) => {
                return fil.name == state.editableTabsValue
              })

              current[0].nodeList.map((data) => {
                if (data.id == evt.sourceId) {
                  evt.connection.setConnector(
                    data.nodeSetting.line == '直线'
                      ? ['Straight', { stub: 0, gap: 0 }]
                      : data.nodeSetting.line == '曲线'
                      ? ['Bezier', { curviness: 100, midpoint: 0.2 }]
                      : // ?['StateMachine', {margin: 0, curviness: 50, proximityLimit: 20}]
                        [
                          'Flowchart',
                          {
                            stub: 30,
                            gap: 0,
                            alwaysRespectStubs: false,
                            midpoint: 0.5,
                            cornerRadius: 10,
                          },
                        ]
                  )

                  current[0].nodeList.map((item) => {
                    if (item.id == evt.targetId) {
                      // if (item.attrInfo.nohighAttr) {
                      // item.nodeList.map((res) => {
                      data.attrInfo.behindActive.push(item.attrInfo.name ? item.attrInfo.name : item.id)
                      // });
                      // } else {
                      //   data.attrInfo.behindActive.push(evt.targetId);
                      // }
                    }
                  })
                  const cache = []
                  for (const t of data.attrInfo.behindActive) {
                    if (cache.find((c) => c == t)) {
                      // 已经存在说明以前记录过，现在这个就是多余的，直接忽略
                      continue
                    }
                    cache.push(t)
                  }
                  data.attrInfo.behindActive = JSON.parse(JSON.stringify(cache))

                  current[0].nodeList.map((item) => {
                    if (item.id == evt.targetId) {
                      // if (data.attrInfo.nohighAttr) {
                      // data.nodeList.map((res) => {
                      item.attrInfo.frontActive.push(data.attrInfo.name ? data.attrInfo.name : data.id)
                      // });
                      // } else {
                      //   item.attrInfo.frontActive.push(data.id);
                      // }
                    }
                    const cache = []
                    for (const t of item.attrInfo.frontActive) {
                      if (cache.find((c) => c == t)) {
                        // 已经存在说明以前记录过，现在这个就是多余的，直接忽略
                        continue
                      }
                      cache.push(t)
                    }
                    item.attrInfo.frontActive = JSON.parse(JSON.stringify(cache))
                  })
                }
              })
              //解决连接线后被自定义图覆盖问题
              var overlay = evt.connection.getOverlay('arrow')
              if (overlay) {
                // overlay.setLocation(myLocation)
                evt.connection.removeOverlay('arrow')
              }
              evt.connection.addOverlay([
                'Arrow',
                {
                  width: 10, // 箭头尾部的宽度
                  length: 8, // 从箭头的尾部到头部的距离
                  location: 0.9, // 位置，建议使用0～1之间
                  direction: 1, // 方向，默认值为1（表示向前），可选-1（表示向后）
                  foldback: 0.623, // 折回，也就是尾翼的角度，默认0.623，当为1时，为正三角
                  id: 'arrow',
                },
              ])

              return true
            })

            // beforeDetach
            state.jsPlumb.bind('beforeDetach', (evt) => {})
          })
        })

        // console.log(panzoom,'2222222222')
      },
      findAllActive() {
        proxy.$axios.findAllActive({}).then((res) => {
          if (res.code === 200) {
            state.tableData = res.data
            state.tableData.map((val) => {
              state.activeSelect.typeOption.map((opt) => {
                if (val.type == opt.key) {
                  val.typeValue = opt.value
                }
              })
              state.activeSelect.levelOption.map((opt) => {
                if (val.level == opt.key) {
                  val.levelValue = opt.value
                }
              })
              state.activeSelect.lanOption.map((opt) => {
                if (val.deLanguage == opt.key) {
                  val.lanValue = opt.value
                }
              })
            })
          }
        })
      },
      deleteActive(row) {
        let params = {
          type: row.type,
          level: row.level,
          deLanguage: row.deLanguage,
        }
        proxy.$axios.deleteActive(params).then((res) => {
          if (res.success) {
            methods.findAllActive()
          }
        })
      },
      // 删除线
      deleteLine(from, to) {
        let temp = state.editableTabs.filter((fil) => {
          return fil.name == state.editableTabsValue
        })
        temp[0].lineList = temp[0].lineList.filter(function (line) {
          if (line.from == from && line.to == to) {
            return false
          }
          return true
        })
        temp[0].nodeList.map((item) => {
          if (item.id == from) {
            item.attrInfo.behindActive = item.attrInfo.behindActive.filter((fil) => {
              return fil != to
            })
          }
          if (item.id == to) {
            item.attrInfo.frontActive = item.attrInfo.frontActive.filter((fil) => {
              return fil != from
            })
          }
        })
      },
      // 改变连线
      changeLine(oldFrom, oldTo) {
        methods.deleteLine(oldFrom, oldTo)
      },
      // 是否具有该线
      hasLine(from, to) {
        let temp = state.editableTabs.filter((fil) => {
          return fil.name == state.editableTabsValue
        })
        for (var i = 0; i < temp[0].lineList.length; i++) {
          var line = temp[0].lineList[i]
          if (line.from === from && line.to === to) {
            return true
          }
        }
        return false
      },
      // 是否含有相反的线
      hashOppositeLine(from, to) {
        return methods.hasLine(to, from)
      },
      //匹配类型
      getMenuByType(id) {
        let modelList = state.modelList
        for (let i = 0; i < modelList.length; i++) {
          for (let j = 0; j < modelList[i].children.length; j++) {
            if (modelList[i].children[j].id === id) {
              return modelList[i].children[j]
            }
          }
        }
      },
      //拖动开始时
      move(evt, a, b, c) {
        console.log(evt)
        var id = evt.item._underlying_vm_.id
        state.nodeMenu = methods.getMenuByType(id)
      },
      //递归迭代执行
      callbackFun(c) {
        //找到需要添加子节点的父节点

        let temp = c?.nodeList.filter((fil) => {
          return fil.tabIndex == state.editableTabsValue
        })
        if (!temp.length) {
          c?.nodeList.map((data) => {
            if (data.nodeList.length) {
              temp = methods.callbackFun(data)
            }
          })
        }
        return temp
      },
      treeCallbackFun(a, id) {
        if (a.length) {
          return a[0].children
        } else {
          let b = state.acticeList.map((data) => {
            return methods.innerTreeCallback(data, id)
          })
          b = b.filter((fil) => {
            return fil.length
          })
          return b[0][0].children
        }
      },
      treeCallbackFun2(a, id) {
        if (a.length) {
          return a[0]
        } else {
          let b = state.acticeList.map((data) => {
            return methods.innerTreeCallback(data, id)
          })
          b = b.filter((fil) => {
            return fil.length
          })
          return b[0][0]
        }
      },
      innerTreeCallback(data, id) {
        let a = data.children.filter((fil) => {
          return fil.tabId == id
        })

        if (!a.length) {
          data.children.map((item) => {
            if (item.children.length) {
              a = methods.innerTreeCallback(item, id)
            }
          })
        }
        return a
      },
      //拖动结束时
      end(evt, e) {
        //originalEvent-浏览器自己产生的事件对象
        // debugger
        //浅拷贝，树里param也可以改变
        let current = state.editableTabs.filter((fil) => {
          return fil.name == state.editableTabsValue
        })

        var screenX = evt.originalEvent.clientX,
          screenY = evt.originalEvent.clientY
        let efContainer = document.getElementById('efContainer' + current[0].name)
        var containerRect = efContainer.getBoundingClientRect()
        var left = screenX,
          top = screenY
        // 计算是否拖入到容器中
        left -= 60
        top -= 33
        if (
          left < containerRect.x ||
          left > containerRect.width + containerRect.x ||
          top < containerRect.y ||
          top > containerRect.y + containerRect.height
        ) {
          ElMessage.error('请把节点拖入到画布中')
          return
        }
        left = left - containerRect.x + efContainer.scrollLeft
        top = top - containerRect.y + efContainer.scrollTop
        // debugger
        // if (
        //   left > containerRect.width + containerRect.x - 390 &&
        //   left < containerRect.width + containerRect.x
        // ) {
        //   // debugger
        //   left = containerRect.width + containerRect.x - 390;
        // }
        // if (
        //   top > containerRect.y + containerRect.height - 120 &&
        //   top < containerRect.y + containerRect.height
        // ) {
        //   top = containerRect.y + containerRect.height - 120;
        // }

        //scrollLeft -代表元素滚动条距离元素左边多少像素
        var nodeId = methods.getUUID()
        // 动态生成名字
        var origName = state.nodeMenu.name
        var nodeName = origName
        var index = 1
        //重复名字加标识

        while (index < 10000) {
          var repeat = false

          for (var i = 0; i < current[0].nodeList.length; i++) {
            let node = current[0].nodeList[i]
            if (node.name === nodeName) {
              nodeName = origName + index
              repeat = true
            }
          }
          if (repeat) {
            index++
            continue
          }
          break
        }
        state.tabIndex = Math.random().toString(36).substr(3, 10)
        state.attrInfo = {
          id: nodeId,
          type: state.nodeMenu.type,
          name: '',
          des: '',
          color: '#fff',
          input: [],
          output: [],
          tool: [],
          post: [],
          frontActive: [],
          behindActive: [],
          children: [],
          tabId: state.tabIndex,
          nohighAttr: false,
        }

        var node = {
          id: nodeId,
          name: nodeName,
          type: state.nodeMenu.type,
          left: left + 'px',
          top: top + 'px',
          ico: state.nodeMenu.ico,
          state: 'success',
          nodeSetting: {
            upload: state.nodeMenu.upload,
            line: '直线',
          },
          attrInfo: state.attrInfo,
          nodeList: [],
          lineList: [],
        }

        /**
         * 这里可以进行业务判断、是否能够添加该节点
         */
        //当前画布的节点
        current[0].nodeList.push(node)
        //保存子节点
        state.activeElement.type = null
        state.activeElement.nodeId = null

        //左侧树的操作
        let a = state.acticeList.filter((fil) => {
          return fil.tabId == state.editableTabsValue
        })

        let tree = methods.treeCallbackFun(a, state.editableTabsValue)
        tree.push(state.attrInfo)
        nextTick(() => {
          //makeSourse,makeTarget使整个节点成为锚点
          state.jsPlumb.makeSource(nodeId, state.jsplumbSourceOptions)
          state.jsPlumb.makeTarget(nodeId, state.jsplumbTargetOptions)
          //原来是锚点可拖动，这样节点成了锚点，节点就可拖动了
          state.jsPlumb.draggable(nodeId, {
            containment: '',
            // containment: "parent",
            stop: function (el) {
              // 拖拽节点结束后的对调
              // console.log("拖拽结束: ", el);
            },
          })
          // state.jsPlumb.revalidate(nodeId)
        })
      },
      clickNode(node) {
        state.activeElement.type = 'node'
        state.activeElement.nodeId = node.id
        let map = new Map()

        let current = state.editableTabs.filter((fil) => {
          return fil.name == state.editableTabsValue
        })

        for (let data of current[0].nodeList) {
          map.set(data.id, data.attrInfo)
        }
        state.attrInfo = map.get(node.id)
        myTree.value.setCurrentKey(node.id)
        // methods.handleNodeClick(node)
        // console.log(state.attrInfo, "click");
      },
      //选择合并节点
      chooseNode(item, type) {
        item.showParams.showChoose = !item.showParams.showChoose
        state.panzoom.dispose()
        let ele = document.getElementById('efContainer' + item.name)
        if (type) {
          ele.addEventListener('mousedown', methods.chooseNodeDown)
          ele.addEventListener('mouseup', methods.chooseNodeup)
        } else {
          ele.removeEventListener('mousedown', methods.chooseNodeDown)
          ele.removeEventListener('mouseup', methods.chooseNodeup)
        }
      },
      chooseNodeDown(ele) {
        // console.log(ele, "chooseNodeDown");
        state.divParams.x = ele.offsetX
        state.divParams.y = ele.offsetY
        let current = state.editableTabs.filter((fil) => {
          return fil.name == state.editableTabsValue
        })
        if (!current[0].showParams.showChoose) {
          return
        }
        let oBox = document.getElementById('efContainer' + current[0].name)
        state.divParams.width = ele.clientX - oBox.offsetLeft
        state.divParams.height = ele.clientY - oBox.offsetTop
        let $div = $(
          '<div style="background:#7dcffa;border:1px #01a3fb solid;position:absolute;z-index:-1;" id="accuracys"></div>'
        )
        $('#' + 'efContainer' + current[0].name).append($div)
        document.addEventListener('mousemove', methods.chooseNodeMove)
      },
      chooseNodeup(ele) {
        let $div = document.getElementById('accuracys')
        //选中框取的元素
        let current = state.editableTabs.filter((fil) => {
          return fil.name == state.editableTabsValue
        })
        // debugger
        let reduceList = []
        let reduceLineList = []
        let reduceacticeList = []
        current[0].nodeList.map((val) => {
          let left2 = parseInt(val.left.match(/\d+/g)[0])
          let top2 = parseInt(val.top.match(/\d+/g)[0])
          if (
            top2 > state.divParams.y &&
            left2 > state.divParams.x &&
            top2 + 66 < state.divParams.y + state.divParams.sheight &&
            left2 + 120 < state.divParams.x + state.divParams.swidth
          ) {
            reduceList.push(val)
            reduceacticeList.push(val.attrInfo)
            current[0].lineList.map((line) => {
              if (line.from == val.id) {
                reduceLineList.push(line)
              }
            })
          }
          val.reduceNode = false
        })
        //有选中的新建一个节点
        // state.tabIndex = Math.random()
        //     .toString(36)
        //     . (3, 10)

        if (reduceList.length) {
          let nodeId = methods.getUUID()
          state.tabIndex = Math.random().toString(36).substr(3, 10)
          state.attrInfo = {
            id: nodeId,
            type: reduceList[0].type,
            name: '',
            des: '',
            color: '#fff',
            input: [],
            output: [],
            tool: [],
            post: [],
            frontActive: [],
            behindActive: [],
            children: reduceacticeList,
            tabId: state.tabIndex,
            nohighAttr: false,
          }

          var node = {
            id: nodeId,
            name: reduceList[0].name, //默认以第一个为准
            type: reduceList[0].type,
            left: reduceList[0].left,
            top: reduceList[0].top,
            ico: reduceList[0].ico,
            state: 'success',
            nodeSetting: {
              upload: state.nodeMenu.upload,
              line: '直线',
            },
            attrInfo: state.attrInfo,
            nodeList: reduceList,
            lineList: reduceLineList,
          }
          current[0].nodeList.push(node)

          //去除掉合并的子节点
          current[0].nodeList = current[0].nodeList.filter((item) => !reduceList.some((ele) => ele.id === item.id))
          //去除合并的线
          current[0].lineList = current[0].lineList.filter(
            (item) => !reduceLineList.some((ele) => ele.from === item.from)
          )

          //左侧树的操作
          let a = state.acticeList.filter((fil) => {
            return fil.tabId == state.editableTabsValue
          })

          let tree = methods.treeCallbackFun(a, state.editableTabsValue)
          //去除合并之前的
          tree.push(state.attrInfo)
          let tree2 = methods.treeCallbackFun2(a, state.editableTabsValue)
          tree2.children = tree2.children.filter((item) => !reduceacticeList.some((ele) => ele.id == item.id))
          //生成对应子节点
          methods.setNode(node, true)
        }
        $div.parentNode.removeChild($div)
        document.removeEventListener('mousemove', methods.chooseNodeMove)
        document.removeEventListener('mousedown', methods.chooseNodeDown)
        current[0].showParams.showChoose = false
        state.panzoom = Panzoom(document.getElementById('efContainer' + current[0].name))
      },
      chooseNodeMove(ele) {
        let current = state.editableTabs.filter((fil) => {
          return fil.name == state.editableTabsValue
        })
        let oBox = document.getElementById('efContainer' + current[0].name)
        let endX = ele.clientX - oBox.offsetLeft
        let endY = ele.clientY - oBox.offsetTop
        $('#accuracys').css({
          height: endY - state.divParams.height + 'px',
          width: endX - state.divParams.width + 'px',
          top: state.divParams.y + 'px',
          left: state.divParams.x + 'px',
        })

        state.divParams.sheight = endY - state.divParams.height
        state.divParams.swidth = endX - state.divParams.width
        //附选中状态
        current[0].nodeList.map((val) => {
          let left2 = parseInt(val.left.match(/\d+/g)[0])
          let top2 = parseInt(val.top.match(/\d+/g)[0])
          if (
            top2 > state.divParams.y &&
            left2 > state.divParams.x &&
            top2 + 66 < state.divParams.y + state.divParams.sheight &&
            left2 + 120 < state.divParams.x + state.divParams.swidth
          ) {
            val.reduceNode = true
          } else {
            val.reduceNode = false
          }
        })
      },
      //删除画布上的节点
      deleteNode() {
        let nodeId = state.activeElement.nodeId
        if (!nodeId) return
        ElMessageBox.confirm('确定要删除该节点吗?', '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          let current = state.editableTabs.filter((fil) => {
            return fil.name == state.editableTabsValue
          })
          // let topIndex = 0;
          let topIndex2 = 0
          // current[0].nodeList.map((data, index) => {
          //   if (data.id == nodeId) {
          //     topIndex = index;
          //   }
          // });
          current[0].lineList = current[0].lineList.filter(function (line) {
            if (line.from == nodeId || line.to == nodeId) {
              return false
            }
            return true
          })
          let connections = state.jsPlumb.getAllConnections()
          // console.log(connections,nodeId,'111111111111')
          //   connections.map((data) => {
          //     if (data.sourceId == nodeId || data.targetId == nodeId) {
          //       // 删除相匹配的线
          //       let a = state.jsPlumb.deleteConnection(data); // deleteConnection(@) 删除链接线  @线对象
          //     }
          //   });
          methods.forceExceed2(connections, connections.length)
          let topIndex = current[0].nodeList.findIndex((data) => data.id === nodeId)
          current[0].nodeList.splice(topIndex, 1)
          state.acticeList.map((item) => {
            if (item.tabId == state.editableTabsValue) {
              item.children.map((data, index) => {
                if (data.id == nodeId) {
                  topIndex2 = index
                }
              })
              item.children.splice(topIndex2, 1)
            }
          })

          if (state.attrInfo.id == nodeId) {
            state.attrInfo = {
              id: '',
              type: '',
              name: '',
              des: '',
              color: '',
              input: [],
              output: [],
              tool: [],
              post: [],
              frontActive: [],
              behindActive: [],
            }
          }
        })
      },
      //双击画布定义内部结构
      setNode(node, type) {
        //设置外层的大模型不展示高级属性
        node.attrInfo.nohighAttr = true
        let hasopen = state.editableTabs.find((val) => val.name == String(node.attrInfo.tabId))
        //选中的情况下
        if (node.nodeList.length && !hasopen) {
          let obj = {
            title: node.attrInfo.name || node.name + '_' + node.id,
            name: node.attrInfo.tabId,
            nodeList: node.nodeList.length ? node.nodeList : [],
            lineList: node.lineList.length ? node.lineList : [],
            showParams: {
              showPost: false,
              showTool: false,
              showChoose: false,
            },
          }
          //左侧树的操作

          let a = state.acticeList.filter((fil) => {
            return fil.tabId == node.attrInfo.tabId
          })

          let tree = methods.treeCallbackFun2(a, node.attrInfo.tabId)
          tree.param = obj

          state.editableTabs.push(obj)
        }
        //没有内部子结构，新添加一个
        if (!node.nodeList.length && !hasopen) {
          let obj = {
            title: node.attrInfo.name || node.name + '_' + node.id,
            name: node.attrInfo.tabId,
            nodeList: [],
            lineList: [],
            showParams: {
              showPost: false,
              showTool: false,
              showChoose: false,
            },
          }
          //左侧树的操作

          let a = state.acticeList.filter((fil) => {
            return fil.tabId == node.attrInfo.tabId
          })

          let tree = methods.treeCallbackFun2(a, node.attrInfo.tabId)
          tree.param = obj

          state.editableTabs.push(obj)

          state.editableTabsValue = String(node.attrInfo.tabId)
          methods.rePainter()
        } else {
          //有的话重新绘制
          state.editableTabsValue = String(node.attrInfo.tabId)
          methods.rePainter()
        }
      },

      //删除某个模型
      deleteModel(modelId, item) {
        ElMessageBox.confirm('确定要删除该模型吗?', '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          let map = new Map()
          for (let data of state.modelList) {
            map.set(data.name, data.children)
          }
          let children = map.get(item.name)
          children.map((item, index) => {
            if (item.id == modelId) {
              children.splice(index, 1)
            }
          })
        })
      },
      uploadImgInner(data) {
        state.visible = true
        nextTick(() => {
          state.nodeSetting = data.setting
          state.activeElement.nodeId = data.nodeId
          let nodeSettingUpload = document.getElementById('nodeSettingUpload')
          nodeSettingUpload.style.backgroundImage = 'url(' + state.nodeSetting.upload + ')'
        })
      },
      // 改变节点的位置
      changeNodeSite(data) {
        let current = state.editableTabs.filter((fil) => {
          return fil.name == state.editableTabsValue
        })
        for (var i = 0; i < current[0].nodeList.length; i++) {
          let node = current[0].nodeList[i]
          if (node.id === data.nodeId) {
            node.left = data.left
            node.top = data.top
          }
        }
      },
      //改变图示
      uploadImg(data, event) {
        // event.stopPropagation();
        // let fileBtn = document.getElementById(data.id);
        // fileBtn.click();
        state.flag = 1
        state.dialogVisible2 = true
        state.dialogInput2 = data.name
        state.currentModel = data.id //这里的id是里层的id，把这个变量赋值为里层的，和添加时id含义不一样
        state.tempImgURL = data.upload
          ? data.upload
          : new URL(`../../../assets/images/${data.ico}.png`, import.meta.url).href
        let userImg = document.getElementById('activeUploadImg')
        userImg.style.backgroundImage = 'url(' + state.tempImgURL + ')'
      },

      getActiveFile() {
        let fileBtn = document.getElementById('acticeFileupload')
        fileBtn.click()
      },
      getActiveFileNode() {
        let fileBtn = document.getElementById('acticeFileuploadNode')
        fileBtn.click()
      },
      changeActive(e) {
        const fileObj = e.target.files[0]
        const windowURL = window.URL || window.webkitURL
        if (fileObj) {
          state.tempImgURL = windowURL.createObjectURL(fileObj)
          let userImg = document.getElementById('activeUploadImg')
          userImg.style.backgroundImage = 'url(' + state.tempImgURL + ')'
        }
      },
      changeActiveNode(e) {
        const fileObj = e.target.files[0]
        const windowURL = window.URL || window.webkitURL
        if (fileObj) {
          state.nodeSetting.upload = windowURL.createObjectURL(fileObj)
          let userImg = document.getElementById('nodeSettingUpload')
          userImg.style.backgroundImage = 'url(' + state.nodeSetting.upload + ')'
        }
      },
      openUploadDialog(item) {
        state.flag = 0
        state.dialogVisible2 = true
        state.currentModel = item.id
        state.dialogInput2 = null
        let userImg = document.getElementById('activeUploadImg')
        userImg.style.backgroundImage = null
      },
      //确认添加类型
      sureToSave() {
        state.modelList.push({
          id: Math.random().toString(36).substr(3, 8),
          name: state.dialogInput,
          children: [],
        })
        state.dialogVisible = false
      },
      //确认添加活动
      sureToSaveActive() {
        state.tabIndex = Math.random().toString(36).substr(3, 10)

        let obj = {
          title: state.dialogInputActive,
          name: String(state.tabIndex),
          nodeList: [],
          lineList: [],
          showParams: {
            showPost: false,
            showTool: false,
            showChoose: false,
          },
        }
        state.acticeList.push({
          name: state.dialogInputActive,
          children: [],
          tabId: state.tabIndex,
          param: obj,
        })
        state.editableTabs.push(obj)
        state.activeVisible = false
        state.editableTabsValue = String(state.tabIndex)
      },
      sureToSave2() {
        if (state.flag) {
          state.modelList.map((data) => {
            data.children.map((res) => {
              if (res.id == state.currentModel) {
                res.name = state.dialogInput2
                res.type = state.dialogInput2
                res.upload = state.tempImgURL
              }
            })
          })
        } else {
          state.modelList.map((data) => {
            if (data.id == state.currentModel) {
              data.children.push({
                id: methods.getUUID(),
                name: state.dialogInput2,
                type: state.dialogInput2,
                ico: '',
                upload: state.tempImgURL,
                style: {},
              })
            }
          })
        }

        state.dialogVisible2 = false
      },
      sureToSaveNode() {
        let current = state.editableTabs.filter((fil) => {
          return fil.name == state.editableTabsValue
        })
        current[0].nodeList.map((data) => {
          if (data.id == state.activeElement.nodeId) {
            data.nodeSetting = state.nodeSetting
          }
          // data.nodeSetting
        })
        //先暂时删除再重绘
        // state.data.lineList.map((data) => {
        //   if (data.from == state.activeElement.nodeId) {
        //     state.jsPlumb.deleteConnectionsForElement(
        //       state.activeElement.nodeId
        //     );
        //   }
        // });
        var connections = state.jsPlumb.getAllConnections()
        let length = connections.length
        if (length) {
          methods.forceExceed(connections, length, 1)
          const cache = []
          for (const t of current[0].lineList) {
            if (cache.find((c) => c.from === t.from && c.to === t.to)) {
              // 已经存在说明以前记录过，现在这个就是多余的，直接忽略
              continue
            }
            cache.push(t)
          }
          current[0].lineList = JSON.parse(JSON.stringify(cache))
        }
        //重绘修改连线方式
        nextTick(() => {
          state.jsPlumb.ready(() => {
            current[0].lineList.map((data) => {
              if (data.from == state.activeElement.nodeId) {
                state.jsPlumb.connect({
                  source: data.from,
                  target: data.to,
                  // paintStyle:{ stroke:"blue", strokeWidth:10 }
                  // endpoint: [
                  //   "Dot",
                  //   {
                  //     radius: 3,
                  //     cssClass: "ef-dot",
                  //     hoverClass: "ef-dot-hover",
                  //   },
                  // ],
                  endpoint: [
                    'Image',
                    {
                      src: new URL(`../../../assets/images/spoint.png`, import.meta.url).href,
                      cssClass: 'ef-img',
                      hoverClass: 'ef-img-hover',
                    },
                  ],

                  connector:
                    state.nodeSetting.line == '直线'
                      ? ['Straight', { stub: 0, gap: 1 }]
                      : state.nodeSetting.line == '曲线'
                      ? ['Bezier', { curviness: 100 }]
                      : [
                          'Flowchart',
                          {
                            stub: 30,
                            gap: 1,
                            alwaysRespectStubs: false,
                            midpoint: 0.5,
                            cornerRadius: 10,
                          },
                        ],
                  // anchor: ['Left', 'Right']
                  // Connector: ['StateMachine', {margin: 5, curviness: 10, proximityLimit: 80}],
                })
              }
            })
          })
        })
        state.visible = false
      },
      //以这种方式控制强制执行
      forceExceed(connections, length, type) {
        length--
        if (type) {
          connections.map((data) => {
            if (data.sourceId == state.activeElement.nodeId) {
              // 删除相匹配的线
              let a = state.jsPlumb.deleteConnection(data) // deleteConnection(@) 删除链接线  @线对象
            }
          })
        } else {
          connections.map((data) => {
            if (data.targetId == state.activeElement.nodeId) {
              // 删除相匹配的线
              let a = state.jsPlumb.deleteConnection(data) // deleteConnection(@) 删除链接线  @线对象
            }
          })
        }

        if (length != 0) {
          methods.forceExceed(connections, length, type)
        }
      },
      forceExceed2(connections, length) {
        length--
        connections.map((data) => {
          if (data.sourceId == state.activeElement.nodeId || data.targetId == state.activeElement.nodeId) {
            // 删除相匹配的线
            let a = state.jsPlumb.deleteConnection(data) // deleteConnection(@) 删除链接线  @线对象
          }
        })
        // connections.map((data) => {
        //   if (data.targetId == state.activeElement.nodeId) {
        //     // 删除相匹配的线
        //     let a = state.jsPlumb.deleteConnection(data); // deleteConnection(@) 删除链接线  @线对象
        //   }
        // });

        if (length != 0) {
          methods.forceExceed2(connections, length)
        }
      },
      //点击树节点事件
      handleNodeClick(data) {
        console.log(data)
        //不分有没有孩子，有param直接跳
        if (data.param && data.param.nodeList.length) {
          let has = state.editableTabs.filter((fil) => {
            return fil.name == data.tabId
          })
          if (!has.length) {
            state.editableTabs.push(data.param)
            console.log(state.editableTabs, '0-0-0-0--0-0--')
          }
          state.editableTabsValue = data.tabId
          methods.rePainter()
        } else {
          nextTick(() => {
            methods.clickNode(data)
          })
        }
      },
      //点击某一行
      rowClick(row, column) {
        // console.log(row,column,'11111111')
        state.currentNum = row.num
      },
      getDaTree(flag, row) {
        if (flag) {
          state.activeSelect.type = row.type
          state.activeSelect.level = row.level
          state.activeSelect.language = row.deLanguage
          state.editableTabs = JSON.parse(JSON.stringify([]))
        }
        proxy.$axios
          .getActiveLibrary({
            type: state.activeSelect.type,
            level: state.activeSelect.level,
            deLanguage: state.activeSelect.language,
          })
          .then((res) => {
            let name =
              state.activeSelect.type == 1
                ? '火箭飞控活动列表'
                : state.activeSelect.type == 2
                ? '综控器监控活动列表'
                : state.activeSelect.type == 3
                ? 'GNCC活动列表'
                : state.activeSelect.type == 4
                ? '卫星星务活动列表'
                : '应用软件活动列表'
            state.acticeList[0].name = name
            state.acticeList[0].param.title = name
            let data = JSON.parse(res.data.daTree)
            if (!data) return
            state.acticeList = data
          })
      },
      saveParams() {
        let num = state.acticeList[0].children.length || 0
        proxy.$axios
          .saveActiveLibrary({
            type: state.activeSelect.type,
            level: state.activeSelect.level,
            deLanguage: state.activeSelect.language,
            daTree: JSON.stringify(state.acticeList),
            num,
          })
          .then((res) => {
            if (res.success) {
              ElNotification({
                title: '提示',
                message: '保存成功',
              })
            }
          })
      },
      //删除编辑页面
      removeTab(targetName) {
        const tabs = state.editableTabs
        let activeName = state.editableTabsValue
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          })
        }
        let obj = state.editableTabs.filter((fil) => {
          return fil.name == targetName
        })

        state.editableTabsValue = activeName
        state.editableTabs = tabs.filter((tab) => tab.name !== targetName)
        //当前的重画
        methods.rePainter()
        myTree.value.setCurrentKey(state.editableTabsValue)
      },
      //切换tab页时
      changeTab(targetName) {
        methods.rePainter()
        myTree.value.setCurrentKey(state.editableTabsValue)
      },
      //重新绘制方法
      rePainter() {
        state.attrInfo = {}
        nextTick(() => {
          state.jsPlumb = jsPlumb.getInstance()
          state.jsPlumb.reset()

          nextTick(async () => {
            await methods.jsPlumbInit()
            methods.panzoomInit()
          })
        })
        nextTick(() => {
          //重新加载之后要重新设置可拖动
          let current = state.editableTabs.filter((fil) => {
            return fil.name == state.editableTabsValue
          })

          current[0].nodeList.map((item) => {
            state.jsPlumb.makeSource(item.id, state.jsplumbSourceOptions)
            state.jsPlumb.makeTarget(item.id, state.jsplumbTargetOptions)
            state.jsPlumb.draggable(item.id, {
              // containment: "parent",
              containment: '',
              stop: function (el) {},
            })
          })
          //先对线去重
          const cache = []
          for (const t of current[0].lineList) {
            if (cache.find((c) => c.from === t.from && c.to === t.to)) {
              // 已经存在说明以前记录过，现在这个就是多余的，直接忽略
              continue
            }
            cache.push(t)
          }
          current[0].lineList = JSON.parse(JSON.stringify(cache))
          //再重新划线
          nextTick(() => {
            let current = state.editableTabs.filter((fil) => {
              return fil.name == state.editableTabsValue
            })
            state.jsPlumb.ready(() => {
              current[0].nodeList.map((item) => {
                current[0].lineList.map((data) => {
                  if (item.id == data.from) {
                    state.jsPlumb.connect({
                      source: data.from,
                      target: data.to,
                      // endpoint: [
                      //   "Dot",
                      //   {
                      //     radius: 5,
                      //     cssClass: "ef-dot",
                      //     hoverClass: "ef-dot-hover",
                      //   },
                      // ],
                      endpoint: [
                        'Image',
                        {
                          src: new URL(`../../../assets/images/spoint.png`, import.meta.url).href,
                          cssClass: 'ef-img',
                          hoverClass: 'ef-img-hover',
                        },
                      ],

                      endpointStyle: {
                        fill: '#fff',
                        outlineWidth: 10,
                        outlineStroke: '#00cdea',
                        strokeWidth: 2,
                      },
                      connectorHoverStyle: {
                        stroke: '#346f81',
                      },
                      hoverPaintStyle: {
                        stroke: '#346f81',
                      },
                      paintStyle: {
                        stroke: '#b4bdc5',
                        strokeWidth: 2,
                        outlineStroke: 'transparent',
                        outlineWidth: 10,
                      },
                      connector:
                        item.nodeSetting.line == '直线'
                          ? ['Straight', { stub: 0, gap: 1 }]
                          : item.nodeSetting.line == '曲线'
                          ? ['Bezier', { curviness: 100 }]
                          : [
                              'Flowchart',
                              {
                                stub: 30,
                                gap: 1,
                                alwaysRespectStubs: false,
                                midpoint: 0.5,
                                cornerRadius: 10,
                              },
                            ],
                      overlays: [
                        [
                          'Arrow',
                          {
                            width: 10, // 箭头尾部的宽度
                            length: 8, // 从箭头的尾部到头部的距离
                            location: 0.9, // 位置，建议使用0～1之间
                            direction: 1, // 方向，默认值为1（表示向前），可选-1（表示向后）
                            foldback: 0.623, // 折回，也就是尾翼的角度，默认0.623，当为1时，为正三角
                            id: 'arrow',
                          },
                        ],
                      ],
                      // anchor: ['Left', 'Right']
                      // Connector: ['StateMachine', {margin: 5, curviness: 10, proximityLimit: 80}],
                    })
                  }
                })
              })
            })
          })
        })
      },
      //删除前置后置活动时
      deleteLineActive(val) {
        let current = state.editableTabs.filter((fil) => {
          return fil.name == state.editableTabsValue
        })
        setTimeout(() => {
          current[0].nodeList.map((res) => {
            if (res.id == state.activeElement.nodeId) {
              current[0].nodeList.map((cp) => {
                if (cp.id == val) {
                  cp.attrInfo.behindActive = cp.attrInfo.behindActive.filter((fil) => {
                    return !(fil == res.id || fil == res.attrInfo.name)
                  })
                }
              })
            }
          })
          current[0].lineList = current[0].lineList.filter((fil) => {
            return fil.from != val
          })
        }, 200)
      },
      deleteLineActive2(val) {
        let current = state.editableTabs.filter((fil) => {
          return fil.name == state.editableTabsValue
        })
        setTimeout(() => {
          current[0].nodeList.map((res) => {
            if (res.id == state.activeElement.nodeId) {
              current[0].nodeList.map((cp) => {
                if (cp.id == val) {
                  cp.attrInfo.frontActive = cp.attrInfo.frontActive.filter((fil) => {
                    return !(fil == res.id || fil == res.attrInfo.name)
                  })
                }
              })
            }
          })
          current[0].lineList = current[0].lineList.filter((fil) => {
            return fil.to != val
          })
        }, 200)
      },
      //前后置活动更改时
      selectAndLineNode(type, list) {
        console.log(type, list, '1111111111111')
        //活动更改时先跳过校验，暂时这样处理
        state.jumpValite = true
        list = [...new Set(list)]
        let current = state.editableTabs.filter((fil) => {
          return fil.name == state.editableTabsValue
        })
        var connections = state.jsPlumb.getAllConnections()
        let length = connections.length
        if (length) {
          methods.forceExceed(connections, length, type)
          const cache = []
          for (const t of current[0].lineList) {
            if (cache.find((c) => c.from === t.from && c.to === t.to)) {
              // 已经存在说明以前记录过，现在这个就是多余的，直接忽略
              continue
            }
            cache.push(t)
          }
          current[0].lineList = JSON.parse(JSON.stringify(cache))
        }
        //重绘修改连线方式
        nextTick(() => {
          state.jsPlumb.ready(() => {
            current[0].nodeList.map((res) => {
              if (res.id == state.activeElement.nodeId) {
                res.attrInfo[type ? 'behindActive' : 'frontActive'].map((line) => {
                  state.jsPlumb.connect({
                    source: type ? res.id : line,
                    target: type ? line : res.id,
                    endpoint: [
                      'Image',
                      {
                        src: new URL(`../../../assets/images/spoint.png`, import.meta.url).href,
                        cssClass: 'ef-img',
                        hoverClass: 'ef-img-hover',
                      },
                    ],
                    connector:
                      state.nodeSetting.line == '直线'
                        ? ['Straight', { stub: 0, gap: 1 }]
                        : state.nodeSetting.line == '曲线'
                        ? ['Bezier', { curviness: 100 }]
                        : [
                            'Flowchart',
                            {
                              stub: 30,
                              gap: 1,
                              alwaysRespectStubs: false,
                              midpoint: 0.5,
                              cornerRadius: 10,
                            },
                          ],

                    // anchor: ['Left', 'Right']
                    // Connector: ['StateMachine', {margin: 5, curviness: 10, proximityLimit: 80}],
                  })
                  //其他节点上的属性前后活动也要选择上
                  // current[0].lineList.push({from:type ? res.id : line,to:type ? line : res.id})

                  current[0].nodeList.map((cp) => {
                    if (cp.id == line && type) {
                      cp.attrInfo.frontActive.push(res.attrInfo.name ? res.attrInfo.name : res.id)
                      cp.attrInfo.frontActive = [...new Set(cp.attrInfo.frontActive)]
                    }
                    if (cp.id == line && !type) {
                      cp.attrInfo.behindActive.push(res.attrInfo.name ? res.attrInfo.name : res.id)
                      cp.attrInfo.behindActive = [...new Set(cp.attrInfo.behindActive)]
                    }
                  })
                  console.log(3211)
                })
              }
            })
          })
        })
      },
    }

    return {
      ...toRefs(state),
      ...methods,
      acticeSelectList,
      myTree,
    }
  },
})
</script>
<style src="@/assets/styles/css/main.less" scoped></style>
<style scoped lang="less">
.el-select {
  height: auto;
}
.flex_center {
  display: flex;
  align-items: center;
  justify-content: center;
}
:deep(.el-tabs) {
  height: 100%;
}
:deep(.el-tabs__content) {
  height: calc(100% - 34px);
}
:deep(.el-tab-pane) {
  height: 100%;
}
:deep(.el-tabs--card > .el-tabs__header .el-tabs__item.is-active) {
  background-color: var(--my-bg-color);
  display: flex;
}
:deep(.el-tabs__header) {
  height: 32px;
  margin-bottom: 0;
  background-color: var(--my-bg-color-5);
}
:deep(.el-tabs__nav-wrap) {
  height: 32px;
}
:deep(.el-tabs__nav-scroll) {
  height: 32px;
}
:deep(.el-tabs__nav) {
  height: 32px;
  align-items: center;
}
:deep(.el-tabs__item) {
  height: 32px;
}
.el-select {
  flex: 1;
}
.Content2 {
  width: auto !important;
}
.oneInput2 {
  margin-top: 26px !important;
  span {
    // font-size: 14px !important;
    white-space: nowrap;
  }
}
.custom-tabs-label {
  display: flex;
  font-weight: 700;
}
.wrapper {
  height: 100%;
  background-color: var(--my-bg-color);
  border: 1px solid var(--el-border-color);
}
:deep(.el-collapse-item__header) {
  padding-left: 2rem;
}
:deep(.el-collapse-item__content) {
  padding-bottom: 0;
}
:deep(.el-select-dropdown__item) {
  padding-left: 1rem;
}
:deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
  background-color: var(--my-bg-color-2);
}
.dialogOneArea {
  width: 100%;
  .flex_center;
  flex-wrap: wrap;
  height: 10rem;
  border: 1px solid var(--el-border-color);
  .activeInner {
    width: 100%;
    .flex_center;
  }
}
.oneButton {
  padding: 0.3rem 1rem;
  display: inline-block;
  color: #fff;
  background: #0069f3;
  box-shadow: 0px 6px 3px 0px rgb(0 0 0 / 10%);
  border-radius: 3px;
  font-size: 12px;
  float: left;
  cursor: pointer;
  margin-bottom: 1rem;
}
.dialogOneArea_n {
  width: 100%;
  height: auto;
  padding: 1rem 0 1rem 1rem;
  background: var(--my-bg-color-3);
  border-radius: 4px;
  margin-top: 1rem;
  color: var(--my-text-bg-color);
  text-align: left;
}
.specil::-webkit-input-placeholder {
  color: #c0c5ce;
}
.addActive {
  width: 100%;
  height: 1.5rem;
  background: var(--my-bg-color-3);
  opacity: 0.3;
  font-size: 18px;
  margin-top: 0.5rem;
  cursor: pointer;
  .flex_center;
}
.activeImg {
  width: 10rem;
  height: 10rem;
  border: 1px solid var(--el-border-color);
  border-radius: 3px;
  color: #767676;
  font-size: 30px;
  cursor: pointer;
  .flex_center;
  background-size: 100% 100%;
}
.content_bottom {
  height: 2.5%;
  width: 100%;
  background: var(--my-bg-color-5);
  color: var(--my-text-bg-color);
  display: flex;
  align-items: center;
  padding-left: 0.8rem;
  font-size: 15px;
  img {
    width: 15px;
    height: 15px;
    margin-right: 0.5rem;
  }
}
.content_main {
  display: flex;
  color: var(--my-text-bg-color);
  height: 97.5%;
  .centerArea {
    width: calc(100% - 4px);
    height: 100%;
  }
  .rightMenu {
    width: 2%;
    height: 100%;
    border-left: 1px solid var(--el-border-color);
    font-size: 16px;
    background: var(--my-bg-color-5);

    .oneMenu {
      width: 100%;
      height: 7.5rem;
      writing-mode: vertical-lr;
      letter-spacing: 5px;
      // margin-top: .5rem;
      cursor: pointer;
      .flex_center;
      img {
        width: 15px;
        height: 15px;
        margin-bottom: 0.5rem;
      }
    }
    .oneMenuS {
      margin: auto;
      width: 80%;
      height: 4rem;
      writing-mode: vertical-lr;
      letter-spacing: 5px;
      background: #0069f3;
      box-shadow: 0px 6px 3px 0px rgba(0, 0, 0, 0.1);
      border-radius: 3px;
      .flex_center;
      color: #fff;
      cursor: pointer;
      // padding: .5rem .5rem;
      // transform:rotate(90deg);
      margin-top: 1rem;
    }
  }
  .leftMenu {
    width: 2.2%;
    height: 100%;
    border-right: 1px solid var(--el-border-color);
    border-bottom: 1px solid var(--el-border-color);
    font-size: 14px;
    .oneMenu {
      width: 100%;
      height: 9rem;
      border-bottom: 1px solid var(--el-border-color);
      writing-mode: vertical-lr;
      letter-spacing: 5px;
      color: var(--my-text-bg-color);
      cursor: pointer;
      .flex_center;
      img {
        width: 15px;
        height: 15px;
        margin-bottom: 0.5rem;
      }
    }
  }
  @keyframes fadein {
    from {
      width: 0;
    }
    to {
      width: 18.2%;
    }
  }
  @keyframes fadeout {
    from {
      width: 18.2%;
    }
    to {
      width: 0;
    }
  }
  @keyframes fadein2 {
    from {
      width: 0;
    }
    to {
      width: 20%;
    }
  }
  @keyframes fadeout2 {
    from {
      width: 20%;
    }
    to {
      width: 0;
    }
  }
  .sideArea {
    width: 18.2%;
    height: 100%;
    border-right: 1px solid var(--el-border-color);
    border-bottom: 1px solid var(--el-border-color);
    animation: fadein 0.5s;
  }
  .sideAreaFade {
    animation: fadeout 0.5s;
    width: 0;
    height: 0;
  }
  .sideArea2 {
    width: 15%;
    height: 100%;
    border-right: 1px solid var(--el-border-color);
    border-bottom: 1px solid var(--el-border-color);
    // animation: fadein2 0.8s;
    transition: width 0.5s;
    background: var(--my-bg-color-5);
  }
  .sideAreaFade2 {
    width: 0;
    height: 0;
    // animation: fadeout2 0.8s;
    transition: width 0.5s;
  }
  .topText2 {
    width: 100%;
    height: 2rem;
    color: var(--my-text-bg-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--my-bg-color);
    border-bottom: 1px solid var(--el-border-color);
    font-size: 16px;
    .inner {
      width: 8rem;
      height: 100%;
      // border-top: 1px solid #000;
      // border-left: 1px solid #000;
      // border-right: 1px solid #000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    // .inner2 {
    //   width: 8rem;
    //   height: 100%;
    //   border-right: 1px solid #000;
    //   display: flex;
    //   align-items: center;
    //   justify-content: center;
    // }
    img {
      margin-right: 1rem;
      cursor: pointer;
      width: 20px;
      height: 20px;
    }
  }
  .Content {
    width: 100%;
    height: calc(100% - 2rem);
    font-size: 16px !important;
    overflow: auto;
  }
  .Content2 {
    width: 100%;
    // height: calc(100% - 3rem);
    height: 100%;
    // border-top: 1px solid #000;
    position: relative;
    display: flex;
    flex-direction: column;
    // flex-wrap: wrap;
    overflow: auto;
    .oneInput {
      .flex_center;
      margin: 8px;
      span {
        width: 10%;
        text-align: center;
        font-size: 14px;
      }
      input {
        width: 72%;
        height: 100%;
        // box-shadow: 0px 6px 3px 0px rgb(0 0 0 / 10%);
      }
    }
    .oneInput2 {
      width: 100%;
      height: calc(16% - 1rem);
      margin-top: 1rem;
      // min-height: 1rem;
      .flex_center;
      span {
        width: 10%;
        text-align: center;
        font-size: 16px;
      }
      input {
        width: 72%;
        height: 100%;
      }
    }
  }
  .centerContent {
    width: 100%;
    height: 100%;
    .viewChoose {
      position: absolute;
      width: 13%;
      height: 2rem;
      left: 2rem;
      z-index: 999;
      .flex_center;
      img {
        width: 20px;
        height: 20px;
        margin-right: 1rem;
        cursor: pointer;
      }
    }
    .modelWrap {
      height: 100%;
      position: relative;
      overflow: hidden;
      outline: none !important;
    }
    .model {
      // height: 75%;
      outline: none !important;
      height: 100%;
      width: 100%;
      // transform: translate(-100%,-100%);
      // background: #f5f7fa;
      position: relative; //*********这 */
      // right:100%;
      // bottom:100%;
      // overflow: auto;
      // flex: 1;
    }
    @keyframes fadein3 {
      from {
        // height:0;
        transform: translateY(100%);
      }
      to {
        // height:30%;
        transform: translateY(0);
      }
    }
    @keyframes fadeout3 {
      from {
        // height:30%;
        transform: translateY(0);
      }
      to {
        // height:0;
        transform: translateY(100%);
      }
    }
    .attrbute {
      height: 25%;
      width: 100%;
      border-top: 1px solid var(--el-border-color);
      animation: fadein3 0.8s;
      position: absolute;
      bottom: 0;
      background: var(--my-bg-color);
    }
    .attrbuteFade {
      height: 25%;
      width: 100%;
      animation: fadeout3 0.8s;
      position: absolute;
      bottom: 0;
    }
  }
  .treeRoot {
    margin: 2rem 0 0 1rem;
  }
  .treeNode {
    margin: 0.5rem 0 0 5rem;
    display: flex;
    align-items: center;
  }
  .oneModelWrap {
    display: flex;
    /* justify-content: center; */
    align-items: center;
    flex-wrap: wrap;
  }
  .oneModel {
    width: 100%;
    height: 2rem;
    span {
      // width: calc(100% - 15px);
    }
    .flex_center;
    justify-content: left;
    .gragh {
      // width: 120px;
      // height: 66px;
      margin-right: 0.5rem;
      margin-left: 3rem;
      .flex_center();
      img {
        width: 15px;
        height: 15px;
      }
    }
  }
}
.tt {
  cursor: move;
  // display: flex;
}
.specail {
  display: flex;
  justify-content: center;
  height: 100%;
}
.el-collapse{
  background-color: var(--my-bg-color);
}
</style>

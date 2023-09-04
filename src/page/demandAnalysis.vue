<!--
 * @Author: LiuFengRui
 * @Date: 2021-11-08 15:41:12
 * @LastEditTime: 2023-07-26 13:35:10
 * @LastEditors: Please set LastEditors
 * @Description: 
-->
<template>
  <div class="wrapper">
    <div class="content_main">
      <div class="topMenu">
        <!-- 领域需求结构化定义工具 -->
        <div class="menuArea">
          <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            background-color="#fff"
            text-color="#000"
            active-text-color="#40afff"
            @select="handleSelect"
          >
            <el-sub-menu index="1">
              <template #title
                ><img
                  src="src/assets/images/menu_file.png"
                  style="height: 15px; width: 15px; margin-right: 8px"
                />文件</template
              >
              <el-menu-item index="1-1">从...打开</el-menu-item>
              <el-menu-item index="1-2">另存为</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title
                ><img
                  src="src/assets/images/menu_operate.png"
                  style="height: 15px; width: 15px; margin-right: 8px"
                />操作</template
              >
              <el-menu-item index="2-1">确认</el-menu-item>
              <el-menu-item index="2-2">保存</el-menu-item>
              <el-menu-item index="2-3">重新生成</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="3">
              <template #title
                ><img
                  src="src/assets/images/menu_view.png"
                  style="height: 15px; width: 15px; margin-right: 8px"
                />视图</template
              >
              <el-menu-item index="3-1" style="display: flex; justify-content: space-between; align-items: center"
                >左侧树
                <el-switch
                  v-model="showTree"
                  class="ml-2"
                  style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                />
              </el-menu-item>
              <el-menu-item index="3-2" style="display: flex; justify-content: space-between; align-items: center"
                >左右对照视图模式
                <el-switch
                  v-model="showTaskBook"
                  class="ml-2"
                  style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                />
              </el-menu-item>
              <el-menu-item index="3-3" style="display: flex; justify-content: space-between; align-items: center"
                >智能辅助视图模式
                <el-switch
                  v-model="showStretch"
                  class="ml-2"
                  style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                />
              </el-menu-item>
              <!-- <el-menu-item
              index="4-2"
              style="display:flex;justify-content: space-between;align-items:center"
              >批量确认
              <el-switch
                v-model="showEvalue"
                class="ml-2"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949;"
              />
            </el-menu-item> -->
            </el-sub-menu>
            <el-sub-menu index="4">
              <template #title
                ><img
                  src="src/assets/images/tool_menu.png"
                  style="height: 15px; width: 15px; margin-right: 8px"
                />工具</template
              >
              <el-menu-item index="4-1" style="display: flex; justify-content: space-between; align-items: center"
                >智能验证
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </div>
      </div>
      <div class="bottom_contain">
        <div :class="[showTaskBook ? 'leftTask' : 'leftTask2']">
          <el-affix :offset="60" style="width: 100%">
            <img src="src/assets/images/amplify.png" class="taskBook" @click="changeSizeTask(0)" />
            <img src="src/assets/images/shrink.png" class="taskBook" style="right: 40px" @click="changeSizeTask(1)" />
          </el-affix>
          <div class="childRef"></div>
        </div>
        <div v-if="isDemand" :class="[showTree ? 'leftTree' : 'leftTree2']">
          <el-tree
            :data="treeData"
            :props="defaultProps"
            @node-click="handleNodeClick"
            :expand-on-click-node="false"
            :default-expand-all="true"
            highlight-current
            node-key="label"
            :show-checkbox="showEvalue"
            ref="elTree"
          >
            <template #default="{ node, data }">
              <div
                class="custom-tree-node"
                @mouseenter="data.showSign = true"
                @mouseleave="data.showSign = false"
                :title="node.label + '(' + data.params?.id + ')'"
              >
                <div class="treeTitle">
                  <div class="confirmed" v-if="data.params && data.params.confirm">待确认</div>
                  <span class="treeSpan">{{ node.label }}</span>
                  <span v-if="data.params && data.params.id">&nbsp;({{ data.params.id }})</span>
                </div>
                <span v-show="data.showSign">
                  <a @click="openDialog(data, node)"> + </a>
                  <a style="margin-left: 8px" @click="remove(node, data)"> × </a>
                </span>
              </div>
            </template>
          </el-tree>
        </div>
        <div v-if="isDemand" class="rightContent">
          <!-- :style="{ width: showTree ? 'calc(75% - 1rem)' : '100%' }" -->
          <!-- <div
        class="rightChoose"
        style="height:100%;top:0;"
        v-if="params.id && showRocket"
      >
        <img src="src/assets/images/rocket2.png" class="goTopAnimation" />
        <div class="fuel"></div>
      </div> -->
          <div class="width:100%;height:100%;" v-if="params.id && showDetail">
            <!-- <el-affix :offset="150" style="transition:1s;"> -->
            <div
              v-if="showRocket2"
              :style="{ right: showAffix ? '-2%' : '-4.5%' }"
              class="rightChoose"
              @mouseenter="showAffix = true"
              @mouseleave="showAffix = false"
            >
              <!--:style="{right:showTree?'0':'-35%'}" -->
              <el-collapse accordion>
                <el-collapse-item name="1">
                  <template #title>
                    <img
                      src="src/assets/images/icon.png"
                      style="height: 50px; width: 50px"
                      :class="[trsnsformImg ? 'transformImg' : 'transformImg2']"
                      @click="trsnsformImg = !trsnsformImg"
                    />
                  </template>
                  <draggable @end="end" @start="move" v-model="dragList" forceFallback="false" ghostClass="tt">
                    <template #item="{ element }">
                      <div class="chooseCollapse" :title="element.name">
                        <img :src="'src/assets/images/' + element.id + '.png'" style="cursor: pointer" />
                        <!-- <span>{{ element.name }}</span> -->
                      </div>
                    </template>
                  </draggable>
                </el-collapse-item>
              </el-collapse>
            </div>
            <!-- </el-affix> -->

            <ul class="ulClass">
              <li>
                <span style="color: #67aae9; font-size: 20px">需求详情</span>
                <!-- <div class="button" @click="saveParams">保存</div> -->
              </li>
              <li>
                <span>需求名称</span>
                <input
                  type="text"
                  style="height: 2.5rem; margin-left: 4rem; width: 80%; background: #efefef; cursor: not-allowed"
                  v-model="params.name"
                  disabled
                />
              </li>
              <li>
                <span>需求ID&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <input
                  type="text"
                  style="height: 2.5rem; margin-left: 4rem; width: 32%; background: #efefef; cursor: not-allowed"
                  v-model="params.id"
                  disabled
                />
                <span style="margin-left: 4rem">需求类型</span>
                <!-- <input
              type="text"
              style="height:2.5rem;margin-left:4rem;width:19rem;"
              v-model="params.type"
            /> -->
                <el-select
                  v-model="params.type"
                  size="normal"
                  placeholder="请选择"
                  style="height: 2.5rem; margin-left: 3rem; width: 32.5%"
                >
                  <el-option
                    style="padding-left: 1rem"
                    v-for="gs in typeList"
                    :key="gs.id"
                    :label="gs.label"
                    :value="gs.id"
                  />
                </el-select>
              </li>
              <li>
                <span>处理过程</span>
                <div class="produceArea">
                  <span
                    style="right: 0; top: 0; line-height: 16px; position: absolute; cursor: pointer; width: 1rem"
                    title="添加处理步骤"
                    @click="addProduce(params.produce)"
                    >+</span
                  >
                  <div class="oneProduce" v-for="(item, index) in params.produce" :key="index">
                    <img src="src/assets/images/liebiao.png" style="height: 15px; width: 15px; margin-left: 1rem" />
                    <span>&nbsp;步骤{{ index + 1 }}</span>
                    <!-- <input type="text" v-model="item.content" /> -->
                    <el-select
                      v-model="item.value"
                      size="small"
                      placeholder="请选择"
                      @change="filterProduce(item, index)"
                      :title="item.value"
                    >
                      <el-option
                        style="padding-left: 1rem"
                        v-for="gs in item.content"
                        :key="gs.content"
                        :label="gs.content"
                        :value="gs.content"
                      />
                    </el-select>
                    <span @click="deleteProduce(params, index)" style="cursor: pointer; margin-left: 1rem">×</span>
                  </div>
                </div>
                <img
                  v-show="!showAffix"
                  src="src/assets/images/add2.png"
                  @click="produceDrawer = true"
                  style="height: 20px; width: 20px; margin-left: 1rem; cursor: pointer"
                  title="添加步骤可选择项"
                />
                <teleport to="#teleport-produce">
                  <el-drawer v-model="produceDrawer" size="15%" direction="rtl">
                    <span>添加该步骤可选择内容</span>
                    <span style="margin-left: 1rem; cursor: pointer" @click="addProduceContent">+</span>
                    <div style="height: 5%" class="drawerContent" v-for="(item, index) in produceContent" :key="index">
                      <input type="text" v-model="item.content" />
                      <span
                        @click="deleteProduceContent(produceContent, index)"
                        style="cursor: pointer; margin-left: 1rem"
                        >×</span
                      >
                    </div>
                    <div style="position: absolute; bottom: 0; width: 90%" class="drawerContent">
                      <!-- <el-button @click="produceDrawer = fasle">取消</el-button> -->
                      <el-button type="primary" @click="saveProduce">确认</el-button>
                    </div>
                  </el-drawer>
                </teleport>
              </li>
              <li>
                <el-popover placement="right" :width="400" trigger="click" v-if="showStretch">
                  <template #reference>
                    <span style="cursor: pointer; position: relative"
                      >输入
                      <!-- <div class="strechPoint"></div> -->
                      <img class="strechPoint" src="src/assets/images/ai.png" alt="" />
                    </span>
                  </template>
                  <el-tabs v-model="params.activeName" class="demo-tabs">
                    <el-tab-pane label="建议" name="1">
                      <div class="strechAdvice">
                        <ul>
                          <li>
                            <img
                              src="src/assets/images/flag.png"
                              style="width: 20px; height: 20px; margin-right: 1rem"
                            />
                            <span
                              >建议输入参数加上‘起飞信号’。起飞时刻作为助推飞行阶段程序角计算的计时零点，是很重要的输入参数。</span
                            >
                          </li>
                          <!-- <li>
                        <img src="src/assets/images/flag.png" style="width:20px;height:20px;margin-right:1rem">
                        <span>需求分析中，输入参数有‘起飞信号’</span>
                      </li> -->
                        </ul>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="历史案例" name="2">
                      <div class="strechAdvice">
                        <ul>
                          <li>
                            <img
                              src="src/assets/images/flag2.png"
                              style="width: 20px; height: 20px; margin-right: 1rem"
                            />
                            <span>xxx案例</span>
                            <i style="margin-left: 1rem">程序角初始值:</i>
                            <input type="text" value="1" disabled style="margin-left: 5px; width: 30%" />
                          </li>
                          <li>
                            <img
                              src="src/assets/images/flag2.png"
                              style="width: 20px; height: 20px; margin-right: 1rem"
                            />
                            <span>xxx案例</span>
                            <i style="margin-left: 1rem">程序角初始值:</i>
                            <input type="text" value="1" disabled style="margin-left: 5px; width: 30%" />
                          </li>
                        </ul>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </el-popover>

                <span v-else>输入</span>
                <div class="inputArea" id="inputArea">
                  <grid-layout
                    :layout.sync="params.layout"
                    :col-num="3"
                    :row-height="36"
                    :is-draggable="true"
                    :is-resizable="true"
                    :is-mirrored="false"
                    :vertical-compact="true"
                    :margin="[10, 10]"
                    :use-css-transforms="true"
                  >
                    <grid-item
                      v-for="item in params.layout"
                      :class="[item.type == '4' ? 'gridItem2' : 'gridItem']"
                      :x="item.x"
                      :y="item.y"
                      :w="item.w"
                      :h="item.h"
                      :i="item.i"
                      :key="item.i"
                    >
                      <!-- 拖动输入框进来 -->
                      <div class="inputChoose" v-show="item.type == '1'">
                        <span
                          style="right: 2rem; top: 0; line-height: 16px; position: absolute; cursor: pointer"
                          title="添加输入框"
                          @click="addInputArea(item)"
                          >+</span
                        >
                        <ul>
                          <li
                            v-for="(area, index) in item.inputParams"
                            :key="index"
                            @mouseenter="area.showDelete = true"
                            @mouseleave="area.showDelete = false"
                          >
                            <input type="checkbox" name="" id="" v-model="area.checked" />
                            <input
                              type="text"
                              @blur="area.showBorder = false"
                              @focus="area.showBorder = true"
                              :style="{
                                border: area.showBorder ? '1px solid #dcdfe6' : 'none',
                              }"
                              v-model="area.name"
                              placeholder="输入框标题"
                            />
                            <input
                              type="text"
                              style="margin-left: 2rem"
                              v-model="area.content"
                              placeholder="输入框内容"
                            />
                            <span
                              v-show="area.showDelete"
                              @click="deleteInputArea(item, index)"
                              style="cursor: pointer; margin-left: 1rem"
                              >×</span
                            >
                          </li>
                          <li></li>
                        </ul>
                        <span @click="deleteGrid(item, item.i)" class="deleteGrid">×</span>
                      </div>
                      <!-- 拖动tab表格进来 -->
                      <div class="tabTableChoose" v-show="item.type == '2'">
                        <teleport to="#teleport-target" v-if="teleportCurrent == item.i">
                          <el-drawer v-model="drawer" size="15%" direction="rtl">
                            <!-- <template #header> -->
                            <h4>添加tab页名称</h4>
                            <!-- </template>
                      <template #default> -->
                            <div class="drawerContent">
                              <input type="text" v-model="tabNameInput" />
                            </div>
                            <h4>添加对应列名称(、符号隔开)</h4>
                            <!-- </template>
                      <template #default> -->
                            <div class="drawerContent">
                              <input type="text" v-model="tabColumeInput" />
                            </div>
                            <!-- </template> -->
                            <!-- <template #footer> -->
                            <div style="position: absolute; bottom: 0; width: 90%" class="drawerContent">
                              <el-button @click="drawer = fasle">取消</el-button>
                              <el-button type="primary" @click="addtabArea(item)">确认</el-button>
                            </div>
                            <!-- </template> -->
                          </el-drawer>
                        </teleport>
                        <teleport to="#teleport-target2" v-if="teleportColume == item.i">
                          <el-drawer v-model="drawer2" size="15%" direction="rtl">
                            <!-- <template #header> -->
                            <h3>添加行数据</h3>

                            <div
                              class="drawerContent"
                              v-for="(jou, index) in reserveDrawlist"
                              :key="index"
                              style="flex-direction: column"
                            >
                              <div style="margin: 1rem 3rem 1rem 0px; width: 100%">
                                {{ jou.label }}
                              </div>
                              <p></p>
                              <input type="text" v-model="jou.content" />
                            </div>
                            <div style="position: absolute; bottom: 0; width: 90%" class="drawerContent">
                              <el-button @click="drawer2 = fasle">取消</el-button>
                              <el-button type="primary" @click="addColumnList(item)">确认</el-button>
                            </div>
                            <!-- </template> -->
                          </el-drawer>
                        </teleport>
                        <span
                          style="
                            z-index: 9;
                            cursor: pointer;
                            position: absolute;
                            right: 2rem;
                            top: 0;
                            line-height: 16px;
                          "
                          @click="addTab(item.i)"
                          title="添加tab页"
                          >+</span
                        >
                        <img
                          src="src/assets/images/add3.png"
                          style="
                            z-index: 9;
                            height: 15px;
                            width: 15px;
                            cursor: pointer;
                            position: absolute;
                            right: 10px;
                            top: 20%;
                          "
                          @click="addRowData(item, item.i)"
                          title="添加行数据"
                          v-if="item.tabTableParams.tabList.length"
                        />
                        <el-tabs v-model="item.tabTableParams.activeName" class="demo-tabs">
                          <el-tab-pane
                            :label="area.label"
                            :name="area.name"
                            v-for="area in item.tabTableParams.tabList"
                            :key="area.name"
                          >
                            <div class="tabInner" v-if="area.name == item.tabTableParams.activeName">
                              <el-table :data="area.tableList" border style="width: 100%" height="93%">
                                <el-table-column
                                  v-for="(jou, index) in area.columeList"
                                  :key="index"
                                  :prop="jou.label"
                                  align="center"
                                >
                                  <template #header>
                                    <img style="width: 78px" src="src/assets/images/unit.png" v-if="jou.label == 'a'" />
                                    <span v-else>{{ jou.label }}</span>
                                  </template>
                                  <!-- <template #default="scope">
                              <span>{{scope}}</span>
                            </template> -->
                                </el-table-column>
                                <el-table-column label="选项" align="center">
                                  <template #default="scope">
                                    <!-- <el-button
                                  link
                                  type="primary"
                                  size="small"
                                  @click.prevent="
                                    area.tableList.splice(scope.$index, 1)
                                  "
                                > -->
                                    <span
                                      style="color: #5eadff; cursor: pointer; font-weight: 400"
                                      @click.prevent="area.tableList.splice(scope.$index, 1)"
                                      >删除</span
                                    >
                                    <!-- </el-button> -->
                                  </template>
                                </el-table-column>
                              </el-table>
                            </div>
                          </el-tab-pane>
                          <!-- <el-tab-pane label="Role" name="third">Role</el-tab-pane>
                    <el-tab-pane label="Task" name="fourth">Task</el-tab-pane> -->
                        </el-tabs>
                        <span @click="deleteGrid(item, item.i)" class="deleteGrid">×</span>
                      </div>
                      <!-- 拖动选择框进来 -->
                      <div class="checkboxChoose" v-show="item.type == '3'">
                        <span
                          style="right: 2rem; top: 0; line-height: 16px; position: absolute; cursor: pointer"
                          title="添加选择框"
                          @click="addcheckboxArea(item)"
                          >+</span
                        >
                        <div
                          class="onecheckbox"
                          v-for="(area, index) in item.checkboxParams"
                          :key="index"
                          @mouseenter="area.showDelete = true"
                          @mouseleave="area.showDelete = false"
                        >
                          <input type="checkbox" name="" id="" v-model="area.checked" />
                          <input
                            type="text"
                            @blur="area.showBorder = false"
                            @focus="area.showBorder = true"
                            :style="{
                              border: area.showBorder ? '1px solid #dcdfe6' : 'none',
                            }"
                            v-model="area.name"
                            placeholder="请输入单选框名称"
                          />
                          <span
                            @click="deletecheckboxArea(item, index)"
                            style="cursor: pointer; margin-left: 0.5rem"
                            v-show="area.showDelete"
                            >×</span
                          >
                        </div>
                        <span @click="deleteGrid(item, item.i)" class="deleteGrid">×</span>
                      </div>
                      <!-- 拖动文本框进来 -->
                      <div class="textChoose" v-show="item.type == '4'">
                        <el-input
                          style="height: 100%; font-size: 16px"
                          v-model="item.textParams"
                          :autosize="{ minRows: 3, maxRows: 3 }"
                          resize="none"
                          type="textarea"
                          placeholder="请输入"
                        />
                        <span @click="deleteGrid(item, item.i)" class="deleteGrid">×</span>
                      </div>
                    </grid-item>
                  </grid-layout>
                </div>
              </li>
              <li>
                <el-popover placement="right" :width="400" trigger="click" v-if="showStretch">
                  <template #reference>
                    <span style="cursor: pointer; position: relative"
                      >输出
                      <!-- <div class="strechPoint"></div> -->
                      <img class="strechPoint" src="src/assets/images/ai.png" alt="" />
                    </span>
                  </template>
                  <el-tabs v-model="params.activeName2">
                    <el-tab-pane label="建议" name="1">
                      <div class="strechAdvice">
                        <div class="resultNull">暂无</div>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="历史案例" name="2">
                      <div class="strechAdvice">
                        <div class="resultNull">暂无</div>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </el-popover>
                <span v-else>输出</span>
                <div class="inputArea" id="inputArea2">
                  <grid-layout
                    :layout.sync="params.layout2"
                    :col-num="3"
                    :row-height="36"
                    :is-draggable="true"
                    :is-resizable="true"
                    :is-mirrored="false"
                    :vertical-compact="true"
                    :margin="[10, 10]"
                    :use-css-transforms="true"
                  >
                    <grid-item
                      v-for="item in params.layout2"
                      :class="[item.type == '4' ? 'gridItem2' : 'gridItem']"
                      :x="item.x"
                      :y="item.y"
                      :w="item.w"
                      :h="item.h"
                      :i="item.i"
                      :key="item.i"
                    >
                      <!-- 拖动输入框进来 -->
                      <div class="inputChoose" v-show="item.type == '1'">
                        <span
                          style="right: 2rem; top: 0; line-height: 16px; position: absolute; cursor: pointer"
                          title="添加输入框"
                          @click="addInputArea(item)"
                          >+</span
                        >
                        <ul>
                          <li
                            v-for="(area, index) in item.inputParams"
                            :key="index"
                            @mouseenter="area.showDelete = true"
                            @mouseleave="area.showDelete = false"
                          >
                            <input type="checkbox" name="" id="" v-model="area.checked" />
                            <input
                              type="text"
                              @blur="area.showBorder = false"
                              @focus="area.showBorder = true"
                              :style="{
                                border: area.showBorder ? '1px solid #dcdfe6' : 'none',
                              }"
                              v-model="area.name"
                              placeholder="输入框标题"
                            />
                            <input
                              type="text"
                              style="margin-left: 2rem"
                              v-model="area.content"
                              placeholder="输入框内容"
                            />
                            <span
                              @click="deleteInputArea(item, index)"
                              style="cursor: pointer; margin-left: 1rem"
                              v-show="area.showDelete"
                              >×</span
                            >
                          </li>
                          <li></li>
                        </ul>
                        <span @click="deleteGrid2(item, item.i)" class="deleteGrid">×</span>
                      </div>
                      <!-- 拖动tab表格进来 -->
                      <div class="tabTableChoose" v-show="item.type == '2'">
                        <teleport to="#teleport-target3" v-if="teleportCurrent == item.i">
                          <el-drawer v-model="drawer3" size="15%" direction="rtl">
                            <!-- <template #header> -->
                            <h4>添加tab页名称</h4>
                            <!-- </template>
                      <template #default> -->
                            <div class="drawerContent">
                              <input type="text" v-model="tabNameInput" />
                            </div>
                            <h4>添加对应列名称(、符号隔开)</h4>
                            <!-- </template>
                      <template #default> -->
                            <div class="drawerContent">
                              <input type="text" v-model="tabColumeInput" />
                            </div>
                            <!-- </template> -->
                            <!-- <template #footer> -->
                            <div style="position: absolute; bottom: 0; width: 90%" class="drawerContent">
                              <el-button @click="drawer3 = fasle">取消</el-button>
                              <el-button type="primary" @click="addtabArea(item)">确认</el-button>
                            </div>
                            <!-- </template> -->
                          </el-drawer>
                        </teleport>
                        <teleport to="#teleport-target4" v-if="teleportColume == item.i">
                          <el-drawer v-model="drawer4" size="15%" direction="rtl">
                            <!-- <template #header> -->
                            <h3>添加行数据</h3>

                            <div
                              class="drawerContent"
                              v-for="(jou, index) in reserveDrawlist"
                              :key="index"
                              style="flex-direction: column"
                            >
                              <div style="margin: 1rem 3rem 1rem 0px; width: 100%">
                                {{ jou.label }}
                              </div>
                              <p></p>
                              <input type="text" v-model="jou.content" />
                            </div>
                            <div style="position: absolute; bottom: 0; width: 90%" class="drawerContent">
                              <el-button @click="drawer4 = fasle">取消</el-button>
                              <el-button type="primary" @click="addColumnList(item)">确认</el-button>
                            </div>
                            <!-- </template> -->
                          </el-drawer>
                        </teleport>
                        <span
                          style="
                            z-index: 9;
                            cursor: pointer;
                            position: absolute;
                            right: 2rem;
                            top: 0;
                            line-height: 16px;
                          "
                          @click="addTabThree(item.i)"
                          title="添加tab页"
                          >+</span
                        >
                        <img
                          src="src/assets/images/add3.png"
                          style="
                            z-index: 9;
                            height: 15px;
                            width: 15px;
                            cursor: pointer;
                            position: absolute;
                            right: 10px;
                            top: 20%;
                          "
                          @click="addRowDataFour(item)"
                          title="添加行数据"
                          v-if="item.tabTableParams.tabList.length"
                        />
                        <el-tabs v-model="item.tabTableParams.activeName" class="demo-tabs">
                          <el-tab-pane
                            :label="area.label"
                            :name="area.name"
                            v-for="area in item.tabTableParams.tabList"
                            :key="area.name"
                          >
                            <div class="tabInner" v-if="area.name == item.tabTableParams.activeName">
                              <el-table :data="area.tableList" border style="width: 100%" height="93%">
                                <!-- <el-table-column
                              v-for="(jou, index) in area.columeList"
                              :key="index"
                              :prop="jou.label"
                              :label="jou.label"
                              align="center"
                            /> -->
                                <el-table-column
                                  v-for="(jou, index) in area.columeList"
                                  :key="index"
                                  :prop="jou.label"
                                  align="center"
                                >
                                  <template #header>
                                    <img style="width: 78px" src="src/assets/images/unit.png" v-if="jou.label == 'a'" />
                                    <span v-else>{{ jou.label }}</span>
                                  </template>
                                  <!-- <template #default="scope">
                              <span>{{scope}}</span>
                            </template> -->
                                </el-table-column>
                                <el-table-column label="选项" align="center">
                                  <template #default="scope">
                                    <!-- <el-button
                                  link
                                  type="primary"
                                  size="small"
                                  @click.prevent="
                                    area.tableList.splice(scope.$index, 1)
                                  "
                                >
                                  删除
                                </el-button> -->
                                    <span
                                      style="color: #5eadff; cursor: pointer; font-weight: 400"
                                      @click.prevent="area.tableList.splice(scope.$index, 1)"
                                      >删除</span
                                    >
                                  </template>
                                </el-table-column>
                              </el-table>
                            </div>
                          </el-tab-pane>
                          <!-- <el-tab-pane label="Role" name="third">Role</el-tab-pane>
                    <el-tab-pane label="Task" name="fourth">Task</el-tab-pane> -->
                        </el-tabs>
                        <span @click="deleteGrid2(item, item.i)" class="deleteGrid">×</span>
                      </div>
                      <!-- 拖动选择框进来 -->
                      <div class="checkboxChoose" v-show="item.type == '3'">
                        <span
                          style="right: 2rem; top: 0; line-height: 16px; position: absolute; cursor: pointer"
                          title="添加选择框"
                          @click="addcheckboxArea(item)"
                          >+</span
                        >
                        <div
                          class="onecheckbox"
                          v-for="(area, index) in item.checkboxParams"
                          :key="index"
                          @mouseenter="area.showDelete = true"
                          @mouseleave="area.showDelete = false"
                        >
                          <input type="checkbox" name="" id="" v-model="area.checked" />
                          <input
                            type="text"
                            @blur="area.showBorder = false"
                            @focus="area.showBorder = true"
                            :style="{
                              border: area.showBorder ? '1px solid #dcdfe6' : 'none',
                            }"
                            v-model="area.name"
                            placeholder="请输入单选框名称"
                          />
                          <span
                            @click="deletecheckboxArea(item, index)"
                            style="cursor: pointer; margin-left: 0.5rem"
                            v-show="area.showDelete"
                            >×</span
                          >
                        </div>
                        <span @click="deleteGrid2(item, item.i)" class="deleteGrid">×</span>
                      </div>
                      <!-- 拖动文本框进来 -->
                      <div class="textChoose" v-show="item.type == '4'">
                        <el-input
                          style="height: 100%; font-size: 16px"
                          v-model="item.textParams"
                          :autosize="{ minRows: 3, maxRows: 3 }"
                          resize="none"
                          type="textarea"
                          placeholder="请输入"
                        />
                        <span @click="deleteGrid2(item, item.i)" class="deleteGrid">×</span>
                      </div>
                    </grid-item>
                  </grid-layout>
                </div>
              </li>
              <li>
                <el-popover placement="right" :width="400" trigger="click" v-if="showStretch">
                  <template #reference>
                    <span style="cursor: pointer; position: relative"
                      >异常处理
                      <!-- <div class="strechPoint"></div> -->
                      <img class="strechPoint" src="src/assets/images/ai.png" alt="" />
                    </span>
                  </template>
                  <el-tabs v-model="params.activeName3">
                    <el-tab-pane label="建议" name="1">
                      <div class="strechAdvice">
                        <div class="resultNull">暂无</div>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="历史案例" name="2">
                      <div class="strechAdvice">
                        <div class="resultNull">暂无</div>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </el-popover>
                <span v-else>异常处理</span>
                <div class="inputArea" id="inputArea3">
                  <grid-layout
                    :layout.sync="params.layout3"
                    :col-num="3"
                    :row-height="36"
                    :is-draggable="true"
                    :is-resizable="true"
                    :is-mirrored="false"
                    :vertical-compact="true"
                    :margin="[10, 10]"
                    :use-css-transforms="true"
                  >
                    <grid-item
                      v-for="item in params.layout3"
                      :class="[item.type == '4' ? 'gridItem2' : 'gridItem']"
                      :x="item.x"
                      :y="item.y"
                      :w="item.w"
                      :h="item.h"
                      :i="item.i"
                      :key="item.i"
                    >
                      <!-- 拖动输入框进来 -->
                      <div class="inputChoose" v-show="item.type == '1'">
                        <span
                          style="right: 2rem; top: 0; line-height: 16px; position: absolute; cursor: pointer"
                          title="添加输入框"
                          @click="addInputArea(item)"
                          >+</span
                        >
                        <ul>
                          <li
                            v-for="(area, index) in item.inputParams"
                            :key="index"
                            @mouseenter="area.showDelete = true"
                            @mouseleave="area.showDelete = false"
                          >
                            <input type="checkbox" name="" id="" v-model="area.checked" />
                            <input
                              type="text"
                              @blur="area.showBorder = false"
                              @focus="area.showBorder = true"
                              :style="{
                                border: area.showBorder ? '1px solid #dcdfe6' : 'none',
                              }"
                              v-model="area.name"
                              placeholder="输入框标题"
                            />
                            <input
                              type="text"
                              style="margin-left: 2rem"
                              v-model="area.content"
                              placeholder="输入框内容"
                            />
                            <span
                              @click="deleteInputArea(item, index)"
                              style="cursor: pointer; margin-left: 1rem"
                              v-show="area.showDelete"
                              >×</span
                            >
                          </li>
                          <li></li>
                        </ul>
                        <span @click="deleteGrid3(item, item.i)" class="deleteGrid">×</span>
                      </div>
                      <!-- 拖动tab表格进来 -->
                      <div class="tabTableChoose" v-show="item.type == '2'">
                        <teleport to="#teleport-target5" v-if="teleportCurrent == item.i">
                          <el-drawer v-model="drawer5" size="15%" direction="rtl">
                            <!-- <template #header> -->
                            <h4>添加tab页名称</h4>
                            <!-- </template>
                      <template #default> -->
                            <div class="drawerContent">
                              <input type="text" v-model="tabNameInput" />
                            </div>
                            <h4>添加对应列名称(、符号隔开)</h4>
                            <!-- </template>
                      <template #default> -->
                            <div class="drawerContent">
                              <input type="text" v-model="tabColumeInput" />
                            </div>
                            <!-- </template> -->
                            <!-- <template #footer> -->
                            <div style="position: absolute; bottom: 0; width: 90%" class="drawerContent">
                              <el-button @click="drawer5 = fasle">取消</el-button>
                              <el-button type="primary" @click="addtabArea(item)">确认</el-button>
                            </div>
                            <!-- </template> -->
                          </el-drawer>
                        </teleport>
                        <teleport to="#teleport-target6" v-if="teleportColume == item.i">
                          <el-drawer v-model="drawer6" size="15%" direction="rtl">
                            <!-- <template #header> -->
                            <h3>添加行数据</h3>

                            <div
                              class="drawerContent"
                              v-for="(jou, index) in reserveDrawlist"
                              :key="index"
                              style="flex-direction: column"
                            >
                              <div style="margin: 1rem 3rem 1rem 0px; width: 100%">
                                {{ jou.label }}
                              </div>
                              <p></p>
                              <input type="text" v-model="jou.content" />
                            </div>
                            <div style="position: absolute; bottom: 0; width: 90%" class="drawerContent">
                              <el-button @click="drawer6 = fasle">取消</el-button>
                              <el-button type="primary" @click="addColumnList(item)">确认</el-button>
                            </div>
                            <!-- </template> -->
                          </el-drawer>
                        </teleport>
                        <span
                          style="
                            z-index: 9;
                            cursor: pointer;
                            position: absolute;
                            right: 2rem;
                            top: 0;
                            line-height: 16px;
                          "
                          @click="addTabFive(item.i)"
                          title="添加tab页"
                          >+</span
                        >
                        <img
                          src="src/assets/images/add3.png"
                          style="
                            z-index: 9;
                            height: 15px;
                            width: 15px;
                            cursor: pointer;
                            position: absolute;
                            right: 10px;
                            top: 20%;
                          "
                          @click="addRowDataSix(item)"
                          title="添加行数据"
                          v-if="item.tabTableParams.tabList.length"
                        />
                        <el-tabs v-model="item.tabTableParams.activeName" class="demo-tabs">
                          <el-tab-pane
                            :label="area.label"
                            :name="area.name"
                            v-for="area in item.tabTableParams.tabList"
                            :key="area.name"
                          >
                            <div class="tabInner" v-if="area.name == item.tabTableParams.activeName">
                              <el-table :data="area.tableList" border style="width: 100%" height="93%">
                                <!-- <el-table-column
                              v-for="(jou, index) in area.columeList"
                              :key="index"
                              :prop="jou.label"
                              :label="jou.label"
                              align="center"
                            /> -->
                                <el-table-column
                                  v-for="(jou, index) in area.columeList"
                                  :key="index"
                                  :prop="jou.label"
                                  align="center"
                                >
                                  <template #header>
                                    <img style="width: 78px" src="src/assets/images/unit.png" v-if="jou.label == 'a'" />
                                    <span v-else>{{ jou.label }}</span>
                                  </template>
                                  <!-- <template #default="scope">
                              <span>{{scope}}</span>
                            </template> -->
                                </el-table-column>
                                <el-table-column label="选项" align="center">
                                  <template #default="scope">
                                    <!-- <el-button
                                  link
                                  type="primary"
                                  size="small"
                                  @click.prevent="
                                    area.tableList.splice(scope.$index, 1)
                                  "
                                >
                                  删除
                                </el-button> -->

                                    <span
                                      style="color: #5eadff; cursor: pointer; font-weight: 400"
                                      @click.prevent="area.tableList.splice(scope.$index, 1)"
                                      >删除</span
                                    >
                                  </template>
                                </el-table-column>
                              </el-table>
                            </div>
                          </el-tab-pane>
                          <!-- <el-tab-pane label="Role" name="third">Role</el-tab-pane>
                    <el-tab-pane label="Task" name="fourth">Task</el-tab-pane> -->
                        </el-tabs>
                        <span @click="deleteGrid3(item, item.i)" class="deleteGrid">×</span>
                      </div>
                      <!-- 拖动选择框进来 -->
                      <div class="checkboxChoose" v-show="item.type == '3'">
                        <span
                          style="right: 2rem; top: 0; line-height: 16px; position: absolute; cursor: pointer"
                          title="添加选择框"
                          @click="addcheckboxArea(item)"
                          >+</span
                        >
                        <div
                          class="onecheckbox"
                          v-for="(area, index) in item.checkboxParams"
                          :key="index"
                          @mouseenter="area.showDelete = true"
                          @mouseleave="area.showDelete = false"
                        >
                          <input type="checkbox" name="" id="" v-model="area.checked" />
                          <input
                            type="text"
                            @blur="area.showBorder = false"
                            @focus="area.showBorder = true"
                            :style="{
                              border: area.showBorder ? '1px solid #dcdfe6' : 'none',
                            }"
                            v-model="area.name"
                            placeholder="请输入单选框名称"
                          />
                          <span
                            @click="deletecheckboxArea(item, index)"
                            style="cursor: pointer; margin-left: 0.5rem"
                            v-show="area.showDelete"
                            >×</span
                          >
                        </div>
                        <span @click="deleteGrid3(item, item.i)" class="deleteGrid">×</span>
                      </div>
                      <!-- 拖动文本框进来 -->
                      <div class="textChoose" v-show="item.type == '4'">
                        <el-input
                          style="height: 100%; font-size: 16px"
                          v-model="item.textParams"
                          :autosize="{ minRows: 3, maxRows: 3 }"
                          resize="none"
                          type="textarea"
                          placeholder="请输入"
                        />
                        <span @click="deleteGrid3(item, item.i)" class="deleteGrid">×</span>
                      </div>
                    </grid-item>
                  </grid-layout>
                </div>
              </li>
              <li></li>
            </ul>
          </div>
        </div>
        <div v-if="!isDemand" class="no_demand">
          <el-button type="primary" @click="isAutoDemand = true">自动生成需求分析</el-button>
        </div>
      </div>
    </div>
    <div id="teleport-target"></div>
    <div id="teleport-target2"></div>
    <div id="teleport-target3"></div>
    <div id="teleport-target4"></div>
    <div id="teleport-target5"></div>
    <div id="teleport-target6"></div>
    <div id="teleport-produce"></div>
    <el-dialog v-model="dialogVisible" title="添加树节点" width="30%">
      <input type="text" placeholder="请输入" v-model="addTreeNode" style="width: 80%" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="append"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="生成需求分析" v-model="isAutoDemand">
      <el-form>
        <el-form-item v-if="nextStep === 1" label="需求模板">
          <el-select v-model="autoInfo.template">
            <el-option v-for="item in autoList.template" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="nextStep === 2" label="其他">
          <span>程序角</span>
          <el-checkbox v-model="autoInfo.table" label="插值表" />
          <el-checkbox v-model="autoInfo.data" label="诸元系数" />
          <el-checkbox v-model="autoInfo.fightTime" label="飞行时间" />
          <el-checkbox v-model="autoInfo.fightTarget" label="飞行段标志" />
        </el-form-item>
        <div v-if="nextStep === 3">
          <el-form-item label="需求模版">
            {{ autoInfo.template }}
          </el-form-item>
          <el-form-item label="其他">
            <span>程序角</span>
            <el-checkbox disabled v-model="autoInfo.table" label="插值表" />
            <el-checkbox disabled v-model="autoInfo.data" label="诸元系数" />
            <el-checkbox disabled v-model="autoInfo.fightTime" label="飞行时间" />
            <el-checkbox disabled v-model="autoInfo.fightTarget" label="飞行段标志" />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="nextAuto">{{ nextStep === 3 ? '确认' : '下一步' }}</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="isAdvice" title="总体建议" width="40%">
      <p style="text-align: left">通过对本文档的分析解读，以及和历史案例的对照，我们有以下建议：</p>
      <p style="margin-left: 10px; text-align: left">
        1.
        系统参与者分析章节缺少图片或表格说明。鉴于条目比较多，一般推荐有一张图或表来汇总“系统参与者分析”会更清晰一些。
      </p>
      <p style="margin-left: 10px; text-align: left">
        2.
        需求规格说明书附录中的“需求追踪表”最后一列的需求权重分布不合理，权重都是10。请确认所有权重都是最重要且一样重要吗？
      </p>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="isAdvice = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { renderAsync } from 'docx-preview'
import examineData from '@/utils/examine'
import draggable from 'vuedraggable'
import { ElNotification } from 'element-plus'
import $ from 'jquery'
import Cookies from 'js-cookie'
import { GridLayout, GridItem } from 'vue-grid-layout'

export default defineComponent({
  components: { draggable, GridLayout, GridItem },
  props: {},
  setup(props, context) {
    const router = useRouter()
    const { proxy } = getCurrentInstance()
    const state = reactive({
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      isAutoDemand: false,
      nextStep: 1,
      isAdvice: false,
      activeName: 'suggest',
      autoInfo: {
        template: '',
        table: false,
        data: false,
        fightTime: false,
        fightTarget: false,
      },
      autoList: {
        template: [
          {
            label: '长征5号',
            value: '长征5号',
          },
          {
            label: '长征7号',
            value: '长征7号',
          },
        ],
      },
      index: -1,
      index2: -1,
      index3: -1,
      tabIndex: '',
      addTreedata: {}, //储存点击添加树节点后的值
      dialogVisible: false,
      addTreeNode: '', //添加树节点的输入框
      params: { label: '' },
      treeData: [],
      trsnsformImg: false,
      drawer: false,
      drawer2: false,
      drawer3: false,
      drawer4: false,
      drawer5: false,
      drawer6: false,
      produceDrawer: false,
      tabNameInput: '',
      tabColumeInput: '',
      dragList: [
        {
          id: '1',
          name: '输入框',
        },
        {
          id: '2',
          name: 'tab表格页',
        },
        {
          id: '3',
          name: '选择框',
        },
        {
          id: '4',
          name: '文本框',
        },
      ],
      typeList: [],
      showRocket: false,
      showRocket2: false,
      reserveDrawlist: [], //复现抽屉中的列数据
      produceContent: [], //存放处理过程中的可选择内容
      showDetail: false,
      teleportColume: '',
      teleportCurrent: '', //定义当前的teleport
      taskId: 1,
      activeIndex: '1',
      showTree: true,
      showAffix: false,
      showEvalue: false,
      showTaskBook: true,
      showStretch: false,
      isDemand: false,
    })

    const methods = {
      addTab(val) {
        state.drawer = true
        state.tabNameInput = ''
        state.tabColumeInput = ''
        state.teleportCurrent = val
      },
      addRowData(item, val) {
        state.drawer2 = true
        state.teleportColume = val
        item.tabTableParams.tabList.map((res) => {
          if (res.name == item.tabTableParams.activeName) {
            reserveDrawlist = JSON.parse(JSON.stringify(res.columeList))
            res.columeList.map((elm) => {
              elm.content = ''
            })
          }
        })
      },
      addTabThree(val) {
        state.drawer3 = true
        state.tabNameInput = ''
        state.tabColumeInput = ''
        state.teleportCurrent = val
      },
      addRowDataFour(item) {
        state.drawer4 = true
        state.teleportColume = item.i
        item.tabTableParams.tabList.map((res) => {
          if (res.name == item.tabTableParams.activeName) {
            reserveDrawlist = JSON.parse(JSON.stringify(res.columeList))
            res.columeList.map((elm) => {
              elm.content = ''
            })
          }
        })
      },
      addTabFive(val) {
        state.drawer5 = true
        state.tabNameInput = ''
        state.tabColumeInput = ''
        state.teleportCurrent = val
      },
      addRowDataSix(item) {
        state.drawer6 = true
        state.eleportColume = item.i
        item.tabTableParams.tabList.map((res) => {
          if (res.name == item.tabTableParams.activeName) {
            reserveDrawlist = JSON.parse(JSON.stringify(res.columeList))
            res.columeList.map((elm) => {
              elm.content = ''
            })
          }
        })
      },
      //获取树数据
      async getDaTree() {
        await proxy.$axios
          .getTaskDetail({
            taskId: Cookies.get('taskId'),
          })
          .then((res) => {
            // console.log(JSON.parse(res.data.daTree),'11111111111')
            let data = JSON.parse(res.data.daTree)
            state.treeData = data
            console.log(data, res)
            data.map((val, index) => {
              let label = val.label.match(/\D+/g)[0]
              state.typeList.push({ id: index, label })
            })
          })
      },
      handleNodeClick(data) {
        console.log(data)
        state.showDetail = true
        // state.showRocket = true
        // state.showRocket = false;
        state.trsnsformImg = false
        state.showRocket2 = false
        // setTimeout(() => {
        //   state.showRocket = true;
        // }, 500);
        setTimeout(() => {
          state.showRocket2 = true
        }, 500)
        if (!data.params) return
        state.params = JSON.parse(JSON.stringify(data.params))
        state.params.label = data.label
        let regex = /^\d+(\.\d+)*\s*/
        state.params.name = data.label.replace(regex, '')
        // state.params.name = data.label.match(/^\d+\.\d+\.\d+\s*/)[1]
        state.produceContent = state.params.produceContent || []
        // console.log(data);
        nextTick(() => {
          //解决拖动进来后父节点高度坍塌问题
          document.getElementById('inputArea').firstChild.style.height = '300px'
          document.getElementById('inputArea2').firstChild.style.height = '300px'
          document.getElementById('inputArea3').firstChild.style.height = '300px'
        })
      },
      async handleSelect(key) {
        if (key == '2-1') {
          methods.finishConfirm()
        } else if (key == '2-2') {
          //更新之后重新渲染数据
          methods.saveParams()
        } else if (key == '2-3') {
          methods.getDaTree()
          state.params = Object.assign({})
          ElNotification({
            title: '提示',
            message: '已重新生成需求文档',
          })
        } else if (key == '3-1') {
        } else if (key === '4-1') {
          state.isAdvice = true
          state.showStretch = true
        }
      },
      //添加树节点
      openDialog(data, node) {
        // console.log(data, node);
        state.addTreedata = data
        state.dialogVisible = true
        state.addTreeNode = ''
      },
      append() {
        // console.log(state.addTreedata);
        const newChild = {
          label: state.addTreeNode,
          children: [],
          params: {
            name: '',
            id: Math.random().toString(36).substr(3, 5).toUpperCase(),
            type: '',
            input: {},
            output: '',
            produce: [],
            layout3: [],
            layout2: [],
            layout: [],
            examineData,
          },
        }
        if (!state.addTreedata.children) {
          state.addTreedata.children = []
        }
        if (state.addTreedata.params) {
          newChild.params = JSON.parse(JSON.stringify(state.addTreedata.params))
          delete state.addTreedata.params
        }
        state.addTreedata.children.push(newChild)
        //进行一个排序
        state.addTreedata.children.map((val) => {
          let reg = val.label.match(/\d+/g)
          if (reg) {
            val.sortIndex = parseInt(reg.join(''))
          } else {
            val.sortIndex = 99999999999999
          }
        })
        state.addTreedata.children.sort((b, a) => {
          return b.sortIndex - a.sortIndex
        })

        state.treeData = [...state.treeData]
        state.dialogVisible = false
        proxy.$axios
          .saveTaskDetail({
            taskId: Cookies.get('taskId'),
            daTree: JSON.stringify(state.treeData),
          })
          .then((res) => {
            if (res.success) {
              ElNotification({
                title: '提示',
                message: '添加树节点成功',
              })
            }
          })
      },
      //删除树节点
      remove(node, data) {
        console.log(node, data)
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex((d) => d.label === data.label)

        children.splice(index, 1)
        state.treeData = [...state.treeData]
        if (!state.addTreedata.children.length) {
          state.addTreedata.params = {
            name: '',
            id: Math.random().toString(36).substr(3, 5),
            type: '',
            input: {},
            output: '',
            produce: [],
            layout3: [],
            layout2: [],
            layout: [],
            examineData: {},
          }
        }

        proxy.$axios
          .saveTaskDetail({
            taskId: Cookies.get('taskId'),
            daTree: JSON.stringify(state.treeData),
          })
          .then((res) => {
            if (res.success) {
              state.showDetail = false
              ElNotification({
                title: '提示',
                message: '删除树节点成功',
              })
            }
          })
      },
      //完成确认
      finishConfirm() {
        state.params.confirm = false
        methods.saveParams()
      },
      //保存详情
      saveParams() {
        if (!state.params) return
        let cur = methods.findCurrent(state.treeData)
        console.log(cur)
        cur.params = state.params
        cur.params.produceContent = state.produceContent
        // console.log(state.treeData, state.params, cur);
        proxy.$axios
          .saveTaskDetail({
            daTree: JSON.stringify(state.treeData),
            taskId: Cookies.get('taskId'),
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
      //递归查询对应树节点
      findCurrent(data) {
        for (let o of data || []) {
          if (o.label == state.params.label) return o
          const o_ = methods.findCurrent(o.children)
          if (o_) return o_
        }
      },
      findCal(data) {
        //找到程序角那个节点
        for (let o of data || []) {
          if (o.label == '1.2.1.3程序角计算') return o
          const o_ = methods.findCal(o.children)
          if (o_) return o_
        }
      },
      //删除输入的栅格
      deleteGrid(item, index) {
        console.log(item, index)
        state.params.layout = state.params.layout.filter((fil) => {
          return fil.i != index
        })
        nextTick(() => {
          document.getElementById('inputArea').firstChild.style.height = '300px'
        })
      },
      deleteGrid2(item, index) {
        console.log(item, index)
        state.params.layout2 = state.params.layout2.filter((fil) => {
          return fil.i != index
        })
        nextTick(() => {
          document.getElementById('inputArea2').firstChild.style.height = '300px'
        })
      },
      deleteGrid3(item, index) {
        console.log(index)
        state.params.layout3 = state.params.layout3.filter((fil) => {
          return fil.i != index
        })
        nextTick(() => {
          document.getElementById('inputArea3').firstChild.style.height = '300px'
        })
      },
      //确定处理过程内容时，更新已经选择好的了可选择内容
      saveProduce() {
        state.params.produce.map((val) => {
          val.content = state.produceContent
        })
        state.produceDrawer = false
      },
      //添加处理过程
      addProduce(params) {
        console.log(params, state.params)
        params.push({ content: state.produceContent, value: '' })
        state.produceDrawer = false
      },
      addProduceContent() {
        state.produceContent.push({ content: '' })
      },
      //删除处理过程
      deleteProduce(params, index) {
        params.produce.splice(index, 1)
      },
      deleteProduceContent(params, index) {
        params.splice(index, 1)
      },
      //选择一个步骤时其他不可选
      filterProduce(item, index) {
        state.params.produce.map((data, inner) => {
          if (data.value == item.value && index != inner) {
            data.value = ''
          }
        })
      },
      //添加输入项
      addInputArea(item) {
        item.inputParams.push({
          showBorder: true,
          checked: false,
          name: '',
          content: '',
        })
      },
      deleteInputArea(item, index) {
        item.inputParams.splice(index, 1)
      },
      //添加选择框
      addcheckboxArea(item) {
        item.checkboxParams.push({
          showBorder: true,
          checked: false,
          name: '',
        })
      },
      deletecheckboxArea(item, index) {
        item.checkboxParams.splice(index, 1)
      },
      //添加tab选择框
      addtabArea(item) {
        console.log(item)
        let t = state.tabColumeInput.split('、')
        let columeList = []
        t.map((res) => {
          columeList.push({ label: res, content: '' })
        })
        ;(state.tabIndex = Math.random().toString(36).substr(3, 8)),
          item.tabTableParams.tabList.push({
            label: state.tabNameInput,
            name: state.tabIndex,
            tableList: [],
            columeList,
          })
        item.tabTableParams.activeName = state.tabIndex

        state.drawer = false
        state.drawer3 = false
        state.drawer5 = false
      },
      //添加列
      addColumnList(item) {
        let columeDataList = {}
        // item.tabTableParams.columeList.map((data, index) => {
        //   columeDataList[data.label] = data.content;
        // });
        // item.tabTableParams.tabList.map((data) => {
        //   if (data.name == item.tabTableParams.activeName) {
        state.reserveDrawlist.map((res) => {
          columeDataList[res.label] = res.content
        })
        //   }
        // });
        item.tabTableParams.tabList.map((data) => {
          if (data.name == item.tabTableParams.activeName) {
            data.tableList.push(columeDataList)
          }
        })
        state.drawer2 = false
        state.drawer4 = false
        state.drawer6 = false
      },
      move(evt, a, b, c) {
        console.log(evt)
        var id = evt.item._underlying_vm_.id
      },
      end(evt) {
        let inputArea = document.getElementById('inputArea')
        let inputArea2 = document.getElementById('inputArea2')
        let inputArea3 = document.getElementById('inputArea3')
        var containerRect = inputArea.getBoundingClientRect()
        var containerRect2 = inputArea2.getBoundingClientRect()
        var containerRect3 = inputArea3.getBoundingClientRect()
        var left = evt.originalEvent.clientX,
          top = evt.originalEvent.clientY
        let judge1 =
          left < containerRect.x ||
          left > containerRect.width + containerRect.x ||
          top < containerRect.y ||
          top > containerRect.y + containerRect.height
        let judge2 =
          left < containerRect2.x ||
          left > containerRect2.width + containerRect2.x ||
          top < containerRect2.y ||
          top > containerRect2.y + containerRect2.height
        let judge3 =
          left < containerRect3.x ||
          left > containerRect3.width + containerRect3.x ||
          top < containerRect3.y ||
          top > containerRect3.y + containerRect3.height
        if (judge1 && judge2 && judge3) {
          ElNotification({
            title: '提示',
            message: '请把节点拖入到输入、输出或异常处理中',
          })
        }
        if (!judge1 && judge2 && judge3) {
          state.params.layout.push({
            x: 0,
            y: ++state.index,
            w: 12,
            h: evt.item._underlying_vm_.id == '2' ? 4 : 2,
            i: Math.random().toString(36).substr(3, 5),
            type: evt.item._underlying_vm_.id,
            inputParams: [],
            tabTableParams: {
              activeName: '1',
              tabList: [],
            },
            checkboxParams: [],
            textParams: '',
          })
          nextTick(() => {
            //解决拖动进来后父节点高度坍塌问题
            document.getElementById('inputArea').firstChild.style.height = '300px'
          })
        }
        if (!judge2 && judge1 && judge3) {
          state.params.layout2.push({
            x: 0,
            y: ++state.index2,
            w: 12,
            h: evt.item._underlying_vm_.id == '2' ? 4 : 2,
            i: Math.random().toString(36).substr(3, 5),
            type: evt.item._underlying_vm_.id,
            inputParams: [],
            tabTableParams: {
              activeName: '1',
              tabList: [],
            },
            checkboxParams: [],
            textParams: '',
          })
          nextTick(() => {
            //解决拖动进来后父节点高度坍塌问题
            document.getElementById('inputArea2').firstChild.style.height = '300px'
          })
        }
        if (!judge3 && judge1 && judge2) {
          state.params.layout3.push({
            x: 0,
            y: ++state.index3,
            w: 12,
            h: evt.item._underlying_vm_.id == '2' ? 4 : 2,
            i: Math.random().toString(36).substr(3, 5),
            type: evt.item._underlying_vm_.id,
            inputParams: [],
            tabTableParams: {
              activeName: '1',
              tabList: [],
            },
            checkboxParams: [],
            textParams: '',
          })
          nextTick(() => {
            //解决拖动进来后父节点高度坍塌问题
            document.getElementById('inputArea3').firstChild.style.height = '300px'
          })
        }
      },
      previewfile() {
        // if (item.fileType == '.docx') {
        nextTick(() => {
          fetch('/public/mock/word/demand_analysis.docx')
            .then((response) => {
              let docData = response.blob() //将文件转换成bolb形式
              //  console.log(docData,response,'1111111111111')
              //选择要渲染的元素
              let childRef = document.getElementsByClassName('childRef')

              //用docx-preview渲染
              renderAsync(docData, childRef[0]).then((res) => {
                console.log('res---->', res)
              })
            })
            .catch((error) => {
              console.log(error)
            })
        })
      },
      //改变任务书大小
      changeSizeTask(type) {
        if (type) {
          $('.docx-wrapper').css({
            transform: 'scale(0.5)',
            top: '-3265px',
            left: ' -251px',
          })
        } else {
          $('.docx-wrapper').css({
            transform: 'scale(1)',
            top: 0,
            left: 0,
          })
        }
      },
      nextAuto() {
        if (state.nextStep < 3) {
          state.nextStep++
        } else {
          state.isAutoDemand = false
          state.nextStep = 1
          state.isDemand = true
        }
      },
      cancel() {
        state.isAutoDemand = false
        state.nextStep = 1
        state.autoInfo = {
          template: '',
          table: false,
          data: false,
          fightTime: false,
          fightTarget: false,
        }
      },
    }
    onMounted(() => {
      if (Cookies.get('userId') && Cookies.get('taskId')) {
        state.taskId = Cookies.get('taskId')
        // methods.saveParams()
      } else {
        if (Cookies.get('taskId')) {
          state.taskId = Cookies.get('taskId')
        }
      }
      if (Cookies.get('status')) {
        methods.getDaTree()
        ElNotification({
          title: '提示',
          type: 'error',
          message: '1.2.1.3程序角计算-初始俯仰程序角不可以大于90',
          duration: 0,
        })
        let cur = methods.findCal(state.treeData)
        cur.params.confirm = true
        // console.log(state.treeData, state.params, cur);
        proxy.$axios
          .saveTaskDetail({
            daTree: JSON.stringify(state.treeData),
            taskId: Cookies.get('taskId'),
          })
          .then((res) => {
            console.log('保存成功')
          })
      }
      methods.previewfile()
      setTimeout(() => {
        methods.getDaTree()
      }, 500)
    })
    onUnmounted(() => {})
    return {
      ...toRefs(state),
      ...methods,
    }
  },
})
</script>
<style lang="less" scoped>
.wrapper{
  height: calc(100% - 60px);
  margin: 0 8px;
}
.no_demand {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
}
.strechPoint {
  height: 20px;
  width: 20px;
  position: absolute;
  left: -21px;
  top: -8px;
  border-radius: 50%;
}
.strechAdvice {
  width: 100%;
  height: 10rem;
  overflow: auto;
  li {
    display: flex;
    align-items: center;
    margin-top: 1rem;
    span {
      font-weight: 600;
    }
  }
  .resultNull {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #c3c0c0;
    font-size: 16px;
  }
}
.childRef {
  position: relative;
}
:deep(.docx-wrapper) {
  background-color: #fff;
  padding: 0;
  transform: scale(0.5);
  top: -3265px;
  // top: -3200px;
  // left: -200px;
  left: -251px;
  position: absolute;
  background: #eee;
  // padding: 0 10px;
  padding-left: 10px;
  width: 969px;
}
:deep(.docx-wrapper > section.docx) {
  // width: 100% !important;
  // padding: 0rem !important;
  min-height: auto !important;
  box-shadow: none;
  // margin-bottom: 0;
}
:deep(.el-menu-item) {
  font-size: 16px;
}
:deep(.el-sub-menu__title) {
  font-size: 16px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  .treeTitle {
    .flex_center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .treeSpan {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .confirmed {
    font-size: 12px;
    padding: 2px 3px;
    background: #ff5c20;
    color: #fff;
    border-radius: 5px;
    margin-right: 5px;
  }
  a {
    font-weight: 600;
  }
}
.tabInner {
  width: 93%;
  margin: auto;
  height: calc(100% - 1rem);
  margin-top: 1rem;
}
.drawerContent {
  height: 10%;
  width: 60%;
  margin: auto;
  .flex_center;
}
.gridItem {
  border: solid #dfdfdf 1px;
  border-radius: 5px;
  position: relative;
}
.gridItem2 {
  position: relative;
}
// background-color: #cccccc;
.textChoose {
  height: 100%;
  width: 100%;
}
.tabTableChoose {
  height: 100%;
  width: 100%;
  // overflow-x: auto;
}
.checkboxChoose {
  height: 100%;
  width: 100%;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  .onecheckbox {
    width: 30%;
    .flex_center;
    margin-left: 1rem;
    // margin-top: 1rem;
    input[type='text'] {
      width: 80%;
      height: 100%;
    }
  }
}
.inputChoose {
  height: 100%;
  width: 100%;
  overflow: auto;
  .flex_center;
  ul {
    overflow: auto;
    height: calc(100% - 1rem);
    width: 100%;
    // margin-top: 1rem;
    .flex_center;
    flex-wrap: wrap;
  }
  li {
    margin-top: 0 !important;
    .flex_center !important;
    width: 100%;
    input[type='text'] {
      width: 30%;
    }
  }
}
@import '../assets/styles/css/main.less';

:deep(.el-textarea__inner) {
  min-height: 0 !important;
}
:deep(.el-collapse) {
  border-bottom: none;
  border-top: none;
}
:deep(.el-collapse-item__wrap) {
  background-color: #fff !important;
  border-bottom: none;
}
:deep(.el-collapse-item__header) {
  background-color: #fff !important;
  // margin-top: -1.5rem;
  border-bottom: none;
}
:deep(.el-collapse-item__arrow) {
  display: none;
}
:deep(.el-collapse-item__content) {
  margin-top: 1.5rem;
}
:deep(.el-tabs__item.is-active) {
  color: #1041f5 !important;
}
:deep(.el-tabs__item:hover) {
  color: #1041f5 !important;
}
:deep(.el-tabs__nav) {
  margin-left: 0 !important;
  transform: translateX(0) !important;
}
:deep(.el-tabs__active-bar) {
  background-color: #1041f5 !important;
}
:deep(.el-tabs__nav-wrap::after) {
  background-color: #e6e6e6 !important;
}
:deep(.el-tabs__item) {
  margin: 0 20px !important;
  padding: 0 0px !important;
}
:deep(.el-table .el-table__cell) {
  padding: 5px 0;
  font-size: 16px;
}
:deep(.el-textarea__inner) {
  color: #000;
}
:deep(.el-table) {
  color: #000;
}
:deep(.el-select) {
  width: 100%;
}
:deep(.el-input) {
  height: 100%;
}
:deep(.el-menu){
  height:40px;
}
.deleteGrid {
  cursor: pointer;
  position: absolute;
  top: -4px;
  right: 3px;
  z-index: 9;
  width: auto !important;
}
.content_main {
  background: #f1f5f9;
  padding: 0rem;
  input {
    border: 1px solid #dfdfdf;
  }
  .topMenu {
    width: 100%;
    // width: calc(100% - 3rem);
    // height: 5%;
    background: #fff;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 1rem;
    letter-spacing: 2px;
    font-size: 17px;
    flex-wrap: wrap;
    border-bottom: 1px rgb(226, 226, 226) solid;
    .rightinner {
      .flex_center;
      .changeView {
        padding: 0.3rem 1rem;
        background: #fefeff;
        border: 1px solid #eaeaeb;
        margin-right: 2rem;
        border-radius: 5px;
        cursor: pointer;
      }
    }
    .menuArea {
      width: 50%;
      height: 100%;
      // height: 40px;
      // display: flex;
      // justify-content: left;
      // align-items: center;
      // padding-left: 1rem;
      .oneMenu {
        padding: 5px 0.8rem;
        color: #fff;
        font-size: 14px;
        background: #4991f2;
        border-radius: 15px;
        margin-right: 2rem;
        cursor: pointer;
      }
      .oneMenu:hover {
        background: #ffbb3d;
      }
    }
  }
  .bottom_contain {
    width: 100%;
    height: calc(100% - 45px);
    display: flex;
  }
  @keyframes emergeTree {
    from {
      width: 0;
    }
    to {
      width: 30%;
    }
  }
  @keyframes fadeTree {
    from {
      width: 30%;
    }
    to {
      width: 0;
    }
  }
  @keyframes emergeTree2 {
    from {
      width: 0;
    }
    to {
      width: 45%;
    }
  }
  @keyframes fadeTree2 {
    from {
      width: 45%;
    }
    to {
      width: 0;
    }
  }
  .leftTree {
    // margin-top: 1rem;
    background: #fff;
    height: 100%;
    border-radius: 10px;
    margin-right: 10px;
    overflow: auto;
    animation: emergeTree 0.3s forwards;
    position: relative;
  }
  .leftTask {
    // margin-top: 1rem;
    background: #fff;
    height: 100%;
    border-radius: 10px;
    margin-right: 10px;
    overflow: auto;
    animation: emergeTree2 0.3s forwards;
    position: relative;
  }
  .taskBook {
    position: absolute;
    right: 15px;
    top: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
  .leftTree2 {
    // width: 25%;
    // margin-top: 1rem;
    background: #fff;
    margin-right: 10px;
    height: 100%;
    // height: calc(95% - 35px + 1rem);
    border-radius: 10px;
    overflow: auto;
    animation: fadeTree 0.3s forwards;
  }
  .leftTask2 {
    // width: 25%;
    // margin-top: 1rem;
    background: #fff;
    margin-right: 10px;
    height: 100%;
    // height: calc(95% - 35px + 1rem);
    border-radius: 10px;
    overflow: auto;
    animation: fadeTree2 0.3s forwards;
  }
  .rightContent {
    // width: calc(75% - 3rem);
    // width: calc(75% - 1rem);
    // width: calc(50% - 20px);
    width: 100%;
    height: 100%;
    // height: calc(95% - 35px + 1rem);
    // margin-top: 1rem;
    // margin-right: 2rem;
    border-radius: 10px;
    background: #fff;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    transition: 0.3s width;
    .rightChoose {
      position: fixed;
      right: 0%;
      top: 30%;
      width: 6rem;
      height: 10rem;
      transition: 0.3s;
      z-index: 99;
      @keyframes gotoTop {
        from {
          bottom: 0;
        }
        to {
          bottom: 60%;
        }
      }
      @keyframes fadeaway {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }
      @keyframes changeHeight {
        from {
          height: 0;
        }
        to {
          height: 60%;
        }
      }
      @keyframes changeHeight2 {
        from {
          height: 60%;
          bottom: 0;
        }
        to {
          height: 0;
          bottom: 60%;
        }
      }
      .goTopAnimation {
        position: absolute;
        bottom: 0;
        width: 5rem;
        height: 5rem;
        left: 50%;
        transform: translate(-50%);
        animation: gotoTop 0.5s forwards, fadeaway 0.5s 0.5s forwards;
      }
      .fuel {
        width: 1rem;
        height: 3rem;
        background: linear-gradient(to bottom, #ff5c20, #fee22f);
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%);
        animation: changeHeight 0.5s forwards, changeHeight2 0.5s 0.5s forwards;
        opacity: 0.5;
      }
      @keyframes imgRorate {
        from {
          transform: rotate(0);
        }
        to {
          transform: rotate(90deg);
        }
      }
      @keyframes imgRorate2 {
        from {
          transform: rotate(90deg);
        }
        to {
          transform: rotate(0);
        }
      }
      .transformImg {
        animation: imgRorate 1s forwards;
      }
      .transformImg2 {
        animation: imgRorate2 1s forwards;
      }
      span {
        font-weight: 500 !important;
      }
      .chooseCollapse {
        .flex_center;
        background: #0000000d;
        border-radius: 50px;
        margin-top: 0.5rem;
        width: 5rem;
        height: 5rem;
        img {
          height: 20px;
          width: 20px;
        }
      }
    }
    .ulClass {
      padding-left: 4rem;
      .button {
        width: 4rem;
        height: 2rem;
        background: #2bb763;
        position: absolute;
        right: 4rem;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        cursor: pointer;
      }
      li {
        margin-top: 2rem;
        display: flex;
        justify-content: left;
        align-items: center;
        span {
          font-weight: 600;
          width: 5rem;
        }
        // cursor: pointer;
      }

      .inputArea {
        padding: 2rem;
        border: 1px solid #2599ff;
        border-radius: 5px;
        margin-left: 4rem;
        padding: 1rem;
        width: 79%;
        height: auto;
        span {
          width: auto;
        }
      }
      .produceArea {
        margin-left: 4rem;
        width: 79%;
        border: 1px solid #dfdfdf;
        border-radius: 5px;
        height: auto;
        min-height: 1.5rem;
        padding: 0 1rem 1rem 1rem;
        position: relative;
        .oneProduce {
          height: 2rem;
          width: 100%;
          margin-top: 1rem;
          display: flex;
          justify-content: left;
          align-items: center;
          input {
            height: 100%;
            width: 100%;
            margin-left: 2rem;
            margin-right: 2rem;
          }
        }
      }
    }
  }
}
:deep(.el-form-item__label) {
  color: #333;
}
:deep(.el-menu--horizontal){
  border-bottom: none;
}
</style>

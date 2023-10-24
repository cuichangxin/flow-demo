<!--
 * @Author: LiuFengRui
 * @Date: 2021-11-08 15:41:12
 * @LastEditTime: 2023-07-26 13:35:10
 * @LastEditors: Please set LastEditors
 * @Description: 
-->
<template>
  <div class="wrapper" :style="{ height: `${configHeight}px` }">
    <div class="content_main">
      <div class="topMenu">
        <!-- 领域需求结构化定义工具 -->
        <div class="menuArea">
          <el-menu mode="horizontal" @select="handleSelect">
            <shapeElMenu :menus="menuList"></shapeElMenu>
          </el-menu>
        </div>
      </div>
      <Splitpanes class="default-theme">
        <pane :size="showWord ? 45 : 0" class="pane">
          <div class="docx"></div>
        </pane>
        <pane :size="showWord ? 55 : 100">
          <div style="display: flex; justify-content: space-between; height: 100%">
            <div v-if="showTree" class="leftTree">
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
              <div v-if="params.id && showDetail">
                <div v-if="showRocket2" class="rightChoose">
                  <el-popover placement="left" popper-style="min-width:80px;width:80px;" :visible="popoverVisible">
                    <template #reference>
                      <div class="float_menu">
                        <i class="iconfont icon-xuanfucaidan" @click="popoverVisible = !popoverVisible" />
                      </div>
                    </template>
                    <div class="float-menu_content">
                      <draggable
                        @end="end"
                        @start="move"
                        v-model="dragList"
                        item-key="id"
                        forceFallback="false"
                        ghostClass="tt"
                      >
                        <template #item="{ element }">
                          <div class="chooseCollapse" :title="element.name">
                            <i :class="['iconfont', element.icon]"></i>
                          </div>
                        </template>
                      </draggable>
                    </div>
                  </el-popover>
                </div>
                <h4 style="color: #1b89f0; font-size: 18px">需求详情</h4>
                <ul class="ulClass">
                  <div class="my-box-info">
                    <li style="width: 48.5%">
                      <span>需求名称</span>
                      <el-input type="text" style="cursor: not-allowed" v-model="params.name" disabled />
                    </li>
                    <li style="width: 48.5%">
                      <span>需求ID</span>
                      <el-input type="text" style="cursor: not-allowed" v-model="params.id" disabled />
                    </li>
                    <li style="width: 500px">
                      <span>需求类型</span>
                      <el-select v-model="params.type" placeholder="请选择" style="width: 100%">
                        <el-option v-for="gs in typeList" :key="gs.id" :label="gs.label" :value="gs.id" />
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
                          <i class="iconfont icon-liebiao"></i>
                          <span style="min-width: 0; margin-left: 10px">步骤{{ index + 1 }}</span>
                          <el-select
                            v-model="item.value"
                            size="small"
                            placeholder="请选择"
                            @change="filterProduce(item, index)"
                            :title="item.value"
                          >
                            <el-option
                              v-for="gs in item.content"
                              :key="gs.content"
                              :label="gs.content"
                              :value="gs.content"
                            />
                          </el-select>
                          <span @click="deleteProduce(params, index)" style="cursor: pointer">×</span>
                        </div>
                      </div>
                      <img
                        src="../assets/images/add2.png"
                        @click="produceDrawer = true"
                        style="height: 20px; width: 20px; margin-left: 1rem; cursor: pointer"
                        title="添加步骤可选择项"
                      />
                      <teleport to="#teleport-produce">
                        <el-drawer size="30%" v-model="produceDrawer" direction="rtl">
                          <span style="display: inline-block; margin-bottom: 10px">添加该步骤可选择内容</span>
                          <span style="margin-left: 1rem; cursor: pointer" @click="addProduceContent">+</span>
                          <div
                            style="height: 5%"
                            class="drawerContent"
                            v-for="(item, index) in produceContent"
                            :key="index"
                          >
                            <el-input type="text" v-model="item.content" />
                            <span
                              @click="deleteProduceContent(produceContent, index)"
                              style="cursor: pointer; margin-left: 1rem"
                              >×</span
                            >
                          </div>
                          <div class="drawerContent" style="float: right; margin: 15px 26px 0">
                            <el-button type="primary" @click="saveProduce">确认</el-button>
                          </div>
                        </el-drawer>
                      </teleport>
                    </li>
                    <li>
                      <el-popover placement="right" :width="400" trigger="click" v-if="showStretch">
                        <template #reference>
                          <span style="cursor: pointer; position: relative">
                            输入
                            <img class="strechPoint" src="../assets/images/ai.png" alt="" />
                          </span>
                        </template>
                        <el-tabs v-model="params.activeName" class="demo-tabs">
                          <el-tab-pane label="建议" name="1">
                            <div class="strechAdvice">
                              <ul>
                                <li>
                                  <img
                                    src="../assets/images/flag.png"
                                    style="width: 20px; height: 20px; margin-right: 1rem"
                                  />
                                  <span
                                    >建议输入参数加上‘起飞信号’。起飞时刻作为助推飞行阶段程序角计算的计时零点，是很重要的输入参数。</span
                                  >
                                </li>
                              </ul>
                            </div>
                          </el-tab-pane>
                          <el-tab-pane label="历史案例" name="2">
                            <div class="strechAdvice">
                              <ul>
                                <li>
                                  <img
                                    src="../assets/images/flag2.png"
                                    style="width: 20px; height: 20px; margin-right: 1rem"
                                  />
                                  <span>xxx案例</span>
                                  <i style="margin-left: 1rem">程序角初始值:</i>
                                  <el-input
                                    type="text"
                                    class="my-input"
                                    value="1"
                                    disabled
                                    style="margin-left: 5px; width: 30%"
                                  />
                                </li>
                                <li>
                                  <img
                                    src="../assets/images/flag2.png"
                                    style="width: 20px; height: 20px; margin-right: 1rem"
                                  />
                                  <span>xxx案例</span>
                                  <i style="margin-left: 1rem">程序角初始值:</i>
                                  <el-input type="text" value="1" disabled style="margin-left: 5px; width: 30%" />
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
                          :row-height="86"
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
                                style="right: 30px; top: 5px; position: absolute; cursor: pointer"
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
                                  <el-checkbox type="checkbox" name="" id="" v-model="area.checked" />
                                  <el-input
                                    type="text"
                                    @blur="area.showBorder = false"
                                    @focus="area.showBorder = true"
                                    :style="{
                                      border: area.showBorder ? '1px solid #dcdfe6' : 'none',
                                    }"
                                    v-model="area.name"
                                    placeholder="输入框标题"
                                  />
                                  <el-input
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
                              <span @click="deleteGrid(item, item.i)" style="min-width: 0" class="deleteGrid">×</span>
                            </div>
                            <!-- 拖动tab表格进来 -->
                            <div class="tabTableChoose" v-show="item.type == '2'">
                              <teleport to="#teleport-target" v-if="teleportCurrent == item.i">
                                <el-drawer size="20%" v-model="drawer" direction="rtl">
                                  <div class="drawerContent">
                                    <label>添加tab页名称</label>
                                    <el-input type="text" v-model="tabNameInput" />
                                  </div>
                                  <div class="drawerContent">
                                    <label>添加对应列名称(、符号隔开)</label>
                                    <el-input type="text" v-model="tabColumeInput" />
                                  </div>
                                  <div style="position: absolute; bottom: 0; right: 25px" class="drawerContent">
                                    <el-button @click="drawer = fasle">取消</el-button>
                                    <el-button type="primary" @click="addtabArea(item)">确认</el-button>
                                  </div>
                                </el-drawer>
                              </teleport>
                              <teleport to="#teleport-target2" v-if="teleportColume == item.i">
                                <el-drawer size="20%" v-model="drawer2" direction="rtl">
                                  <h5>添加行数据</h5>
                                  <div
                                    class="drawerContent"
                                    v-for="(jou, index) in reserveDrawlist"
                                    :key="index"
                                    style="flex-direction: column"
                                  >
                                    <div style="width: 100%; font-size: 14px">
                                      {{ jou.label }}
                                    </div>
                                    <el-input type="text" v-model="jou.content" />
                                  </div>
                                  <div style="position: absolute; bottom: 0; right: 25px" class="drawerContent">
                                    <el-button @click="drawer2 = fasle">取消</el-button>
                                    <el-button type="primary" @click="addColumnList(item)">确认</el-button>
                                  </div>
                                  <!-- </template> -->
                                </el-drawer>
                              </teleport>
                              <span
                                style="z-index: 9; cursor: pointer; position: absolute; right: 30px; top: 5px"
                                @click="addTab(item.i)"
                                title="添加tab页"
                                >+</span
                              >
                              <img
                                src="../assets/images/add3.png"
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
                                          <img
                                            style="width: 78px"
                                            src="../assets/images/unit.png"
                                            v-if="jou.label == 'a'"
                                          />
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
                              <span @click="deleteGrid(item, item.i)" style="min-width: 0" class="deleteGrid">×</span>
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
                                <el-checkbox type="checkbox" name="" id="" v-model="area.checked" />
                                <el-input
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
                              <span @click="deleteGrid(item, item.i)" style="min-width: 0" class="deleteGrid">×</span>
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
                              <span @click="deleteGrid(item, item.i)" style="min-width: 0" class="deleteGrid">×</span>
                            </div>
                          </grid-item>
                        </grid-layout>
                      </div>
                    </li>
                    <li>
                      <el-popover placement="right" :width="400" trigger="click" v-if="showStretch">
                        <template #reference>
                          <span style="cursor: pointer; position: relative">
                            输出
                            <img class="strechPoint" src="../assets/images/ai.png" alt="" />
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
                                  <el-checkbox type="checkbox" name="" id="" v-model="area.checked" />
                                  <el-input
                                    type="text"
                                    @blur="area.showBorder = false"
                                    @focus="area.showBorder = true"
                                    :style="{
                                      border: area.showBorder ? '1px solid #dcdfe6' : 'none',
                                    }"
                                    v-model="area.name"
                                    placeholder="输入框标题"
                                  />
                                  <el-input
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
                              <span @click="deleteGrid2(item, item.i)" style="min-width: 0" class="deleteGrid">×</span>
                            </div>
                            <!-- 拖动tab表格进来 -->
                            <div class="tabTableChoose" v-show="item.type == '2'">
                              <teleport to="#teleport-target3" v-if="teleportCurrent == item.i">
                                <el-drawer size="20%" v-model="drawer3" direction="rtl">
                                  <div class="drawerContent">
                                    <label>添加tab页名称</label>
                                    <el-input type="text" v-model="tabNameInput" />
                                  </div>
                                  <div class="drawerContent">
                                    <label>添加对应列名称(、符号隔开)</label>
                                    <el-input type="text" v-model="tabColumeInput" />
                                  </div>
                                  <div style="position: absolute; bottom: 0; right: 25px" class="drawerContent">
                                    <el-button @click="drawer3 = fasle">取消</el-button>
                                    <el-button type="primary" @click="addtabArea(item)">确认</el-button>
                                  </div>
                                </el-drawer>
                              </teleport>
                              <teleport to="#teleport-target4" v-if="teleportColume == item.i">
                                <el-drawer size="20%" v-model="drawer4" direction="rtl">
                                  <h5>添加行数据</h5>
                                  <div
                                    class="drawerContent"
                                    v-for="(jou, index) in reserveDrawlist"
                                    :key="index"
                                    style="flex-direction: column"
                                  >
                                    <div>
                                      {{ jou.label }}
                                    </div>
                                    <el-input type="text" v-model="jou.content" />
                                  </div>
                                  <div style="position: absolute; bottom: 0; right: 25px" class="drawerContent">
                                    <el-button @click="drawer4 = fasle">取消</el-button>
                                    <el-button type="primary" @click="addColumnList(item)">确认</el-button>
                                  </div>
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
                                src="../assets/images/add3.png"
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
                                          <img
                                            style="width: 78px"
                                            src="../assets/images/unit.png"
                                            v-if="jou.label == 'a'"
                                          />
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
                              <span @click="deleteGrid2(item, item.i)" style="min-width: 0" class="deleteGrid">×</span>
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
                                <el-checkbox type="checkbox" name="" id="" v-model="area.checked" />
                                <el-input
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
                              <span @click="deleteGrid2(item, item.i)" style="min-width: 0" class="deleteGrid">×</span>
                            </div>
                            <!-- 拖动文本框进来 -->
                            <div class="textChoose" v-show="item.type == '4'">
                              <el-input
                                v-model="item.textParams"
                                :autosize="{ minRows: 3, maxRows: 3 }"
                                resize="none"
                                type="textarea"
                                placeholder="请输入"
                              />
                              <span @click="deleteGrid2(item, item.i)" style="min-width: 0" class="deleteGrid">×</span>
                            </div>
                          </grid-item>
                        </grid-layout>
                      </div>
                    </li>
                    <li>
                      <el-popover placement="right" :width="400" trigger="click" v-if="showStretch">
                        <template #reference>
                          <span style="cursor: pointer; position: relative">
                            异常处理
                            <img class="strechPoint" src="../assets/images/ai.png" alt="" />
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
                                  <el-checkbox type="checkbox" name="" id="" v-model="area.checked" />
                                  <el-input
                                    type="text"
                                    @blur="area.showBorder = false"
                                    @focus="area.showBorder = true"
                                    :style="{
                                      border: area.showBorder ? '1px solid #dcdfe6' : 'none',
                                    }"
                                    v-model="area.name"
                                    placeholder="输入框标题"
                                  />
                                  <el-input
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
                              <span @click="deleteGrid3(item, item.i)" style="min-width: 0" class="deleteGrid">×</span>
                            </div>
                            <!-- 拖动tab表格进来 -->
                            <div class="tabTableChoose" v-show="item.type == '2'">
                              <teleport to="#teleport-target5" v-if="teleportCurrent == item.i">
                                <el-drawer size="20%" v-model="drawer5" direction="rtl">
                                  <h4>添加tab页名称</h4>
                                  <div class="drawerContent">
                                    <el-input type="text" v-model="tabNameInput" />
                                  </div>
                                  <h4>添加对应列名称(、符号隔开)</h4>
                                  <div class="drawerContent">
                                    <el-input type="text" v-model="tabColumeInput" />
                                  </div>
                                  <div style="position: absolute; bottom: 0; width: 90%" class="drawerContent">
                                    <el-button @click="drawer5 = fasle">取消</el-button>
                                    <el-button type="primary" @click="addtabArea(item)">确认</el-button>
                                  </div>
                                </el-drawer>
                              </teleport>
                              <teleport to="#teleport-target6" v-if="teleportColume == item.i">
                                <el-drawer size="20%" v-model="drawer6" direction="rtl">
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
                                    <el-input type="text" v-model="jou.content" />
                                  </div>
                                  <div style="position: absolute; bottom: 0; width: 90%" class="drawerContent">
                                    <el-button @click="drawer6 = fasle">取消</el-button>
                                    <el-button type="primary" @click="addColumnList(item)">确认</el-button>
                                  </div>
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
                                src="../assets/images/add3.png"
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
                                      <el-table-column
                                        v-for="(jou, index) in area.columeList"
                                        :key="index"
                                        :prop="jou.label"
                                        align="center"
                                      >
                                        <template #header>
                                          <img
                                            style="width: 78px"
                                            src="../assets/images/unit.png"
                                            v-if="jou.label == 'a'"
                                          />
                                          <span v-else>{{ jou.label }}</span>
                                        </template>
                                      </el-table-column>
                                      <el-table-column label="选项" align="center">
                                        <template #default="scope">
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
                              </el-tabs>
                              <span @click="deleteGrid3(item, item.i)" style="min-width: 0" class="deleteGrid">×</span>
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
                                <el-checkbox type="checkbox" name="" id="" v-model="area.checked" />
                                <el-input
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
                              <span @click="deleteGrid3(item, item.i)" style="min-width: 0" class="deleteGrid">×</span>
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
                              <span @click="deleteGrid3(item, item.i)" style="min-width: 0" class="deleteGrid">×</span>
                            </div>
                          </grid-item>
                        </grid-layout>
                      </div>
                    </li>
                  </div>
                </ul>
              </div>
            </div>
            <div v-else class="no_demand">
              <el-button type="primary" @click="isAutoDemand = true">自动生成需求分析</el-button>
            </div>
          </div>
        </pane>
      </Splitpanes>
    </div>
    <div id="teleport-target"></div>
    <div id="teleport-target2"></div>
    <div id="teleport-target3"></div>
    <div id="teleport-target4"></div>
    <div id="teleport-target5"></div>
    <div id="teleport-target6"></div>
    <div id="teleport-produce"></div>
    <el-dialog v-model="dialogVisible" title="添加树节点" width="30%">
      <el-input type="text" placeholder="请输入" v-model="addTreeNode" style="width: 80%" />
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

<script setup>
import { renderAsync } from 'docx-preview'
import examineData from '@/utils/examine'
import draggable from 'vuedraggable'
import { ElNotification } from 'element-plus'
import Cookies from 'js-cookie'
import shapeElMenu from '../components/common/shape/shapeElMenu.vue'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import axios from 'axios'

const { proxy } = getCurrentInstance()

const configHeight = ref('')
const defaultProps = reactive({
  children: 'children',
  label: 'label',
})
const showWord = ref(true)
const isAutoDemand = ref(false)
const nextStep = ref(1)
const isAdvice = ref(false)
const autoInfo = ref({
  template: '',
  table: false,
  data: false,
  fightTime: false,
  fightTarget: false,
})
const autoList = reactive({
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
})
const popoverVisible = ref(false)
const index = ref(-1)
const index2 = ref(-1)
const index3 = ref(-1)
const tabIndex = ref('')
const addTreedata = ref({}) //储存点击添加树节点后的值
const dialogVisible = ref(false)
const addTreeNode = ref('') //添加树节点的输入框
const params = ref({ label: '' })
const treeData = ref([])
const drawer = ref(false)
const drawer2 = ref(false)
const drawer3 = ref(false)
const drawer4 = ref(false)
const drawer5 = ref(false)
const drawer6 = ref(false)
const produceDrawer = ref(false)
const tabNameInput = ref('')
const tabColumeInput = ref('')
const dragList = ref([
  {
    id: '1',
    name: '输入框',
    icon: 'icon-danhangshurukuang',
  },
  {
    id: '2',
    name: 'tab表格页',
    icon: 'icon-biaoge',
  },
  {
    id: '3',
    name: '选择框',
    icon: 'icon-duoxuankuang',
  },
  {
    id: '4',
    name: '文本框',
    icon: 'icon-wenbenkuang',
  },
])
const typeList = ref([])
const showRocket2 = ref(false)
const reserveDrawlist = ref([]) //复现抽屉中的列数据
const produceContent = ref([]) //存放处理过程中的可选择内容
const showDetail = ref(false)
const teleportColume = ref('')
const teleportCurrent = ref('') //定义当前的teleport
const taskId = ref(1)
const showEvalue = ref(false)
const showStretch = ref(false)
const isDemand = ref(false)
const showTree = ref(true)
const menuList = ref([
  {
    title: '文件',
    icon: 'icon-wenjian1',
    children: [
      {
        title: '从...打开',
        icon: '',
      },
      {
        title: '另存为',
        icon: '',
      },
    ],
  },
  {
    title: '操作',
    icon: 'icon-bianji1',
    children: [
      {
        title: '确认',
        icon: '',
      },
      {
        title: '保存',
        icon: '',
      },
      {
        title: '重新生成',
        icon: '',
      },
    ],
  },
  {
    title: '视图',
    icon: 'icon-chakan',
    children: [
      {
        title: '左侧树',
        icon: '',
      },
      {
        title: '左右对照模式',
        icon: '',
      },
      {
        title: '智能辅助视图模式',
        icon: '',
      },
    ],
  },
  {
    title: '工具',
    icon: 'icon-caozuo-bianji',
    children: [
      {
        title: '智能验证',
        icon: '',
      },
    ],
  },
])

function addTab(val) {
  drawer.value = true
  tabNameInput.value = ''
  tabColumeInput.value = ''
  teleportCurrent.value = val
}
function addRowData(item, val) {
  drawer2.value = true
  teleportColume.value = val
  item.tabTableParams.tabList.map((res) => {
    if (res.name == item.tabTableParams.activeName) {
      reserveDrawlist.value = JSON.parse(JSON.stringify(res.columeList))
      res.columeList.map((elm) => {
        elm.content = ''
      })
    }
  })
}
function addTabThree(val) {
  drawer3.value = true
  tabNameInput.value = ''
  tabColumeInput.value = ''
  teleportCurrent.value = val
}
function addRowDataFour(item) {
  drawer4.value = true
  teleportColume.value = item.i
  item.tabTableParams.tabList.map((res) => {
    if (res.name == item.tabTableParams.activeName) {
      reserveDrawlist.value = JSON.parse(JSON.stringify(res.columeList))
      res.columeList.map((elm) => {
        elm.content = ''
      })
    }
  })
}
function addTabFive(val) {
  drawer5.value = true
  tabNameInput.value = ''
  tabColumeInput.value = ''
  teleportCurrent.value = val
}
function addRowDataSix(item) {
  drawer6.value = true
  eleportColume = item.i
  item.tabTableParams.tabList.map((res) => {
    if (res.name == item.tabTableParams.activeName) {
      reserveDrawlist.value = JSON.parse(JSON.stringify(res.columeList))
      res.columeList.map((elm) => {
        elm.content = ''
      })
    }
  })
}
//获取树数据
async function getDaTree() {
  await proxy.$axios
    .getTaskDetail({
      taskId: Cookies.get('taskId'),
    })
    .then((res) => {
      let data = JSON.parse(res.data.daTree)
      treeData.value = data
      console.log(data, res)
      data.map((val, index) => {
        let label = val.label.match(/\D+/g)[0]
        typeList.value.push({ id: index, label })
      })
    })
}
function handleNodeClick(data) {
  showDetail.value = true
  showRocket2.value = false
  setTimeout(() => {
    showRocket2.value = true
  }, 500)
  if (!data.params) return
  params.value = JSON.parse(JSON.stringify(data.params))
  params.value.label = data.label
  let regex = /^\d+(\.\d+)*\s*/
  params.value.name = data.label.replace(regex, '')
  produceContent.value = params.value.produceContent || []
  // console.log(data);
  nextTick(() => {
    //解决拖动进来后父节点高度坍塌问题
    document.getElementById('inputArea').firstChild.style.height = '300px'
    document.getElementById('inputArea2').firstChild.style.height = '300px'
    document.getElementById('inputArea3').firstChild.style.height = '300px'
  })
}
function handleSelect(key) {
  if (key == '确认') {
    finishConfirm()
  } else if (key == '保存') {
    //更新之后重新渲染数据
    saveParams()
  } else if (key == '重新生成') {
    getDaTree()
    params.value = Object.assign({})
    ElNotification({
      title: '提示',
      message: '已重新生成需求文档',
    })
  } else if (key == '左侧树') {
    showTree.value = !showTree.value
  } else if (key === '智能验证') {
    isAdvice.value = true
    showStretch.value = true
  } else if (key === '左右对照模式') {
    showWord.value = !showWord.value
  } else if (key === '智能辅助视图模式') {
    showStretch.value = !showStretch.value
  }
}
//添加树节点
function openDialog(data, node) {
  // console.log(data, node);
  addTreedata.value = data
  dialogVisible.value = true
  addTreeNode.value = ''
}
function append() {
  // console.log(addTreedata);
  const newChild = {
    label: addTreeNode.value,
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
  if (!addTreedata.value.children) {
    addTreedata.value.children = []
  }
  if (addTreedata.value.params) {
    newChild.params = JSON.parse(JSON.stringify(addTreedata.value.params))
    delete addTreedata.value.params
  }
  addTreedata.value.children.push(newChild)
  //进行一个排序
  addTreedata.value.children.map((val) => {
    let reg = val.label.match(/\d+/g)
    if (reg) {
      val.sortIndex = parseInt(reg.join(''))
    } else {
      val.sortIndex = 99999999999999
    }
  })
  addTreedata.value.children.sort((b, a) => {
    return b.sortIndex - a.sortIndex
  })

  treeData.value = [...treeData.value]
  dialogVisible.value = false
  proxy.$axios
    .saveTaskDetail({
      taskId: Cookies.get('taskId'),
      daTree: JSON.stringify(treeData.value),
    })
    .then((res) => {
      if (res.success) {
        ElNotification({
          title: '提示',
          message: '添加树节点成功',
        })
      }
    })
}
//删除树节点
function remove(node, data) {
  console.log(node, data)
  const parent = node.parent
  const children = parent.data.children || parent.data
  const index = children.findIndex((d) => d.label === data.label)

  children.splice(index, 1)
  treeData.value = [...treeData.value]
  if (!addTreedata.value.children.length) {
    addTreedata.value.params = {
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
      daTree: JSON.stringify(treeData.value),
    })
    .then((res) => {
      if (res.success) {
        showDetail.value = false
        ElNotification({
          title: '提示',
          message: '删除树节点成功',
        })
      }
    })
}
//完成确认
function finishConfirm() {
  params.value.confirm = false
  saveParams()
}
//保存详情
function saveParams() {
  if (!params.value) return
  let cur = findCurrent(treeData.value)
  console.log(cur)
  cur.params = params.value
  cur.params.produceContent = produceContent.value
  // console.log(treeData, params, cur);
  proxy.$axios
    .saveTaskDetail({
      daTree: JSON.stringify(treeData.value),
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
}
//递归查询对应树节点
function findCurrent(data) {
  for (let o of data || []) {
    if (o.label == params.value.label) return o
    const o_ = findCurrent(o.children)
    if (o_) return o_
  }
}
function findCal(data) {
  //找到程序角那个节点
  for (let o of data || []) {
    if (o.label == '1.2.1.3程序角计算') return o
    const o_ = findCal(o.children)
    if (o_) return o_
  }
}
//删除输入的栅格
function deleteGrid(item, index) {
  console.log(item, index)
  params.value.layout = params.value.layout.filter((fil) => {
    return fil.i != index
  })
  nextTick(() => {
    document.getElementById('inputArea').firstChild.style.height = '300px'
  })
}
function deleteGrid2(item, index) {
  console.log(item, index)
  params.value.layout2 = params.value.layout2.filter((fil) => {
    return fil.i != index
  })
  nextTick(() => {
    document.getElementById('inputArea2').firstChild.style.height = '300px'
  })
}
function deleteGrid3(item, index) {
  console.log(index)
  params.value.layout3 = params.value.layout3.filter((fil) => {
    return fil.i != index
  })
  nextTick(() => {
    document.getElementById('inputArea3').firstChild.style.height = '300px'
  })
}
//确定处理过程内容时，更新已经选择好的了可选择内容
function saveProduce() {
  params.produce.map((val) => {
    val.content = produceContent.value
  })
  produceDrawer.value = false
}
//添加处理过程
function addProduce(params) {
  console.log(params, params)
  params.push({ content: produceContent.value, value: '' })
  produceDrawer.value = false
}
function addProduceContent() {
  produceContent.value.push({ content: '' })
}
//删除处理过程
function deleteProduce(params, index) {
  params.produce.splice(index, 1)
}
function deleteProduceContent(params, index) {
  params.splice(index, 1)
}
//选择一个步骤时其他不可选
function filterProduce(item, index) {
  params.value.produce.map((data, inner) => {
    if (data.value == item.value && index != inner) {
      data.value = ''
    }
  })
}
//添加输入项
function addInputArea(item) {
  item.inputParams.push({
    showBorder: true,
    checked: false,
    name: '',
    content: '',
  })
}
function deleteInputArea(item, index) {
  item.inputParams.splice(index, 1)
}
//添加选择框
function addcheckboxArea(item) {
  item.checkboxParams.push({
    showBorder: true,
    checked: false,
    name: '',
  })
}
function deletecheckboxArea(item, index) {
  item.checkboxParams.splice(index, 1)
}
//添加tab选择框
function addtabArea(item) {
  console.log(item)
  let t = tabColumeInput.value.split('、')
  let columeList = []
  t.map((res) => {
    columeList.push({ label: res, content: '' })
  })
  ;(tabIndex.value = Math.random().toString(36).substr(3, 8)),
    item.tabTableParams.tabList.push({
      label: tabNameInput.value,
      name: tabIndex.value,
      tableList: [],
      columeList,
    })
  item.tabTableParams.activeName = tabIndex.value

  drawer.value = false
  drawer3.value = false
  drawer5.value = false
}
//添加列
function addColumnList(item) {
  let columeDataList = {}
  reserveDrawlist.value.map((res) => {
    columeDataList[res.label] = res.content
  })
  item.tabTableParams.tabList.map((data) => {
    if (data.name == item.tabTableParams.activeName) {
      data.tableList.push(columeDataList)
    }
  })
  drawer2.value = false
  drawer4.value = false
  drawer6.value = false
}
function move(evt, a, b, c) {
  console.log(evt)
  var id = evt.item._underlying_vm_.id
}
function end(evt) {
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
    params.value.layout.push({
      x: 0,
      y: ++index.value,
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
    params.value.layout2.push({
      x: 0,
      y: ++index2.value,
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
    params.value.layout3.push({
      x: 0,
      y: ++index3.value,
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
}
function previewfile() {
  nextTick(() => {
    axios
      .get('/mock/word/demand_analysis.docx', { responseType: 'blob' })
      .then((response) => {
        //选择要渲染的元素
        let childRef = document.getElementsByClassName('docx')
        //用docx-preview渲染
        renderAsync(response, childRef[0]).then((res) => {
          console.log('res---->', res)
        })
      })
      .catch((error) => {
        console.log(error)
      })
  })
}
function nextAuto() {
  if (nextStep.value < 3) {
    nextStep.value++
  } else {
    isAutoDemand.value = false
    nextStep.value = 1
    isDemand.value = true
    localStorage.setItem('isDaAuto', isDemand.value)
  }
}
function cancel() {
  isAutoDemand.value = false
  nextStep.value = 1
  autoInfo.value = {
    template: '',
    table: false,
    data: false,
    fightTime: false,
    fightTarget: false,
  }
}
function getImgUrl(img) {
  return new URL(`../assets/images/${img}`, import.meta.url).href
}
onMounted(() => {
  const autoCreateTarget = localStorage.getItem('isDaAuto')
  if (Cookies.get('userId') && Cookies.get('taskId')) {
    taskId.value = Cookies.get('taskId')
    // saveParams()
  } else {
    if (Cookies.get('taskId')) {
      taskId.value = Cookies.get('taskId')
    }
  }

  if (autoCreateTarget !== null && JSON.parse(autoCreateTarget)) {
    isDemand.value = true
  }

  if (Cookies.get('status') && JSON.parse(autoCreateTarget)) {
    getDaTree()
    ElNotification({
      title: '提示',
      type: 'error',
      message: '1.2.1.3程序角计算-初始俯仰程序角不可以大于90',
      duration: 0,
    })
    let cur = findCal(treeData.value)
    if (cur !== undefined) {
      cur.params.confirm = true
    }
    // console.log(treeData, params, cur);
    // proxy.$axios
    //   .saveTaskDetail({
    //     daTree: JSON.stringify(treeData.value),
    //     taskId: Cookies.get('taskId'),
    //   })
    //   .then((res) => {
    //     console.log('保存成功')
    //   })
  }
  previewfile()
  setTimeout(() => {
    getDaTree()
  }, 500)
  configHeight.value = window.innerHeight - 140
  window.addEventListener('resize', () => {
    configHeight.value = window.innerHeight - 140
  })
})
onUnmounted(() => {
  window.removeEventListener('resize', {})
})
</script>
<style lang="less" scoped>
:deep(.el-tabs__header) {
  margin: 0;
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
  left: 35px;
  top: -18px;
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
  display: flex;
  align-items: center;
  label {
    font-weight: normal;
    font-size: 14px;
    white-space: nowrap;
  }
}
.gridItem {
  width: 100%;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  position: relative;
  padding: 10px;
}
.gridItem2 {
  position: relative;
}
.textChoose {
  height: 100%;
  width: 100%;
}
.tabTableChoose {
  height: 100%;
  width: 100%;
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
  }
}
.inputChoose {
  height: 100%;
  width: 100%;
  padding: 10px;
  overflow: auto;
  .flex_center;
  ul {
    overflow: auto;
    width: 100%;
    .flex_center;
    flex-wrap: wrap;
  }
  li {
    margin-top: 0 !important;
    .flex_center !important;
    width: 100%;
  }
}
@import '../assets/styles/css/main.less';

:deep(.el-textarea__inner) {
  min-height: 0 !important;
}
:deep(.el-tabs__item) {
  margin: 0 20px !important;
  padding: 0 0px !important;
}
:deep(.el-menu) {
  height: 40px;
}
.deleteGrid {
  display: inline-block;
  cursor: pointer;
  position: absolute;
  top: 5px;
  right: 3px;
  z-index: 9;
  width: auto !important;
}
.content_main {
  height: 100%;
  background: var(--my-bg-color-5);
  padding: 0rem;
  .topMenu {
    width: 100%;
    background: var(--my-bg-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 1rem;
    letter-spacing: 2px;
    font-size: 17px;
    flex-wrap: wrap;
    border-bottom: 1px var(--el-border-color) solid;
    .menuArea {
      width: 50%;
      height: 100%;
    }
  }
  @keyframes emergeTree {
    from {
      width: 0;
    }
    to {
      width: 40%;
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
    width: 200px;
    background: var(--my-bg-color);
    margin-right: 10px;
    overflow: auto;
    animation: emergeTree 0.3s forwards;
    position: relative;
  }
  .rightContent {
    width: 100%;
    height: 100%;
    padding: 10px 30px 10px 10px;
    background: var(--my-bg-color);
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    transition: 0.3s width;
    .rightChoose {
      position: fixed;
      right: 10px;
      bottom: 100px;
      transition: 0.3s;
      z-index: 99;
      span {
        font-weight: 500 !important;
      }
    }
    .ulClass {
      padding: 0 0 0 20px;
      li {
        width: 100%;
        display: flex;
        align-items: center;
        margin: 8px 0;
        position: relative;
        span {
          min-width: 80px;
          white-space: nowrap;
          text-align: right;
          font-size: 14px;
          margin: 0 10px 0 0;
        }
      }

      .inputArea {
        padding: 20px;
        border: 1px solid var(--el-border-color);
        border-radius: 4px;
        padding: 1rem;
        width: calc(100% - 126px);
        height: auto;
        span {
          width: auto;
        }
      }
      .produceArea {
        width: 109%;
        border: 1px solid var(--el-border-color);
        border-radius: 4px;
        height: auto;
        min-height: 1.5rem;
        padding: 0 8px 8px;
        position: relative;
        .oneProduce {
          height: 2rem;
          width: 100%;
          margin-top: 1rem;
          display: flex;
          justify-content: left;
          align-items: center;
        }
      }
    }
  }
}
:deep(.el-menu--horizontal) {
  border-bottom: none;
}
:deep(.splitpanes.default-theme .splitpanes__pane) {
  background-color: var(--my-bg-color-4);
}
:deep(.splitpanes__splitter) {
  background-color: #e9f1f6 !important;
}
.splitpanes {
  height: calc(100% - 30px);
}
:deep(.docx-wrapper) {
  background-color: var(--my-bg-color-4);
}
:deep(.docx-wrapper > section.docx) {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  background-color: var(--my-bg-color);
}
:deep(.splitpanes__splitter) {
  background-color: var(--my-bg-color-2) !important;
  border-left: 1px solid var(--el-border-color) !important;
}
:deep(.splitpanes.default-theme .splitpanes__splitter:before),
:deep(.splitpanes.default-theme .splitpanes__splitter:after) {
  background-color: var(--my-text-bg-color-5);
}
:deep(.docx) {
  color: var(--my-text-bg-color-3);
}
:deep(.docx span) {
  color: var(--my-text-bg-color-3) !important;
}
:deep(.docx-wrapper > section.docx) {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}
.pane {
  overflow: auto;
}
h4 {
  margin-top: 10px;
  margin-left: 10px;
}
.my-box-info {
  display: flex;
  flex-wrap: wrap;
}
.el-checkbox {
  margin-right: 10px;
}
h5 {
  margin-top: 0;
}
.el-select {
  width: 100%;
}
.float_menu {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--my-bg-color);
  box-shadow: 0 4px 10px 0 hsla(220, 4%, 56%, 0.3);
}
.icon-xuanfucaidan {
  color: #0987ee;
  font-size: 30px;
  display: inline-block;
  cursor: pointer;
}
.float-menu_content {
  width: 60px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
}
.chooseCollapse {
  display: flex;
  justify-content: center;
  i {
    font-size: 25px;
    display: inline-block;
    margin: 4px 0;
    color: var(--my-text-bg-color-3);
    cursor: pointer;
    position: relative;
    z-index: 2001;
  }
  &:nth-child(1) {
    i {
      font-size: 28px;
    }
  }
}
</style>

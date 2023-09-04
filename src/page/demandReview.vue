<!--
 * @Author: LiuFengRui
 * @Date: 2021-11-08 15:41:12
 * @LastEditTime: 2023-07-25 17:17:27
 * @LastEditors: Please set LastEditors
 * @Description: 
-->
<template>
  <div class="content_main">
    <div class="topMenu">
      <div class="menuArea">
        <!-- <div class="oneMenu">文件</div>
        <div class="oneMenu" @click="saveParams(0)">推送</div>
        <div class="oneMenu" @click="getDaTree(0)">更新</div>
        <div class="oneMenu" @click="openDialog = true">知识库</div> -->
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
            <template #title>
              <img
                src="../assets/images/menu_file.png"
                style="height: 15px; width: 15px; margin-right: 8px"
              />文件</template
            >
            <el-menu-item index="1-1">从...打开</el-menu-item>
            <el-menu-item index="1-2">另存为</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title
              ><img
                src="../assets/images/menu_manage.png"
                style="height: 15px; width: 15px; margin-right: 8px"
              />管理</template
            >
            <el-menu-item index="2-1">推送</el-menu-item>
            <el-menu-item index="2-2">更新</el-menu-item>
            <el-menu-item index="2-3" style="display: flex; justify-content: space-between; align-items: center"
              >批量评审
              <el-switch
                v-model="showEvalue"
                class="ml-2"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              />
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="3">
            <template #title
              ><img
                src="../assets/images/menu_knowledge.png"
                style="height: 15px; width: 15px; margin-right: 8px"
              />知识库</template
            >
            <el-menu-item index="3-1">查看</el-menu-item>
            <el-menu-item index="3-2">新增</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="4">
            <template #title
              ><img
                src="../assets/images/menu_view.png"
                style="height: 15px; width: 15px; margin-right: 8px"
              />视图</template
            >
            <el-menu-item index="4-1" style="display: flex; justify-content: space-between; align-items: center"
              >左侧树
              <el-switch
                v-model="showTree"
                class="ml-2"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              />
            </el-menu-item>
            <el-menu-item index="4-2" style="display: flex; justify-content: space-between; align-items: center"
              >审查单
              <el-switch
                v-model="examine"
                class="ml-2"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              />
            </el-menu-item>

            <el-menu-item index="4-4" style="display: flex; justify-content: space-between; align-items: center"
              >左右对照视图模式
              <el-switch
                v-model="showTaskBook"
                class="ml-2"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              />
            </el-menu-item>
            <el-menu-item index="4-5" style="display: flex; justify-content: space-between; align-items: center"
              >智能辅助视图模式
              <el-switch
                v-model="showStretch"
                class="ml-2"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              />
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
      <!-- <span style="width:calc(50% - 8rem);text-align:right;margin-right:8rem;">需求管理 > 需求审查</span> -->
      <div class="rightinner">
        <!-- <div class="changeView" @click="showRich = !showRich">切换视图</div> -->
        <img
          src="../assets/images/changeView.png"
          style="height: 20px; width: 20px; cursor: pointer"
          title="切换视图"
          @click="showRich = !showRich"
        />
      </div>
    </div>
    <div class="bottom_contain">
      <div :class="[showTaskBook ? 'leftTask' : 'leftTask2']">
        <el-affix :offset="60" style="width: 100%">
          <img src="../assets/images/amplify.png" class="taskBook" @click="changeSizeTask(0)" />
          <img src="../assets/images/shrink.png" class="taskBook" style="right: 40px" @click="changeSizeTask(1)" />
        </el-affix>
        <div class="childRef"></div>
      </div>
      <div :class="[showTree ? 'leftTree' : 'leftTree2']">
        <el-tree
          :data="treeData"
          :props="defaultProps"
          node-key="label"
          @node-click="handleNodeClick"
          :expand-on-click-node="false"
          :default-expand-all="true"
          :show-checkbox="showEvalue"
          highlight-current
          ref="elTree"
        >
          <template #default="{ node, data }">
            <!-- <span class="custom-tree-node">
            <span>{{ node.label }}</span> -->
            <!-- <span v-show="data.showSign"> -->
            <!-- <a @click="openDialog(data)"> + </a>
              <a style="margin-left: 8px" @click="remove(node, data)"> × </a> -->
            <!-- </span> -->
            <!-- </span> -->
            <div class="treeTitle" :title="node.label + '(' + data.params?.id + ')'">
              <div class="confirmed" v-if="data.params && !data.params.finishSubmit">未评审</div>
              <span class="treeSpan">{{ node.label }}</span>
              <span v-if="data.params && data.params.id">&nbsp;({{ data.params.id }})</span>
            </div>
          </template>
        </el-tree>
      </div>
      <!-- :style="{width:examine?'calc(35% - 3rem)':'calc(75% - 3rem)'}" -->
      <div class="rightContent">
        <!-- :style="{
        width:
          examine && showTree
            ? 'calc(35% - 3rem)'
            : !examine && showTree
            ? 'calc(75% - 1rem)'
            : examine && !showTree
            ? 'calc(60% - 2rem)'
            : 'calc(100% - 2rem)',
        'margin-left': showTree ? '' : '0',
      }" -->
        <img src="../assets/images/ar.png" v-if="!examine && params.id" class="leftArrow" @click="leftArrow" />

        <div v-if="params.id && !showRich">
          <ul class="ulClass" :style="{ 'padding-left': examine ? '2rem' : '4rem' }">
            <li>
              <span style="color: #67aae9; font-size: 20px">需求详情</span>
            </li>
            <li>
              <span>需求名称</span>
              <input
                type="text"
                style="height: 2.5rem; margin-left: 4rem; width: 80%; background: #fafafa; cursor: not-allowed"
                disabled
                v-model="params.name"
                v-if="!examine"
              />
              <input
                v-if="examine"
                type="text"
                style="height: 2.5rem; margin-left: 1rem; width: 76%; background: #fafafa; cursor: not-allowed"
                disabled
                v-model="params.name"
              />
            </li>
            <li>
              <span>需求ID&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <input
                type="text"
                style="height: 2.5rem; margin-left: 4rem; width: 32%; background: #fafafa; cursor: not-allowed"
                v-model="params.id"
                disabled
                v-if="!examine"
              />
              <input
                type="text"
                style="height: 2.5rem; margin-left: 1rem; width: 76%; background: #fafafa; cursor: not-allowed"
                v-model="params.id"
                disabled
                v-if="examine"
              />
              <span :style="{ 'margin-left': showTree ? '4rem' : '8%' }" v-if="!examine">需求类型</span>
              <el-select
                v-if="!examine"
                v-model="params.type"
                size="normal"
                placeholder="请选择"
                style="height: 2.5rem; margin-left: 3rem; width: 32%"
                disabled
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
            <li v-if="examine">
              <span>需求类型</span>
              <el-select
                v-model="params.type"
                size="normal"
                placeholder="请选择"
                style="height: 2.5rem; margin-left: 1rem; width: 77.5%"
                disabled
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
              <div :class="[examine ? 'produceArea2' : 'produceArea']">
                <div class="oneProduce" v-for="(item, index) in params.produce" :key="index">
                  <img src="../assets/images/liebiao.png" style="height: 15px; width: 15px; margin-left: 1rem" />
                  <span>&nbsp;步骤{{ index + 1 }}</span>
                  <el-select
                    v-model="item.value"
                    size="small"
                    placeholder="请选择"
                    @change="filterProduce(item, index)"
                    disabled
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
                </div>
              </div>
              <!-- <img
              src="../assets/images/add2.png"
              @click="produceDrawer = true"
              style="height:20px;width:20px;margin-left:1rem;cursor: pointer;"
              title="添加步骤可选择项"
            /> -->
            </li>
            <li>
              <el-popover placement="right" :width="400" trigger="click" v-if="showStretch">
                <template #reference>
                  <span style="cursor: pointer; position: relative"
                    >输入
                    <!-- <div class="strechPoint"> -->
                    <img class="strechPoint" src="../assets/images/ai.png" alt="" />
                    <!-- </div> -->
                  </span>
                </template>
                <el-tabs v-model="params.activeName">
                  <el-tab-pane label="历史案例" name="2">
                    <div class="strechAdvice">
                      <ul>
                        <li>
                          <img src="../assets/images/flag2.png" style="width: 20px; height: 20px; margin-right: 1rem" />
                          <span>xxx案例</span>
                          <i style="margin-left: 1rem">程序角初始值:</i>
                          <input type="text" value="1" disabled style="margin-left: 5px; width: 30%" />
                        </li>
                        <li>
                          <img src="../assets/images/flag2.png" style="width: 20px; height: 20px; margin-right: 1rem" />
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
              <div :class="[examine ? 'inputArea_scale' : 'inputArea']" id="inputArea">
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
                      <ul>
                        <li v-for="(area, index) in item.inputParams" :key="index">
                          <input type="checkbox" name="" id="" v-model="area.checked" disabled />
                          <input type="text" v-model="area.name" disabled placeholder="输入框标题" />
                          <input
                            type="text"
                            style="margin-left: 2rem"
                            v-model="area.content"
                            placeholder="输入框内容"
                            disabled
                          />
                        </li>
                        <li></li>
                      </ul>
                    </div>
                    <!-- 拖动tab表格进来 -->
                    <div class="tabTableChoose" v-show="item.type == '2'">
                      <el-tabs v-model="item.tabTableParams.activeName" class="demo-tabs">
                        <el-tab-pane
                          :label="area.label"
                          :name="area.name"
                          v-for="area in item.tabTableParams.tabList"
                          :key="area.name"
                        >
                          <div class="tabInner" v-show="area.name == item.tabTableParams.activeName">
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
                                  <img style="width: 78px" src="../assets/images/unit.png" v-if="jou.label == 'a'" />
                                  <span v-else>{{ jou.label }}</span>
                                </template>
                                <!-- <template #default="scope">
                              <span>{{scope}}</span>
                            </template> -->
                              </el-table-column>
                            </el-table>
                          </div>
                        </el-tab-pane>
                        <!-- <el-tab-pane label="Role" name="third">Role</el-tab-pane>
                    <el-tab-pane label="Task" name="fourth">Task</el-tab-pane> -->
                      </el-tabs>
                    </div>
                    <!-- 拖动选择框进来 -->
                    <div class="checkboxChoose" v-show="item.type == '3'">
                      <div class="onecheckbox" v-for="(area, index) in item.checkboxParams" :key="index">
                        <input type="checkbox" name="" id="" v-model="area.checked" disabled />
                        <input type="text" v-model="area.name" placeholder="请输入单选框名称" disabled />
                      </div>
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
                        disabled
                      />
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
                    <img class="strechPoint" src="../assets/images/ai.png" alt="" />
                  </span>
                </template>
                <el-tabs v-model="params.activeName2">
                  <el-tab-pane label="历史案例" name="2">
                    <div class="strechAdvice">
                      <div class="resultNull">暂无</div>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </el-popover>
              <span v-else>输出</span>
              <div :class="[examine ? 'inputArea_scale' : 'inputArea']" id="inputArea2">
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
                      <ul>
                        <li v-for="(area, index) in item.inputParams" :key="index">
                          <input type="checkbox" name="" id="" v-model="area.checked" disabled />
                          <input type="text" v-model="area.name" placeholder="输入框标题" disabled />
                          <input
                            type="text"
                            style="margin-left: 2rem"
                            v-model="area.content"
                            placeholder="输入框内容"
                            disabled
                          />
                        </li>
                        <li></li>
                      </ul>
                    </div>
                    <!-- 拖动tab表格进来 -->
                    <div class="tabTableChoose" v-show="item.type == '2'">
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
                                  <img style="width: 78px" src="../assets/images/unit.png" v-if="jou.label == 'a'" />
                                  <span v-else>{{ jou.label }}</span>
                                </template>
                                <!-- <template #default="scope">
                              <span>{{scope}}</span>
                            </template> -->
                              </el-table-column>
                            </el-table>
                          </div>
                        </el-tab-pane>
                        <!-- <el-tab-pane label="Role" name="third">Role</el-tab-pane>
                    <el-tab-pane label="Task" name="fourth">Task</el-tab-pane> -->
                      </el-tabs>
                    </div>
                    <!-- 拖动选择框进来 -->
                    <div class="checkboxChoose" v-show="item.type == '3'">
                      <div class="onecheckbox" v-for="(area, index) in item.checkboxParams" :key="index">
                        <input type="checkbox" name="" id="" v-model="area.checked" disabled />
                        <input type="text" v-model="area.name" placeholder="请输入单选框名称" disabled />
                      </div>
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
                        disabled
                      />
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
                    <!-- <div class="strechPoint"> -->
                    <img class="strechPoint" src="../assets/images/ai.png" alt="" />
                    <!-- </div> -->
                  </span>
                </template>
                <el-tabs v-model="params.activeName3">
                  <el-tab-pane label="历史案例" name="2">
                    <div class="strechAdvice">
                      <div class="resultNull">暂无</div>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </el-popover>
              <span v-else>异常处理</span>
              <div :class="[examine ? 'inputArea_scale' : 'inputArea']" id="inputArea3">
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
                      <ul>
                        <li
                          v-for="(area, index) in item.inputParams"
                          :key="index"
                          @mouseenter="area.showDelete = true"
                          @mouseleave="area.showDelete = false"
                        >
                          <input type="checkbox" name="" id="" v-model="area.checked" disabled />
                          <input type="text" v-model="area.name" placeholder="输入框标题" disabled />
                          <input
                            type="text"
                            style="margin-left: 2rem"
                            v-model="area.content"
                            placeholder="输入框内容"
                            disabled
                          />
                        </li>
                        <li></li>
                      </ul>
                    </div>
                    <!-- 拖动tab表格进来 -->
                    <div class="tabTableChoose" v-show="item.type == '2'">
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
                                  <img style="width: 78px" src="../assets/images/unit.png" v-if="jou.label == 'a'" />
                                  <span v-else>{{ jou.label }}</span>
                                </template>
                                <!-- <template #default="scope">
                              <span>{{scope}}</span>
                            </template> -->
                              </el-table-column>
                            </el-table>
                          </div>
                        </el-tab-pane>
                      </el-tabs>
                    </div>
                    <!-- 拖动选择框进来 -->
                    <div class="checkboxChoose" v-show="item.type == '3'">
                      <div class="onecheckbox" v-for="(area, index) in item.checkboxParams" :key="index">
                        <input type="checkbox" name="" id="" v-model="area.checked" disabled />
                        <input type="text" v-model="area.name" placeholder="请输入单选框名称" disabled />
                      </div>
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
                        disabled
                      />
                    </div>
                  </grid-item>
                </grid-layout>
              </div>
            </li>
            <li></li>
          </ul>
        </div>
        <div class="innerRich" v-if="params.id && showRich">
          <QuillEditor
            v-model:content="content"
            :options="editorOptions"
            contentType="html"
            ref="myQuillEditor"
            v-if="freshRich"
          >
          </QuillEditor>
          <!-- readOnly 
           @focus="onFocus()"
          @blur="onBlur($event)"
          -->
          <a
            style="
              position: absolute;
              bottom: 1rem;
              left: 50%;
              transform: translate(-50%, 50%);
              color: #6ebef4;
              cursor: pointer;
            "
            @click="downloadFile"
            >下载文档</a
          >
        </div>
      </div>
      <!-- <img
        src="../assets/images/ar.png"
        v-if="examine"
        class="righttArrow"
        @click="
          examine = false;
          changeRichContent(1);
        "
      /> -->
      <div :class="[examine ? 'examineArea' : 'examineArea2']" v-if="params.id">
        <div class="topTitle">审查单</div>
        <div class="exTitle">一般性检查</div>
        <div class="tableArea">
          <el-table :data="params.examineData.normal" style="width: 100%" max-height="450">
            <el-table-column prop="id" label="序号" width="60" align="center" />
            <el-table-column prop="name" label="检查名称" width="100" />
            <el-table-column prop="demand" label="考核要求" width="150" />
            <el-table-column prop="result" label="审核结果" width="120">
              <template #default="scope">
                <el-select v-model="scope.row.result" size="small" placeholder="请选择">
                  <el-option
                    style="padding-left: 1rem"
                    v-for="gs in option"
                    :key="gs.id"
                    :label="gs.content"
                    :value="gs.id"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="suggest" label="审查意见">
              <template #default="scope">
                <textarea
                  :class="[scope.row.appear ? 'textareaClass' : 'textareaClass2']"
                  type="text"
                  placeholder="请输入"
                  v-model="scope.row.suggest"
                  @blur="scope.row.appear = false"
                  :disabled="scope.row.appear ? false : true"
                ></textarea>
                <img
                  src="../assets/images/edit.png"
                  style="height: 15px; width: 20px; cursor: pointer"
                  @click="scope.row.appear = true"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="exTitle">专业性检查</div>
        <div class="tableArea" style="height: 35%">
          <el-table :data="params.examineData.profession" style="width: 100%" max-height="350">
            <el-table-column prop="id" label="序号" width="60" align="center" />
            <el-table-column prop="name" label="检查名称" width="100" />
            <el-table-column prop="demand" label="考核要求" width="150" />
            <el-table-column prop="result" label="审核结果" width="120">
              <template #default="scope">
                <el-select v-model="scope.row.result" size="small" placeholder="请选择">
                  <el-option
                    style="padding-left: 1rem"
                    v-for="gs in option"
                    :key="gs.id"
                    :label="gs.content"
                    :value="gs.id"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="suggest" label="审查意见">
              <template #default="scope">
                <textarea
                  :class="[scope.row.appear ? 'textareaClass' : 'textareaClass2']"
                  type="text"
                  placeholder="请输入"
                  v-model="scope.row.suggest"
                  @blur="scope.row.appear = false"
                  :disabled="scope.row.appear ? false : true"
                ></textarea>
                <img
                  src="../assets/images/edit.png"
                  style="height: 15px; width: 20px; cursor: pointer"
                  @click="scope.row.appear = true"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="buttonSubmit" @click="saveParams(1)">提交</div>
      </div>
    </div>

    <el-dialog v-model="openDialog" title="知识库" width="50%">
      <div class="exTitle">一般性检查</div>
      <div class="tableArea">
        <el-table :data="examineData.normal" style="width: 100%" max-height="450">
          <el-table-column prop="id" label="序号" align="center" />
          <el-table-column prop="name" label="检查名称" />
          <el-table-column prop="demand" label="考核要求" />
        </el-table>
      </div>
      <div class="exTitle">专业性检查</div>
      <div class="tableArea" style="height: 35%">
        <el-table :data="examineData.profession" style="width: 100%" max-height="350">
          <el-table-column prop="id" label="序号" align="center" />
          <el-table-column prop="name" label="检查名称" />
          <el-table-column prop="demand" label="考核要求" />
        </el-table>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="openDialog = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { ElNotification } from 'element-plus'
import $ from 'jquery'
import examineData from '@/utils/examine'
import { renderAsync } from 'docx-preview'
import { QuillEditor, Quill } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { GridLayout, GridItem } from 'vue-grid-layout'
import Cookies from 'js-cookie'

export default defineComponent({
  name: 'Demand_analysis',
  components: { draggable, QuillEditor, GridLayout, GridItem },
  props: {},
  setup(props, context) {
    const router = useRouter()
    const { proxy } = getCurrentInstance()
    const myQuillEditor = ref(null)
    const elTree = ref(null)
    const editorOptions = reactive({
      modules: {
        toolbar: [
          // 工具栏配置
          ['bold', 'italic', 'underline', 'strike'], // 粗体、斜体、下划线、删除线
          [{ list: 'ordered' }, { list: 'bullet' }], // 有序列表和无序列表
          [{ script: 'sub' }, { script: 'super' }], // 上标和下标
          [{ indent: '-1' }, { indent: '+1' }], // 缩进
          [{ direction: 'rtl' }], // 文字方向
          [{ size: ['small', false, 'large', 'huge'] }], // 字号
          [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题等级
          [{ color: [] }, { background: [] }], // 字体颜色和背景色
          [{ font: [] }], // 字体
          [{ align: [] }], // 对齐方式
          ['clean'], // 清除格式
        ],
      },
    })
    const state = reactive({
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      params: { label: '' },
      treeData: [],
      showRich: false,
      freshRich: false,
      Rich: false,
      showArrow: false,
      content: '',
      typeList: [],
      option: [
        { content: '不通过', id: 0 },
        { content: '通过', id: 1 },
      ],
      examine: false, //是否展示审查单
      openDialog: false,
      activeIndex: '1',
      showTree: true,
      taskId: 1,
      showEvalue: false,
      showTaskBook: true,
      showStretch: false,
    })
    const methods = {
      leftArrow() {
        state.examine = true
        changeRichContent(0)
      },
      //获取树数据
      async getDaTree(type) {
        await proxy.$axios.getTaskDetail({ taskId: Cookies.get('taskId') }).then((res) => {
          let data = JSON.parse(res.data.daTree)
          state.treeData = data
          console.log(data, res)
          state.typeList = []
          data.map((val, index) => {
            let label = val.label.match(/\D+/g)[0]
            state.typeList.push({ id: index, label })
          })
        })
        if (!type) {
          ElNotification({
            title: '提示',
            message: '已更新至最新评审意见',
          })
        }
      },
      handleNodeClick(data) {
        state.showRich = false
        if (!data.params) return
        state.params = JSON.parse(JSON.stringify(data.params))
        state.params.label = data.label
        let regex = /^\d+(\.\d+)*\s*/
        state.params.name = data.label.replace(regex, '')
        // state.params.name = data.label.match(/\D\W[^≤|≥|＞|＜]+/g)[0];
        state.produceContent = state.params.produceContent || []
        console.log(data, state.params)
        methods.changeRichContent(1)
        nextTick(() => {
          //解决拖动进来后父节点高度坍塌问题
          document.getElementById('inputArea').firstChild.style.height = '300px'
          document.getElementById('inputArea2').firstChild.style.height = '300px'
          document.getElementById('inputArea3').firstChild.style.height = '300px'
        })
      },
      downloadFile() {
        // window.open('/public/mock/word/姿控评审文档.doc')
        window.open('/assets/mock/word/姿控评审文档.doc')
      },
      //保存详情
      saveParams(type) {
        if (!state.params) return
        // console.log(elTree.value.getCheckedNodes(),'111111111111')
        let choseNode = elTree.value.getCheckedNodes()
        if (type) {
          let cur = methods.findCurrent(state.treeData)
          cur.params = state.params
          cur.params.finishSubmit = true
          if (choseNode.length) {
            choseNode.map((val) => {
              // let curs = methods.findCurrentSome(state.treeData,val.params.id)
              if (val.params) {
                val.params.examineData = state.params.examineData
                val.params.finishSubmit = true
              }
            })
          }
        }
        if (!type) {
          methods.getDaTree(1)
        }
        // console.log(state.treeData, state.params, cur);
        proxy.$axios
          .saveTaskDetail({
            taskId: Cookies.get('taskId'),
            daTree: JSON.stringify(state.treeData),
          })
          .then((res) => {
            if (res.success) {
              ElNotification({
                title: '提示',
                message: type ? '提交审查单成功' : '修改评审意见已推送至平台',
              })
              //批量完后，复选框置位空
              elTree.value.setCheckedKeys([], false)
            }
          })
      },
      deepclone(obj) {
        return JSON.parse(JSON.stringify(obj))
      },
      //递归查询对应树节点
      findCurrent(data) {
        for (let o of data || []) {
          if (o.params) {
            if (o.params.id == state.params.id) return o
          }
          const o_ = methods.findCurrent(o.children)
          if (o_) return o_
        }
      },
      async handleSelect(key) {
        if (key == '2-1') {
          methods.saveParams(0)
        } else if (key == '2-2') {
          await methods.getDaTree(0)
          //更新之后重新渲染数据
          let cur = methods.findCurrent(state.treeData)
          state.params = methods.deepclone(cur.params)
        } else if (key == '3-1') {
          state.openDialog = true
        } else if (key == '4-1') {
          // state.showTree = true
        } else if (key == '4-2') {
          // state.showTree = false
        }
      },
      onFocus() {
        // myQuillEditor.value.editor.__quill.enable(true);
        // myQuillEditor.value.disabled = true
      },
      numberToChinese(num) {
        var chineseNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
        var chineseUnit = ['', '十', '百', '千', '万', '亿']
        var result = ''
        var unitPos = 0
        var needZero = false

        if (num == 0) {
          return chineseNum[0]
        }

        while (num > 0) {
          var digit = num % 10
          if (digit == 0) {
            if (needZero) {
              result = chineseNum[0] + result
            }
            needZero = true
          } else {
            result = chineseNum[digit] + chineseUnit[unitPos] + result
            needZero = false
          }
          unitPos++
          num = Math.floor(num / 10)
        }

        return result
      },
      // onBlur(){
      //   console.log(myQuillEditor.value,myQuillEditor.value.editor.__quill)
      //           myQuillEditor.value.editor.__quill.enable(true);
      //   },
      changeRichContent(type) {
        state.freshRich = false
        setTimeout(() => {
          state.freshRich = true
        }, 300)
        let params = state.params
        let t = []
        params.produce.map((val, index) => {
          t.push(`第${methods.numberToChinese(++index)}步` + val.value)
        })
        let demandType = ''
        state.typeList.map((val) => {
          if (val.id === params.type) {
            demandType = val.label
          }
        })
        let input = [],
          output = [],
          notNormal = [],
          judge = []
        for (let i = 0; i < 3; i++) {
          judge = i == 0 ? input : i == 1 ? output : notNormal
          let index = 1
          let text = i == 0 ? '输入' : i == 1 ? '输出' : '异常处理'
          params[i == 0 ? 'layout' : i == 1 ? 'layout2' : 'layout3'].map((val) => {
            if (val.inputParams.length) {
              let itemp = []
              val.inputParams.map((data) => {
                let check = data.checked ? '已选择' : '未选择'
                itemp.push(check + data.name + '为' + (data.content || '未输入'))
              })
              judge.push(text + methods.numberToChinese(index) + '为' + itemp.join(','))
              ++index
            }
            let t = []
            if (val.tabTableParams.tabList.length) {
              let a = []
              val.tabTableParams.tabList.map((data) => {
                data.tableList.map((table, indext) => {
                  indext++
                  Object.keys(table).map((key) => {
                    a.push(`第${indext}行` + key + '为' + table[key])
                  })
                })
                t.push('tab' + data.label + '范围内' + '相关对应值为' + a.join(','))
                a = []
              })
              judge.push(text + methods.numberToChinese(index) + '为' + t.join(','))
              ++index
            }
            if (val.checkboxParams.length) {
              let ctemp = []
              val.checkboxParams.map((val) => {
                let check = val.checked ? '已选择参数' : '未选择参数'
                ctemp.push(check + val.name)
              })
              judge.push(text + methods.numberToChinese(index) + '为' + ctemp.join(','))
              ++index
            }
            if (val.textParams) {
              judge.push(text + methods.numberToChinese(index) + '为' + val.textParams)
              ++index
            }
          })
        }
        // console.log(input,output,notNormal)
        state.content = type
          ? `
        <h1 class='ql-align-center'><span style='color: rgb(102, 163, 224);'>${params.label}</span></h1>
        <h2 class="ql-indent-2">需求名称</h2>
        <p class="ql-indent-3">${params.name || '暂无'}</p>
        <h2 class="ql-indent-2">需求ID</h2>
        <p class="ql-indent-3">${params.id || '暂无'}</p>
         <h2 class="ql-indent-2">需求类型</h2>
        <p class="ql-indent-3">${demandType || '暂无'}</p>
        <h2 class="ql-indent-2">处理过程</h2>
        <p class="ql-indent-3">${
          t.length ? `该需求处理过程总共有${methods.numberToChinese(t.length)}步,${t.join(',')}` : '暂无'
        }</p>
        <h2 class="ql-indent-2">输入</h2>
        <p class="ql-indent-3">
        ${input.length ? `该输入要求总共有${methods.numberToChinese(input.length)}个,${input.join('。')}` : '暂无'}</p>
        <h2 class="ql-indent-2">输出</h2>
        <p class="ql-indent-3">
        ${
          output.length ? `该输出要求总共有${methods.numberToChinese(output.length)}个,${output.join('。')}` : '暂无'
        }</p>
        <h2 class="ql-indent-2">异常处理</h2>
        <p class="ql-indent-3">
        ${
          notNormal.length
            ? `该异常处理步骤共有${methods.numberToChinese(notNormal.length)}步,${notNormal.join('。')}`
            : '暂无'
        }</p>
        `
          : `
        <h1 class='ql-align-center'><span style='color: rgb(102, 163, 224);'>${params.label}</span></h1>
        <h2 class="ql-indent-1">需求名称</h2>
        <p class="ql-indent-2">${params.name || '暂无'}</p>
        <h2 class="ql-indent-1">需求ID</h2>
        <p class="ql-indent-2">${params.id || '暂无'}</p>
         <h2 class="ql-indent-1">需求类型</h2>
        <p class="ql-indent-2">${demandType || '暂无'}</p>
        <h2 class="ql-indent-1">处理过程</h2>
        <p class="ql-indent-2">${t.length ? `该需求处理过程总共有${t.length}步,${t.join(',')}` : '暂无'}</p>
        <h2 class="ql-indent-1">输入</h2>
        <p class="ql-indent-2">${
          input.length ? `该输入要求总共有${methods.numberToChinese(input.length)}个,${input.join('。')}` : '暂无'
        }</p>
         <h2 class="ql-indent-1">输出</h2>
        <p class="ql-indent-2">${
          output.length ? `该输出要求总共有${methods.numberToChinese(output.length)}个,${output.join('。')}` : '暂无'
        }</p>
         <h2 class="ql-indent-1">异常处理</h2>
        <p class="ql-indent-2">${
          notNormal.length
            ? `该异常处理步骤共有${methods.numberToChinese(notNormal.length)}步,${notNormal.join('。')}`
            : '暂无'
        }</p>
        `
      },
      previewfile() {
        nextTick(() => {
          // fetch('/public/mock/word/demand_analysis.docx')
          fetch('/assets/mock/word/demand_analysis.docx')
            .then((response) => {
              //选择要渲染的元素
              let docData = response.blob() //将文件转换成bolb形式
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
            left: ' -223px',
          })
        } else {
          $('.docx-wrapper').css({
            transform: 'scale(1)',
            top: 0,
            left: 0,
          })
        }
      },
    }
    onMounted(() => {
      methods.previewfile()
      window.addEventListener(
        'message',
        (e) => {
          if (e.data.userId && e.data.taskId) {
            state.taskId = e.data.taskId
            methods.saveParams(1)
            console.log(e.data, '外层发来的消息提交') // 父页面发送的消息
          } else {
            if (e.data.taskId) {
              state.taskId = e.data.taskId
              console.log(e.data, '外层发来的消息查看') // 父页面发送的消息
            }
          }
        },
        false
      )
      setTimeout(() => {
        methods.getDaTree(1)
      }, 500)
    })
    onUnmounted(() => {})
    return {
      ...toRefs(state),
      editorOptions,
      ...methods,
      myQuillEditor,
      elTree,
      examineData,
    }
  },
})
</script>
<style lang="less" scoped>
.strechPoint {
  // background:#3dfbe8;
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
  left: -223px;
  position: absolute;
  background: #eee;
  // padding: 0 10px;
  // padding-left: 10px;
  width: 883px;
}
:deep(.docx-wrapper > section.docx) {
  // width: 100% !important;
  // padding: 0rem !important;
  min-height: auto !important;
  box-shadow: none;
  // margin-bottom: 0;
}
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
.taskBook {
  position: absolute;
  right: 15px;
  top: 10px;
  width: 15px;
  height: 15px;
  cursor: pointer;
}
.confirmed {
  font-size: 12px;
  padding: 2px 3px;
  background: #1f98ee;
  color: #fff;
  border-radius: 5px;
  margin-right: 5px;
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

:deep(.el-menu-item) {
  font-size: 16px;
}
:deep(.el-sub-menu__title) {
  font-size: 16px;
}
:deep(.ql-editor p) {
  font-size: 16px;
  //  margin-left: 10rem;
}
:deep(.ql-indent-3) {
  padding-right: 3rem;
}
// :deep(.ql-editor h2){
//  margin-left: 8rem;
// }
:deep(.el-textarea.is-disabled .el-textarea__inner) {
  background-color: #fafafa;
  border-color: #dfdfdf;
  color: #5f5f5f;
}
:deep(.el-input.is-disabled .el-input__inner) {
  background-color: #fafafa;
}
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
  height: 100%;
}
:deep(.el-select) {
  width: 100%;
}
:deep(.el-input) {
  height: 100%;
}
:deep(.el-input__inner) {
  border-color: #ededed !important;
  color: #000 !important;
}
.deleteGrid {
  cursor: pointer;
  position: absolute;
  top: -4px;
  right: 3px;
  z-index: 9;
  width: auto !important;
}
:deep(.el-menu){
  height: 40px;
}
.content_main {
  width: auto;
  height: calc(100% - 60px);
  background: #f1f5f9;
  padding: 0;
  margin: 0 8px;
  input {
    border: 1px solid #dfdfdf;
    cursor: not-allowed;
  }
  .topMenu {
    width: 100%;
    height: 40px;
    background: #fff;
    border-radius: 2px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 1rem;
    letter-spacing: 2px;
    font-size: 17px;
    flex-wrap: wrap;
    border-bottom: 1px rgb(226, 226, 226) solid;
    .menuArea {
      width: 50%;
      height: 100%;
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
    .rightinner {
      .flex_center;
      position: absolute;
      right: 25px;
      .changeView {
        padding: 0.3rem 1rem;
        background: #fefeff;
        border: 1px solid #eaeaeb;
        margin-right: 2rem;
        border-radius: 5px;
        cursor: pointer;
      }
    }
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
      width: 40%;
    }
  }
  @keyframes fadeTree2 {
    from {
      width: 40%;
    }
    to {
      width: 0;
    }
  }
  .bottom_contain {
    width: 100%;
    height: calc(100% - 45px);
    display: flex;
  }
  .leftTree {
    // width: 25%;
    // margin-top: 1rem;
    background: #fff;
    // height: calc(95% - 60px);
    height: 100%;
    border-radius: 2px;
    margin-right: 10px;
    float: left;
    overflow: auto;
    animation: emergeTree 0.3s forwards;
  }
  .leftTask {
    // margin-top: 1rem;
    background: #fff;
    height: 100%;
    border-radius: 2px;
    margin-right: 10px;
    overflow: auto;
    animation: emergeTree2 0.3s forwards;
    position: relative;
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
  .leftTree2 {
    // width: 25%;
    // margin-top: 1rem;
    background: #fff;
    height: 100%;
    margin-right: 10px;
    border-radius: 10px;
    float: left;
    overflow: auto;
    animation: fadeTree 0.3s forwards;
  }
  @keyframes emergeForm {
    from {
      width: 0;
    }
    to {
      // width: calc(40% + 1rem);
      width: 100%;
    }
  }
  @keyframes fadeForm {
    from {
      // width: calc(40% + 1rem);
      width: 100%;
    }
    to {
      width: 0;
    }
  }
  .examineArea {
    // height: calc(100% - 45px);
    height: 100%;
    // height: calc(95% - 35px + 1rem);
    // height: calc(92% - 60px);
    float: right;
    // margin-top: 1rem;
    border-radius: 10px;
    background: #fff;
    // position: absolute;
    // right: 0;
    animation: emergeForm 0.3s forwards;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .examineArea2 {
    // height: calc(93% - 35px + 1rem);
    height: calc(98% - 45px);
    float: right;
    // margin-top: 1rem;
    border-radius: 10px;
    background: #fff;
    // position: absolute;
    // right: 0;
    width: 0;
    transition: 0.3s width;
    // animation: fadeForm .3s forwards;
  }
  .topTitle {
    font-size: 24px;
    text-align: center;
    width: 100%;
    color: #0093b8;
    margin: 10px 0;
  }
  .buttonSubmit {
    background: #2bb763;
    color: #fff;
    border: 1px solid #eaeaeb;
    border-radius: 5px;
    cursor: pointer;
    width: 5rem;
    height: 2rem;
    text-align: center;
    margin: 10px auto;
    /* margin: auto; */
    line-height: 2rem;
  }
  .exTitle {
    font-size: 18px;
    font-weight: 600;
    text-align: left;
    width: 100%;
    color: #000;
    margin: 5px 0 10px 20px;
  }
  .tableArea {
    width: 100%;
    height: 45%;
    .textareaClass {
      cursor: pointer;
      font-size: 16px;
      width: 80%;
      vertical-align: top;
      border-color: #ededed;
      border-radius: 2px;
    }
    .textareaClass2 {
      cursor: not-allowed;
      font-size: 16px;
      width: 80%;
      vertical-align: top;
      border: none;
      resize: none;
      border-radius: 2px;
    }
  }
  .leftArrow {
    position: fixed;
    // right: -17px;
    right: 1px;
    top: 40%;
    // width: 35px;
    // height: 35px;
    width: 15px;
    height: 15px;
    z-index: 9;
    cursor: pointer;
    // transform: rotate(-135deg);
    transform: rotate(180deg);
    // transition: .5s;
  }
  // .leftArrow:hover{
  //      position: fixed;
  //       right: 5px;
  //       top: 40%;
  //       width: 50px;
  //       height: 50px;
  //       z-index: 9;
  //       cursor: pointer;
  //       transform: rotate(-90deg);
  // }
  .righttArrow {
    position: absolute;
    right: 41%;
    top: 40%;
    width: 15px;
    height: 15px;
    z-index: 99999999;
    cursor: pointer;
  }
  .rightContent {
    width: calc(75% - 3rem);
    float: left;
    // height: calc(95% - 60px);
    height: 100%;
    width: 100%;
    // margin-top: 1rem;
    // margin-left: 1rem;
    border-radius: 2px;
    background: #fff;
    overflow: auto;
    position: relative;
    transition: 0.3s width;
    .innerRich {
      width: calc(100% - 1rem - 4px);
      height: calc(100% - 1rem - 4px);
      margin: 0.5rem;
      border: 2px #bbbbbb dashed;
      border-radius: 5px;
      overflow: hidden;
    }
    .rightChoose {
      position: absolute;
      right: 0rem;
      top: 35%;
      width: 6rem;
      height: 10rem;
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
        // width: 51rem;
        width: 79%;
        height: auto;
        span {
          width: auto;
        }
      }
      .inputArea_scale {
        padding: 2rem;
        border: 1px solid #2599ff;
        border-radius: 5px;
        margin-left: 1rem;
        padding: 1rem;
        width: 73%;
        height: auto;
        span {
          width: auto;
        }
      }
      .produceArea {
        margin-left: 4rem;
        // width: 51rem;
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
      .produceArea2 {
        margin-left: 1rem;
        width: 73%;
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
</style>

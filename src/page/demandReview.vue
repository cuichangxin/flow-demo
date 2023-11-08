<!--
 * @Author: LiuFengRui
 * @Date: 2021-11-08 15:41:12
 * @LastEditTime: 2023-07-25 17:17:27
 * @LastEditors: Please set LastEditors
 * @Description: 
-->
<template>
  <div class="wrapper" :style="{ height: `${configHeight}px` }">
    <div class="content_main">
      <div class="topMenu">
        <div class="menuArea">
          <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
            <shapeElMenu :menus="menuList"></shapeElMenu>
          </el-menu>
        </div>
        <div class="rightinner">
          <!-- <img
            src="../assets/images/changeView.png"
            style="height: 20px; width: 20px; cursor: pointer"
            
            
          /> -->
          <el-icon size="20" color="#1b89f0" title="切换视图" style="cursor: pointer;" @click="showRich = !showRich"><View /></el-icon>
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
                node-key="label"
                @node-click="handleNodeClick"
                :expand-on-click-node="false"
                :default-expand-all="true"
                :show-checkbox="showEvalue"
                highlight-current
                ref="elTreeRef"
              >
                <template #default="{ node, data }">
                  <div class="treeTitle" :title="node.label + '(' + data.params?.id + ')'">
                    <div class="confirmed" v-if="data.params && !data.params.finishSubmit">未评审</div>
                    <span class="treeSpan">{{ node.label }}</span>
                    <span v-if="data.params && data.params.id">({{ data.params.id }})</span>
                  </div>
                </template>
              </el-tree>
            </div>
            <div class="rightContent" :style="{ borderRight: examine ? '1px solid var(--el-border-color)' : '' }">
              <el-icon v-if="params.id" size="20" :style="{transform: examine ? 'rotate(180deg)' :''}" class="leftArrow" @click="leftArrow"><ArrowLeftBold /></el-icon>

              <div v-if="params.id && !showRich">
                <h4 style="color: #1b89f0; font-size: 18px">需求详情</h4>
                <ul class="ulClass">
                  <div class="my-box-info">
                    <li style="width: 50%">
                      <span>需求名称</span>
                      <el-input type="text" disabled v-model="params.name" />
                    </li>
                    <li style="width: 50%">
                      <span>需求ID</span>
                      <el-input type="text" v-model="params.id" disabled />
                    </li>
                    <li style="width: 500px">
                      <span>需求类型</span>
                      <el-select v-model="params.type" placeholder="请选择" disabled>
                        <el-option v-for="gs in typeList" :key="gs.id" :label="gs.label" :value="gs.id" />
                      </el-select>
                    </li>
                    <li>
                      <span>处理过程</span>
                      <div :class="[examine ? 'produceArea2' : 'produceArea']">
                        <div class="oneProduce" v-for="(item, index) in params.produce" :key="index">
                          <i class="iconfont icon-liebiao"></i>
                          <span style="min-width: 0; margin-left: 10px">步骤{{ index + 1 }}</span>
                          <el-select
                            v-model="item.value"
                            size="small"
                            placeholder="请选择"
                            @change="filterProduce(item, index)"
                            disabled
                            :title="item.value"
                          >
                            <el-option
                              v-for="gs in item.content"
                              :key="gs.content"
                              :label="gs.content"
                              :value="gs.content"
                            />
                          </el-select>
                        </div>
                      </div>
                    </li>
                    <li>
                      <el-popover placement="right" :width="400" trigger="click" v-if="showStretch">
                        <template #reference>
                          <span style="cursor: pointer; position: relative"
                            >输入
                            <img class="strechPoint" src="../assets/images/ai.png" alt="" />
                          </span>
                        </template>
                        <el-tabs v-model="params.activeName">
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
                                  <el-input type="text" value="1" disabled />
                                </li>
                                <li>
                                  <img
                                    src="../assets/images/flag2.png"
                                    style="width: 20px; height: 20px; margin-right: 1rem"
                                  />
                                  <span>xxx案例</span>
                                  <i style="margin-left: 1rem">程序角初始值:</i>
                                  <el-input type="text" value="1" disabled />
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
                              <ul>
                                <li v-for="(area, index) in item.inputParams" :key="index">
                                  <el-checkbox type="checkbox" name="" id="" v-model="area.checked" disabled />
                                  <el-input type="text" v-model="area.name" disabled placeholder="输入框标题" />
                                  <el-input
                                    type="text"
                                    style="margin-left: 2rem"
                                    v-model="area.content"
                                    placeholder="输入框内容"
                                    disabled
                                  />
                                </li>
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
                                    <el-table :data="area.tableList" border>
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
                                    </el-table>
                                  </div>
                                </el-tab-pane>
                              </el-tabs>
                            </div>
                            <!-- 拖动选择框进来 -->
                            <div class="checkboxChoose" v-show="item.type == '3'">
                              <div class="onecheckbox" v-for="(area, index) in item.checkboxParams" :key="index">
                                <el-checkbox type="checkbox" name="" id="" v-model="area.checked" disabled />
                                <el-input type="text" v-model="area.name" placeholder="请输入单选框名称" disabled />
                              </div>
                            </div>
                            <!-- 拖动文本框进来 -->
                            <div class="textChoose" v-show="item.type == '4'">
                              <el-input
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
                          <span style="cursor: pointer; position: relative">
                            输出
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
                                  <el-checkbox type="checkbox" name="" id="" v-model="area.checked" disabled />
                                  <el-input type="text" v-model="area.name" placeholder="输入框标题" disabled />
                                  <el-input type="text" v-model="area.content" placeholder="输入框内容" disabled />
                                </li>
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
                                    <el-table :data="area.tableList" border>
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
                                    </el-table>
                                  </div>
                                </el-tab-pane>
                              </el-tabs>
                            </div>
                            <!-- 拖动选择框进来 -->
                            <div class="checkboxChoose" v-show="item.type == '3'">
                              <div class="onecheckbox" v-for="(area, index) in item.checkboxParams" :key="index">
                                <el-checkbox type="checkbox" name="" id="" v-model="area.checked" disabled />
                                <el-input type="text" v-model="area.name" placeholder="请输入单选框名称" disabled />
                              </div>
                            </div>
                            <!-- 拖动文本框进来 -->
                            <div class="textChoose" v-show="item.type == '4'">
                              <el-input
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
                            <img class="strechPoint" src="../assets/images/ai.png" alt="" />
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
                                  <el-checkbox type="checkbox" name="" id="" v-model="area.checked" disabled />
                                  <el-input type="text" v-model="area.name" placeholder="输入框标题" disabled />
                                  <el-input type="text" v-model="area.content" placeholder="输入框内容" disabled />
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
                                    <el-table :data="area.tableList" border>
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
                                    </el-table>
                                  </div>
                                </el-tab-pane>
                              </el-tabs>
                            </div>
                            <!-- 拖动选择框进来 -->
                            <div class="checkboxChoose" v-show="item.type == '3'">
                              <div class="onecheckbox" v-for="(area, index) in item.checkboxParams" :key="index">
                                <el-checkbox type="checkbox" name="" id="" v-model="area.checked" disabled />
                                <el-input type="text" v-model="area.name" placeholder="请输入单选框名称" disabled />
                              </div>
                            </div>
                            <!-- 拖动文本框进来 -->
                            <div class="textChoose" v-show="item.type == '4'">
                              <el-input
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
                  </div>
                </ul>
              </div>
              <div class="innerRich" v-if="params.id && showRich">
                <QuillEditor
                  v-model:content="content"
                  :options="editorOptions"
                  contentType="html"
                  ref="myQuillEditor"
                  v-show="freshRich"
                >
                </QuillEditor>
                <el-button type="text" class="my_button" @click="downloadFile">下载文档</el-button>
              </div>
            </div>
            <el-scrollbar :class="[examine ? 'examineArea' : 'examineArea2']" v-if="params.id">
              <div>
                <div class="topTitle">审查单</div>
                <div class="exTitle">一般性检查</div>
                <div class="tableArea">
                  <el-table :data="params.examineData.normal">
                    <el-table-column prop="id" label="序号" width="60" align="center" />
                    <el-table-column prop="name" label="检查名称" width="100" />
                    <el-table-column prop="demand" label="考核要求" width="150" />
                    <el-table-column prop="result" label="审核结果" width="120">
                      <template #default="scope">
                        <el-select v-model="scope.row.result" size="small" placeholder="请选择">
                          <el-option v-for="gs in option" :key="gs.id" :label="gs.content" :value="gs.id" />
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="suggest" label="审查意见">
                      <template #default="scope">
                        <div style="display: flex; align-items: center;">
                          <textarea
                          :class="[scope.row.appear ? 'textareaClass' : 'textareaClass2']"
                          type="text"
                          placeholder="请输入"
                          v-model="scope.row.suggest"
                          @blur="scope.row.appear = false"
                          :disabled="scope.row.appear ? false : true"
                        ></textarea>
                        <el-icon size="20" class="el_icon" @click="scope.row.appear = true"><Edit /></el-icon>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <div class="exTitle">专业性检查</div>
                <div class="tableArea">
                  <el-table :data="params.examineData.profession">
                    <el-table-column prop="id" label="序号" width="60" align="center" />
                    <el-table-column prop="name" label="检查名称" width="100" />
                    <el-table-column prop="demand" label="考核要求" width="150" />
                    <el-table-column prop="result" label="审核结果" width="120">
                      <template #default="scope">
                        <el-select v-model="scope.row.result" size="small" placeholder="请选择">
                          <el-option v-for="gs in option" :key="gs.id" :label="gs.content" :value="gs.id" />
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="suggest" label="审查意见">
                      <template #default="scope">
                        <div style="display: flex; align-items: center;">
                          <textarea
                            :class="[scope.row.appear ? 'textareaClass' : 'textareaClass2']"
                            type="text"
                            placeholder="请输入"
                            v-model="scope.row.suggest"
                            @blur="scope.row.appear = false"
                            :disabled="scope.row.appear ? false : true"
                          ></textarea>
                          <el-icon size="20" class="el_icon" @click="scope.row.appear = true"><Edit /></el-icon>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <div style="width: 100%; display: flex; justify-content: center; margin: 18px 0 10px 0">
                  <el-button type="primary" @click="saveParams(1)">提交</el-button>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </pane>
      </Splitpanes>
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

<script setup>
import { ElNotification } from 'element-plus'
import examineData from '@/utils/examine'
import { renderAsync } from 'docx-preview'
import { QuillEditor, Quill } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import Cookies from 'js-cookie'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import shapeElMenu from '../components/common/shape/shapeElMenu.vue'
import { Edit, ArrowLeftBold, View } from '@element-plus/icons-vue'
import axios from 'axios'

const { proxy } = getCurrentInstance()
const myQuillEditor = ref(null)
const elTreeRef = ref(null)
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
const defaultProps = reactive({
  children: 'children',
  label: 'label',
})
const showWord = ref(true)
const params = ref({ label: '' })
const treeData = ref([])
const showRich = ref(false)
const freshRich = ref(false)
const content = ref('')
const typeList = ref([])
const option = ref([
  { content: '不通过', id: 0 },
  { content: '通过', id: 1 },
])
const examine = ref(false) //是否展示审查单
const openDialog = ref(false)
const activeIndex = ref('1')
const showTree = ref(true)
const taskId = ref(1)
const showEvalue = ref(false)
const showTaskBook = ref(true)
const showStretch = ref(false)
const configHeight = ref('')
const produceContent = ref([])
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
    title: '管理',
    icon: 'icon-guanli',
    children: [
      {
        title: '推送',
        icon: '',
      },
      {
        title: '更新',
        icon: '',
      },
      {
        title: '批量评审',
        icon: '',
      },
    ],
  },
  {
    title: '知识库',
    icon: 'icon-zhishiku',
    children: [
      {
        title: '查看',
        icon: '',
      },
      {
        title: '新增',
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
        title: '审查单',
        icon: '',
      },
      {
        title: '左右对照视图模式',
        icon: '',
      },
      {
        title: '智能辅助视图模式',
        icon: '',
      },
    ],
  },
])

function leftArrow() {
  examine.value = !examine.value
  changeRichContent(0)
}
//获取树数据
async function getDaTree(type) {
  await proxy.$axios.getTaskDetail({ taskId: Cookies.get('taskId') }).then((res) => {
    let data = JSON.parse(res.data.daTree)
    treeData.value = data
    console.log(data, res)
    typeList.value = []
    data.map((val, index) => {
      let label = val.label.match(/\D+/g)[0]
      typeList.value.push({ id: index, label })
    })
  })
  if (!type) {
    ElNotification({
      title: '提示',
      message: '已更新至最新评审意见',
    })
  }
}
function handleNodeClick(data) {
  showRich.value = false
  if (!data.params) return
  params.value = JSON.parse(JSON.stringify(data.params))
  params.value.label = data.label
  let regex = /^\d+(\.\d+)*\s*/
  params.value.name = data.label.replace(regex, '')
  produceContent.value = params.value.produceContent || []
  console.log(data, params.value)
  changeRichContent(1)
  nextTick(() => {
    //解决拖动进来后父节点高度坍塌问题
    document.getElementById('inputArea').firstChild.style.height = '300px'
    document.getElementById('inputArea2').firstChild.style.height = '300px'
    document.getElementById('inputArea3').firstChild.style.height = '300px'
  })
}
function downloadFile() {
  window.open('/mock/word/姿控评审文档.doc')
}
//保存详情
function saveParams(type) {
  if (!params.value) return
  // console.log(elTree.value.getCheckedNodes(),'111111111111')
  let choseNode = elTreeRef.value.getCheckedNodes()
  if (type) {
    let cur = findCurrent(treeData.value)
    cur.params = params.value
    cur.params.finishSubmit = true
    if (choseNode.length) {
      choseNode.map((val) => {
        // let curs = findCurrentSome(treeData,val.params.id)
        if (val.params) {
          val.params.examineData = params.value.examineData
          val.params.finishSubmit = true
        }
      })
    }
  }
  if (!type) {
    getDaTree(1)
  }
  // console.log(treeData, params, cur);
  proxy.$axios
    .saveTaskDetail({
      taskId: Cookies.get('taskId'),
      daTree: JSON.stringify(treeData.value),
    })
    .then((res) => {
      if (res.success) {
        ElNotification({
          title: '提示',
          message: type ? '提交审查单成功' : '修改评审意见已推送至平台',
        })
        //批量完后，复选框置位空
        elTreeRef.value.setCheckedKeys([], false)
      }
    })
}
function deepclone(obj) {
  return JSON.parse(JSON.stringify(obj))
}
//递归查询对应树节点
function findCurrent(data) {
  for (let o of data || []) {
    if (o.params) {
      if (o.params.id == params.value.id) return o
    }
    const o_ = findCurrent(o.children)
    if (o_) return o_
  }
}
async function handleSelect(key) {
  if (key == '推送') {
    saveParams(0)
  } else if (key == '更新') {
    await getDaTree(0)
    //更新之后重新渲染数据
    let cur = findCurrent(treeData.value)
    params.value = deepclone(cur.params)
  } else if (key == '查看') {
    openDialog.value = true
  } else if (key == '左侧树') {
    showTree.value = !showTree.value
  } else if (key == '审查单') {
    examine.value = !examine.value
  } else if (key === '左右对照视图模式') {
    showWord.value = !showWord.value
  } else if (key === '批量评审') {
    showEvalue.value = !showEvalue.value
  } else if (key === '智能辅助视图模式') {
    showStretch.value = !showStretch.value
  }
}
function numberToChinese(num) {
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
}
function changeRichContent(type) {
  freshRich.value = false
  setTimeout(() => {
    freshRich.value = true
  })
  // let params = params.value
  console.log(params.value.id, examine.value, '-----------111----1-1-1-111-11-')
  let t = []
  params.value.produce.map((val, index) => {
    t.push(`第${numberToChinese(++index)}步` + val.value)
  })
  let demandType = ''
  typeList.value.map((val) => {
    if (val.id === params.value.type) {
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
    params.value[i == 0 ? 'layout' : i == 1 ? 'layout2' : 'layout3'].map((val) => {
      if (val.inputParams.length) {
        let itemp = []
        val.inputParams.map((data) => {
          let check = data.checked ? '已选择' : '未选择'
          itemp.push(check + data.name + '为' + (data.content || '未输入'))
        })
        judge.push(text + numberToChinese(index) + '为' + itemp.join(','))
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
        judge.push(text + numberToChinese(index) + '为' + t.join(','))
        ++index
      }
      if (val.checkboxParams.length) {
        let ctemp = []
        val.checkboxParams.map((val) => {
          let check = val.checked ? '已选择参数' : '未选择参数'
          ctemp.push(check + val.name)
        })
        judge.push(text + numberToChinese(index) + '为' + ctemp.join(','))
        ++index
      }
      if (val.textParams) {
        judge.push(text + numberToChinese(index) + '为' + val.textParams)
        ++index
      }
    })
  }
  // console.log(input,output,notNormal)
  content.value = type
    ? `
        <h1 class='ql-align-center'><span style='color: rgb(102, 163, 224);'>${params.value.label}</span></h1>
        <h2 class="ql-indent-2">需求名称</h2>
        <p class="ql-indent-3">${params.value.name || '暂无'}</p>
        <h2 class="ql-indent-2">需求ID</h2>
        <p class="ql-indent-3">${params.value.id || '暂无'}</p>
         <h2 class="ql-indent-2">需求类型</h2>
        <p class="ql-indent-3">${demandType || '暂无'}</p>
        <h2 class="ql-indent-2">处理过程</h2>
        <p class="ql-indent-3">${
          t.length ? `该需求处理过程总共有${numberToChinese(t.length)}步,${t.join(',')}` : '暂无'
        }</p>
        <h2 class="ql-indent-2">输入</h2>
        <p class="ql-indent-3">
        ${input.length ? `该输入要求总共有${numberToChinese(input.length)}个,${input.join('。')}` : '暂无'}</p>
        <h2 class="ql-indent-2">输出</h2>
        <p class="ql-indent-3">
        ${output.length ? `该输出要求总共有${numberToChinese(output.length)}个,${output.join('。')}` : '暂无'}</p>
        <h2 class="ql-indent-2">异常处理</h2>
        <p class="ql-indent-3">
        ${
          notNormal.length ? `该异常处理步骤共有${numberToChinese(notNormal.length)}步,${notNormal.join('。')}` : '暂无'
        }</p>
        `
    : `
        <h1 class='ql-align-center'><span style='color: rgb(102, 163, 224);'>${params.value.label}</span></h1>
        <h2 class="ql-indent-1">需求名称</h2>
        <p class="ql-indent-2">${params.value.name || '暂无'}</p>
        <h2 class="ql-indent-1">需求ID</h2>
        <p class="ql-indent-2">${params.value.id || '暂无'}</p>
         <h2 class="ql-indent-1">需求类型</h2>
        <p class="ql-indent-2">${demandType || '暂无'}</p>
        <h2 class="ql-indent-1">处理过程</h2>
        <p class="ql-indent-2">${t.length ? `该需求处理过程总共有${t.length}步,${t.join(',')}` : '暂无'}</p>
        <h2 class="ql-indent-1">输入</h2>
        <p class="ql-indent-2">${
          input.length ? `该输入要求总共有${numberToChinese(input.length)}个,${input.join('。')}` : '暂无'
        }</p>
         <h2 class="ql-indent-1">输出</h2>
        <p class="ql-indent-2">${
          output.length ? `该输出要求总共有${numberToChinese(output.length)}个,${output.join('。')}` : '暂无'
        }</p>
         <h2 class="ql-indent-1">异常处理</h2>
        <p class="ql-indent-2">${
          notNormal.length ? `该异常处理步骤共有${numberToChinese(notNormal.length)}步,${notNormal.join('。')}` : '暂无'
        }</p>
        `
}
function previewfile() {
  nextTick(() => {
      axios.get('/mock/word/demand_analysis.docx',{responseType:'blob'}).then((response) => {
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
onMounted(() => {
  previewfile()
  window.addEventListener(
    'message',
    (e) => {
      if (e.data.userId && e.data.taskId) {
        taskId.value = e.data.taskId
        saveParams(1)
        console.log(e.data, '外层发来的消息提交') // 父页面发送的消息
      } else {
        if (e.data.taskId) {
          taskId.value = e.data.taskId
          console.log(e.data, '外层发来的消息查看') // 父页面发送的消息
        }
      }
    },
    false
  )
  setTimeout(() => {
    getDaTree(1)
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
.strechPoint {
  height: 20px;
  width: 20px;
  position: absolute;
  left: 20px;
  top: -17px;
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
  width: 100%;
  border: solid var(--el-border-color) 1px;
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
    input[type='text'] {
      width: 80%;
      height: 100%;
    }
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

:deep(.ql-editor p) {
  font-size: 16px;
}
:deep(.ql-indent-3) {
  padding-right: 3rem;
}
:deep(.el-select) {
  width: 100%;
}
.deleteGrid {
  cursor: pointer;
  position: absolute;
  top: -4px;
  right: 3px;
  z-index: 9;
  width: auto !important;
}
:deep(.el-menu) {
  height: 40px;
}
.content_main {
  width: 100%;
  height: 100%;
  background: var(--my-bg-color-5);
  padding: 0;
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
    .rightinner {
      .flex_center;
      position: absolute;
      right: 25px;
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
  .leftTree {
    width: 200px;
    background: var(--my-bg-color);
    margin-right: 10px;
    overflow: auto;
    animation: emergeTree 0.3s forwards;
    position: relative;
  }
  @keyframes emergeForm {
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  }
  @keyframes fadeForm {
    from {
      width: 100%;
    }
    to {
      width: 0;
    }
  }
  .el-scrollbar {
    width: 100%;
    background-color: var(--my-bg-color);
  }
  .examineArea {
    height: 100%;
    background: var(--my-bg-color);
    animation: emergeForm 0.3s forwards;
    padding: 0 10px;
  }
  .examineArea2 {
    height: calc(98% - 45px);
    float: right;
    border-radius: 10px;
    background: #fff;
    width: 0;
    transition: 0.3s width;
  }
  .topTitle {
    font-size: 19px;
    text-align: center;
    width: 100%;
    color: #1b89f0;
    margin: 10px 0;
    font-weight: 600;
  }
  .exTitle {
    font-size: 16px;
    font-weight: 600;
    text-align: left;
    width: 100%;
    color: var(--my-text-bg-color-3);
    margin: 8px 0 10px 20px;
  }
  .tableArea {
    width: 100%;
    .textareaClass {
      cursor: pointer;
      font-size: 14px;
      width: 80%;
      vertical-align: top;
      border-color: #ededed;
      border-radius: 2px;
    }
    .textareaClass2 {
      cursor: not-allowed;
      width: 80%;
      vertical-align: top;
      border: none;
      resize: none;
      border-radius: 2px;
    }
  }
  .leftArrow {
    position: absolute;
    right: 0;
    top: 50%;
    z-index: 9;
    cursor: pointer;
    transform: translate(-50%);
  }
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
    width: 100%;
    height: 100%;
    padding: 10px 30px 10px 10px;
    background: var(--my-bg-color);
    overflow: auto;
    position: relative;
    transition: 0.3s width;
    .innerRich {
      width: calc(100% - 1rem - 4px);
      height: calc(100% - 80px);
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
      padding: 0 0 0 20px;
      li {
        width: 100%;
        display: flex;
        align-items: center;
        margin: 8px 0;
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
        width: 100%;
        height: auto;
        span {
          width: auto;
        }
      }
      .produceArea {
        width: 100%;
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
      .produceArea2 {
        width: 100%;
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
:deep(.el-tabs__header) {
  margin: 0;
}
:deep(.el-tabs__item) {
  margin: 0 20px !important;
  padding: 0 0px !important;
}
.inputArea_scale {
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  padding: 0 8px 8px;
  width: 100%;
  height: auto;
  span {
    width: auto;
  }
}
.el_icon {
  margin-left: 5px;
  cursor: pointer;
}
.my_button{
  float: right;
}
</style>

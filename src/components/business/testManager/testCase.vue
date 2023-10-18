<template>
  <div class="test_case" :style="{ height: `${areaHeight}px` }">
    <caseMenu @handleMenu="handleMenu"></caseMenu>
    <Splitpanes class="default-theme">
      <pane :size="showWord ? 40 : 0" class="pane">
        <div class="docx"></div>
      </pane>
      <pane :size="showWord ? 60 : 100">
        <div class="test-case-content">
          <div class="tree-box">
            <el-tree :data="treeData.list" :show-checkbox="showCheckout" ref="treeRef" @node-click="handleTree">
              <template #default="{ node, data }">
                <span class="custom-tree-node">
                  <span v-if="data.params && !data.params.confirm2" class="affirm">待确认</span>
                  <span>{{ node.label }}</span>
                </span>
              </template>
            </el-tree>
          </div>
          <div class="test_case_wrapper">
            <div class="content">
              <div class="flex">
                <div class="item">
                  <label>对应需求名称</label>
                  <el-input v-model="useCase.label" :disabled="disabledFlag"></el-input>
                </div>
                <div class="item">
                  <label>对应需求ID</label>
                  <el-input v-model="useCase.params.id" :disabled="disabledFlag"></el-input>
                </div>
                <el-button class="button" type="info" :disabled="disabledFlag" @click="addCase">
                  <el-icon>
                    <Plus />
                  </el-icon>
                  添加用例
                </el-button>
              </div>
              <el-table class="table" :data="tableData" border :highlight-current-row="true">
                <el-table-column align="center" prop="name" label="用例名称"> </el-table-column>
                <el-table-column align="center" prop="id" label="用例ID"> </el-table-column>
                <el-table-column align="center" label="操作" width="150">
                  <template #default="scope">
                    <el-button link @click="edit(scope.row)">
                      <el-icon size="18" color="#0095d9">
                        <Edit />
                      </el-icon>
                    </el-button>
                    <el-button link @click="remove(scope.row)">
                      <el-icon size="18" color="#f20c00">
                        <Delete />
                      </el-icon>
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="case_count">
                <span>测试用例总数:</span>
                <span>{{ tableData.length }}</span>
              </div>
              <!-- 处理步骤 -->
              <div class="handle">
                <span class="handle_title">处理步骤</span>
                <el-button link @click="addFrom" :disabled="stepDisabled">
                  <el-icon class="icon_add" size="20" :color="stepDisabled ? '' : '#0095d9'">
                    <CirclePlus />
                  </el-icon>
                </el-button>
                <div class="handle_content">
                  <el-form :inline="true" :model="formInline" ref="formRef">
                    <el-form-item prop="caseName" label="用例名称" class="form-item">
                      <el-input v-model="formInline.caseName" :disabled="stepDisabled"></el-input>
                    </el-form-item>
                    <el-form-item prop="caseId" label="用例ID" class="form-item">
                      <el-input v-model="formInline.caseId" :disabled="stepDisabled"></el-input>
                    </el-form-item>
                    <el-table :data="formInline.suppContact" :max-height="tableHeight">
                      <el-table-column label="序号" width="80">
                        <template #default="scope">
                          <i v-if="!suggest" class="iconfont icon-jiqiren_o" @click="openSuggest(scope)"></i>
                          {{ scope.$index + 1 }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="operation" label="操作">
                        <template #default="scope">
                          <el-form-item :prop="'suppContact.' + scope.$index + '.operation'">
                            <el-select v-model="scope.row.operation" :disabled="stepDisabled" @change="selectHandle">
                              <el-option
                                v-for="item in operationList"
                                :key="item.label"
                                :label="item.label"
                                :value="item.value"
                              ></el-option>
                            </el-select>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="operand" label="操作对象">
                        <template #default="scope">
                          <el-form-item :prop="'suppContact.' + scope.$index + '.operand'">
                            <el-select v-model="scope.row.operand" :disabled="stepDisabled" @change="selectHandle">
                              <el-option
                                v-for="item in operandList"
                                :key="item.label"
                                :label="item.label"
                                :value="item.value"
                              ></el-option>
                            </el-select>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="operationInput" width="160">
                        <template #default="scope">
                          <el-form-item :prop="'suppContact.' + scope.$index + '.operationInput'">
                            <el-input
                              v-model="scope.row.operationInput"
                              :disabled="stepDisabled"
                              class="operation_input"
                              @change="selectHandle"
                            ></el-input>
                          </el-form-item>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form>
                </div>
              </div>

              <div class="btn_box">
                <el-button class="enter_btn" type="primary" :disabled="disabledFlag" @click="confirmCase"
                  >确认</el-button
                >
              </div>
            </div>
          </div>
        </div>
      </pane>
    </Splitpanes>
    <!-- 添加用例抽屉 -->
    <el-drawer v-model="drawer" title="添加用例">
      <el-form :model="caseFormCase" label-position="right" label-width="80px" ref="caseFormRef">
        <el-form-item prop="name" label="用例名称">
          <el-input v-model="caseFormCase.name"></el-input>
        </el-form-item>
        <el-form-item prop="id" label="用例ID">
          <el-input v-model="caseFormCase.id"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="caseOff">取消</el-button>
          <el-button type="primary" @click="caseEnter">确定</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
    <Dialog title="智能辅助" :hidden-full-btn="false" v-model="visible" @confirm="handleConfirm" @close="handleClose">
      <el-tabs v-model="activeName">
        <el-tab-pane label="建议" name="suggest">
          <ul class="suggest_ul">
            <li>
              <!-- <img src="../../../assets/image/shengdantubiao-05.png" alt="" /> -->
              <p>针对{{ showTitle }}，为您搜索到以下建议:</p>
              <p>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
                  showTitle
                }}的临界值是正负40。所以，建议测试用例至少要覆盖：-41，-40，-39，0，39，40，41等
              </p>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="历史案例" name="case">
          <el-tabs v-model="caseName">
            <el-tab-pane label="xxx案例" name="langFive">
              <ul class="suggest_ul">
                <li>
                  <!-- <img src="../../../assets/image/shengdantubiao-05.png" alt="" /> -->
                  该案例下测试用例覆盖了俯仰姿态角的值：-50，-41，-40，-39，-10，0，10，39，40，41，50
                </li>
              </ul>
            </el-tab-pane>
            <el-tab-pane label="xxx案例" name="langSix"></el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
    </Dialog>
  </div>
</template>
<script setup>
import { Plus, Edit, Delete, CirclePlus } from '@element-plus/icons-vue'
import Cookies from 'js-cookie'
import { getToken } from '@/utils/auth'
import caseMenu from './caseMenu.vue'
import { ElMessageBox } from 'element-plus'
import { cloneDeep } from 'lodash'
import { week } from '../../../utils/utils'

import Dialog from '../../common/dialog/dialog.vue'
import useDialog from '@/hooks/useDialog'

import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { renderAsync } from 'docx-preview'

const { visible: visible, openDialog: openDialog, closeDialog: closeDialog } = useDialog()
const { proxy } = getCurrentInstance()

const userId = getToken()
const activeName = ref('suggest')
const caseName = ref('langFive')
// 左侧树数据
const treeData = reactive({
  list: [],
})
// 当前用例全部数据
const useCase = ref({
  label: '',
  params: {
    id: '',
  },
})
// 用例抽屉表单数据
const caseFormCase = ref({
  name: '',
  id: '',
})
const suggest = ref(true)
const showWord = ref(true)
const drawer = ref(false)
// 用例表格数据
const tableData = ref([])
const caseFormRef = ref(null)
const operationList = ref([
  {
    value: '注入',
    label: '注入',
  },
  {
    value: '监听',
    label: '监听',
  },
  {
    value: '判断',
    label: '判断',
  },
])
const operandList = ref([
  {
    value: '俯仰姿态角',
    label: '俯仰姿态角',
  },
  {
    value: '偏航姿态角',
    label: '偏航姿态角',
  },
  {
    value: '双口RAM',
    label: '双口RAM',
  },
  {
    value: '=0xAAFF',
    label: '=0xAAFF',
  },
  {
    value: '=0xFFFF',
    label: '=0xFFFF',
  },
])
const caseGo = ref(true)
const stepDisabled = ref(true) // 处理步骤禁用
const atEditRow = ref({})

const disabledFlag = computed(() => {
  if (userId !== '6') {
    return true
  } else if (userId == '6' && !caseGo.value) {
    return false
  } else {
    return true
  }
})

const tableHeight = ref(0)
const treeHeight = ref(0)
const areaHeight = ref(0)
const formInline = reactive({
  suppContact: [],
  caseName: '',
  caseId: '',
})
const showCheckout = ref(false)
const treeRef = ref(null)

const handleMenu = (e) => {
  if (e === '批量操作') {
    showCheckout.value = !showCheckout.value
  }
  if (e === '保存') {
    // 批量保存
    const data = treeRef.value.getCheckedNodes()
    console.log(data)
    const res = []
    data.forEach((item) => {
      findParent(treeData.list, item, res)
    })
    const tree = treeData.list.map((val) => {
      if (val.label === res[0]) {
        return val.children
      }
    })
    console.log(tree)
    proxy.$axios
      .saveTaskDetail({
        taskId: '1', // 特殊处理 测试用例定死1
        daTree: JSON.stringify(...tree),
      })
      .then((res) => {
        console.log(res)
        // localStorage.setItem('trackingStatus', true)
        proxy.$modal.msgSuccess('提交成功')
      })
  }
  if (e === '视图对照') {
    showWord.value = !showWord.value
  }
  if (e === '智能辅助') {
    suggest.value = !suggest.value
  }
}

const showTitle = ref('')
const addFrom = () => {
  console.log(formInline)
  formInline.suppContact.push({
    operation: '',
    operand: '',
    operationInput: '',
  })
}
const handleTree = (node) => {
  proxy.$refs.formRef.resetFields()
  formInline.suppContact = []
  if (node.params) {
    useCase.value = node
    caseGo.value = false
    tableData.value = node.useCase === undefined ? [] : node.useCase
    console.log(node)
  }
}

/**
 * @param data 要查找的数据
 * @param target 查找的目标
 * @param res 查找结果容器
 */
function findParent(data, target, res = []) {
  for (let i in data) {
    let item = data[i]
    if (item.label === target.label) {
      res.unshift(item.label)
      if (item.params && !item.params.confirm2) {
        item.params.confirm2 = true
      }
      return true
    }
    if (item.children && item.children.length) {
      const ok = findParent(item.children, target, res)
      if (ok) {
        res.unshift(item.label)
        return true
      }
    }
  }
  return false
}

const addCase = () => {
  drawer.value = true
}
const caseEnter = () => {
  caseFormRef.value.validate((valid) => {
    if (valid) {
      tableData.value.push({
        name: caseFormCase.value.name,
        id: caseFormCase.value.id,
        suppContact: [],
      })
      drawer.value = false
      caseFormRef.value.resetFields()
    } else {
      console.log('submit 失败')
    }
  })
}
const caseOff = () => {
  drawer.value = false
  caseFormRef.value.resetFields()
}
const edit = (row) => {
  formInline.caseName = row.name
  formInline.caseId = row.id
  formInline.suppContact = row.suppContact
  stepDisabled.value = false
  atEditRow.value = row
}
const remove = (row) => {
  const index = tableData.value.indexOf(row)
  tableData.value.splice(index, 1)
}
function caseRange(useCase) {
  return new Promise((resolve, reject) => {
    let range = []
    let isRange = false
    useCase.value.useCase.forEach((item) => {
      if (item.suppContact && item.suppContact.length) {
        item.suppContact.forEach((val) => {
          range.push(val.operationInput)
        })
      }
    })
    for (let index = 0; index < range.length; index++) {
      if (range[index].toString().indexOf('[') !== -1 && range[index].toString().indexOf(']') !== -1) {
        isRange = true
        continue
      }
    }
    resolve({
      isRange,
      range,
    })
  })
}

const confirmCase = () => {
  const res = []
  let rowClone
  let INDEX
  let idArr = []
  let lastNum
  let subIndex
  let str
  let weeks = []
  const cloneCase = JSON.parse(JSON.stringify(useCase.value.useCase))
  console.log(useCase.value.useCase)
  if (useCase.value.useCase) {
    caseRange(useCase).then((res) => {
      console.log(res)
      if (res.isRange) {
        ElMessageBox.confirm('是否需要生成批量测试用例？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(() => {
            console.log('开始生成')
            useCase.value.useCase.forEach((item, idx, arr) => {
              if (item.isTarget) {
                item.suppContact.forEach((val, index) => {
                  if (val.operationInput.indexOf('[') !== -1 && val.operationInput.indexOf(']') !== -1) {
                    rowClone = cloneDeep(item)
                    let reg = new RegExp(/[[]|]/, 'g')
                    str = val.operationInput.replace(reg, '').split(',')
                    idArr = useCase.value.useCase[useCase.value.useCase.length - 1].id.split('_')
                    lastNum = idArr[idArr.length - 1].slice(1)
                  }
                  subIndex = index
                })
                if (subIndex === item.suppContact.length - 1) {
                  weeks.push(week(str[0], str[1]))
                  weeks.push(week(str[1], str[2]))
                  for (let myIndex = 0; myIndex < 2; myIndex++) {
                    const I = myIndex
                    const random = Math.floor(Math.random() * (weeks[I].length - weeks[I][0])) + weeks[I][0]
                    for (let index = 0; index < weeks[I].length; index++) {
                      if (index < random) {
                        const rowClone = cloneDeep(item)
                        rowClone.suppContact[idx].operationInput = weeks[I][index]
                        useCase.value.useCase.push({
                          name: item.name,
                          id: idArr[0] + '_' + idArr[1] + '_' + '0' + ++lastNum,
                          suppContact: rowClone.suppContact,
                        })
                      }
                    }
                  }
                  console.log(useCase.value.useCase)
                }
              }
              INDEX = idx
            })
            console.log(INDEX, cloneCase.length - 1)
            if (INDEX === cloneCase.length - 1) {
              console.log(rowClone)
              useCase.value.useCase.forEach((item, index) => {
                if (item.id === rowClone.id) {
                  useCase.value.useCase.splice(index, 1)
                }
              })
              // const index = useCase.value.useCase.indexOf(rowClone)
              // console.log(index)
              // useCase.value.useCase.splice(index, 1)
            }
          })
          .catch(() => {})
      } else {
        let res = []
        findParent(treeData.list, useCase.value, res)
        const tree = treeData.list.map((val) => {
          if (val.label === res[0]) {
            return val.children
          }
        })
        console.log(...tree)
        proxy.$axios
          .saveTaskDetail({
            taskId: '1', // 特殊处理 测试用例定死1
            daTree: JSON.stringify(...tree),
          })
          .then((res) => {
            console.log(res)
            if (useCase.value.label.indexOf('姿态自毁控制') !== -1) {
              localStorage.setItem('trackingStatus', true)
            }
            proxy.$modal.msgSuccess('提交成功')
          })
      }
    })
  } else {
    findParent(treeData.list, useCase.value, res)
    const tree = treeData.list.map((val) => {
      if (val.label === res[0]) {
        return val.children
      }
    })
    console.log(...tree)
    proxy.$axios
      .saveTaskDetail({
        taskId: '1', // 特殊处理 测试用例定死1
        daTree: JSON.stringify(...tree),
      })
      .then((res) => {
        console.log(res)
        if (useCase.value.label.indexOf('姿态自毁控制') !== -1) {
          localStorage.setItem('trackingStatus', true)
        }
        proxy.$modal.msgSuccess('提交成功')
      })
  }
}
const selectHandle = (e) => {
  tableData.value.forEach((item, index) => {
    if (item.id === formInline.caseId) {
      item.isTarget = true
      item.suppContact = formInline.suppContact
    }
    if (index === tableData.value.length - 1) {
      pushCase(treeData.list)
    }
  })
}
const handleConfirm = () => {
  closeDialog()
}
const handleClose = () => {
  closeDialog()
}
const openSuggest = (scope) => {
  console.log(scope)
  showTitle.value = scope.row.operand
  openDialog()
}

function pushCase(tree) {
  tree.forEach((item) => {
    if (item.params && item.params.id === useCase.value.params.id) {
      item.useCase = tableData.value
    } else if (item.children && item.children.length) {
      pushCase(item.children)
    }
  })
}
function previewFile() {
  nextTick(() => {
    // fetch('/public/mock/word/3.docx')
      fetch('/assets/mock/word/3.docx')
      .then((response) => {
        const docData = response.blob()
        const html = document.getElementsByClassName('docx')

        renderAsync(docData, html[0]).then((res) => {
          console.log('res---->', res)
        })
      })
      .catch((error) => {
        console.log(error)
      })
  })
}
previewFile()

onMounted(() => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 478
    treeHeight.value = window.innerHeight - 150
    areaHeight.value = window.innerHeight - 140
  })
  window.addEventListener('resize', () => {
    tableHeight.value = window.innerHeight - 478
    treeHeight.value = window.innerHeight - 150
    areaHeight.value = window.innerHeight - 140
  })
  proxy.$axios.getTestTree().then((res) => {
    console.log(res)
    treeData.list = res.data
  })
})
onUnmounted(() => {
  window.removeEventListener('resize', () => {})
})
</script>
<style lang="scss" scoped>
.test_case {
  display: flex;
  flex-direction: column;
}

.tree-box {
  min-width: 200px;
  height: 100%;
  /* background-color: #fff; */
  overflow: auto;
}

.el-tree {
  min-width: 100%;
  min-height: 100%;
  display: inline-block;
  background-color: var(--my-bg-color);
}

:deep(.el-tree-node) {
  flex: 1;
}

:deep(.el-tree-node__content) {
  height: 40px;
}

.test_case_wrapper {
  flex: 1;
  margin-left: 8px;
  border-radius: 3px;
  height: 100%;
  overflow: auto;
}

.content {
  height: 100%;
  padding: 10px 20px;
  background-color: var(--my-bg-color);
  position: relative;
  overflow: auto;

  .item {
    display: inline-flex;
    align-items: center;
    flex: 1;

    label {
      margin-right: 10px;
      font-size: 14px;
      font-weight: normal;
      white-space: nowrap;
    }

    &:nth-child(1) {
      margin-right: 20px;
    }
  }
}
.btn_box {
  width: 100%;
  text-align: right;
  .enter_btn {
    margin-top: 30px;
    margin-bottom: 10px;
  }
}

.flex {
  display: flex;
}

.button {
  margin-left: 30px;
}

.table {
  margin-top: 30px;
}

.handle {
  display: flex;
  margin-top: 40px;
  position: relative;

  .handle_title {
    display: block;
    height: 100%;
    height: 100%;
    font-size: 14px;
    white-space: nowrap;
    margin-right: 20px;
  }

  .handle_content {
    flex: 1;
    border: 1px solid var(--el-border-color);
    padding: 10px;
    min-width: 0;
  }
}

.operation_input {
  width: 100px;
}

.icon_add {
  position: absolute;
  left: 50px;
  top: 60px;
}
.custom-tree-node {
  .affirm {
    display: inline-block;
    padding: 3px;
    background-color: #feab25;
    font-size: 12px;
    color: #fff;
    margin-right: 4px;
  }
}
.form-item {
  width: 45%;
}
.test-case-content {
  display: flex;
  width: 100%;
  height: 100%;
}
.case_count {
  font-size: 14px;
  float: right;
  margin: 10px 0 0 0;
  &::after {
    content: '';
    clear: both;
  }
}
:deep(.splitpanes__splitter) {
  background-color: var(--my-bg-color-2) !important;
  border-left:1px solid var(--el-border-color) !important;
}
:deep(.splitpanes.default-theme .splitpanes__splitter:before),
:deep(.splitpanes.default-theme .splitpanes__splitter:after){
  background-color: var(--my-text-bg-color);
}
.splitpanes {
  height: calc(100% - 25px);
}
.splitpanes__pane {
  border-radius: 3px;
}
:deep(.docx-wrapper) {
  background-color: var(--my-bg-color-4);
}
:deep(.docx-wrapper > section.docx) {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  background-color: var(--my-bg-color);
}
.show_word {
  width: 0 !important;
}
.el-badge {
  --el-badge-size: 14px;
  --el-badge-bg-color: #0095d9;
  cursor: pointer;
}
:deep(.el-badge__content--danger) {
  background-color: #0095d9;
}
.suggest_ul {
  list-style: none;
  padding-left: 0;
  li {
    display: flex;
    img {
      width: 14px;
      height: 14px;
      margin: 3px 5px 0 0;
    }
  }
}
.icon-jiqiren_o {
  cursor: pointer;
}
.pane {
  overflow: auto;
}
:deep(.splitpanes.default-theme .splitpanes__pane){
  background-color: var(--my-bg-color-4);
}
:deep(.docx) {
    color: var(--my-text-bg-color-3);
}
</style>

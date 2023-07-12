<template>
  <div class="test_case">
    <caseMenu @handleMenu="handleMenu"></caseMenu>
    <div class="test-case-content">
      <div class="tree-box">
        <el-scrollbar :height="treeHeight">
          <el-tree :data="treeData.list" :show-checkbox="showCheckout" ref="treeRef" @node-click="handleTree">
            <template #default="{ node, data }">
              <span class="custom-tree-node">
                <span v-if="data.params && !data.params.confirm2" class="affirm">待确认</span>
                <span>{{ node.label }}</span>
              </span>
            </template>
          </el-tree>
        </el-scrollbar>
      </div>
      <div class="test_case_wrapper">
        <header class="header">测试用例</header>
        <el-scrollbar :height="areaHeight">
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
            <!-- 处理步骤 -->
            <div class="handle">
              <span class="handle_title">处理步骤</span>
              <el-button link @click="addFrom" :disabled="stepDisabled">
                <el-icon class="icon_add" size="20" :color="stepDisabled ? '' : '#0095d9'">
                  <CirclePlus />
                </el-icon>
              </el-button>
              <div class="handle_content">
                <el-form :inline="true" :model="formInline">
                  <el-form-item prop="caseName" label="用例名称" class="form-item">
                    <el-input v-model="formInline.caseName" :disabled="stepDisabled"></el-input>
                  </el-form-item>
                  <el-form-item prop="caseId" label="用例ID" class="form-item">
                    <el-input v-model="formInline.caseId" :disabled="stepDisabled"></el-input>
                  </el-form-item>
                  <el-table :data="formInline.suppContact" :max-height="tableHeight">
                    <el-table-column
                      prop="id"
                      label="序号"
                      width="100"
                      type="index"
                      :index="(index) => index + 1"
                    ></el-table-column>
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
              <el-button class="enter_btn" type="primary" :disabled="disabledFlag" @click="confirmCase">确认</el-button>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
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
  </div>
</template>
<script setup>
import { Plus, Edit, Delete, CirclePlus } from '@element-plus/icons-vue'
import Cookies from 'js-cookie'
import { getToken } from '@/utils/auth'
import caseMenu from './caseMenu.vue'

const { proxy } = getCurrentInstance()

const userId = getToken()
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
        localStorage.setItem('trackingStatus', true)
        proxy.$modal.msgSuccess('提交成功')
      })
  }
}

const addFrom = () => {
  console.log(formInline)
  formInline.suppContact.push({
    operation: '',
    operand: '',
    operationInput: '',
  })
}
const handleTree = (node) => {
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
}
const remove = (row) => {
  const index = tableData.value.indexOf(row)
  tableData.value.splice(index, 1)
}
const confirmCase = () => {
  const res = []
  console.log(useCase.value);
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
const selectHandle = (e) => {
  tableData.value.forEach((item, index) => {
    if (item.id === formInline.caseId) {
      item.suppContact = formInline.suppContact
    }
    if (index === tableData.value.length - 1) {
      pushCase(treeData.list)
    }
  })
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

onMounted(() => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 478
    treeHeight.value = window.innerHeight - 150
    areaHeight.value = window.innerHeight - 190
  })
  window.addEventListener('resize', () => {
    tableHeight.value = window.innerHeight - 478
    treeHeight.value = window.innerHeight - 150
    areaHeight.value = window.innerHeight - 190
  })
  proxy.$axios.getTestTree().then((res) => {
    // console.log(res);
    treeData.list = res.data
  })
})
onUnmounted(() => {
  window.removeEventListener('resize', () => {})
})
</script>
<style lang="scss" scoped>
.test_case {
  margin: 0 8px;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-bottom: 14px;
}

.tree-box {
  width: 200px;
  height: calc(100% - 14px);
  .el-scrollbar {
    border-radius: 3px;
  }
}

.el-tree {
  color: #0e0e0e;
  display: flex;
  flex-wrap: wrap;
}

:deep(.el-tree-node) {
  flex: 1;
}

.el-scrollbar {
  box-shadow: 0px 0px 22px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

:deep(.el-tree-node__content) {
  height: 40px;
}

.test_case_wrapper {
  flex: 1;
  margin-left: 8px;
  border-radius: 3px;
  overflow: hidden;
  height: calc(100% - 14px);
  box-shadow: 0px 0px 22px rgba(0, 0, 0, 0.1);
}

.header {
  height: 40px;
  width: 100%;
  background-color: #b9ccff;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  text-align: center;
  line-height: 40px;
}

.content {
  padding: 10px 20px;
  background-color: #fff;
  border-radius: 0 0 3px 3px;
  height: calc(100% - 40px);
  position: relative;

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
  margin-top: 30px;
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
    border: 1px solid #dddcdc;
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
    border-radius: 4px;
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
}
</style>

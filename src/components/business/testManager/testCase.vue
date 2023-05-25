<template>
  <div class="test_case">
    <div class="tree-box">
      <el-scrollbar :height="treeHeight">
        <el-tree :data="treeData.list" @node-click="handleTree">
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span>{{ node.label }}</span>
            </span>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
    <div class="test_case_wrapper">
      <header class="header">测试用例</header>
      <div class="content">
        <div class="flex">
          <div class="item">
            <label>对应需求名称</label>
            <el-input v-model="formList.needName" :disabled="disabledFlag"></el-input>
          </div>
          <div class="item">
            <label>对应需求ID</label>
            <el-input v-model="formList.needId" :disabled="disabledFlag"></el-input>
          </div>
          <el-button class="button" type="info" :disabled="disabledFlag">
            <el-icon>
              <Plus />
            </el-icon>
            添加用例
          </el-button>
        </div>
        <el-table class="table" :data="tableData" border>
          <el-table-column align="center" prop="name" label="用例名称">
          </el-table-column>
          <el-table-column align="center" prop="id" label="用例ID">
          </el-table-column>
          <el-table-column align="center" label="操作" width="150">
            <template #default="scope">
              <el-button link @click="remove(scope.row)">
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
        <div class="handle">
          <span class="handle_title">处理步骤</span>
          <el-button link @click="addFrom" :disabled="disabledFlag">
            <el-icon class="icon_add" size="20" :color="disabledFlag ? '' : '#0095d9'">
              <CirclePlus />
            </el-icon>
          </el-button>
          <div class="handle_content">
            <el-form :inline="true" :model="formInline">
              <el-form-item prop="caseName" label="用例名称">
                <el-input v-model="formList.needName" :disabled="disabledFlag"></el-input>
              </el-form-item>
              <el-form-item prop="caseId" label="用例ID">
                <el-input v-model="formList.needName" :disabled="disabledFlag"></el-input>
              </el-form-item>
              <el-table :data="formInline.suppContact" :max-height="tableHeight">
                <el-table-column prop="id" label="序号" width="100" type="index"
                  :index="index => index + 1"></el-table-column>
                <el-table-column prop="operation" label="操作">
                  <template #default="scope">
                    <el-form-item :prop="'suppContact.' + scope.$index + '.operation'">
                      <el-select v-model="scope.row.operation" :disabled="disabledFlag">
                        <el-option label="" value=""></el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="operand" label="操作对象">
                  <template #default="scope">
                    <el-form-item :prop="'suppContact.' + scope.$index + '.operand'">
                      <el-select v-model="scope.row.operand" :disabled="disabledFlag">
                        <el-option label="" value=""></el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="operationInput" width="160">
                  <template #default="scope">
                    <el-form-item :prop="'suppContact.' + scope.$index + '.operationInput'">
                      <el-input v-model="scope.row.operationInput" :disabled="disabledFlag" class="operation_input"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Plus, Edit, Delete, CirclePlus } from '@element-plus/icons-vue'

const { proxy } = getCurrentInstance(0)

const treeData = reactive({
  list: []
})
const formList = ref({
  needName: '姿态自毁控制功能',
  needId: 'RQ_ZTZHKZGN'
})
const tableData = ref([
  // {
  //   name: '',
  //   id: ''
  // }
])
const disabledFlag = ref(true) // 目前禁用所有可修改项
const tableHeight = ref(0)
const treeHeight = ref(0)
const formInline = reactive({
  suppContact: [],
  caseName: '',
  caseId: ''
})
const addFrom = () => {
  formInline.suppContact.push({
    operation: '',
    operand: '',
    operationInput: ''
  })
}
const handleTree = (node) => {
  console.log(node);
}

onMounted(() => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 478
    treeHeight.value = window.innerHeight - 150
  })
  window.addEventListener('resize', () => {
    tableHeight.value = window.innerHeight - 478
    treeHeight.value = window.innerHeight - 150
  })
  proxy.$axios.getTestTree().then((res) => {
    console.log(res);
    treeData.list = res.data
  })
})
onUnmounted(() => {
  window.removeEventListener('resize', () => { })
})
</script>
<style lang="scss" scoped>
.test_case {
  margin: 0 20px;
  border-radius: 8px;
  display: flex;
  height: 100%;
  padding-bottom: 14px;
}

.tree-box {
  width: 200px;
  height: calc(100% - 76px);
}
.el-tree{
  color: #0e0e0e;
  display: flex;
  flex-wrap: wrap;
}
:deep(.el-tree-node){
  flex: 1;
}
.el-scrollbar {
  border-radius: 8px;
  box-shadow: 0px 0px 22px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

:deep(.el-tree-node__content) {
  height: 40px;
}

.test_case_wrapper {
  flex: 1;
  margin-left: 20px;
  border-radius: 8px;
  overflow: hidden;
  height: calc(100% - 76px);
  box-shadow: 0px 0px 22px rgba(0, 0, 0, 0.1);
}

.header {
  height: 40px;
  width: 100%;
  background-color: #3572e3;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  text-align: center;
  line-height: 40px;
}

.content {
  padding: 10px 20px;
  background-color: #fff;
  border-radius: 0 0 8px 8px;
  height: 100%;

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
</style>

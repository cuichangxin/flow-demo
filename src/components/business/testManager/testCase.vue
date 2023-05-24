<template>
  <div class="test_case">
    <div class="tree-box">
      <el-scrollbar :height="treeHeight">
        <el-tree :data="treeData.list"></el-tree>
      </el-scrollbar>
    </div>
    <div class="test_case_wrapper">
      <header class="header">测试用例</header>
      <div class="content">
        <div class="flex">
          <div class="item">
            <label>对应需求名称</label>
            <el-input v-model="formList.needName"></el-input>
          </div>
          <div class="item">
            <label>对应需求ID</label>
            <el-input v-model="formList.needId"></el-input>
          </div>
          <el-button class="button" type="info">
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
          <el-icon class="icon_add" size="20" color="#0095d9" @click="addFrom">
            <CirclePlus />
          </el-icon>
          <div class="handle_content">
            <el-form :inline="true" :model="formInline">
              <el-form-item prop="caseName" label="用例名称">
                <el-input v-model="formList.needName"></el-input>
              </el-form-item>
              <el-form-item prop="caseId" label="用例ID">
                <el-input v-model="formList.needName"></el-input>
              </el-form-item>
              <el-table :data="formInline.suppContact" :max-height="tableHeight">
                <el-table-column prop="id" label="序号" width="100" type="index"
                  :index="index => index + 1"></el-table-column>
                <el-table-column prop="operation" label="操作">
                  <template #default="scope">
                    <el-form-item :prop="'suppContact.' + scope.$index + '.operation'">
                      <el-select v-model="scope.row.operation">
                        <el-option label="" value=""></el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="operand" label="操作对象">
                  <template #default="scope">
                    <el-form-item :prop="'suppContact.' + scope.$index + '.operand'">
                      <el-select v-model="scope.row.operand">
                        <el-option label="" value=""></el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="operationInput" width="160">
                  <template #default="scope">
                    <el-form-item :prop="'suppContact.' + scope.$index + '.operationInput'">
                      <el-input v-model="scope.row.operationInput" class="operation_input"></el-input>
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
import { nextTick } from 'vue';

const treeData = reactive({
  list: [
    {
      label: '功能需求',
      id: '1',
      children: [
        {
          id: '1-1',
          label: '制导控制模块处理功能',
          children: [
            {
              id: '1-1-1',
              label: '射前准备段功能',
              children: []
            },
            {
              id: '1-1-2',
              label: '助推飞行段功能',
              children: []
            },
            {
              id: '1-1-3',
              label: '芯一级飞行段功能',
              children: []
            },
            {
              id: '1-1-4',
              label: '舱箭分离及后续飞行段',
              children: []
            },
            {
              id: '1-1-5',
              label: '遥测数据文件要求',
              children: []
            },
            {
              id: '1-1-6',
              label: '制导系统模拟飞行功能',
              children: []
            },
            {
              id: '1-1-7',
              label: '制导系统飞行软件工作',
              children: []
            },
            {
              id: '1-1-8',
              label: '制导周期功能',
              children: []
            },
            {
              id: '1-1-9',
              label: '制导系统诸元要求',
              children: []
            },
          ]
        },
        {
          id: '1-2',
          label: '姿态控制模块处理功能',
          children: [
            {
              id: '1-2-1',
              label: '通用数据处理要求',
              children: [
                {
                  id: '1-2-1-1',
                  label: '姿态角简单计算',
                  children: []
                },
                {
                  id: '1-2-1-2',
                  label: '姿态角偏差计算',
                  children: []
                },
                {
                  id: '1-2-1-3',
                  label: '程序角计算',
                  children: []
                },
                {
                  id: '1-2-1-4',
                  label: '姿态增益计算',
                  children: []
                },
                {
                  id: '1-2-1-5',
                  label: '姿态网络计算',
                  children: []
                },
              ]
            },
            {
              id: '1-2-2',
              label: '姿控助推控制功能',
              children: []
            },
            {
              id: '1-2-3',
              label: '姿控一级控制功能',
              children: []
            },
            {
              id: '1-2-4',
              label: '姿控模飞要求功能',
              children: []
            },
            {
              id: '1-2-5',
              label: '下传特征诸元要求',
              children: []
            },
            {
              id: '1-2-6',
              label: '姿控控制功能',
              children: []
            },
            {
              id: '1-2-7',
              label: '姿控诸元要求',
              children: []
            },
          ]
        },
        {
          id: '1-3',
          label: '综合控制模块处理功能',
          children: [
            {
              id: '1-3-1',
              label: '综合模块数据录入功能',
              children: []
            },
            {
              id: '1-3-2',
              label: '综合模块数据输出功能',
              children: []
            },
            {
              id: '1-3-3',
              label: '姿态自毁控制',
              children: []
            },
            {
              id: '1-3-4',
              label: 'CRC循环自检',
              children: []
            },
            {
              id: '1-3-5',
              label: '助推耗尽关机',
              children: []
            },
            {
              id: '1-3-6',
              label: '程序运行指示控制功能',
              children: []
            },
            {
              id: '1-3-7',
              label: 'AD转换控制功能',
              children: []
            },
            {
              id: '1-3-8',
              label: '计算机遥测字处理功能',
              children: []
            },
            {
              id: '1-3-9',
              label: '综合遥测控制功能',
              children: []
            },
            {
              id: '1-3-10',
              label: '点名自检处理功能',
              children: []
            },
            {
              id: '1-3-11',
              label: '信号处理功能',
              children: []
            },
            {
              id: '1-3-12',
              label: '确定当前工作的总线',
              children: []
            },
            {
              id: '1-3-13',
              label: '综合模飞软件要求',
              children: []
            },
          ]
        },
      ]
    },
    {
      label: '性能需求',
      id: '2',
      children: [
        {
          id: '2-1',
          label: '定时切换的时间误差≤40ms',
          children: []
        }
      ]
    },
    {
      label: '安全性需求',
      id: '3',
      children: [
        {
          id: '3-1',
          label: '三取二及取中间值功能',
          children: [
            {
              id: '3-1-1',
              label: '对三机信号、转段标志',
              children: []
            },
            {
              id: '3-1-2',
              label: '对接收指令、制导段标',
              children: []
            },
            {
              id: '3-1-3',
              label: '对三机开算、点火、起飞',
              children: []
            },
            {
              id: '3-1-4',
              label: '起飞时刻制导初始化时间',
              children: []
            },
          ]
        },
        {
          id: '3-2',
          label: '信号滤波处理',
          children: [
            {
              id: '3-2-1',
              label: '开算信号，要求连续查',
              children: []
            },
            {
              id: '3-2-2',
              label: '点火信号，要求连续查',
              children: []
            },
            {
              id: '3-2-3',
              label: '起飞信号，要求连续查',
              children: []
            },
          ]
        },
      ]
    },
    {
      label: '可靠性需求',
      id: '4',
      children: [
        {
          id: '4-1',
          label: '制导控制模块处理功能',
          children: []
        }
      ]
    },
  ]
})
const formList = ref({
  needName: '姿态自毁控制功能',
  needId: 'RQ_ZTZHKZGN'
})
const tableData = ref([
  {
    name: '',
    id: ''
  }
])
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
onMounted(() => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 478
    treeHeight.value = window.innerHeight - 150
  })
  window.addEventListener('resize', () => {
    tableHeight.value = window.innerHeight - 478
    treeHeight.value = window.innerHeight - 150
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
  border-radius: 8px;
  overflow: auto;
  /* height: calc(96% - 42px); */
  height: calc(100% - 76px);
}

.el-scrollbar {
  box-shadow: 0px 0px 22px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

:deep(.el-tree-node__children) {
  /* display: inline-block !important; */
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
  cursor: pointer;
}
</style>

<template>
  <div class="table_control" :class="{ out: isOut }">
    <div class="button_box" :class="{ op: isOut }">
      <el-radio-group v-model="tabPosition">
        <el-radio-button label="1">属性</el-radio-button>
        <el-radio-button label="2">需求追踪</el-radio-button>
        <el-radio-button label="3">飞行段定义</el-radio-button>
      </el-radio-group>
    </div>
    <!-- 属性 -->
    <div v-if="!isOut">
      <div v-show="tabPosition == 1" class="table_box">
        <el-scrollbar class="scroll">
          <table class="table">
            <thead>
              <tr>
                <th class="th" width="20%">属性</th>
                <th class="th" width="25%">值</th>
                <th class="th" width="20%">属性</th>
                <th class="th" width="25%">值</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th class="label">任务名称</th>
                <th @click="edit(5)">
                  <span v-show="hideInput != 5">{{ tableData.taskName }}</span>
                  <el-input
                    v-show="hideInput == 5"
                    size="small"
                    placeholder="请输入内容"
                    v-model="tableData.taskName"
                    clearable
                    @keyup.enter.native="(e) => enter(5, 'taskName')"
                    @blur="blur"
                    :ref="inputRef"
                  >
                  </el-input>
                </th>
                <th class="label">最长执行时间</th>
                <th @click="edit(0)">
                  <span v-show="hideInput != 0">{{ tableData.langTime }}</span>
                  <el-input
                    v-show="hideInput == 0"
                    size="small"
                    placeholder="请输入内容"
                    v-model="tableData.langTime"
                    clearable
                    @keyup.enter.native="(e) => enter(0, 'langTime')"
                    @blur="blur"
                    :ref="inputRef"
                  >
                  </el-input>
                </th>
              </tr>
              <tr>
                <th class="label">描述</th>
                <th @click="edit(3)">
                  <span v-show="hideInput != 3">{{ tableData.desc }}</span>
                  <el-input
                    v-show="hideInput == 3"
                    size="small"
                    placeholder="请输入内容"
                    v-model="tableData.desc"
                    clearable
                    @keyup.enter.native="(e) => enter(3, 'desc')"
                    @blur="blur"
                    :ref="inputRef"
                  >
                  </el-input>
                </th>
                <th class="label">开始时间</th>
                <th @click="edit(1)">
                  <span v-show="hideInput != 1">{{ tableData.startTime }}</span>
                  <el-input
                    v-show="hideInput == 1"
                    size="small"
                    placeholder="请输入内容"
                    v-model="tableData.startTime"
                    clearable
                    @keyup.enter.native="(e) => enter(1, 'startTime')"
                    @blur="blur"
                    :ref="inputRef"
                  >
                  </el-input>
                </th>
              </tr>
              <tr>
                <th class="label">优先级</th>
                <th @click="edit(4)">
                  <span v-show="hideInput != 4">{{ tableData.prec }}</span>
                  <el-input
                    v-show="hideInput == 4"
                    size="small"
                    placeholder="请输入内容"
                    v-model="tableData.prec"
                    clearable
                    @keyup.enter.native="(e) => enter(4, 'prec')"
                    @blur="blur"
                    :ref="inputRef"
                  >
                  </el-input>
                </th>
                <th class="label">结束时间</th>
                <th @click="edit(2)">
                  <span v-show="hideInput != 2">{{ tableData.endTime }}</span>
                  <el-input
                    v-show="hideInput == 2"
                    size="small"
                    placeholder="请输入内容"
                    v-model="tableData.endTime"
                    clearable
                    @keyup.enter.native="(e) => enter(2, 'endTime')"
                    @blur="blur"
                    :ref="inputRef"
                  >
                  </el-input>
                </th>
              </tr>
              <tr>
                <th class="label">函数名称</th>
                <th @click="edit(6)">
                  <span v-show="hideInput != 6">{{ tableData.funName }}</span>
                  <el-input
                    v-show="hideInput == 6"
                    size="small"
                    placeholder="请输入内容"
                    v-model="tableData.funName"
                    clearable
                    @keyup.enter.native="(e) => enter(6, 'funName')"
                    @blur="blur"
                    :ref="inputRef"
                  >
                  </el-input>
                </th>
                <th></th>
                <th></th>
              </tr>
            </tbody>
          </table>
        </el-scrollbar>
      </div>
    </div>

    <!-- 需求追踪 -->
    <div v-if="!isOut">
      <div v-show="tabPosition == 2" class="need_box">
        <div class="top_add">
          <i class="iconfont icon" @click="dialogVisible = true">&#xe683;</i>
        </div>
        <el-table
          :data="needList"
          height="180"
          border
          :cell-style="tableCellStyle"
          :header-cell-style="tableHeaderCellStyle"
        >
          <el-table-column prop="id" label="需求ID"> </el-table-column>
          <el-table-column prop="label" label="需求名称"> </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template #default>
              <div class="butn">
                <el-button link @click="remove(scope.row)">
                  <el-icon size="20" color="red"><Delete /></el-icon>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 飞行段定义 -->
    <div v-if="!isOut">
      <div v-show="tabPosition == 3" class="fight_box">
        <div class="top_add">
          <i class="iconfont icon" @click="addFly">&#xe683;</i>
        </div>
        <el-table
          :data="flyList"
          height="180"
          border
          :cell-style="tableCellStyle"
          :header-cell-style="tableHeaderCellStyle"
        >
          <el-table-column prop="title" label="飞行段名称" />
          <el-table-column prop="sTime" label="开始时间" />
          <el-table-column prop="eTime" label="结束时间" />
          <el-table-column label="操作" width="130">
            <template #default="scope">
              <div class="butn">
                <el-button link @click="handleEdit(scope.row, 'update')">
                  <el-icon color="#0069f3" size="20"><Edit /></el-icon>
                </el-button>
                <el-button link @click="flyRemove(scope.row)">
                  <el-icon color="red" size="20"><Delete /></el-icon>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <markPoint :isOut="isOut" :direction="'top'" :color="'#fff'" @hideMenu="hideMenu"></markPoint>
  </div>

  <!-- 弹窗 -->
  <el-dialog title="需求追踪" v-model="dialogVisible">
    <el-table :data="dialogNeedList" border @selection-change="handleSelectionChange" :ref="(el) => (tableRef = el)">
      <el-table-column type="selection" width="55" :selectable="checkSelectable"> </el-table-column>
      <el-table-column prop="id" label="需求ID"> </el-table-column>
      <el-table-column prop="label" label="需求名称" width="400"> </el-table-column>
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="callOff">取 消</el-button>
        <el-button type="primary" @click="needEn">确 定</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 表单 -->
  <el-drawer title="飞行段定义" v-model="drawer">
    <div class="form_box">
      <el-form
        :ref="(el) => (formRef = el)"
        :rules="flyRules"
        :hide-required-asterisk="true"
        :model="form"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="飞行段名称" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="sTime">
          <el-input v-model="form.sTime"></el-input>
        </el-form-item>
        <el-form-item label="结束时间" prop="eTime">
          <el-input v-model="form.eTime"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确 定</el-button>
          <el-button @click="drawerOff">取 消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-drawer>
</template>
<script setup>
import _ from 'lodash'
import markPoint from '../../common/mark/markPoiner.vue'
import { Delete, Edit } from '@element-plus/icons-vue'

const instance = getCurrentInstance()

const timeReg = /^([-+])?\d{1,}s|ms|S/
var checkSTime = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入开始时间'))
  } else if (!timeReg.test(value)) {
    return callback(new Error('请输入正确的时间'))
  } else {
    callback()
  }
}
var checkETime = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入结束时间'))
  } else if (!timeReg.test(value)) {
    return callback(new Error('请输入正确的时间'))
  } else {
    callback()
  }
}

const inputRef = (el) => {
  if (el) {
    el.focus()
    el.select()
  }
}

const formRef = ref(null)
const tableRef = ref(null)
const tableData = ref({
  langTime: '', // 最长执行时间
  startTime: '', // 开始时间
  endTime: '', // 结束时间
  desc: '', // 描述
  prec: '', // 优先级
  w: '', // 宽度
  left: '', // 左边距离
  taskName:'',
  funName:''
})
const hideInput = ref(null)
const tabPosition = ref(1)
// 需求追踪列表
const needList = ref([])
// 需求追踪弹窗列表
const dialogNeedList = ref([
  {
    serial: 1,
    id: 'RQ_CXJJS',
    label: '程序角计算',
  },
  {
    serial: 2,
    id: 'RQ_ZYJS',
    label: '姿态增益计算',
  },
  {
    serial: 3,
    id: 'RQ_WLJS',
    label: '姿态网络计算',
  },
])
const dialogVisible = ref(false)
const selectNeedList = ref([]) // 选中的需求
const flyList = ref([])
const drawer = ref(false)
const form = ref({
  title: '',
  sTime: '',
  eTime: '',
})
const typeStatus = ref('')
const flyRules = ref({
  title: [{ required: true, message: '请输入飞行段名称', trigger: 'blur' }],
  sTime: [{ validator: checkSTime, trigger: 'blur' }],
  eTime: [{ validator: checkETime, trigger: 'blur' }],
})
const isflag = ref(true)
const isOut = ref(false)
const elInformation = ref({})

instance.proxy.$bus.on('*', (name, val) => {
  if (name === 'showCellData') {
    const data = val
    data.store.data.data.y = data.store.data.position.y
    tableData.value = data.store.data.data
    tableData.value.oldEndTime = tableData.value.endTime
    elInformation.value = val
    if (Object.prototype.hasOwnProperty.call(val.data, 'needList')) {
      needList.value = val.data.needList
    } else {
      needList.value = []
    }
  }
  if (name === 'flightChange') {
    flyList.value.forEach((item) => {
      if (val.store.data.data.id === item.id) {
        item.sTime = val.store.data.position.x + 's'
        item.eTime = val.store.data.position.x + val.store.data.size.width + 's'
      }
    })
  }
})

const edit = (value) => {
  if (isflag.value) {
    document.onkeydown = null
    hideInput.value = value
  }
}
// 节点更新修改数据
const formatData = (val) => {
  if (val == 1) {
    // val为1调整节点x和width
    const changeX = parseFloat(tableData.value.startTime)
    if (tableData.value.x > changeX) {
      tableData.value.width = Math.abs(changeX - tableData.value.x) + tableData.value.width
    } else {
      tableData.value.width = tableData.value.width - (changeX - tableData.value.x)
    }
    tableData.value.x = parseFloat(tableData.value.startTime)
  } else {
    // 否则修改width
    const changeW = parseFloat(tableData.value.endTime)
    if (changeW > tableData.value.width) {
      tableData.value.width = tableData.value.width + (changeW - tableData.value.x - tableData.value.width)
    } else {
      tableData.value.width = tableData.value.width - (tableData.value.width - (changeW - tableData.value.x))
    }
  }
  elInformation.value.store.data.data = tableData.value
  instance.proxy.$bus.emit('changeCell', elInformation.value)
}
const enter = (val, code) => {
  changeData(val, code)
}
const blur = () => {
  hideInput.value = null
}
const changeData = (val, code) => {
  isflag.value = false
  if (val == 0) {
    if (tableData.value.langTime !== '' && !timeReg.test(tableData.value.langTime)) {
      instance.proxy.$modal.msgWarning('时间格式错误')
      return
    }
  } else if (val == 1) {
    if (!timeReg.test(tableData.value.startTime)) {
      instance.proxy.$modal.msgWarning(tableData.value.startTime !== '' ? '时间格式错误' : '请输入内容')
      return
    }
  } else if (val == 2) {
    if (!timeReg.test(tableData.value.endTime)) {
      instance.proxy.$modal.msgWarning(tableData.value.startTime !== '' ? '时间格式错误' : '请输入内容')
      return
    }
  }
  isflag.value = true
  hideInput.value = null
  formatData(val, code)
}
const tableCellStyle = () => {
  return {
    'border-color': '#ececec',
  }
}
const tableHeaderCellStyle = () => {
  return {
    'border-color': '#ececec',
  }
}
const addFly = () => {
  typeStatus.value = 'add'
  drawer.value = true
}
const remove = (row) => {
  needList.value.forEach((item, index) => {
    if (item.id == row.id) {
      needList.value.splice(index, 1)
    }
  })
  tableData.value.needList = needList.value
  formatData()
}
const handleSelectionChange = (val) => {
  selectNeedList.value = val
}
const checkSelectable = (row) => {
  const allowedIds = needList.value.map((e) => {
    return e.id
  })
  return !allowedIds.includes(row.id)
}
// 添加需求追踪
const needEn = () => {
  if (needList.value.length) {
    const needAllow = needList.value.map((e) => {
      return e.id
    })
    selectNeedList.value.forEach((d) => {
      if (!needAllow.includes(d.id)) {
        needList.value.push(d)
      }
    })
  } else {
    needList.value = _.cloneDeep(selectNeedList.value)
  }
  tableData.value.needList = needList.value
  tableRef.value.clearSelection()
  formatData()
  dialogVisible.value = false
}
const callOff = () => {
  tableRef.value.clearSelection()
  dialogVisible.value = false
}
const onSubmit = () => {
  formRef.value.validate((val) => {
    if (val) {
      const x = parseFloat(form.value.sTime)
      const endTime = parseFloat(form.value.eTime)
      if (typeStatus.value == 'update') {
        form.value.x = x
        form.value.width = endTime - x
        flyList.value.forEach((item) => {
          if (item.id == form.value.id) {
            item.title = form.value.title
            item.sTime = form.value.sTime
            item.eTime = form.value.eTime
            item.width = form.value.width
          }
        })
      } else {
        form.value.id = Date.now() + '' + Math.ceil(Math.random() * 1000)
        form.value.x = x
        form.value.y = 440
        form.value.width = endTime - x
        flyList.value.push(form.value)
      }
      instance.proxy.$bus.emit('setFlyData', { action: typeStatus.value, form: form.value })
      form.value = {
        title: '',
        sTime: '',
        eTime: '',
      }
      drawer.value = false
    } else {
      return false
    }
  })
}
const drawerOff = () => {
  form.value = {
    title: '',
    sTime: '',
    eTime: '',
  }
  drawer.value = false
}
const handleEdit = (row, type) => {
  document.onkeydown = null
  typeStatus.value = type
  drawer.value = true
  form.value = { ...row }
}
const flyRemove = (row) => {
  let forms = { ...row }
  flyList.value.forEach((item, index) => {
    if (item.title == row.title) {
      flyList.value.splice(index, 1)
    }
  })
  instance.proxy.$bus.emit('setFlyData', { action: 'remove', form: forms })
}
const hideMenu = (val) => {
  isOut.value = val
  instance.proxy.$bus.emit('sendOut', isOut.value)
}

const handleToolMenu = (target, val) => {
  if (val === '格式') {
    hideMenu(target)
  }
}
defineExpose({ handleToolMenu })
watchEffect(() => {
  if (tabPosition.value == 3) {
    let fly = localStorage.getItem('flyData')
    if (fly) {
      flyList.value = JSON.parse(fly)
      console.log(flyList.value)
    }
  }
})
</script>
<style lang="scss" scoped>
.table_control {
  width: 100%;
  height: 220px;
  position: relative;
  transition: height 0.2s linear;

  &:hover {
    .click {
      opacity: 1;
    }
  }
  &.out {
    height: 0;
  }

  .table_box {
    width: 100%;
    height: 181px;
    background: #fff;
    border-radius: 3px;
    display: flex;
    padding: 10px;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);

    .table {
      width: 100%;
      border-collapse: collapse;

      th {
        height: 40px;
        text-align: left;
        padding-left: 4px;
        font-weight: normal;
        font-size: 13px;

        span {
          color: #606266;
        }
      }

      .th {
        font-weight: 600;
        background-color: #f5f7fa;
        height: 40px;
        font-size: 13px;
      }

      table,
      th,
      td {
        border: 1px solid #dddcdc;
      }

      .label {
        background-color: #ecedef;
      }
    }
    .scroll{
      width: 100%;
    }
  }

  .need_box {
    /* width: 100%; */
    /* height: calc(100% - 96px); */
    min-height: 204px;
    background: #fff;
    border-radius: 3px;
    padding: 0 5px;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);

    .top_add {
      float: right;

      .icon {
        color: #518edf;
        font-weight: bold;
        font-size: 19px;
        margin: 8px 16px 0 0;
        cursor: pointer;
      }
    }

    :deep(thead) {
      color: #333;
    }

    :deep(.el-table--border) {
      border-color: #ececec;
    }

    :deep(.el-table::before) {
      background-color: #ececec;
    }

    :deep(.el-table--border::after) {
      background-color: #ececec;
    }

    .butn {
      .el-button {
        span {
          .icon {
            font-size: 19px;
            font-weight: bold;
            color: red;
          }
        }
      }
    }
  }

  .fight_box {
    width: 100%;
    /* height: calc(100% - 96px); */
    min-height: 204px;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
    background: #fff;
    border-radius: 3px;
    padding: 0 5px;

    .top_add {
      float: right;

      .icon {
        color: #518edf;
        font-weight: bold;
        font-size: 19px;
        margin: 8px 16px 0 0;
        cursor: pointer;
      }
    }

    :deep(thead) {
      color: #333;
    }

    .butn {
      .el-button {
        span {
          .icon {
            font-size: 19px;
            font-weight: bold;
          }
        }

        &:nth-child(2) {
          span {
            .icon {
              font-size: 19px;
              font-weight: bold;
              color: red;
            }
          }
        }
      }
    }
  }

  .form_box {
    padding: 0 10px;
  }

  .button_box {
    &.op {
      display: none;
    }
  }
}
</style>

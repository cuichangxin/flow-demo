<template>
  <div class="model_table" :class="{ fade: isOut }">
    <div class="button_box">
      <el-tabs v-model="tabPosition" type="card" class="tabs-box">
        <el-tab-pane label="属性" name="1"></el-tab-pane>
        <el-tab-pane label="需求追踪" name="2"></el-tab-pane>
      </el-tabs>
      <!-- <el-radio-group v-model="tabPosition">
        <el-radio-button label="1">属性</el-radio-button>
        <el-radio-button label="2">需求追踪</el-radio-button>
      </el-radio-group> -->
    </div>
    <div class="table_box" :style="{ alignItems: tabPosition == 1 ? 'center' : '' }">
      <table v-show="tabPosition == 1" class="table">
        <tr>
          <th class="th" width="20%">属性</th>
          <th class="th" width="25%">值</th>
          <th class="th" width="20%">属性</th>
          <th class="th" width="25%">值</th>
        </tr>
        <tr>
          <th class="label">算法名称</th>
          <th @click="edit(0)">
            <span v-show="hideInput != 0">{{ config.label }}</span>
            <el-input
              v-show="hideInput == 0"
              size="small"
              :ref="inputRef"
              placeholder="请输入内容"
              v-model="config.label"
              clearable
              @keyup.enter.native="(e) => enter(0, '')"
              @blur="(e) => blur(0, e)"
            >
            </el-input>
          </th>
          <th class="label">描述 <i v-if="showSuggest" class="iconfont icon-jiqiren_o" @click="openSuggest"></i></th>
          <th @click="edit(1)">
            <span v-show="hideInput != 1">{{ config.desc }}</span>
            <el-input
              v-show="hideInput == 1"
              size="small"
              :ref="inputRef"
              placeholder="请输入内容"
              v-model="config.desc"
              clearable
              @keyup.enter.native="(e) => enter(1, '')"
              @blur="(e) => blur(1, e)"
            >
            </el-input>
          </th>
        </tr>
        <tr>
          <th class="label">输入 <i v-if="showSuggest" class="iconfont icon-jiqiren_o" @click="openSuggest"></i></th>
          <th @click="edit(2)">
            <span v-show="hideInput != 2">{{ config.input }}</span>
            <el-input
              v-show="hideInput == 2"
              size="small"
              :ref="inputRef"
              placeholder="请输入内容"
              v-model="config.input"
              clearable
              @keyup.enter.native="(e) => enter(2, '')"
              @blur="(e) => blur(2, e)"
            >
            </el-input>
          </th>
          <th></th>
          <th></th>
        </tr>
        <tr>
          <th class="label">输出 <i v-if="showSuggest" class="iconfont icon-jiqiren_o" @click="openSuggest"></i></th>
          <th @click="edit(3)">
            <span v-show="hideInput != 3">{{ config.output }}</span>
            <el-input
              v-show="hideInput == 3"
              size="small"
              :ref="inputRef"
              placeholder="请输入内容"
              v-model="config.output"
              clearable
              @keyup.enter.native="(e) => enter(3, '')"
              @blur="(e) => blur(3, e)"
            >
            </el-input>
          </th>
          <th></th>
          <th></th>
        </tr>
      </table>
      <!-- 需求追踪 -->
      <div v-show="tabPosition == 2" class="track">
        <div class="top_add">
          <i class="iconfont icon" @click="dialogVisible = true">&#xe683;</i>
        </div>
        <el-table :data="trackList" border style="width: 100%">
          <el-table-column prop="id" label="需求ID"></el-table-column>
          <el-table-column prop="label" label="需求名称"></el-table-column>
          <el-table-column label="操作" width="100">
            <template #default>
              <el-button link @click="remove(scope.row)">
                <el-icon size="20" color="red">
                  <Delete />
                </el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <markPoint class="mark" :isOut="isOut" :direction="'top'" :color="'#fff'" @hideMenu="hideMenu"></markPoint>

    <!-- 需求追踪添加 -->
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
    <Dialog title="智能辅助" :width="'40%'" :hidden-full-btn="false" v-model="visible" @confirm="handleConfirm" @close="handleClose">
      <el-tabs v-model="activeName">
        <el-tab-pane label="建议" name="suggest">
          <ul class="suggest_ul">
            <li>
              <!-- <img src="../../../assets/image/shengdantubiao-05.png" alt="" /> -->
              <p>针对限幅处理输出值，为您搜索到以下建议:</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;助推级的限幅值最大值不超过：1.5*π/180</p>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="历史案例" name="case">
          <el-tabs v-model="caseName">
            <el-tab-pane label="xxx案例" name="langFive">
              <ul class="suggest_ul">
                <li>
                  <!-- <img src="../../../assets/image/shengdantubiao-05.png" alt="" /> -->
                  该案例下助推级的限幅值最大值不超过：1.4*π/180
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
import _ from 'lodash'
import markPoint from '../../common/mark/markPoiner.vue'
import { Delete } from '@element-plus/icons-vue'
import Dialog from '../../common/dialog/dialog.vue'
import useDialog from '../../../hooks/useDialog'

const instance = getCurrentInstance()
const { visible: visible, openDialog: openDialog, closeDialog: closeDialog } = useDialog()

instance.proxy.$bus.on('*', (name, val) => {
  if (name === 'tableConfig') {
    // 属性表格 需求追踪配置项
    config.value = val
    config.value.label = val.attrs.text.text
    config.value.oldLabel = val.attrs.text.text
    if (val?.trackList) {
      trackList.value = val.trackList
    } else {
      trackList.value = []
    }
  }
  if (name === 'contraction') {
    isOut.value = val
  }
  if (name === 'regen') {
    config.value = {}
  }
  if (name === 'showAi') {
    showSuggest.value = !showSuggest.value
  }
})
const activeName = ref('suggest')
const caseName = ref('langFive')

const tabPosition = ref('1')
const hideInput = ref(null)
const config = ref({})
const trackList = ref([])
const dialogVisible = ref(false)
const selectList = ref([])
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
const showSuggest = ref(false)
const isNext = ref(true)

const inputRef = (el) => {
  if (el) {
    el.focus()
    el.select()
  }
}
const tableRef = ref(null)
const isOut = ref(false)

const edit = (val) => {
  if (isNext.value) {
    hideInput.value = val
    isNext.value = false
  }
}
const enter = () => {
  format()
}
const blur = () => {
  format()
}
const format = () => {
  if (config.value.label == '') {
    isNext.value = false
    instance.proxy.modal.msgWarning('请输入名称')
  } else {
    trackList.value = _.cloneDeep(config.value.trackList)
    instance.proxy.$bus.emit('updateNode', config.value) // 更新节点信息并且保存数据到左侧树中
    isNext.value = true
    hideInput.value = null
  }
}
const handleSelectionChange = (val) => {
  selectList.value = val
}
const checkSelectable = (row) => {
  const allowedIds = trackList.value.map((e) => {
    return e.id
  })
  return !allowedIds.includes(row.id)
}
const callOff = () => {
  tableRef.value.clearSelection()
  dialogVisible.value = false
}
const needEn = () => {
  if (trackList.value.length) {
    const needAllow = trackList.value.map((e) => {
      return e.id
    })
    selectList.value.forEach((d) => {
      if (!needAllow.includes(d.id)) {
        trackList.value.push(d)
      }
    })
  } else {
    trackList.value = _.cloneDeep(selectList.value)
  }
  tableRef.value.clearSelection()
  config.value.trackList = trackList.value
  instance.proxy.$bus.emit('updateNode', config.value)
  dialogVisible.value = false
}
const remove = (row) => {
  trackList.value.forEach((item, index) => {
    if (item.id == row.id) {
      trackList.value.splice(index, 1)
    }
  })
  config.value.trackList = trackList.value
  instance.proxy.$bus.emit('updateNode', config.value)
}
const hideMenu = (val) => {
  isOut.value = val
  instance.proxy.$bus.emit('resize', isOut.value)
}
const openSuggest = () => {
  openDialog()
}
const handleConfirm = () => {
  closeDialog()
}
const handleClose = () => {
  closeDialog()
}
</script>
<style lang="scss" scoped>
.model_table {
  width: 100%;
  height: 220px;
  position: relative;
  z-index: 10;
  transition: height 0.2s linear;

  .table_box {
    width: 100%;
    height: 200px;
    background: var(--my-bg-color);
    border-radius: 3px;
    display: flex;
    padding: 10px;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);

    .table {
      width: 100%;
      height: 90%;
      border-collapse: collapse;

      th {
        height: 20px;
        text-align: left;
        padding-left: 6px;
        font-weight: normal;
        font-size: 13px;
        font-weight: 500;

        span {
          color: #606266;
        }
      }

      .label {
        background-color: var(--my-bg-color-4);
      }

      .th {
        font-weight: bold;
        background-color: var(--my-bg-color-4);
        height: 20px;
        font-size: 14px;
      }

      table,
      th,
      td {
        border: 1px solid var(--el-border-color);
      }
    }

    .track {
      width: 100%;

      .top_add {
        float: right;

        .icon {
          color: #518edf;
          font-weight: bold;
          font-size: 19px;
          margin: 0 6px 0 0;
          cursor: pointer;
        }
      }
    }

    :deep(thead) {
      color: #333;
    }
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

  &.fade {
    height: 0;
    margin-bottom: -10px;
  }

  &:hover {
    .click {
      opacity: 1;
    }
  }
}

.mark {
  bottom: 84.9% !important;
}
.icon-jiqiren_o {
  cursor: pointer;
  font-weight: 600;
  color: #3e4f66;
  &:hover {
    color: #518edf;
  }
}
.suggest_ul {
  list-style: none;
  padding-left: 0;
  li {
    /* display: flex; */
    color: #333;
    img {
      width: 14px;
      height: 14px;
      margin: 3px 5px 0 0;
    }
  }
}
:deep(.el-tabs__header){
  margin: 0;
}
:deep(.el-tabs){
  --el-tabs-header-height:33px; 
}
</style>

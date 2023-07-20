<template>
  <div class="tool_room" :style="{ height: `${toolH}px` }">
    <el-scrollbar class="tree_box">
      <el-tree
        :data="treeData.list"
        :highlight-current="true"
        node-key="name"
        default-expand-all
        @node-click="HandleTree"
      ></el-tree>
    </el-scrollbar>

    <el-scrollbar class="tool_room_wrapper">
      <header>
        <h1>{{ addToolFlag ? '集成工具' : toolDetailTarget ? toolDetailInfo.name : '平台类工具' }}</h1>
        <img v-if="toolDetailTarget" class="fh" src="../../../assets/image/fh.png" @click="back" />
      </header>
      <div v-if="!addToolFlag && !toolDetailTarget" class="tool_room_content">
        <div class="tool_room_content_item" v-for="(item, index) in toolList" :key="index" @click="toolDetail(item)">
          <img class="tool_room_content_item_img" :src="item.imgUrl" />
          <div class="tool_room_content_item_desc">
            <div class="flex">
              <span>名称:</span>
              <span>{{ item.name }}</span>
            </div>
            <div class="flex">
              <span>版本:</span>
              <span>{{ item.version }}</span>
            </div>
            <div class="flex">
              <span>厂商:</span>
              <span>{{ item.manufacturer }}</span>
            </div>
          </div>
        </div>
        <div class="tool_room_content_item extend" @click="addTool">
          <el-icon color="#bdbdbd" size="40">
            <Plus />
          </el-icon>
          <span>工具扩展</span>
        </div>
      </div>
      <div v-if="addToolFlag" class="add_tool">
        <el-form :model="toolForm" label-position="right" label-width="100px" ref="formRef" class="form_box">
          <el-form-item label="工具名称" prop="toolName">
            <el-input v-model="toolForm.toolName"></el-input>
          </el-form-item>
          <el-form-item label="工具版本" prop="toolVersion">
            <el-input v-model="toolForm.toolVersion"></el-input>
          </el-form-item>
          <el-form-item label="国别" prop="make">
            <el-input v-model="toolForm.make"></el-input>
          </el-form-item>
          <el-form-item label="工具类型" prop="toolType">
            <el-select v-model="toolForm.toolType">
              <el-option
                v-for="item in toolTypeList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="接口定义" prop="port">
            <el-button link class="icon_add" @click="addPort">
              <el-icon size="20" :color="'#0095d9'">
                <CirclePlus />
              </el-icon>
            </el-button>
            <el-table :data="toolForm.port">
              <el-table-column prop="feature" label="功能"></el-table-column>
              <el-table-column prop="portName" label="接口名称"></el-table-column>
              <el-table-column prop="input" label="输入"></el-table-column>
              <el-table-column prop="output" label="输出"></el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item class="last_child">
            <el-button type="info" class="call-off" @click="callOff('formRef')">取消</el-button>
            <el-button type="primary" @click="toolEnter('formRef')">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="toolDetailTarget" class="tool-detail">
        <div class="tool-detail_item">
          <p>工具名称</p>
          <span class="content">{{ toolDetailInfo.name }}</span>
        </div>
        <div class="tool-detail_item half" style="margin-right: 30px">
          <p>工具版本</p>
          <span class="content">{{ toolDetailInfo.version }}</span>
        </div>
        <div class="tool-detail_item half">
          <p>工具类型</p>
          <span class="content">{{ toolDetailInfo.type }}</span>
        </div>
        <div class="tool-detail_item half">
          <p>工具厂商</p>
          <span class="content">{{ toolDetailInfo.manufacturer }}</span>
        </div>
        <div class="tool-detail_item" style="height: auto">
          <p>功能简介</p>
          <span class="content introduce">{{ toolDetailInfo.desc }}</span>
        </div>
      </div>
    </el-scrollbar>
    <el-drawer title="接口定义" v-model="drawer">
      <el-form :model="portForm" label-position="right" label-width="100px" ref="portRef">
        <el-form-item label="功能" prop="feature" :required="true">
          <el-input v-model="portForm.feature"></el-input>
        </el-form-item>
        <el-form-item label="接口名称" prop="portName" :required="true">
          <el-input v-model="portForm.portName"></el-input>
        </el-form-item>
        <el-form-item label="输入" prop="input" :required="true">
          <el-input v-model="portForm.input"></el-input>
        </el-form-item>
        <el-form-item label="输出" prop="output" :required="true">
          <el-input v-model="portForm.output"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="info" class="call-off" @click="callOff('portRef')">取消</el-button>
          <el-button type="primary" @click="toolEnter('portRef')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>
<script setup>
import { Plus, CirclePlus } from '@element-plus/icons-vue'

const treeData = reactive({
  list: [
    {
      label: '平台类工具',
      id: '1',
      children: [
        {
          label: '测试管理工具',
          id: '1-1',
          children: [],
        },
        {
          label: '问题管理工具',
          id: '1-2',
          children: [],
        },
        {
          label: '配置管理库',
          id: '1-3',
          children: [],
        },
      ],
    },
    {
      label: 'Sparc C语言工具链',
      id: '2',
      children: [
        {
          label: '需求分析工具',
          id: '2-1',
          children: [],
        },
        {
          label: '安全性需求分析工具',
          id: '2-2',
          children: [],
        },
        {
          label: '架构设计工具',
          id: '2-3',
          children: [],
        },
        {
          label: '安全设计工具',
          id: '2-4',
          children: [],
        },
        {
          label: '详细设计工具',
          id: '2-5',
          children: [],
        },
        {
          label: '编码调试工具',
          id: '2-6',
          children: [],
        },
        {
          label: '编译工具',
          id: '2-7',
          children: [],
        },
      ],
    },
    {
      label: 'FPGA工具链',
      id: '3',
      children: [
        {
          label: '集成开发工具',
          id: '3-1',
          children: [],
        },
        {
          label: '仿真工具',
          id: '3-2',
          children: [],
        },
        {
          label: '编码规则检查工具',
          id: '3-3',
          children: [],
        },
        {
          label: '软件综合布线工具',
          id: '3-4',
          children: [],
        },
      ],
    },
    {
      label: '模型驱动工具链（C语言）',
      id: '4',
      children: [
        {
          label: '需求建模工具',
          id: '4-1',
          children: [],
        },
        {
          label: '架构建模工具',
          id: '4-2',
          children: [],
        },
        {
          label: '算法建模工具',
          id: '4-3',
          children: [],
        },
        {
          label: '代码生成工具',
          id: '4-4',
          children: [],
        },
        {
          label: '需求分析检查工具',
          id: '4-5',
          children: [],
        },
      ],
    },
    {
      label: 'c++工具链',
      id: '5',
      children: [
        {
          label: 'VScode',
          id: '5-1',
          children: [],
        },
        {
          label: 'CMake',
          id: '5-2',
          children: [],
        },
        {
          label: 'Cmake Tools',
          id: '5-3',
          children: [],
        },
        {
          label: 'Clangd',
          id: '5-4',
          children: [],
        },
        {
          label: 'clang-tidy',
          id: '5-5',
          children: [],
        },
        {
          label: 'CodeLLDB',
          id: '5-6',
          children: [],
        },
      ],
    },
  ],
})
const toolList = ref([
  {
    name: '问题管理Mantis',
    version: '2021',
    manufacturer: '美国',
    type: '问题管理类工具',
    imgUrl: new URL('../../../assets/image/item.png', import.meta.url).href,
    desc: 'Mantis主要用于缺陷跟踪，其具有多种特征，包括：易于安装，易于操作，基于Web，支持任何可运行php的平台(Windows,Linux,Mac,Solaris,AS400/i5等)',
  },
  {
    name: '测试管理ZenTao',
    version: '2021',
    manufacturer: '美国',
    imgUrl: new URL('../../../assets/image/zen.png', import.meta.url).href,
  },
  {
    name: '配置管理库Gitlab',
    version: '2021',
    manufacturer: '美国',
    imgUrl: new URL('../../../assets/image/lab.png', import.meta.url).href,
  },
  {
    name: '自动化测试工具selenium',
    version: '2021',
    manufacturer: '美国',
    imgUrl: new URL('../../../assets/image/sel.png', import.meta.url).href,
  },
  {
    name: '云端编码Theia',
    version: '2021',
    manufacturer: '美国',
    imgUrl: new URL('../../../assets/image/the.png', import.meta.url).href,
  },
])
const toolH = ref('')
const addToolFlag = ref(false)
const toolForm = reactive({
  toolName: '',
  toolVersion: '',
  make: '',
  toolType: '',
  port: [],
})
const drawer = ref(false)
const formRef = ref(null)
const portForm = ref({
  feature: '',
  portName: '',
  input: '',
  output: '',
})
const portRef = ref(null)
const toolTypeList = ref([
  {
    label: '自动化执行工具',
    value: '自动化执行工具',
  },
  {
    label: '人工交互工具',
    value: '人工交互工具',
  },
])
const toolDetailTarget = ref(false)
const toolDetailInfo = ref({})

const addTool = () => {
  addToolFlag.value = true
}
const toolEnter = (val) => {
  if (val === 'portRef') {
    portRef.value.validate((valid) => {
      if (valid) {
        toolForm.port.push(portForm.value)
        drawer.value = false
        portRef.value.resetFields()
      } else {
        console.log('submit 失败')
      }
    })
  }
  if (val === 'formRef') {
    formRef.value.validate((valid) => {
      if (valid) {
        toolList.value.push({
          name: toolForm.toolName,
          version: toolForm.toolVersion,
          manufacturer: toolForm.make,
          imgUrl: new URL('../../../assets/image/item.png', import.meta.url).href,
        })
        addToolFlag.value = false
        formRef.value.resetFields()
      } else {
        console.log('submit 失败')
      }
    })
  }
}
const callOff = (val) => {
  if (val === 'portRef') {
    portRef.value.resetFields()
    drawer.value = false
  }
  if (val === 'formRef') {
    formRef.value.resetFields()
    addToolFlag.value = false
  }
}
const addPort = () => {
  drawer.value = true
}

const toolDetail = (item) => {
  toolDetailTarget.value = true
  toolDetailInfo.value = item
}
const back = () => {
  toolDetailTarget.value = false
}
const HandleTree = (node) => {
  console.log(node)
}

onMounted(() => {
  toolH.value = window.innerHeight - 114
  window.addEventListener('resize', () => {
    toolH.value = window.innerHeight - 114
  })
})
onUnmounted(() => {
  window.removeEventListener('resize', () => {})
})
</script>
<style lang="scss" scoped>
.tool_room {
  margin: 0 8px;
  border-radius: 8px;
  display: flex;
  padding-bottom: 20px;
}

.tree_box {
  background: #fff;
  border-radius: 8px;
  width: 220px;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.07);
}

.el-tree {
  :deep(.el-tree-node__content) {
    height: 40px;
    color: #030303;
  }
}

.tool_room_wrapper {
  height: 100%;
  flex: 1;
  margin-left: 10px;
  border-radius: 8px;
  padding: 20px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.07);
  header {
    display: flex;
    justify-content: center;
    position: relative;
    h1 {
      font-size: 27px;
      color: #4487f9;
      text-align: center;
      margin-top: 10px;
    }
    .fh {
      width: 25px;
      height: 25px;
      cursor: pointer;
      position: absolute;
      left: 20px;
      top: 10%;
    }
  }
}

.tool_room_content {
  display: grid;
  justify-content: space-around;
  grid-template-columns: repeat(auto-fill, 350px);
  grid-gap: 0 14px;
}

.tool_room_content_item {
  position: relative;
  width: 350px;
  border: 1px solid #ebebeb;
  padding: 20px 10px;
  font-size: 14px;
  display: flex;
  align-items: center;
  margin: 20px 0;
  border-radius: 10px;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
  &::before,
  &::after {
    content: '';
    display: block;
    width: 0;
    height: 0;
    border: 1px solid transparent;
    box-sizing: border-box;
    position: absolute;
    border-radius: 10px;
    transition: height 0.2s ease-out, width 0.2s ease-out 0.2s, border-color 0.4s ease-in;
  }
  &::before {
    top: 0;
    left: 0;
  }
  &::after {
    right: 0;
    bottom: 0;
  }
  &:hover::before,
  &:hover::after {
    width: 100%;
    height: 100%;
    transition: border-color 0.4s ease-in, width 0.2s ease-out, height 0.2s ease-out 0.2s;
  }
  &:hover::before {
    border-top-color: #8d4bbb;
    border-right-color: #8d4bbb;
  }
  &:hover::after {
    border-bottom-color: #8d4bbb;
    border-left-color: #8d4bbb;
  }
}

.tool_room_content_item_img {
  /* width: 47px; */
  height: 50px;
}

.flex {
  display: flex;

  span {
    display: inline-block;
    height: 35px;
    white-space: nowrap;
    line-height: 35px;

    &:nth-child(1) {
      margin-right: 6px;
      font-weight: 600;
    }
  }
}

.tool_room_content_item_desc {
  margin-left: 20px;
}

.extend {
  height: 147px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #bdbdbd;
  cursor: pointer;
}

.add_tool {
  border: 1px solid #bdbdbd;
  padding: 20px;
  height: 100%;
}

.form_box {
  display: grid;
  justify-content: space-around;
  grid-template-columns: repeat(2, 386px);
  grid-gap: 0 30px;

  :deep(.el-form-item) {
    &:nth-last-child(2) {
      grid-column-start: span 2;
    }
  }
}

.el-select {
  width: 100%;
}

.last_child {
  width: 100%;
  grid-column-start: span 2;

  :deep(.el-form-item__content) {
    margin-left: 0 !important;
    justify-content: center;
  }
}

.call-off {
  margin-right: 100px;
}

.icon_add {
  margin-left: auto;
  margin-bottom: 5px;
  margin-top: 5px;
}
.tool-detail {
  width: 100%;
  height: calc(100% - 10px);
  border: 1px solid #ededed;
  padding: 6px 30px;
  display: flex;
  flex-wrap: wrap;
  .tool-detail_item {
    display: flex;
    width: 100%;
    height: 35px;
    margin: 20px 0;
    p {
      width: 80px;
      font-weight: normal;
      font-size: 15px;
      margin: 0;
      line-height: 35px;
      color: #8a8d99;
    }
    .content {
      flex: 1;
      height: 100%;
      background-color: #f4f4f4;
      border: 1px solid #d2d1d2;
      font-size: 14px;
      padding: 8px 5px;
      border-radius: 3px;
    }
    .introduce {
      height: auto;
    }
  }
  .half {
    width: 48%;
  }
}
</style>

<template>
  <div class="tool_room" :style="{ height: `${toolH}px` }">
    <el-scrollbar class="tree_box">
      <el-tree :data="treeData.list"></el-tree>
    </el-scrollbar>

    <el-scrollbar class="tool_room_wrapper">
      <h1>{{ addToolFlag ? '集成工具' : '平台类工具' }}</h1>
      <div v-if="!addToolFlag" class="tool_room_content">
        <div class="tool_room_content_item" v-for="(item, index) in toolList" :key="index">
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
      <div v-else class="add_tool">
        <el-form :model="toolForm" inline label-position="right" label-width="100px" class="form_box">
          <el-form-item label="工具名称">
            <el-input v-model="toolForm.toolName"></el-input>
          </el-form-item>
          <el-form-item label="工具版本">
            <el-input v-model="toolForm.toolVersion"></el-input>
          </el-form-item>
          <el-form-item label="国别">
            <el-input v-model="toolForm.make"></el-input>
          </el-form-item>
          <el-form-item label="工具类型">
            <el-select v-model="toolForm.toolType">
              <el-option label="" value=""></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="接口定义">
            <el-table :data="toolForm.port">
              <el-table-column prop="feature" label="功能"></el-table-column>
              <el-table-column prop="portName" label="接口名称"></el-table-column>
              <el-table-column prop="input" label="输入"></el-table-column>
              <el-table-column prop="output" label="输出"></el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </div>
    </el-scrollbar>
  </div>
</template>
<script setup>
import { Plus } from '@element-plus/icons-vue'
import { onUnmounted } from 'vue';

const treeData = reactive({
  list: [
    {
      label: '平台类工具',
      id: '1',
      children: [
        {
          label: '测试管理工具',
          id: '1-1',
          children: []
        },
        {
          label: '问题管理工具',
          id: '1-2',
          children: []
        },
        {
          label: '配置管理库',
          id: '1-3',
          children: []
        },
      ]
    },
    {
      label: 'Sparc C语言工具链',
      id: '2',
      children: [
        {
          label: '需求分析工具',
          id: '2-1',
          children: []
        },
        {
          label: '安全性需求分析工具',
          id: '2-2',
          children: []
        },
        {
          label: '架构设计工具',
          id: '2-3',
          children: []
        },
        {
          label: '安全设计工具',
          id: '2-4',
          children: []
        },
        {
          label: '详细设计工具',
          id: '2-5',
          children: []
        },
        {
          label: '编码调试工具',
          id: '2-6',
          children: []
        },
        {
          label: '编译工具',
          id: '2-7',
          children: []
        },
      ]
    },
    {
      label: 'FPGA工具链',
      id: '3',
      children: [
        {
          label: '集成开发工具',
          id: '3-1',
          children: []
        },
        {
          label: '仿真工具',
          id: '3-2',
          children: []
        },
        {
          label: '编码规则检查工具',
          id: '3-3',
          children: []
        },
        {
          label: '软件综合布线工具',
          id: '3-4',
          children: []
        },
      ]
    },
    {
      label: '模型驱动工具链（C语言）',
      id: '4',
      children: [
        {
          label: '需求建模工具',
          id: '4-1',
          children: []
        },
        {
          label: '架构建模工具',
          id: '4-2',
          children: []
        },
        {
          label: '算法建模工具',
          id: '4-3',
          children: []
        },
        {
          label: '代码生成工具',
          id: '4-4',
          children: []
        },
        {
          label: '需求分析检查工具',
          id: '4-5',
          children: []
        },
      ]
    },
    {
      label: 'c++工具链',
      id: '5',
      children: [
        {
          label: 'VScode',
          id: '5-1',
          children: []
        },
        {
          label: 'CMake',
          id: '5-2',
          children: []
        },
        {
          label: 'Cmake Tools',
          id: '5-3',
          children: []
        },
        {
          label: 'Clangd',
          id: '5-4',
          children: []
        },
        {
          label: 'clang-tidy',
          id: '5-5',
          children: []
        },
        {
          label: 'CodeLLDB',
          id: '5-6',
          children: []
        },
      ]
    },
  ]
})
const toolList = ref([
  {
    name: '问题管理Mantis',
    version: '2021',
    manufacturer: '美国',
    imgUrl: new URL('../../../assets/image/item.png', import.meta.url).href,
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
const addToolFlag = ref(true)
const toolForm = reactive({
  toolName: '',
  toolVersion: '',
  make: '',
  toolType: '',
  port: [
    {
      feature:'',
      portName:'',
      input:'',
      output:''
    }
  ]
})

const addTool = () => {
  addToolFlag.value = true
}

onMounted(() => {
  toolH.value = window.innerHeight - 136
  window.addEventListener('resize', () => {
    toolH.value = window.innerHeight - 136
  })
})
onUnmounted(() => {
  window.removeEventListener('resize', () => { })
})
</script>
<style lang="scss" scoped>
.tool_room {
  margin: 0 20px;
  border-radius: 8px;
  display: flex;
  padding-bottom: 20px;
}

.tree_box {
  background: #fff;
  border-radius: 8px;
  width: 200px;
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
  margin-left: 20px;
  border-radius: 8px;
  padding: 20px;
  overflow: hidden;
  background-color: #fff;

  h1 {
    font-size: 27px;
    color: #4487f9;
    text-align: center;
    margin-top: 10px;
  }
}

.tool_room_content {
  display: grid;
  justify-content: space-around;
  grid-template-columns: repeat(auto-fill, 350px);
  grid-gap: 0 30px;
}

.tool_room_content_item {
  width: 350px;
  border: 1px solid #d3d1d1;
  padding: 20px 10px;
  font-size: 14px;
  display: flex;
  align-items: center;
  margin: 20px 0;

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

}

.form_box {
  display: grid;
  justify-content: space-around;
  grid-template-columns: repeat(auto-fill, 350px);
  grid-gap: 0 30px;
}
</style>

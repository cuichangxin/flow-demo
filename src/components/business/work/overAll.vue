<template>
  <div class="over_all">
    <div class="top_search">
      <el-input v-model="input" placeholder="搜索" @input="search"></el-input>
    </div>

    <div class="table_info">
      <div class="top_add">
        <i class="iconfont icon" @click="addCode('add')">&#xe683;</i>
      </div>
      <el-table :data="tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)" :border="true"
        :header-cell-style="tableHeaderCellStyle">
        <el-table-column align="center" label="序号" width="180">
          <template #default="scope">
            {{ scope.$index + (currentPage - 1) * pagesize + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="name" label="数据名称">
        </el-table-column>
        <el-table-column align="center" prop="code" label="变量名称">
        </el-table-column>
        <el-table-column align="center" prop="type" label="数据类型">
        </el-table-column>
        <el-table-column align="center" label="操作" width="150">
          <template #default="scope">
            <div class="butn">
              <el-button link @click="update(scope.row, 'update')">
                <i class="iconfont icon">&#xe649;</i>
              </el-button>
              <el-button link @click="remove(scope.row)">
                <i class="iconfont icon">&#xe68e;</i>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="prev, pager, next" :total="tableData.length" :page-size="pagesize"
          :current-page="currentPage" @current-change="handlerCurrentChange" @size-change="handleSizeChange">
        </el-pagination>
      </div>
    </div>
    <!-- 表单 -->
    <el-drawer title="全局数据定义" v-model="drawer">
      <div class="form_box">
        <el-form :ref="(el)=>formRef=el" :model="forms" :hide-required-asterisk="true" :rules="rules" label-position="right"
          label-width="100px">
          <el-form-item label="数据名称" prop="name">
            <el-input v-model="forms.name"></el-input>
          </el-form-item>
          <el-form-item label="变量名称" prop="code">
            <el-input v-model="forms.code"></el-input>
          </el-form-item>
          <el-form-item label="数据类型" prop="type">
            <el-input v-model="forms.type"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit()">确 定</el-button>
            <el-button @click="drawerOff">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>
<script setup>
import _ from "lodash";
const input = ref('')
const tableData = ref(
  [
    {
      id: 1,
      name: "制导系统渚元参数表",
      code: "zdzy_par_tab",
      type: "结构体",
    },
    {
      id: 2,
      name: "姿拉系统渚元参教表",
      code: "zkzy_par_tab",
      type: "结构体",
    },
    {
      id: 3,
      name: "姿控系统遥测表",
      code: "tem_tab",
      type: "结构体",
    },
    {
      id: 4,
      name: "综合飞行软件诸元参数表",
      code: "zhzy_par_tab",
      type: "结构体",
    },
    {
      id: 5,
      name: "综合飞行软件计算机遥测参数表",
      code: "zhyc_par_tab",
      type: "结构体",
    },
    {
      id: 6,
      name: "速度数据",
      code: "rate_data",
      type: "float",
    },
    {
      id: 7,
      name: "姿态数据",
      code: "gesture_data",
      type: "结构体",
    }
  ]
)
const currentPage = ref(1)
const pagesize = ref(15)
const drawer = ref(false)
let forms = reactive({
  name: "",
  code: "",
  type: "",
})
const actionType = ref(null)
const cloneData = ref({})
const cloneSearchData = ref({})
const searchId = ref(1)
const formRef = ref(null)
const rules = reactive({
  name: [
    { required: true, message: '请输入数据名称', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入变量名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请输入数据类型', trigger: 'blur' }
  ]
})
const tableHeaderCellStyle = () => {
  return {
    'background': '#efefef'
  }
}
const handlerCurrentChange = (val) => {
  currentPage.value = val;
}
const handleSizeChange = () => {
  currentPage.value = 1;
}
const update = (row, type) => {
  drawer.value = true
  actionType.value = type
  cloneData.value = row
  forms = reactive({ ...row })
}
const remove = (row) => {
  tableData.value.map((item, index) => {
    if (item.name == row.name) {
      tableData.value.splice(index, 1)
      localStorage.setItem('overAllData',JSON.stringify(tableData.value))
    }
  })
}
const drawerOff = () => {
  drawer.value = false;
  forms = reactive({
    name: "",
    code: "",
    type: "",
  })
}
const addCode = (type) => {
  drawer.value = true;
  actionType.value = type;
}
const onSubmit = async () => {
  await formRef.value.validate(val => {
    if (val) {
      if (actionType.value == "add") {
        tableData.value.push(forms)
      } else if (actionType.value == "update") {
        tableData.value.forEach((item) => {
          if (item.name == cloneData.value.name) {
            item.name = forms.name
            item.code = forms.code
            item.type = forms.type
          }
        })
      }
      drawer.value = false
      forms = reactive({
        name: "",
        code: "",
        type: "",
      })
      localStorage.setItem('overAllData',JSON.stringify(tableData.value))
    } else {
      return false
    }
  })
}
const search = (e) => {
  if (e == '') {
    tableData.value = cloneSearchData.value
    return
  }
  if (searchId.value == 1) {
    cloneSearchData.value = _.cloneDeep(tableData.value)
    searchId.value = 0
  }
  let codeArr = ["name", "code", "type"]
  let searchReg = new RegExp(e)
  let filterArr = cloneSearchData.value.filter((data) => {
    return Object.values(
      Object.fromEntries(
        Object.entries(data).filter((keys) => codeArr.includes(keys[0]))
      )
    ).some((v) => searchReg.test(v))
  })
  tableData.value = filterArr
}

onMounted(()=>{
  let over = localStorage.getItem('overAllData')
  if (over) {
    tableData.value = JSON.parse(over)
  }
})
</script>
<style lang="scss" scoped>
.over_all {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 10px;
  padding: 20px;

  .top_search {
    width: 400px;
  }

  .table_info {
    margin-top: 20px;

    .pagination {
      display: flex;
      justify-content: center;
      margin-top: 30px;
    }

    .butn {
      .el-button {
        padding: 0;

        span {
          .icon {
            font-size: 19px;
            font-weight: bold;
            line-height: 1;
            &:first-child{
              color: #518edf;
            }
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
  }

  .form_box {
    padding: 0 20px 0 0;
  }
}
</style>

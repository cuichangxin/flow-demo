<template>
  <steps :isActive="2"></steps>
  <div class="wrapper">
    <el-scrollbar class="scrollbar">
      <div class="flex">
        <div class="affirm_item">
          <span class="label">项目名称:</span>
          <div class="content">
            <div class="name_item">xxx火箭飞控软件</div>
          </div>
        </div>
        <div class="affirm_item">
          <span class="label">安全关键等级:</span>
          <div class="content">
            <div class="name_item">A级</div>
          </div>
        </div>
        <div class="affirm_item">
          <span class="label">进&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度:</span>
          <div class="content">
            <div class="name_item">生产线与技在2023年4月26日完成，比计划完成时间提前5天</div>
          </div>
        </div>
      </div>
      <div class="flow">
        <span class="label">活动流程:</span>
        <div class="flow_info">
          <img class="img" src="../../../assets/image/quanping_o.png" />
          <img class="img" src="../../../assets/image/quxiaoquanping_o.png" />
        </div>
      </div>
      <div class="tool">
        <span class="label">工具情况:</span>
        <div class="tool_info">
          <el-table :data="tableList" border :header-cell-style="tableHeaderCellStyle">
            <el-table-column align="center" label="序号" width="80">
              <template #default="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="name" label="活动名称">
            </el-table-column>
            <el-table-column align="center" prop="post" label="岗位">
            </el-table-column>
            <el-table-column align="center" prop="tool" label="工具">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="affirm">
        <el-button class="button" type="info">返回上一步</el-button>
        <el-button class="button" type="primary">确认</el-button>
      </div>
    </el-scrollbar>
  </div>
</template>
<script setup>
import steps from './common/steps.vue'

const nameInput = ref('')
const tableList = ref([
  {
    name:'',
    post:'',
    tool:''
  }
])

function tableHeaderCellStyle() {
  return {
    "background": "#efefef"
  }
}

</script>
<style lang="scss" scoped>
.wrapper {
  height: 680px;
  background-color: #fff;
  margin: 30px 20px 0;
  border-radius: 8px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);

  .scrollbar {
    padding: 20px 50px;
  }
}

.affirm_item {
  display: flex;
  align-items: center;
  margin: 0 0 10px;

  &:nth-child(1) {
    margin-right: 30%;
  }

  &:nth-child(3) {
    /* flex: 1; */
    width: 100%;
  }
}

.label {
  font-size: 14px;
}

.flex {
  display: flex;
  flex-wrap: wrap;
}

.content {
  /* width: auto; */
}

.name_item {
  min-width: 150px;
  padding: 0 20px;
  height: 30px;
  background-color: #ededed;
  border: 1px solid #b0afaf;
  margin-left: 10px;
  font-size: 14px;
  line-height: 30px;
  border-radius: 2px;
}

.flow,
.tool {
  margin-top: 20px;

  .flow_info,
  .tool_info {
    margin-top: 10px;
    width: 100%;
    height: 500px;
    border: 1px solid #b0afaf;
    position: relative;

    .img {
      width: 30px;
      height: 30px;
      position: absolute;
      right: 10px;
      top: 5px;
      cursor: pointer;
    }
  }
}
.affirm{
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 30px;
  .button{
    margin: 0 50px;
  }
}
</style>

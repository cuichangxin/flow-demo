<template>
  <div class="card">
    <!-- 软件名称 -->
    <div class="software">
      <div class="title_box">软件名称: {{ projectList.projectName }}</div>
      <div class="board item_1">
        <div class="level">
          <p class="level_text">{{ projectList.rank }}</p>
          <p class="content_text">安全关键等级</p>
        </div>
        <ul class="time">
          <li>启动时间：<span>{{ projectList.sDate }}</span></li>
          <li>完成时间：<span>{{ projectList.eDate }}</span></li>
          <li v-if="projectList.isShowRDate">实际完成时间：<span>{{ projectList.rDate }}</span></li>
        </ul>
      </div>
      <div class="board board2">
        <div class="progress">
          <el-progress type="circle" define-back-color="#0c345f" :percentage="projectList.rate" :width="70"></el-progress>
          <span class="title">项目进度</span>
        </div>
        <div class="progress2">
          <p v-if="JSON.stringify(projectList) !== '{}'" class="offset">{{ projectList.isPositive ? '+' : '-' }}{{
            projectList.rateOffset }}%</p>
          <div class="progress_box">
            <div class="just1">
              <el-progress class="one" define-back-color="#0c345f" :show-text="false" :stroke-width="12"
                :percentage="70"></el-progress>
            </div>
            <div class="just2">
              <el-progress define-back-color="#0c345f" :show-text="false" :stroke-width="12"
                :percentage="50"></el-progress>
            </div>
          </div>
          <span class="title">进度偏差</span>
        </div>
      </div>
    </div>
    <!-- 进度关注点 -->
    <div class="software">
      <div class="title_box">
        <p>进度关注点</p>
        <div v-if="JSON.stringify(projectList) !== '{}'" class="exam">
          <div class="left">
            <div class="icon"></div>
            要求完成时间
          </div>
          <div class="left right">
            <div class="icon"></div>
            已花费时间
          </div>
        </div>
      </div>
      <div class="board slider_flex">
        <div class="flex" v-if="projectList.rateInfoList&&projectList.rateInfoList.length">
          <div class="left" v-for="(item, index) in projectList.rateInfoList" :key="'i' + index">
            <div class="tip">延期{{ item.delay }}%</div>
            <div class="slider">
              <el-progress class="prog_1" :text-inside="true" :stroke-width="18" :percentage="item.cValue"><span>{{
                item.cValue }}</span></el-progress>
              <el-progress class="prog_2" :text-inside="true" :stroke-width="18" :percentage="item.rValue"><span>{{
                item.rValue }}</span></el-progress>
            </div>
            <div class="analyse">{{ item.name }}</div>
          </div>
        </div>
        <h3 v-else style="color:#fff; flex:1; text-align: center;">无</h3>
      </div>
    </div>
    <!-- 质量关注点 -->
    <div class="software">
      <div class="title_box">质量关注点</div>
      <div class="board quality">
        <div v-if="projectList.quailityInfoList&&projectList.quailityInfoList.length" class="flex_o">
          <div class="box" v-for="(item, index) in projectList.quailityInfoList" :key="'ii' + index">
            <div class="img_box">
              <span>{{ item.num }}次</span>
            </div>
            <p>{{ item.name }}</p>
          </div>
        </div>
        <h3 v-else style="color:#fff;">无</h3>
      </div>
    </div>
    <!-- 当前活动情况 -->
    <div class="software last" style="margin: 0 0 5px;">
      <div class="title_box">{{ projectList.showStatus == 0 ? '当前活动情况' : '活动情况汇总' }}</div>
      <el-scrollbar class="board activity">
        <div v-if="projectList.showStatus == 0">
          <div v-for="(item, index) in projectList.activityInfoList" :key="'iii' + index">
            <div v-if="!item.isAuto" class="box_card">
              <p class="top_title">{{ item.name }}</p>
              <ul class="content">
                <li>
                  <img class="img" src="../../../assets/image/icon_1.png" />
                  <p>{{ item.person }}</p>
                </li>
                <li>
                  <img class="img" src="../../../assets/image/icon_2.png" />
                  <p>{{ item.tool }}</p>
                </li>
                <li>
                  <img class="img" src="../../../assets/image/icon_3.png" />
                  <p>{{ item.sDate }}</p>
                </li>
                <li>
                  <img class="img" src="../../../assets/image/icon_4.png" />
                  <p>{{ item.eDate }}</p>
                </li>
              </ul>
            </div>
            <div v-if="item.isAuto" class="box_card green_card">
              <p class="top_title">{{ item.name }}</p>
              <div class="flex">
                <div class="left_icon">
                  <img class="img" src="../../../assets/image/green.png" />
                  <p>{{ item.tool }}</p>
                </div>
                <typed v-if="flag" :strings="item.content"></typed>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="projectList.showStatus == 1" class="collect" v-html="projectList.content.replace(/\n/g, '<br/>')">
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script setup>
import typed from '../../common/typed.vue'

let props = defineProps({
  list: {
    type: Object,
    default: () => []
  }
})

const projectList = ref({})
const flag = ref(true)

watch(() => props.list, (n,o) => {
  projectList.value = n
  if (JSON.stringify(n) !== JSON.stringify(o)) {
    flag.value = false
    nextTick(()=>{
      flag.value = true
    })
  }
},{deep:true})
</script>
<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  .software {
    width: 360px;

    &:not(.last) {
      margin-bottom: 10px;
    }

    .title_box {
      width: 100%;
      height: 30px;
      background: url('../../../assets/image/title_bg.png') no-repeat;
      background-size: 100% 100%;
      color: #fff;
      font-size: 14px;
      line-height: 30px;
      padding-left: 10px;
      font-weight: 800;
      display: flex;
      justify-content: space-between;

      .exam {
        display: flex;
        justify-content: flex-start;

        .left {
          color: #fff;
          font-size: 12px;
          display: flex;
          align-items: center;
          transform: scale(0.8);

          .icon {
            width: 10px;
            height: 10px;
            border-radius: 10px;
            background: #085338;
            margin-right: 3px;
          }
        }

        .right {
          .icon {
            background: #1487de;
          }
        }
      }

      p {
        margin: 0;
      }
    }

    .board {
      width: 100%;
      /* height: 120px; */
      background: rgba(20, 47, 66, 0.9);
      display: flex;
      align-items: center;
      justify-content: flex-start;
      border-radius: 0 0 10px 10px;

      .level {
        background: url('../../../assets/image/level_bg.png') no-repeat;
        background-size: 100% 100%;
        width: 50px;
        height: 60px;
        margin-left: 30px;
        position: relative;

        p {
          margin: 0;
        }

        .level_text {
          color: #6de5f8;
          font-size: 13px;
          font-weight: bold;
          position: absolute;
          top: 2px;
          left: 50%;
          transform: translateX(-47%);
        }

        .content_text {
          color: #fff;
          font-size: 12px;
          width: 50px;
          text-align: center;
          position: absolute;
          bottom: 8px;
          line-height: 13px;
          transform: scale(0.8);
        }
      }

      .time {
        margin-left: 30px;

        li {
          color: #fff;
          font-weight: bold;
          font-size: 13px;
          list-style: none;

          span {
            color: #1470b6;
          }
        }
      }

      .left {
        .slider {
          position: relative;
          transform: rotate(270deg);
          height: auto;

          .el-progress {
            height: 22px;
            width: 80px;
          }

          :deep(.el-progress-bar__outer) {
            background-color: transparent;
          }

          :deep(.el-progress-bar__innerText) {
            transform: rotate(90deg) scale(0.6);
            font-weight: 700;
            margin-bottom: 1px;
          }

          .prog_1 {
            :deep(.el-progress-bar__inner) {
              background: linear-gradient(to right, #1f4037, #05f485);
            }
          }

          .prog_2 {
            :deep(.el-progress-bar__inner) {
              background: linear-gradient(to right, #373b44, #3174e1);
            }
          }
        }

        .tip {
          font-size: 12px;
          color: #1487de;
          transform: scale(0.8);
          text-align: center;
          margin-bottom: 20px;
        }

        .analyse {
          text-align: center;
          font-size: 12px;
          color: #fff;
          transform: scale(0.8);
          margin-top: 22px;
          white-space: nowrap;
        }
      }

      .box {
        display: flex;
        flex-direction: column;
        align-items: center;

        .img_box {
          width: 50px;
          height: 50px;
          background: url('../../../assets/image/c_bg.png') no-repeat;
          background-size: 100% 100%;
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;

          span {
            font-size: 12px;
            color: #3d9cdf;
            font-weight: 700;
          }
        }

        p {
          margin: 0;
          width: 90px;
          text-align: center;
          font-size: 12px;
          font-weight: 600;
          color: #fff;
          transform: scale(0.86);
        }
      }

      .box_card {
        width: 310px;
        height: 130px;
        background: url('../../../assets/image/card_1.png') no-repeat;
        background-size: 100% 100%;
        margin-top: 8px;

        .top_title {
          font-size: 14px;
          font-weight: bold;
          color: #038fd7;
          text-align: center;
          line-height: 28px;
        }

        .content {
          margin-left: 55px;
          margin-top: 10px;

          li {
            color: #038fd7;
            font-size: 12px;
            font-weight: bold;
            display: flex;
            align-items: center;

            img {
              width: 13px;
              height: 13px;
              margin-right: 29px;
            }
          }
        }

        .flex {
          display: flex;
        }

        .left_icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 20px;

          img {
            width: 13px;
            height: 13px;
          }

          p {
            width: 80px;
            color: #15ffcc;
            text-align: center;
            line-height: 1;
            font-size: 12px;
            margin-top: 4px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-weight: 700;
            transform: scale(0.9);
            margin: 0;
          }
        }
      }

      .green_card {
        background: url('../../../assets/image/card_2.png') no-repeat;
        background-size: 100% 100%;

        .top_title {
          color: #15ffcc;
        }
      }
    }

    .activity {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      align-items: flex-start;
      height: 325px;

      p {
        margin: 0;
      }

      .collect {
        color: #0d9bec;
        font-size: 15px;
        font-weight: bold;
        padding: 10px;
      }

      .img {
        width: 12px;
        height: 12px;
        margin-right: 3px;
      }

      ul {
        padding: 0;

        li {
          margin: 4px 0;

          p {
            color: #50b0f9;
          }
        }
      }
    }

    .quality {
      display: flex;
      justify-content: center;
      padding: 5px 0;
      min-height: 180px;

      .flex_o {
        display: flex;
        justify-content: center;
      }
    }

    .slider_flex {
      padding: 5px 0;
      min-height: 180px;

      .flex {
        width: 100%;
        display: flex;
        justify-content: space-around;
      }
    }

    .board2 {
      /* height: 100px; */
      padding: 8px 0;
      margin-top: 10px;
      font-size: 14px;
      display: flex;
      justify-content: space-around;
      align-items: center;

      .progress2,
      .progress {
        .title {
          font-size: 12px;
          font-weight: 500;
          color: #fff;
          text-align: center;
        }
      }

      .progress {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .progress2 {
        position: relative;

        .progress_box {
          margin-top: 30px;

          .just1 {
            :deep(.el-progress-bar__inner) {
              background: #1577c0;
            }

            :deep(.el-progress-bar__outer) {
              background-color: #193f75;
            }
          }

          .just2 {
            :deep(.el-progress-bar__inner) {
              background: #15ad74;
            }

            :deep(.el-progress-bar__outer) {
              background-color: #193f75;
            }
          }
        }

        .one {
          margin-bottom: 6px;
        }

        .offset {
          color: #1577c0;
          font-size: 12px;
          font-weight: bold;
          position: absolute;
          top: -6px;
          left: 50%;
          transform: translateX(-50%);
        }

        .title {
          display: inline-block;
          margin-top: 8px;
        }
      }
    }
  }

  :deep(.el-progress__text) {
    color: #1577c0 !important;
    font-weight: bold;
  }
}

ul {
  margin: 0;
  padding: 0;
}

.item_1 {
  padding: 10px 0;
}

.auto_content {
  color: #15ffcc;
  font-size: 12px;
  font-weight: 900;
  transform: scale(0.8);
  margin: 0;
}
</style>

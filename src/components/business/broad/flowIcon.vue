<template>
  <div class="flow_icon">
    <ul class="ul_common top_box">
      <div v-if="infoList.postList.slice(6, 10).length !== 0" class="bg_box">
        <span class="person_type">姿控工程师</span>
        <li
          class="li"
          v-for="item in infoList.postList.slice(0, 3)"
          :key="item.serial"
          @mouseenter="hovers(item.serial, 'postList')"
          @mouseleave="leaves(item.serial, 'postList')"
        >
          <img
            v-if="item.status === 1"
            :src="
              item.iconStatus === 0
                ? getImgUrl('dark_sit.png')
                : item.iconStatus === 1
                ? getImgUrl('dark_robot.png')
                : item.iconStatus === 2
                ? getImgUrl('dark_stand.png')
                : item.iconStatus === 3
                ? getImgUrl('dark_host.png')
                : ''
            "
          />
          <img
            v-if="item.status === 3"
            :src="
              item.iconStatus === 0
                ? getImgUrl('bright_sit.png')
                : item.iconStatus === 1
                ? getImgUrl('bright_robot.png')
                : item.iconStatus === 2
                ? getImgUrl('bright_stand.png')
                : item.iconStatus === 3
                ? getImgUrl('bright_host.png')
                : ''
            "
          />
          <img
            v-if="item.status === 2"
            :src="
              item.iconStatus === 0
                ? getImgUrl('loading_sit.png')
                : item.iconStatus === 1
                ? getImgUrl('loading_host.png')
                : item.iconStatus === 2
                ? getImgUrl('loading_stand.png')
                : item.iconStatus === 3
                ? getImgUrl('loading_host.png')
                : ''
            "
          />
          <img
            v-if="item.status === 4"
            :src="
              item.iconStatus === 0
                ? getImgUrl('error_sit.png')
                : item.iconStatus === 1
                ? getImgUrl('error_robot.png')
                : item.iconStatus === 2
                ? getImgUrl('error_stand.png')
                : item.iconStatus === 3
                ? getImgUrl('error_host.png')
                : ''
            "
          />
          <div class="hover_info" v-show="item.serial == item.hoverIdx">
            <img
              class="hover_img"
              :src="
                item.status == 1
                  ? getImgUrl('project_2.png')
                  : item.status == 2
                  ? getImgUrl('project_1.png')
                  : item.status == 3
                  ? getImgUrl('project_4.png')
                  : item.status == 4
                  ? getImgUrl('project_3.png')
                  : ''
              "
            />
            <p
              :style="{
                color:
                  item.status == 1
                    ? '#d0d0d0'
                    : item.status == 2
                    ? '#a3d4fb'
                    : item.status == 3
                    ? '#f7f7f7'
                    : item.status == 4
                    ? '#f8d796'
                    : '',
              }"
            >
              姿控工程师
            </p>
          </div>
        </li>
      </div>
      <div v-if="infoList.postList.slice(6, 10).length !== 0" class="bg_box">
        <span class="person_type">副总师</span>
        <li
          class="li"
          v-for="item in infoList.postList.slice(3, 6)"
          :key="item.serial"
          @mouseenter="hovers(item.serial, 'postList')"
          @mouseleave="leaves(item.serial, 'postList')"
        >
          <img
            v-if="item.status === 1"
            :src="
              item.iconStatus === 0
                ? getImgUrl('dark_sit.png')
                : item.iconStatus === 1
                ? getImgUrl('dark_robot.png')
                : item.iconStatus === 2
                ? getImgUrl('dark_stand.png')
                : item.iconStatus === 3
                ? getImgUrl('dark_host.png')
                : ''
            "
          />
          <img
            v-if="item.status === 3"
            :src="
              item.iconStatus === 0
                ? getImgUrl('bright_sit.png')
                : item.iconStatus === 1
                ? getImgUrl('bright_robot.png')
                : item.iconStatus === 2
                ? getImgUrl('bright_stand.png')
                : item.iconStatus === 3
                ? getImgUrl('bright_host.png')
                : ''
            "
          />
          <img
            v-if="item.status === 2"
            :src="
              item.iconStatus === 0
                ? getImgUrl('loading_sit.png')
                : item.iconStatus === 1
                ? getImgUrl('loading_host.png')
                : item.iconStatus === 2
                ? getImgUrl('loading_stand.png')
                : item.iconStatus === 3
                ? getImgUrl('loading_host.png')
                : ''
            "
          />
          <img
            v-if="item.status === 4"
            :src="
              item.iconStatus === 0
                ? getImgUrl('error_sit.png')
                : item.iconStatus === 1
                ? getImgUrl('error_robot.png')
                : item.iconStatus === 2
                ? getImgUrl('error_stand.png')
                : item.iconStatus === 3
                ? getImgUrl('error_host.png')
                : ''
            "
          />
          <div class="hover_info" v-show="item.serial == item.hoverIdx">
            <img
              class="hover_img"
              :src="
                item.status == 1
                  ? getImgUrl('project_2.png')
                  : item.status == 2
                  ? getImgUrl('project_1.png')
                  : item.status == 3
                  ? getImgUrl('project_4.png')
                  : item.status == 4
                  ? getImgUrl('project_3.png')
                  : ''
              "
            />
            <p
              :style="{
                color:
                  item.status == 1
                    ? '#d0d0d0'
                    : item.status == 2
                    ? '#a3d4fb'
                    : item.status == 3
                    ? '#f7f7f7'
                    : item.status == 4
                    ? '#f8d796'
                    : '',
              }"
            >
              副总师
            </p>
          </div>
        </li>
      </div>
      <div v-if="infoList.postList.slice(6, 10).length !== 0" class="bg_box">
        <span class="person_type">测试工程师</span>
        <li
          class="li"
          v-for="item in infoList.postList.slice(6, 10)"
          :key="item.serial"
          @mouseenter="hovers(item.serial, 'postList')"
          @mouseleave="leaves(item.serial, 'postList')"
        >
          <img
            v-if="item.status === 1"
            :src="
              item.iconStatus === 0
                ? getImgUrl('dark_sit.png')
                : item.iconStatus === 1
                ? getImgUrl('dark_robot.png')
                : item.iconStatus === 2
                ? getImgUrl('dark_stand.png')
                : item.iconStatus === 3
                ? getImgUrl('dark_host.png')
                : ''
            "
          />
          <img
            v-if="item.status === 3"
            :src="
              item.iconStatus === 0
                ? getImgUrl('bright_sit.png')
                : item.iconStatus === 1
                ? getImgUrl('bright_robot.png')
                : item.iconStatus === 2
                ? getImgUrl('bright_stand.png')
                : item.iconStatus === 3
                ? getImgUrl('bright_host.png')
                : ''
            "
          />
          <img
            v-if="item.status === 2"
            :src="
              item.iconStatus === 0
                ? getImgUrl('loading_sit.png')
                : item.iconStatus === 1
                ? getImgUrl('loading_host.png')
                : item.iconStatus === 2
                ? getImgUrl('loading_stand.png')
                : item.iconStatus === 3
                ? getImgUrl('loading_host.png')
                : ''
            "
          />
          <img
            v-if="item.status === 4"
            :src="
              item.iconStatus === 0
                ? getImgUrl('error_sit.png')
                : item.iconStatus === 1
                ? getImgUrl('error_robot.png')
                : item.iconStatus === 2
                ? getImgUrl('error_stand.png')
                : item.iconStatus === 3
                ? getImgUrl('error_host.png')
                : ''
            "
          />
          <div class="hover_info" v-show="item.serial == item.hoverIdx">
            <img
              class="hover_img"
              :src="
                item.status == 1
                  ? getImgUrl('project_2.png')
                  : item.status == 2
                  ? getImgUrl('project_1.png')
                  : item.status == 3
                  ? getImgUrl('project_4.png')
                  : item.status == 4
                  ? getImgUrl('project_3.png')
                  : ''
              "
            />
            <p
              :style="{
                color:
                  item.status == 1
                    ? '#d0d0d0'
                    : item.status == 2
                    ? '#a3d4fb'
                    : item.status == 3
                    ? '#f7f7f7'
                    : item.status == 4
                    ? '#f8d796'
                    : '',
              }"
            >
              测试工程师
            </p>
          </div>
        </li>
      </div>
      <span class="label">人工</span>
    </ul>
    <ul class="ul_common center_box">
      <div class="center_info">
        <li class="item_box_bg li" v-for="item in infoList.autoList" :key="item.serial">
          <img v-if="item.status === 1" :src="getImgUrl('dark_robot.png')" />
          <img v-if="item.status === 3" :src="getImgUrl('bright_robot.png')" />
          <img v-if="item.status === 2" :src="getImgUrl('loading_robot.png')" />
          <img v-if="item.status === 4" :src="getImgUrl('error_robot.png')" />
        </li>
      </div>
      <div class="center_info alone">
        <li class="item_box_bg li" id="alone_bg" v-for="item in infoList.autoHostList" :key="item.serial">
          <img v-if="item.status === 1" :src="getImgUrl('dark_host.png')" />
          <img v-if="item.status === 3" :src="getImgUrl('bright_host.png')" />
          <img v-if="item.status === 2" :src="getImgUrl('loading_host.png')" />
          <img v-if="item.status === 4" :src="getImgUrl('error_host.png')" />
        </li>
      </div>
      <div class="center_info">
        <li class="item_box_bg li" v-for="item in infoList.autoTwoList" :key="item.serial">
          <img v-if="item.status === 1" :src="getImgUrl('dark_robot.png')" />
          <img v-if="item.status === 3" :src="getImgUrl('bright_robot.png')" />
          <img v-if="item.status === 2" :src="getImgUrl('loading_robot.png')" />
          <img v-if="item.status === 4" :src="getImgUrl('error_robot.png')" />
        </li>
      </div>
      <span class="label">自动</span>
    </ul>
    <ul class="ul_common bottom_box">
      <div class="bg_box">
        <span class="person_type">制导工程师</span>
        <li
          class="li"
          v-for="item in infoList.postTwoList.slice(0, 2)"
          :key="item.serial"
          @mouseenter="hovers(item.serial, 'postTwoList')"
          @mouseleave="leaves(item.serial, 'postTwoList')"
        >
          <img
            v-if="item.status === 1"
            :src="
              item.iconStatus === 0
                ? getImgUrl('dark_sit.png')
                : item.iconStatus === 1
                ? getImgUrl('dark_robot.png')
                : item.iconStatus === 2
                ? getImgUrl('dark_stand.png')
                : item.iconStatus === 3
                ? getImgUrl('dark_host.png')
                : ''
            "
          />
          <img
            v-if="item.status === 3"
            :src="
              item.iconStatus === 0
                ? getImgUrl('bright_sit.png')
                : item.iconStatus === 1
                ? getImgUrl('bright_robot.png')
                : item.iconStatus === 2
                ? getImgUrl('bright_stand.png')
                : item.iconStatus === 3
                ? getImgUrl('bright_host.png')
                : ''
            "
          />
          <img
            v-if="item.status === 2"
            :src="
              item.iconStatus === 0
                ? getImgUrl('loading_sit.png')
                : item.iconStatus === 1
                ? getImgUrl('loading_host.png')
                : item.iconStatus === 2
                ? getImgUrl('loading_stand.png')
                : item.iconStatus === 3
                ? getImgUrl('loading_host.png')
                : ''
            "
          />
          <img
            v-if="item.status === 4"
            :src="
              item.iconStatus === 0
                ? getImgUrl('error_sit.png')
                : item.iconStatus === 1
                ? getImgUrl('error_robot.png')
                : item.iconStatus === 2
                ? getImgUrl('error_stand.png')
                : item.iconStatus === 3
                ? getImgUrl('error_host.png')
                : ''
            "
          />
          <div class="hover_info" v-show="item.serial == item.hoverIdx">
            <img
              class="hover_img"
              :src="
                item.status == 1
                  ? getImgUrl('project_2.png')
                  : item.status == 2
                  ? getImgUrl('project_1.png')
                  : item.status == 3
                  ? getImgUrl('project_4.png')
                  : item.status == 4
                  ? getImgUrl('project_3.png')
                  : ''
              "
            />
            <p
              :style="{
                color:
                  item.status == 1
                    ? '#d0d0d0'
                    : item.status == 2
                    ? '#a3d4fb'
                    : item.status == 3
                    ? '#f7f7f7'
                    : item.status == 4
                    ? '#f8d796'
                    : '',
              }"
            >
              制导工程师
            </p>
          </div>
        </li>
      </div>
      <div class="bg_box">
        <span class="person_type">综合工程师</span>
        <li
          class="li"
          v-for="item in infoList.postTwoList.slice(2, 4)"
          :key="item.serial"
          @mouseenter="hovers(item.serial, 'postTwoList')"
          @mouseleave="leaves(item.serial, 'postTwoList')"
        >
          <img
            v-if="item.status === 1"
            :src="
              item.iconStatus === 0
                ? getImgUrl('dark_sit.png')
                : item.iconStatus === 1
                ? getImgUrl('dark_robot.png')
                : item.iconStatus === 2
                ? getImgUrl('dark_stand.png')
                : item.iconStatus === 3
                ? getImgUrl('dark_host.png')
                : ''
            "
          />
          <img
            v-if="item.status === 3"
            :src="
              item.iconStatus === 0
                ? getImgUrl('bright_sit.png')
                : item.iconStatus === 1
                ? getImgUrl('bright_robot.png')
                : item.iconStatus === 2
                ? getImgUrl('bright_stand.png')
                : item.iconStatus === 3
                ? getImgUrl('bright_host.png')
                : ''
            "
          />
          <img
            v-if="item.status === 2"
            :src="
              item.iconStatus === 0
                ? getImgUrl('loading_sit.png')
                : item.iconStatus === 1
                ? getImgUrl('loading_host.png')
                : item.iconStatus === 2
                ? getImgUrl('loading_stand.png')
                : item.iconStatus === 3
                ? getImgUrl('loading_host.png')
                : ''
            "
          />
          <img
            v-if="item.status === 4"
            :src="
              item.iconStatus === 0
                ? getImgUrl('error_sit.png')
                : item.iconStatus === 1
                ? getImgUrl('error_robot.png')
                : item.iconStatus === 2
                ? getImgUrl('error_stand.png')
                : item.iconStatus === 3
                ? getImgUrl('error_host.png')
                : ''
            "
          />
          <div class="hover_info" v-show="item.serial == item.hoverIdx">
            <img
              class="hover_img"
              :src="
                item.status == 1
                  ? getImgUrl('project_2.png')
                  : item.status == 2
                  ? getImgUrl('project_1.png')
                  : item.status == 3
                  ? getImgUrl('project_4.png')
                  : item.status == 4
                  ? getImgUrl('project_3.png')
                  : ''
              "
            />
            <p
              :style="{
                color:
                  item.status == 1
                    ? '#d0d0d0'
                    : item.status == 2
                    ? '#a3d4fb'
                    : item.status == 3
                    ? '#f7f7f7'
                    : item.status == 4
                    ? '#f8d796'
                    : '',
              }"
            >
              综合工程师
            </p>
          </div>
        </li>
      </div>
      <div class="bg_box">
        <span class="person_type">技术专家</span>
        <li
          class="li"
          v-for="item in infoList.postTwoList.slice(4, 7)"
          :key="item.serial"
          @mouseenter="hovers(item.serial, 'postTwoList')"
          @mouseleave="leaves(item.serial, 'postTwoList')"
        >
          <img
            v-if="item.status === 1"
            :src="
              item.iconStatus === 0
                ? getImgUrl('dark_sit.png')
                : item.iconStatus === 1
                ? getImgUrl('dark_robot.png')
                : item.iconStatus === 2
                ? getImgUrl('dark_stand.png')
                : item.iconStatus === 3
                ? getImgUrl('dark_host.png')
                : ''
            "
          />
          <img
            v-if="item.status === 3"
            :src="
              item.iconStatus === 0
                ? getImgUrl('bright_sit.png')
                : item.iconStatus === 1
                ? getImgUrl('bright_robot.png')
                : item.iconStatus === 2
                ? getImgUrl('bright_stand.png')
                : item.iconStatus === 3
                ? getImgUrl('bright_host.png')
                : ''
            "
          />
          <img
            v-if="item.status === 2"
            :src="
              item.iconStatus === 0
                ? getImgUrl('loading_sit.png')
                : item.iconStatus === 1
                ? getImgUrl('loading_host.png')
                : item.iconStatus === 2
                ? getImgUrl('loading_stand.png')
                : item.iconStatus === 3
                ? getImgUrl('loading_host.png')
                : ''
            "
          />
          <img
            v-if="item.status === 4"
            :src="
              item.iconStatus === 0
                ? getImgUrl('error_sit.png')
                : item.iconStatus === 1
                ? getImgUrl('error_robot.png')
                : item.iconStatus === 2
                ? getImgUrl('error_stand.png')
                : item.iconStatus === 3
                ? getImgUrl('error_host.png')
                : ''
            "
          />
          <div class="hover_info" v-show="item.serial == item.hoverIdx">
            <img
              class="hover_img"
              :src="
                item.status == 1
                  ? getImgUrl('project_2.png')
                  : item.status == 2
                  ? getImgUrl('project_1.png')
                  : item.status == 3
                  ? getImgUrl('project_4.png')
                  : item.status == 4
                  ? getImgUrl('project_3.png')
                  : ''
              "
            />
            <p
              :style="{
                color:
                  item.status == 1
                    ? '#d0d0d0'
                    : item.status == 2
                    ? '#a3d4fb'
                    : item.status == 3
                    ? '#f7f7f7'
                    : item.status == 4
                    ? '#f8d796'
                    : '',
              }"
            >
              技术专家
            </p>
          </div>
        </li>
      </div>
      <div class="bg_box">
        <span class="person_type">安全工程师</span>
        <li
          class="li"
          v-for="item in infoList.postTwoList.slice(7, 10)"
          :key="item.serial"
          @mouseenter="hovers(item.serial, 'postTwoList')"
          @mouseleave="leaves(item.serial, 'postTwoList')"
        >
          <img
            v-if="item.status === 1"
            :src="
              item.iconStatus === 0
                ? getImgUrl('dark_sit.png')
                : item.iconStatus === 1
                ? getImgUrl('dark_robot.png')
                : item.iconStatus === 2
                ? getImgUrl('dark_stand.png')
                : item.iconStatus === 3
                ? getImgUrl('dark_host.png')
                : ''
            "
          />
          <img
            v-if="item.status === 3"
            :src="
              item.iconStatus === 0
                ? getImgUrl('bright_sit.png')
                : item.iconStatus === 1
                ? getImgUrl('bright_robot.png')
                : item.iconStatus === 2
                ? getImgUrl('bright_stand.png')
                : item.iconStatus === 3
                ? getImgUrl('bright_host.png')
                : ''
            "
          />
          <img
            v-if="item.status === 2"
            :src="
              item.iconStatus === 0
                ? getImgUrl('loading_sit.png')
                : item.iconStatus === 1
                ? getImgUrl('loading_host.png')
                : item.iconStatus === 2
                ? getImgUrl('loading_stand.png')
                : item.iconStatus === 3
                ? getImgUrl('loading_host.png')
                : ''
            "
          />
          <img
            v-if="item.status === 4"
            :src="
              item.iconStatus === 0
                ? getImgUrl('error_sit.png')
                : item.iconStatus === 1
                ? getImgUrl('error_robot.png')
                : item.iconStatus === 2
                ? getImgUrl('error_stand.png')
                : item.iconStatus === 3
                ? getImgUrl('error_host.png')
                : ''
            "
          />
          <div class="hover_info" v-show="item.serial == item.hoverIdx">
            <img
              class="hover_img"
              :src="
                item.status == 1
                  ? getImgUrl('project_2.png')
                  : item.status == 2
                  ? getImgUrl('project_1.png')
                  : item.status == 3
                  ? getImgUrl('project_4.png')
                  : item.status == 4
                  ? getImgUrl('project_3.png')
                  : ''
              "
            />
            <p
              :style="{
                color:
                  item.status == 1
                    ? '#d0d0d0'
                    : item.status == 2
                    ? '#a3d4fb'
                    : item.status == 3
                    ? '#f7f7f7'
                    : item.status == 4
                    ? '#f8d796'
                    : '',
              }"
            >
              安全工程师
            </p>
          </div>
        </li>
      </div>
      <span class="label">人工</span>
    </ul>

    <div class="legend">
      <ul>
        <li>
          <img src="../../../assets/image/bright_sit.png" />
          <p>人工岗</p>
        </li>
        <li>
          <img src="../../../assets/image/bright_robot.png" />
          <p>自动岗</p>
        </li>
        <li>
          <img src="../../../assets/image/bright_stand.png" />
          <p>人工质量</p>
        </li>
        <li>
          <img src="../../../assets/image/bright_host.png" />
          <p>自动质量</p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import LeaderLine from '@/utils/leader-line.min.js'
import { watch } from 'vue'
let props = defineProps({
  list: {
    type: Object,
    default: () => [],
  },
  serial: {
    type: [Number, String],
  },
})

function getImgUrl(img) {
  return new URL(`../../../assets/image/${img}`, import.meta.url).href
}

/**
 * @param status 当前进度状态 1.暗 2.蓝 3.白 4.红
 * @param serial 序号
 * @param iconStatus 图标类型 0.人工岗 1.自动岗 2.人工质量 3.自动质量
 */
const infoList = ref({
  // 第一排数据
  postList: [
    {
      status: 1,
      serial: 1,
      iconStatus: 0,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 2,
      iconStatus: 0,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 3,
      iconStatus: 2,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 4,
      iconStatus: 0,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 5,
      iconStatus: 0,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 6,
      iconStatus: 0,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 7,
      iconStatus: 2,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 8,
      iconStatus: 0,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 9,
      iconStatus: 0,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 10,
      iconStatus: 0,
      hoverIdx: null,
    },
  ],
  // 第二排数据
  autoList: [
    {
      status: 1,
      serial: 11,
      iconStatus: 1,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 12,
      iconStatus: 1,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 13,
      iconStatus: 1,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 14,
      iconStatus: 1,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 15,
      iconStatus: 1,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 16,
      iconStatus: 1,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 17,
      iconStatus: 1,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 18,
      iconStatus: 1,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 19,
      iconStatus: 1,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 20,
      iconStatus: 1,
      hoverIdx: null,
    },
  ],
  // 第三排数据
  autoHostList: [
    {
      status: 1,
      serial: 21,
      iconStatus: 1,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 22,
      iconStatus: 1,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 23,
      iconStatus: 1,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 24,
      iconStatus: 1,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 25,
      iconStatus: 1,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 26,
      iconStatus: 1,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 27,
      iconStatus: 1,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 28,
      iconStatus: 1,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 29,
      iconStatus: 1,
      hoverIdx: null,
    },
  ],
  // 第四排数据
  autoTwoList: [
    {
      status: 1,
      serial: 30,
      iconStatus: 1,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 31,
      iconStatus: 1,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 32,
      iconStatus: 1,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 33,
      iconStatus: 1,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 34,
      iconStatus: 1,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 35,
      iconStatus: 1,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 36,
      iconStatus: 1,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 37,
      iconStatus: 1,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 38,
      iconStatus: 1,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 39,
      iconStatus: 1,
      hoverIdx: null,
    },
  ],
  // 第五排数据
  postTwoList: [
    {
      status: 1,
      serial: 40,
      iconStatus: 0,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 41,
      iconStatus: 0,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 42,
      iconStatus: 0,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 43,
      iconStatus: 0,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 44,
      iconStatus: 2,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 45,
      iconStatus: 2,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 46,
      iconStatus: 2,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 47,
      iconStatus: 0,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 48,
      iconStatus: 0,
      hoverIdx: null,
    },
    {
      status: 1,
      serial: 49,
      iconStatus: 0,
      hoverIdx: null,
    },
  ],
})
const lines = ref([])
const itemList = ref([])
const timer = ref(null)
const isFlag = ref(true)
const idx = ref(null)
const isPostLine = ref(true)

watch(
  () => props.list,
  (n, o) => {
    if (JSON.stringify(n) !== JSON.stringify(o)) {
      if (JSON.stringify(n) == '{}' || n.postLineList.length === 0) {
        lines.value = []
        infoList.value.postList.forEach((item) => {
          item.status = 1
        })
        itemList.value.forEach((item) => {
          item.remove()
        })
        itemList.value = []
      } else {
        lines.value = n.postLineList
        infoList.value.postList.forEach((item) => {
          foreach(n, item)
        })
        infoList.value.autoList.forEach((item) => {
          foreach(n, item)
        })
        infoList.value.autoHostList.forEach((item) => {
          foreach(n, item)
        })
        infoList.value.autoTwoList.forEach((item) => {
          foreach(n, item)
        })
        infoList.value.postTwoList.forEach((item) => {
          foreach(n, item)
        })
        isPostLine.value = n.postLineList.length ? true : false
        if (n.postLineList.length) {
          setTimeout(() => {
            init()
          }, 500)
        }
      }
    }
  }
)

function foreach(val, item) {
  if (val.postList !== undefined) {
    const arr = val.postList.map(item=>{
      return item.serial
    })
    val.postList.forEach((v) => {
      if (item.serial === v.serial) {
        item.status = v.status
      }
    })
    if (!arr.includes(item.serial)) {
      item.status = 1
    }
  }
}

const init = () => {
  const styleOption = {
    // 连线颜色 coral （默认） , 取值参考颜色值
    color: '#ffb800',
    // 连线尺寸 4（默认）
    size: 3,
    // 连线类型 straight 直线 , arc 曲线 , fluid 流体线（默认） , magnet 磁铁线 , grid 折线
    path: 'grid',
    // 连线边框显示 false （默认）
    outline: false,
    // 连线边框颜色 indianred （默认） , 取值参考颜色值
    outlineColor: 'rgba(0,255,255,0)',
    // 连线使用虚线 true 开启 ， false 不开启（默认）
    dash: {
      // 绘制线的长度 'auto'=size*2
      len: 'auto',
      // 绘制线之间的间隙 'auto'=size
      gap: 7,
      // 线条滚动 true 是({duration: 1000, timing: 'linear'}，详见动画选项)， false 否（默认）
      animation: {
        duration: 1000,
        timing: 'linear',
      },
    },
    hide: true,
    // 连线使用渐变色 true 开启 ， false 不开启（默认）
    // 渐变色开始色为startPlugColor，渐变色结束色为endPlugColor
    gradient: false,
    // // 连线开始元素
    // start: "",
    // // 连线结束元素
    // end: "",
    // 连线从元素某侧开始 top 上 , right 右 , bottom 下 , left 左 , auto 自适应（默认）
    startSocket: '',
    // 连线从元素某侧结束
    endSocket: '',
    // 连线开始点样式
    // disc 圆形 , square 方形 , arrow1 箭头1 , arrow2 箭头2 , arrow3 箭头3 ,
    // hand 手指 , crosshair 十字准线 , behind 无（默认）
    startPlug: 'behind',
    // 连线结束点样式 arrow1 箭头1（默认）
    endPlug: 'arrow3',
    // 连线开始点颜色 auto 自适应（默认） , 取值参考颜色值
    startPlugColor: '#ff3792',
    // 连线结束点颜色
    endPlugColor: '',
    // 连线开始点尺寸 1 （默认）
    startPlugSize: 1,
    // 连线结束点尺寸 1 （默认）
    endPlugSize: 1.2,
    // 连线开始文字 默认为空
    startLabel: '',
    // 连线中间文字 默认为空
    middleLabel: '',
    // 连线结束文字 默认为空
    endLabel: '',
  }
  const itemEl = document.getElementsByClassName('li')
  if (!isFlag.value) {
    if (itemList.value.length) {
      itemList.value.forEach((item, index) => {
        item.remove()
        if (index === itemList.value.length - 1) {
          isFlag.value = true
          init()
        }
      })
    }
  }
  if (isFlag.value) {
    isFlag.value = false
    itemList.value = lines.value.map((item, i) => {
      idx.value = i
      if ((item.start - 1) <= 9) {
        styleOption.startSocket = 'bottom'
        if (item.end-1 > 9) {
          styleOption.endSocket = 'top'
        }else {
          styleOption.endSocket = 'bottom'
        }
        
      } else if ((item.start - 1) > 38 && item.start - 1 <= 48) {
        styleOption.startSocket = 'top'
      }else {
        styleOption.startSocket = ''
        styleOption.endSocket = ''
      }
      return new LeaderLine({
        ...styleOption,
        start: itemEl[item.start - 1],
        end: itemEl[item.end - 1],
      })
    })
    if (idx.value == lines.value.length - 1) {
      let animationOptions = {
        duration: 1000,
        timing: 'ease-in',
      }
      itemList.value.forEach((item) => {
        item.show('draw', animationOptions)
      })
    }
  }
}
const changPosition = () => {
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = null
  }
  timer.value = setTimeout(() => {
    itemList.value.forEach((item) => {
      item.position()
    })
  }, 300)
}
const hovers = (num, code) => {
  infoList.value[code].forEach((item) => {
    if (item.serial == num) {
      item.hoverIdx = num
    }
  })
}
const leaves = (num, code) => {
  infoList.value[code].forEach((item) => {
    if (item.serial == num) {
      item.hoverIdx = null
    }
  })
}

onMounted(() => {
  window.addEventListener('resize', changPosition)
})
onUnmounted(() => {
  itemList.value.forEach((item) => {
    item.remove()
  })
  window.removeEventListener('resize', changPosition)
})
</script>
<style lang="scss" scoped>
.flow_icon {
  width: 100%;
  height: 450px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 10px;
  padding: 10px;
  position: relative;

  .ul_common {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;
    position: relative;
    padding: 0;
    margin: 0;

    .center_info {
      width: 100%;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      position: relative;
    }

    .alone {
      padding-left: 50px;
      padding-right: 50px;
    }

    .bg_box {
      height: 74px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(15, 107, 213, 0.5);
      border-radius: 60px;
      position: relative;
      padding: 0 10px;

      .person_type {
        font-size: 12px;
        color: #fff;
        font-weight: bold;
        position: absolute;
        top: 0px;
        left: 50%;
        white-space: nowrap;
        transform: translateX(-50%) scale(0.9);
      }
    }

    li {
      height: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      position: relative;
      padding: 0 10px;

      img {
        width: 60px;
        height: 60px;
      }
    }

    #alone_bg {
      width: 65px;
      background: url('../../../assets/image/cloud_2.png') no-repeat;
      background-size: 100% 100%;
      img {
        width: 60px;
        height: 60px;
      }
    }

    .item_box_bg {
      width: 55px;
      height: 50px;
      background: url('../../../assets/image/cloud_1.png') no-repeat;
      background-size: 100% 60%;
      background-position: bottom;

      img {
        width: 55px;
        height: 55px;
      }
    }

    .label {
      width: 20px;
      font-size: 22px;
      color: #fff;
      position: absolute;
      right: 20px;
    }
  }

  .top_box {
    height: 100px;
    padding: 8px 0;
    background: url('../../../assets/image/j2_1.png') no-repeat;
    background-size: 100% 100%;
    padding-right: 20px;
  }

  .center_box {
    height: 220px;
    padding: 10px 0;
    background: url('../../../assets/image/j1.png') no-repeat;
    background-size: 100% 100%;
    margin: 6px 0;
    li {
      padding: 0;
    }
  }

  .bottom_box {
    height: 100px;
    padding: 8px 0;
    background: url('../../../assets/image/j2_1.png') no-repeat;
    background-size: 100% 100%;
    padding-right: 30px;
  }

  .hover_info {
    .hover_img {
      position: absolute;
      width: 100px;
      height: 70px;
      top: -50px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
    }

    p {
      margin: 0;
      width: 80px;
      position: absolute;
      top: -48px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
      color: #fff;
      font-size: 13px;
      text-align: center;
      line-height: 35px;
    }
  }
}

.legend {
  width: 200px;
  background: #0b2844;
  border: 2px solid #018ee6;
  border-radius: 6px;
  position: absolute;
  top: -65px;
  right: 0;

  ul {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0;
    margin: 0;

    li {
      display: flex;
      flex-direction: column;
      align-items: center;
      transform: scale(0.7);

      img {
        width: 40px;
        height: 40px;
      }

      p {
        line-height: 1;
        color: #fff;
        font-size: 12px;
        margin-top: 3px;
        margin-bottom: 0;
      }
    }
  }
}
</style>

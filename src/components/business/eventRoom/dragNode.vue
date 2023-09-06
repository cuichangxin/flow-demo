<!--
 * @Author: LiuFengRui
 * @Date: 2021-11-08 15:41:12
 * @LastEditTime: 2023-07-05 16:08:29
 * @LastEditors: Please set LastEditors
 * @Description: 
-->
<template>
  <div
    ref="node"
    :id="node.id"
    :style="nodeContainerStyle"
    @click="clickNode"
    :class="nodeContainerClass"
    @mouseup="changeNodeSite"
    @dblclick="setNode"
    @contextmenu.prevent="uploadImgInner(node, $event)"
  >
    <!-- 最左侧的那条竖线 -->
    <!-- <div class="ef-node-left"></div> -->
    <!-- 节点类型的图标 -->
    <!-- <div class="ef-node-left-ico flow-node-drag">
            <i :class="nodeIcoClass"></i>
        </div> -->
    <!-- 节点名称 -->
    <!-- <div class="ef-node-text" :show-overflow-tooltip="true">
      {{ node.name }}
    </div> -->
    <div class="gragh flow-node-drag">
      <img
        :src="
          node.nodeSetting.upload
            ? getSpecialImgUrl(node.nodeSetting.upload.split('/')[node.nodeSetting.upload.split('/').length-1])
            : getImgUrl(node.ico + '.png')
        "
        :id="node.id + '_img'"
      />
      <div
        class="innerText"
        v-show="node.attrInfo.name"
        :style="{
          color: node.attrInfo.color ? node.attrInfo.color : '#000',
          top: showParams.showTool || showParams.showPost ? '0' : '',
        }"
      >
        <img src="../../../assets/images/name.png" />
        <span style="font-weight:600;">{{ node.attrInfo.name }}</span>
      </div>
      <div
        class="innerText"
        v-show="showParams.showTool"
        v-if="!node.attrInfo.nohighAttr"
        :style="{
          color: node.attrInfo.color ? node.attrInfo.color : '#000',
          top: '22px',
          height: 'calc(50% - 11px)',
        }"
      >
        <ul v-if="node.attrInfo.tool.length">
          <li v-for="item in node.attrInfo.tool" :key="item">
            <img src="../../../assets/images/tool.png" />
            {{ item }}
          </li>
        </ul>
        <img
          v-if="!node.attrInfo.tool.length"
          src="../../../assets/images/tool.png"
        />
        <span v-if="!node.attrInfo.tool.length">无</span>
      </div>
      <div
        class="innerText"
        v-show="showParams.showPost"
        v-if="!node.attrInfo.nohighAttr"
        :style="{
          color: node.attrInfo.color ? node.attrInfo.color : '#000',
          top: 'calc(50% + 11px)',
          height: 'calc(50% - 11px)',
        }"
      >
        <ul v-if="node.attrInfo.post.length">
          <li v-for="item in node.attrInfo.post" :key="item">
            <img src="../../../assets/images/post.png" />
            {{ item }}
          </li>
        </ul>
        <!-- {{node.attrInfo.post.length?node.attrInfo.post.join(','):'无'}}</div> -->
        <!-- <input
        type="file"
        style="display: none"
        :id="node.id + '_input'"
        accept="images/*"
        @change="fileBtnInner(node, $event)"
      /> -->
        <img
          v-if="!node.attrInfo.post.length"
          src="../../../assets/images/post.png"
        />
        <span v-if="!node.attrInfo.post.length">无</span>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default defineComponent({
  name: "",
  components: {},
  props: {
    node: Object,
    activeElement: Object,
    showParams: Object,
  },
  setup(props, context) {
    const router = useRouter();
    const nodeContainerClass = computed(() => {
      return {
        "ef-node-container": true,
        "ef-node-active":
          props.activeElement.type == "node"
            ? props.activeElement.nodeId === props.node.id
            : false,
      };
    });
    const nodeContainerStyle = computed(() => {
      return {
        top: props.node.top,
        left: props.node.left,
        "box-shadow": props.node.reduceNode ? "blue 0px 0px 12px 0px" : "",
      };
    });
    const nodeIcoClass = computed(() => {
      var nodeIcoClass = {};
      // 添加该class可以推拽连线出来，viewOnly 可以控制节点是否运行编辑
      nodeIcoClass["flow-node-drag"] = true;
      return nodeIcoClass;
    });
    const state = reactive({
      setting: { line: "直线", upload: "" },
    });

    watch(
      () => [props.node.attrInfo.tool, props.node.attrInfo.post,props.showParams.showTool, props.showParams.showPost],
      ([newvalue], [newpost]) => {
        console.log(props.showParams.showTool, props.showParams.showPost,'11111111111')
        if(props.showParams.showTool||props.showParams.showPost){
          $("#" + props.node.id + " .gragh").css({
          height:
            66 +
            22 * props.node.attrInfo.tool.length +
            22 * props.node.attrInfo.post.length +
            "px",
        });
        }
        
      }
    );
    watch(
      () => [props.showParams.showTool, props.showParams.showPost],
      ([newvalue,newpost], [oldv,oldp]) => {
        console.log(newvalue,newpost,'11111',oldv,oldp)
        if(newvalue||newpost){
          $("#" + props.node.id).css({
            background:'#add6fa',
          })
           $("#" + props.node.id + '_img').css({ display:'none'
          })
          $("#" + props.node.id + " .gragh .innerText").css({
            'border-bottom':'1px solid #75b3fc'
          })
        }else{
          $("#" + props.node.id).css({
            background:'#fff',
          })
          $("#" + props.node.id + '_img').css({ display:'block'
          })
          $("#" + props.node.id + " .gragh .innerText").css({
            'border-bottom':'none'
          })
          $("#" + props.node.id + " .gragh").css({
          height:'66px'
        });
        }
      }
    );
    const methods = {
      getSpecialImgUrl(img){
        return new URL(`../../../assets/images/${img}`,import.meta.url).href
      },
      getImgUrl(img) {
        return new URL(`../../../assets/images/${img}`, import.meta.url).href
      },
      // 点击节点
      clickNode() {
        context.emit("clickNode", props.node);
      },
      //改变图示
      uploadImgInner(data, event) {
        event.stopPropagation();
        state.setting.upload = props.node.nodeSetting.upload
          ? props.node.nodeSetting.upload
          : new URL(`../../../assets/images/${props.node.ico}.png`, import.meta.url).href
        context.emit("uploadImgInner", {
          setting: state.setting,
          nodeId: props.node.id,
        });
        // let fileBtn = document.getElementById(data.id + "_input");
        // fileBtn.click();
        // event.cancelBubble = true
      },
      // 鼠标移动后抬起
      changeNodeSite() {
        // 避免抖动
        if (
          props.node.left ==
            document.getElementById(props.node.id).style.left &&
          props.node.top == document.getElementById(props.node.id).style.top
        ) {
          return;
        }
        context.emit("changeNodeSite", {
          nodeId: props.node.id,
          left: document.getElementById(props.node.id).style.left,
          top: document.getElementById(props.node.id).style.top,
        });
      },
      setNode() {
        context.emit("setNode", props.node);
      },
      // fileBtnInner(data, e) {
      //   const fileObj = e.target.files[0];
      //   const windowURL = window.URL || window.webkitURL;
      //   if (fileObj) {
      //     const imgURL = windowURL.createObjectURL(fileObj);
      //     // let userImg = document.getElementById(data.id+"_img")
      //     data.upload = imgURL;
      //     // console.log(userImg.src)
      //     // userImg.style.backgroundImage = "url("+imgURL+")";
      //   }
      // },
    };

    onMounted(() => {
      // let a = document.getElementById(props.node.id)
      // console.log([a])
      // console.log(window)
      //拖动过来之后默认选中
      nextTick(() => {
        methods.clickNode();
      });
      if (props.node.nodeSetting.upload) {
        let a = props.node.nodeSetting.upload.split('/')
        console.log(a[a.length-1]);
      }
    });
    onUnmounted(() => {});
    return {
      ...toRefs(state),
      ...methods,
      nodeContainerClass,
      nodeContainerStyle,
      nodeIcoClass,
    };
  },
});
</script>
<style lang="less">
@import "../../../assets/styles/css/main.less";

.menu {
  position: absolute;
  width: auto;
  height: auto;
  background: #f9fcff;
  border-top: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
  border-right: 1px solid #dcdfe6;
  .oneMenu {
    width: 8rem;
    height: 3rem;
    border-bottom: 1px solid #dcdfe6;
    .flex_center;
  }
}
.ef-node-container {
  position: absolute;
  display: flex;
  // width: 170px;
  // height: 32px;
  // border: 1px solid #e0e3e7;
  border-radius: 5px;
  // background-color: #fff;
  width: auto;
  height: auto;
  // z-index:1;
  // width: 120px;
  //     height: 66px;
  .gragh {
    position: relative;
    width: 120px;
    height: 66px;
    display: flex;
    justify-content: center;
    align-items: center;
    // flex-direction: column;
    img {
      width: 96%;
      height: 96%;
    }
    .innerText {
      position: absolute;
      // width: 90%;
      // height: 30%;
      width: 110px;
      height: 22px;
      color: #000;
      // border-bottom: 1px solid #ce8684;
      .flex_center;
      // .text-overflow;
      word-break: break-all;
      text-align: center;
      ul {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
      }
      img {
        height: 15px;
        width: 15px;
        margin-right: 2px;
      }
    }
  }
  .gragh:hover {
    cursor: crosshair;
    img:hover {
      cursor: move;
    }
    .innerText:hover {
      cursor: move;
    }
  }
}

.ef-node-container:hover {
  /* 设置移动样式*/
  cursor: move;
  background-color: #fff;
  box-shadow: #1879ff 0px 0px 12px 0px;
  background-color: #fff;
  border: 1px dashed #1879ff;
}

/*节点激活样式*/
.ef-node-active {
  position: absolute;
  background-color: #fff;
  /*box-shadow: #1879FF 0px 0px 12px 0px;*/
  background-color: #fff;
  border: 1px solid #1879ff;
}
</style>

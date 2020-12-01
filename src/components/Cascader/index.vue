<style scoped lang="scss">
.el-popover {
  padding: 2px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
  cursor: pointer;
}
ul {
  display: flex;
  flex-direction: column;
}
</style>

<template>
  <div class="cascader-container">
    <el-input
      v-popover:popover
      v-model="val"
      :style="{ 'max-width': `${width}px` }"
      v-bind="iptProps"
      @input="onInput"
    >
    </el-input>
    <i
      class="el-icon-arrow-down"
      :style="{ position: 'relative', left: '-25px' }"
      v-if="downOrup"
    ></i>
    <i
      v-else
      class="el-icon-arrow-up"
      :style="{ position: 'relative', left: '-25px' }"
    ></i>
    <el-popover ref="popover" id="popover" v-model="visiablePopover">
      <!-- <div> -->
      <ul v-if="getShowFilter">
        <li
          v-for="(item, index) in filterableOpt"
          :key="index"
          @click="onClickOpt(item)"
        >
          {{ item.labelPath }}
        </li>
      </ul>
      <!-- </div> -->
      <CascaderItem
        v-else
        :options="source"
        :level="0"
        :selected="selected"
        :val="val"
        @updateSelected="onUpdateSelected"
      ></CascaderItem>
    </el-popover>
  </div>
</template>
<script lang="ts">
import {
  Component,
  Mixins,
  Ref,
  Prop,
  Vue,
  Watch,
} from "vue-property-decorator";
import { CascaderItem } from "./components/index";
import Node from "./components/node";
@Component({
  name: "Cascader",
  components: {
    CascaderItem,
  },
})
export default class extends Vue {
  @Prop({
    type: Array,
    default() {
      return [];
    },
  })
  options: any;

  @Prop()
  value: any;

  @Prop({
    type: Object,
    default() {
      return {
        value: "id",
        label: "text",
      };
    },
  })
  props: any;

  @Prop({
    type: Number,
    default: 250,
  })
  width: any;

  @Prop({
    type: Object,
    default() {
      return {};
    },
  })
  iptProps: any;
  @Prop({
    type: Boolean,
    default: true,
  })
  filterable: any;
  private source: any = [];
  private selected: any = [];
  private val = "";
  private filterableVal = "";
  private visiablePopover = false;
  private filterableOpt: any = [];
  private filterableSource: any = [];
  //更新数据
  onUpdateSelected(newVal: any, flag: boolean) {
    this.selected = newVal;
    this.handleProps();
  }

  //将数据返回给用户
  handleProps() {
    this.val = this.handleMapSelected(this.props.label).join("/");
    const selectValId = this.handleMapSelected(this.props.value);
    this.$emit("input", selectValId);
  }

  //处理数据
  handleMapSelected(prop: string) {
    return this.selected.map((item: any) => item[prop]);
  }
  //对数据添加checked属性
  //   handleSource(data: any) {
  //     let ary = JSON.parse(JSON.stringify(data));
  //     if (!Array.isArray(ary)) return;
  //     return ary.map((item: any) => {
  //       this.$set(item, "checked", false);

  //       if (item.children && item.children.length > 0) {
  //         item["children"] = this.handleSource(item.children);
  //       }
  //       return { ...item };
  //     });
  //   }
  //搜索数据
  handleLabelToPath(args: any) {
    let baseArr = JSON.parse(JSON.stringify(args));
    let index = 0;
    let arr: any = [];
    while (index < baseArr.length) {
      arr.push(baseArr[index].pathObj);
      if (baseArr[index].children && baseArr[index].children.length !== 0) {
        baseArr = baseArr.concat(baseArr[index].children);
      }
      ++index;
    }
    return arr;
  }
  //原始数据新增pathObj属性和checked数据
  handleNodeToPath() {
    let arr = JSON.parse(JSON.stringify(this.options));
    let _this = this;
    noop(arr, "", "");
    function noop(child: any, text: string, idPath: string) {
      return child.map((val: any) => {
        _this.$set(val, "checked", false);
        const path = text + val.text + "/";
        const id = idPath + val.id + "/";
        val.pathObj = { labelPath: path.slice(0, -1), id: id.slice(0, -1) };
        if (val.children && val.children.length !== 0) {
          noop(val.children, path, id);
        }
      });
    }
    return arr;
  }
  //初始化数据
  initSate() {
    const ary = (this.source = this.handleNodeToPath());
    this.filterableOpt = this.filterableSource = this.handleLabelToPath(ary);
  }
  //点击li的值
  onClickOpt(item: any) {
    this.val = item.labelPath;
    this.$emit(
      "input",
      item.id.split("/").map((id: string) => Number(id))
    );
  }
  //输入框的值
  onInput(newVal: any) {
    this.filterableVal = newVal;
    if (!newVal) {
      this.filterableOpt = this.filterableSource;
    }
    this.filterableOpt = this.filterableOpt.filter((item: any) =>
      item.labelPath.includes(newVal)
    );
  }
  //显示up or down
  get downOrup() {
    if (this.visiablePopover) {
      return false;
    } else {
      return true;
    }
  }
  get getShowFilter() {
    if (this.filterable && this.filterableVal) {
      return true;
    } else {
      return false;
    }
  }
  @Watch("options", { deep: true, immediate: true })
  handleOpt(newVal: any) {
    this.initSate();
  }
}
</script>

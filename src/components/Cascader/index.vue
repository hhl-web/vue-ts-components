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
import { Tag } from "element-ui";
import {
  Component,
  Mixins,
  Ref,
  Prop,
  Vue,
  Watch,
} from "vue-property-decorator";
import { CascaderItem } from "./components/index";
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
  value: Array<any> | any;

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
    console.log(newVal, "new", this.source);
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
  //广度搜索数据
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
  //串行遍历原始数据新增pathObj属性和checked数据
  handleNodeToPath(data: any, bool: boolean, idVal: any) {
    let arr = JSON.parse(JSON.stringify(data));
    let _this = this;
    noop(arr, "", "");
    function noop(child: any, text: string, idPath: string) {
      return child.forEach((val: any, index: number) => {
        const path = text + val.text + "/";
        const id = idPath + val.id + "/";
        val.pathObj = { labelPath: path.slice(0, -1), id: id.slice(0, -1) };
        if (idVal === val.id) {
          _this.$set(val, "checked", !bool);
        } else {
          _this.$set(val, "checked", bool);
        }
        if (val.children && val.children.length !== 0) {
          noop(val.children, path, id);
        }
      });
    }
    return arr;
  }
  //处理映射
  handleMapId(id: any, parentData: any, data: any) {
    let target: any = [];
    let index = 0;
    while (index <= data.length - 1) {
      if (data[index].id === id) {
        target = target.concat(parentData, data[index]);
        break;
      }
      if (data[index].children && data[index].children.length !== 0) {
        parentData.push(data[index]);
        target = target.concat(
          this.handleMapId(id, parentData, data[index].children)
        );
        parentData = [];
      }
      ++index;
    }
    return target;
  }
  //初始化数据
  initSate() {
    const ary = (this.source = this.handleNodeToPath(
      this.options,
      false,
      this.value
    ));
    this.filterableOpt = this.filterableSource = this.handleLabelToPath(ary);
    this.selected = this.handleMapId(this.value, [], this.source);
    this.val = this.handleMapSelected(this.props.label).join("/");
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

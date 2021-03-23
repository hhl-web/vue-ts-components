<template>
  <div class="cascader-container" ref="cascader">
    <!--v-popover:popover -->
    <el-input
      v-model="changeValToStr"
      v-bind="iptProps"
      @input="onInput"
      @clear="onClear"
      @focus="onFocus"
    >
      <template slot="append">
        <i class="el-icon-arrow-down" v-if="downOrup"></i>
        <i v-else class="el-icon-arrow-up"></i>
      </template>
    </el-input>
    <div class="card-container" v-show="visiablePopover">
      <template v-if="getShowFilter">
        <filter-item
          @onClickOpt="onClickOpt"
          :filterableOpt="filterableOpt"
        ></filter-item>
      </template>
      <template v-else>
        <CascaderItem
          ref="cascaderItem"
          :options="source"
          :level="0"
          :changeValToStr="changeValToStr"
          :selected.sync="selected"
          :isCheckbox="isCheckbox"
          :isInput="isInput"
          :reverseChoice="reverseChoice"
          :objKey="key"
          :objLabel="label"
        ></CascaderItem>
      </template>
    </div>
    <!-- <el-popover ref="popover" id="popover" v-model="visiablePopover" trigger="focus">
      <template v-if="getShowFilter">
        <filter-item @onClickOpt="onClickOpt" :filterableOpt="filterableOpt"></filter-item>
      </template>
      <template v-else>
        <CascaderItem
        :options="source"
        :level="0"
        :changeValToStr="changeValToStr"
        :selected.sync="selected"
        :isCheckbox="isCheckbox"
        :isInput="isInput"
        :reverseChoice="reverseChoice"
      ></CascaderItem>
      </template>
    </el-popover> -->
  </div>
</template>
<script lang="ts">
import {
  Component,
  Mixins,
  Ref,
  Prop,
  Vue,
  Watch
} from "vue-property-decorator";
import { CascaderItem, FilterItem } from "./components/index";
@Component({
  name: "Cascader",
  components: {
    CascaderItem,
    FilterItem
  }
})
export default class extends Vue {
  @Prop({
    type: Array,
    default() {
      return [];
    }
  })
  options: any;

  @Prop()
  value: Array<any> | any;

  @Prop({
    type: Object,
    default() {
      return {
        value: "id",
        label: "text"
      };
    }
  })
  props: any;

  // 搜索框的属性
  @Prop({
    type: Object,
    default() {
      return {};
    }
  })
  iptProps: any;

  //是否可搜索
  @Prop({
    type: Boolean,
    default: true
  })
  filterable: any;

  // 是否需要checkbox框
  @Prop({
    type: Boolean,
    default: false
  })
  isCheckbox: any;

  //是否可搜索
  @Prop({
    type: Boolean,
    default: false
  })
  isInput: any;

  @Prop({
    type: Boolean,
    default: false
  })
  reverseChoice: any; //处理是否正反选

  @Ref() cascader!: any;
  private source: any = []; //资源池
  private selected: any = []; //选中的数组
  private changeValToStr = "";
  private filterableVal = "";
  private visiablePopover = false;
  private filterableOpt: any = []; //过滤好的数据
  private filterableSource: any = []; //过滤总数据
  private initSelected = true; //初始面板时的输入框状态
  private itemValue = [];

  private handleEvents(evt: any) {
    if (this.cascader && this.cascader.contains(evt.target)) {
      this.visiablePopover = true;
    } else {
      this.visiablePopover = false;
    }
  }
  mounted() {
    document.addEventListener("click", this.handleEvents);
  }
  beforeDestroy() {
    document.removeEventListener("click", this.handleEvents);
  }
  // 获取焦点
  onFocus() {
    this.visiablePopover = true;
  }
  //清除
  onClear() {
    this.initSate();
    this.$emit("input", []);
    this.$emit("onChange", []);
  }

  //将数据返回给用户
  handleProps() {
    this.changeValToStr = this.handleMapSelected(this.props.label).join("/"); //将数据转化
    this.itemValue = this.handleMapPath();
    if (this.itemValue.length) {
      this.$emit("input", JSON.parse(JSON.stringify(this.itemValue)));
      this.$emit("onChange", JSON.parse(JSON.stringify(this.itemValue)));
    }
  }
  // 处理数据=>根据pathObj字段获取选中的值
  handleMapPath() {
    const pathArr = this.selected[this.selected.length - 1];
    return pathArr
      ? pathArr["pathObj"]
        ? pathArr["pathObj"].id.split("/").map((id: any) => Number(id))
        : []
      : [];
  }

  //处理数据=>映射选中的值
  handleMapSelected(prop: string) {
    return this.selected.map((item: any) => item[prop]);
  }
  //广度搜索数据
  handleLabelToPath(args: any) {
    let baseArr = JSON.parse(JSON.stringify(args));
    let index = 0;
    const arr: any = [];
    while (index < baseArr.length) {
      arr.push(baseArr[index].pathObj);
      if (baseArr[index].children && baseArr[index].children.length !== 0) {
        baseArr = baseArr.concat(baseArr[index].children);
      }
      ++index;
    }
    return arr;
  }
  //串行遍历原始数据:新增pathObj属性和checked属性，以及checkbox框的初始状态。
  handleNodeToPath(data: any, bool: boolean, idVal: any) {
    const arr = JSON.parse(JSON.stringify(data));
    const noop = (child: any, text: string, idPath: string) => {
      return child.forEach((val: any, index: number) => {
        const path = text + val.text + "/"; //文本路径拼接
        const id = idPath + val.id + "/"; //id拼接
        val.pathObj = { labelPath: path.slice(0, -1), id: id.slice(0, -1) };
        if (idVal === val.id) {
          this.$set(val, "checked", !bool);
        } else {
          this.$set(val, "checked", bool);
        }
        if (val.children && val.children.length !== 0) {
          noop(val.children, path, id);
        }
      });
    };
    noop(arr, "", "");
    return arr;
  }

  //根据value值映射selected的值
  handleMapId(id: any, data: any) {
    const source = [...data];
    let res = [];
    const noop = (arr: any, id: any, parent: any) => {
      let target: any = [];
      arr.forEach((item: any) => {
        if (item.id === id) {
          target = target.concat(parent, [item]);
        }
        if (item.children && item.children.length) {
          target = [...noop(item.children, id, [...parent, item]), ...target];
        }
      });
      return target;
    };
    res = noop(source, id, []);
    return res;
  }
  //初始化数据
  initSate() {
    const ary = (this.source = this.handleNodeToPath(
      this.options,
      false,
      this.value
    ));
    this.filterableOpt = this.filterableSource = this.handleLabelToPath(ary);
    this.changeValToStr = this.handleMapSelected(this.props.label).join("/");
  }
  // 初始化value
  initValueToSelected(val: any) {
    this.$nextTick(() => {
      this.selected = this.handleMapId(val, this.source);
    });
  }
  //初始化展开面板
  handleInitSelected() {
    const arr = [this.source[0]],
      result = [];
    while (arr.length) {
      const item = arr.shift();
      result.push(item);
      if (item.children) {
        arr.push(item.children[0]);
      }
    }
    return result;
  }
  //点击li的值
  onClickOpt(item: any) {
    this.changeValToStr = item.labelPath;
    this.itemValue = item.id.split("/").map((id: string) => Number(id));
    if (this.itemValue.length) {
      this.$emit("input", JSON.parse(JSON.stringify(this.itemValue)));
      this.$emit("onChange", JSON.parse(JSON.stringify(this.itemValue)));
    }
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
    return !this.visiablePopover;
  }
  get getShowFilter() {
    if (this.filterable && this.filterableVal) {
      return true;
    } else {
      return false;
    }
  }

  @Watch("selected")
  handleSelected(newVal: Array<any>) {
    if (this.initSelected) {
      this.handleProps();
    }
    this.initSelected = true;
  }

  @Watch("options", { deep: true, immediate: true })
  handleOpt(newVal: any) {
    this.initSate();
  }

  @Watch("value", { deep: true, immediate: true })
  handleValue(newVal: any) {
    if (newVal) {
      if (JSON.stringify(newVal) !== JSON.stringify(this.itemValue))
        this.initValueToSelected(newVal[newVal.length - 1]);
    }
  }

  @Watch("visiablePopover")
  handleVisiable(newVal: any) {
    if (newVal && this.itemValue.length == 0) {
      this.initSelected = false;
      this.selected = this.handleInitSelected();
    }
  }
}
</script>
<style scoped lang="scss">
.cascader-container {
  width: 300px;
  /deep/.el-input__inner {
    text-overflow: ellipsis;
    width: 300px;
  }
  .card-container {
    margin-top: 10px;
    position: absolute;
    z-index: 999;
    background: #ffffff;
    height: 290px;
    box-shadow: 0 2px 12px 0;
    border-radius: 4px;
  }
}
</style>

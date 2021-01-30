<template>
  <div class="cascader-container">
      <el-input
        v-popover:popover
        v-model="changeValToStr"
        v-bind="iptProps"
        @input="onInput"
        @clear="onClear"
        >
        <template slot="append">
          <i class="el-icon-arrow-down" v-if="downOrup"></i>
          <i v-else class="el-icon-arrow-up"></i>
        </template>
      </el-input>
    <el-popover ref="popover" id="popover" v-model="visiablePopover">
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
import { CascaderItem,FilterItem } from "./components/index";
@Component({
  name: "Cascader",
  components: {
    CascaderItem,
    FilterItem
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

  // 搜索框的属性
  @Prop({
    type: Object,
    default() {
      return {};
    },
  })
  iptProps: any;
  
  //是否可搜索
  @Prop({
    type: Boolean,
    default: true,
  })
  filterable: any;

  // 是否需要checkbox框
  @Prop({
    type:Boolean,
    default:false
  })
  isCheckbox:false;

  //是否可搜索
  @Prop({
    type:Boolean,
    default:false
  })
  isInput:false;

  @Prop({
    type:Boolean,
    default:false
  })
  reverseChoice:false;

  private source: any = [];     //资源池
  private selected: any = [];   //选中的数组
  private changeValToStr = "";
  private filterableVal = "";
  private visiablePopover = false;
  private filterableOpt: any = [];      //过滤好的数据
  private filterableSource: any = [];   //过滤总数据
  private initSelected=true;   //初始面板时的输入框状态
  //清除
  onClear() {
    this.initSate();
    this.$emit("input", []);
    this.$emit("onChange", []);
  }

  //将数据返回给用户
  handleProps() {
    this.changeValToStr = this.handleMapSelected(this.props.label).join("/");  //将数据转化
    const selectValId = this.handleMapSelected(this.props.value);
    this.$emit("input", selectValId);
    this.$emit("onChange", selectValId);
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
  //串行遍历原始数据:新增pathObj属性和checked属性，以及checkbox框的初始状态。
  handleNodeToPath(data: any, bool: boolean, idVal: any) {
    let arr = JSON.parse(JSON.stringify(data));
    let _this = this;
    noop(arr, "", "");
    function noop(child: any, text: string, idPath: string) {
      return child.forEach((val: any, index: number) => {
        const path = text + val.text + "/";   //文本路径拼接
        const id = idPath + val.id + "/";     //id拼接
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
  //根据value值映射selected的值
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
    this.changeValToStr = this.handleMapSelected(this.props.label).join("/");
    if(!this.selected.length){    //处理当用户没有默认绑定具体值时，初始化面板展开。
      this.initSelected=false;
      this.selected=this.handleInitSelected();
    }
  }
  //初始化展开面板
  handleInitSelected(){
    const  arr=[this.source[0]],result=[];
    while(arr.length){
      const item=arr.shift();
      result.push(item);
      if(item.children){
        arr.push(item.children[0]);
      }
    }
    return result;
  }
  //点击li的值
  onClickOpt(item: any) {
    this.changeValToStr = item.labelPath;
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
  handleSelected(newVal:Array<any>){
    if(this.initSelected){
      this.handleProps();
    }
    this.initSelected=true;
  }

  @Watch("options", { deep: true, immediate: true })
  handleOpt(newVal: any) {
    this.initSate();
  }
}
</script>
<style scoped lang="scss">
.cascader-container{
  /deep/.el-input__inner{
    width: 300px;
  }
  .el-popover {
    padding: 2px;
  }
}

</style>
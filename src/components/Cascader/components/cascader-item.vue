<template>
  <div class="cascader-item">
    <div class="left">
      <div class="search" v-if="isInput">
        <el-input
          size="mini"
          placeholder="请输入名称搜索"
          v-model="searchVal"
          @input="handleInput"
        ></el-input>
      </div>
      <div class="item-content">
        <template v-for="(item, index) in panelData">
          <div
            :key="`${index}_text`"
            class="label-item cursor"
            :class="{ active: handlerActive(item) }"
            @click="onClickText(item, $event)"
          >
            <div class="label">
              <template v-if="isCheckbox">
                <input
                  type="checkbox"
                  v-model="item.checked"
                  class="cursor"
                  id="checked"
                />
                <label for="checked"></label>
              </template>
              <span class="label">{{ item.text }}</span>
            </div>
            <i
              class="el-icon-arrow-right"
              v-if="item.children && item.children.length !== 0"
            ></i>
          </div>
        </template>
      </div>
    </div>
    <div class="right" v-if="showRightItem">
      <CascaderItem
        :level="level + 1"
        :selected.sync="selected"
        :options="showRightItem"
        :changeValToStr="changeValToStr"
        :isCheckbox="isCheckbox"
        :isInput="isInput"
        :reverseChoice="reverseChoice"
      ></CascaderItem>
    </div>
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
@Component({
  name: "CascaderItem"
})
export default class extends Vue {
  @Prop({
    type: Array,
    default() {
      return [];
    }
  })
  options: any;
  @Prop({
    type: Number,
    default: 0
  })
  level: any;
  @Prop({
    type: String,
    default: ""
  })
  changeValToStr: any;
  @Prop({
    type: Array,
    default() {
      return [];
    }
  })
  selected: any;
  @Prop({
    type: Boolean,
    default: false
  })
  isCheckbox: any;
  @Prop({
    type: Boolean,
    default: false
  })
  isInput: any;

  @Prop({
    type: Boolean,
    default: false
  })
  reverseChoice: any;

  private searchVal = "";
  private panelData = [];
  private initOptions = true;

  //处理input事件
  handleInput(evt: any) {
    if (this.searchVal) {
      this.panelData = this.options.filter((item: any) =>
        item.text.includes(this.searchVal)
      );
      const newLen = this.panelData.length;
      if (newLen) {
        this.initOptions = false;
      }
    } else {
      this.panelData = this.options;
    }
  }
  //处理被选中的样式
  handlerActive(item: any) {
    return this.selected.map((item: any) => item.text).includes(item.text);
  }
  //处理复选框值
  private handleChecked(bool: boolean) {
    const lastIdx = this.selected.length - 1;
    const lastSelected = this.selected[lastIdx];
    if (lastSelected) {
      lastSelected["checked"] = !bool;
    }
  }
  //反选的数据处理
  private handleVal() {
    let valCopy = [];
    if (this.changeValToStr.includes("/")) {
      valCopy = this.changeValToStr.split("/");
    } else {
      valCopy = this.changeValToStr.split(",");
    }
    return valCopy;
  }
  //处理正选和反选的逻辑
  private handleValCopy(item: any) {
    const valCopy = this.handleVal();
    const index = valCopy.indexOf(item.text);
    const len = this.selected.length;
    if (~index) {
      item.checked = false;
      this.selected.splice(index, len - index);
      this.handleChecked(false);
    } else {
      this.handleCheckedToTrue(item);
    }
  }

  //处理是否需要正选反选
  handleChoice(item: any) {
    if (this.reverseChoice) {
      this.handleValCopy(item); //如果需要就开启,是否需要反选的功能。
    } else {
      this.handleCheckedToTrue(item);
    }
  }
  //处理正选
  handleCheckedToTrue(item: any) {
    this.handleChecked(true);
    item.checked = true;
    this.selected[this.level] = item;
  }
  //点击处理
  private onClickText(item: any, evt: any) {
    this.handleChoice(item);
    this.selected.splice(this.level + 1); //如果第一位被换了，那么第二会要删除，实现切换数据视图一致的效果
    if (item.checked && item.children && item.children.length) {
      this.handleChidlrenZero(item.children);
    }
    this.$emit("update:selected", this.selected);
    this.initOptions = true;
  }

  //选择默认每一级的第一位选中
  handleChidlrenZero(item: any) {
    const arr = [item[0]];
    while (arr.length) {
      const item = arr.shift();
      this.selected.push(item);
      if (item.children) {
        this.handleChidlrenZero(item.children);
      }
    }
  }
  get showRightItem() {
    if (this.initOptions) {
      const selectedItem = this.selected[this.level];
      if (
        selectedItem &&
        selectedItem.children &&
        selectedItem.children.length > 0
      ) {
        return selectedItem.children;
      }
      return null;
    }
  }

  //监听
  @Watch("options", { deep: true, immediate: true })
  handleOptions(newVal: any) {
    if (!this.searchVal) {
      this.panelData = newVal;
    }
  }
}
</script>

<style scoped lang="scss">
.cascader-item {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  height: 280px;
  .left {
    height: 100%;
    width: 200px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    margin: 5px;
    border: 1px solid #dddddd;
    .search {
      padding: 5px;
      /deep/.el-input__inner {
        width: 185px;
      }
    }
    .item-content {
      height: 100%;
      width: 100%;
      overflow: auto;
      box-sizing: border-box;
    }
    .label-item:hover {
      color: #1f2d3d;
      font-weight: bold;
    }
    .cursor {
      cursor: pointer;
    }
    .active {
      border-right: 3px solid #009919;
      background: #eee;
    }
  }
  .right {
    height: 100%;
  }
  .label-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 38px;
    align-items: center;
    .label {
      padding-left: 10px;
    }
  }
}
</style>

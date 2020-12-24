<style scoped lang="scss">
.cascader-item {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  height: 150px;
  overflow-y: scroll;
  .left {
    width: 180px;
    height: 100%;
    overflow: auto;
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
  .label-item:hover {
    background: #eee;
    color: #1f2d3d;
    font-weight: bold;
  }
  .cursor {
    cursor: pointer;
  }
}
</style>
<template>
  <div class="cascader-item">
    <div class="left">
      <template v-for="(item, index) in options">
        <div
          :key="`${index}_text`"
          class="label-item cursor"
          @click="onClickText(item, $event)"
        >
          <div>
            <input
              type="checkbox"
              v-model="item.checked"
              class="cursor"
              id="checked"
            />
            <label for="checked"></label>
            <span class="label">{{ item.text }}</span>
          </div>
          <i
            class="el-icon-arrow-right"
            v-if="item.children && item.children.length !== 0"
          ></i>
        </div>
      </template>
    </div>
    <div class="right" v-if="showRightItem">
      <CascaderItem
        :level="level + 1"
        :selected="selected"
        @updateSelected="onUpdateSelected"
        :options="showRightItem"
        :val="val"
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
  Watch,
} from "vue-property-decorator";
@Component({
  name: "CascaderItem",
})
export default class extends Vue {
  @Prop({
    type: Array,
    default() {
      return [];
    },
  })
  options: any;

  @Prop({
    type: Number,
    default: 0,
  })
  level: any;

  @Prop({
    type: String,
    default: "",
  })
  val: any;

  @Prop({
    type: Array,
    default() {
      return [];
    },
  })
  selected: any;
  //处理复选框值
  private handleChecked(bool: Boolean) {
    let lastIdx = this.selected.length - 1;
    let lastSelected = this.selected[lastIdx];
    if (lastSelected) {
       lastSelected["checked"] = !bool;
    }
  }
  //反选的数据处理
  private handleVal() {
    let valCopy = [];
    if (this.val.includes("/")) {
      valCopy = this.val.split("/");
    } else {
      valCopy = this.val.split(",");
    }
    return valCopy;
  }
  //处理正选和反选的逻辑
  private handleValCopy(item: any) {
    let valCopy = this.handleVal();
    if (valCopy.lastIndexOf(item.text) === valCopy.length - 1) {
      item.checked = false;
      this.$delete(this.selected, this.level);
      this.handleChecked(false);
    } else {
      this.handleChecked(true);
      item.checked = true;
      this.selected[this.level] = item;
    }
  }
  //点击处理
  private onClickText(item: any, evt: any) {
    this.handleValCopy(item);
    this.selected.splice(this.level + 1); //如果第一位被换了，那么第二会要删除，实现切换数据视图一致的效果
    this.$emit("updateSelected", this.selected);
  }
  //因为selectedItem的children值的checked为fasle，所以传过去的就是false 了
  get showRightItem() {
    let selectedItem = this.selected[this.level];
    if (
      selectedItem &&
      selectedItem.children &&
      selectedItem.children.length > 0
    ) {
      return selectedItem.children;
    }
  }
  onUpdateSelected(newVal: any) {
    this.$emit("updateSelected", newVal);
  }
}
</script>

<template>
  <div class="table">
    <slot name="header"></slot>
    <div class="content">
      <div class="header">
        <template v-for="(item, index) in $attrs.tableHeader">
          <span
            :key="`${item.props}`"
            :class="{ cell: true, [`cell_${index}`]: true }"
            >{{ item.name }}</span
          >
        </template>
      </div>
      <recursiveRow
        v-bind="$attrs"
        v-on="$listeners"
        v-loading="$attrs.loading"
      ></recursiveRow>
    </div>
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script lang="ts">
import "./style/index.scss";
import { Component, Vue, Watch, Mixins, Ref } from "vue-property-decorator";
import RecursiveRow from "./recursiveRow.vue";

@Component({
  name: "Table",
  components: {
    RecursiveRow
  }
})
export default class extends Vue {
  private iptValue: any;
  /**
   * arr：列表数据
   * id：当前要删除的数据的id
   */
  private handlerDepDel(arr: any = [], id: number) {
    if (!Array.isArray(arr)) return;
    arr.forEach((item: any, index: number) => {
      if (item.id === id) {
        this.$delete(arr, index);
        return;
      }
      if (item.children && item.children.length !== 0) {
        this.handlerDepDel(item.children, id);
      }
    });
  }
  /**
   * 全部打来数据
   */
  private openAllTree(bool: boolean) {
    let index = 0;
    while (this.$children[++index]) {
      const el: any = this.$children[index];
      if (el.$body) {
        el.allOpen(bool);
      }
    }
  }
  /**btn:按钮的信息
   * row：每行的数据
   * evt：事件对象
   * expre：表格数据字段
   */
  private handlerEdit(row: any, evt: any, expre: string) {
    if (!row._$edit) {
      console.log(12);
      Object.assign(row, {
        isChange: expre,
        component: "input",
        attr: {
          value: row[expre]
        },
        listener: {
          ["change"]: (evt: any) => {
            this.iptValue = evt;
          }
        }
      });
      this.$set(row, "_$edit", true);
    } else {
      row[expre] = this.iptValue ? this.iptValue.target.value : row[expre];
      this.$delete(row, "component");
      this.$delete(row, "attr");
      this.$delete(row, "listener");
      this.$set(row, "_$edit", false);
    }
  }
}
</script>

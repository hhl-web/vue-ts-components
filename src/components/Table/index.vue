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
    RecursiveRow,
  },
})
export default class extends Vue {
  mounted() {}
  private iptValue: any;
  private openAllTree(bool: boolean) {
    let index = 0;
    while (this.$children[++index]) {
      if (this.$children[index].$body) {
        this.$children[index].allOpen(bool);
      }
    }
  }
  /**btn:按钮的信息
   * row：每行的数据
   * expre：表格数据字段
   */
  private handlerEdit(btn: any, row: any, evt: any, expre: string) {
    if (btn.label === "编辑") {
      btn.label = "关闭编辑";
      Object.assign(row, {
        isChange: expre,
        component: "input",
        attr: {
          value: row[expre],
        },
        listener: {
          ["change"]: (evt: any) => {
            this.iptValue = evt;
          },
        },
      });
    } else {
      btn.label = "编辑";
      row[expre] = this.iptValue ? this.iptValue.target.value : row[expre];
      this.$delete(row, "component");
      this.$delete(row, "attr");
      this.$delete(row, "listener");
    }
  }
}
</script>

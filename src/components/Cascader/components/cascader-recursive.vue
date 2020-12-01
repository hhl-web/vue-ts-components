<style scoped lang="scss">
.cascader-cycle {
  display: flex;
}
</style>
<template>
  <CascaderSubItem class="cascader-cycle">
    <div :showIcon="showIcon" @hoverShow="hoverShow" :data="data.children">
      <span>{{ data.text }}</span>
      <div>
        <template v-for="(item, index) in data.children">
          <CascaderRecursive
            v-if="showRecursive(item)"
            :key="`${index}_cycle`"
            :data="item"
          >
          </CascaderRecursive>
          <CascaderItem v-else :key="`${index}_item`">{{
            item.text
          }}</CascaderItem>
        </template>
      </div>
    </div>
  </CascaderSubItem>
</template>
<script lang="ts">
import { Component, Mixins, Ref, Prop, Vue } from "vue-property-decorator";
import { CascaderItem, CascaderSubItem } from "./index";
@Component({
  name: "CascaderRecursive",
  components: {
    CascaderItem,
    CascaderSubItem,
  },
})
export default class extends Vue {
  @Prop({
    type: Object,
    default() {
      return {};
    },
  })
  data: any;
  private bool: Boolean = false;
  private showRecursive(item: any) {
    if (item.children && item.children.length !== 0) {
      return true;
    } else {
      return false;
    }
  }
  private hoverShow(bool: Boolean) {
    this.bool = bool;
  }
  get showIcon() {
    if (this.data.children && this.data.children.length !== 0) {
      return true;
    } else {
      return false;
    }
  }
}
</script>

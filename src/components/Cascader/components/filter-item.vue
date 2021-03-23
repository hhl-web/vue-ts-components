<template>
  <div class="filter-item">
    <span
      class="filter-label"
      v-for="(item, index) in filterableOpt"
      :key="index"
      @click="onClickOpt(item)"
    >
      {{ item.labelPath }}</span
    >
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
  name: "filterItem"
})
export default class extends Vue {
  @Prop({
    type: Array,
    default: () => []
  })
  filterableOpt: any;

  onClickOpt(item: any) {
    this.$emit("onClickOpt", item);
  }
}
</script>
<style lang="scss" scoped>
.filter-item {
  display: flex;
  flex-direction: column;
  width: 200px;
  .filter-label {
    height: 28px;
    cursor: pointer;
  }
}
</style>

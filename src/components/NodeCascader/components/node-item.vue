<template>
  <div class="node-item">
    <div class="node-label">
      <label>{{ node.text }}</label>
    </div>
    <div v-if="node.children" class="sub-item">
      <div v-for="(item, index) in node.children" v-bind:key="index">
        <nodeItem :node="item"></nodeItem>
      </div>
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
  name: "nodeItem"
})
export default class extends Vue {
  @Prop({
    type: Object,
    default: () => {}
  })
  node: any;
  mounted() {
    console.log(this.node);
  }
}
</script>
<style lang="scss" scoped>
.node-item {
  display: flex;
  .node-label {
    width: 180px;
    padding: 5px;
    font-size: 14px;
  }
  .sub-item {
    display: flex;
    flex-direction: column;
  }
}
</style>

<template>
  <div class="node-containor">
    <div class="node-header">
      <el-input></el-input>
    </div>
    <div class="node-content">
      <template v-for="(item, index) in options">
        <nodeItem :node="item" :key="index"></nodeItem>
      </template>
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
import nodeItem from "./components/node-item.vue";
@Component({
  name: "nodeCascader",
  components: {
    nodeItem
  }
})
export default class extends Vue {
  @Prop({
    type: Array,
    default: () => []
  })
  options: any;
}
</script>
<style lang="scss" scoped>
.node-containor {
  display: flex;
  flex-direction: column;
  .node-header {
  }
  .node-content {
  }
}
</style>

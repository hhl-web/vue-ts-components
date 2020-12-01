<style scoped lang="scss">
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
<template>
  <ul>
    <slot></slot>
  </ul>
</template>
<script lang="ts">
import { Component, Mixins, Ref, Prop, Vue } from "vue-property-decorator";

@Component({
  name: "CascaderSub",
})
export default class extends Vue {}
</script>

<template>
  <div>
    <Table></Table>
    <Cascader></Cascader>
    <Upload></Upload>
  </div>
</template>
<script>
import { Component, Prop, Vue } from "vue-property-decorator";
import { Table, Cascader, Upload } from "./index";
@Component({
  name: "App",
  components: {
    Table,
    Cascader,
    Upload
  }
})
export default class extends Vue {}
</script>

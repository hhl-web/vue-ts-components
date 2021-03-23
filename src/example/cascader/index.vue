<template>
  <div id="app">
    <Cascader
      :options="data"
      v-model="selelt"
      :props="{ value: 'id', label: 'text' }"
      :iptProps="{ size: 'small', placeholder: '请选择' }"
      filterable
      isInput
      reverseChoice
    ></Cascader>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue, Watch } from "vue-property-decorator";
import { Cascader } from "../../components/index";
import { data } from "../../mock/cascader";
@Component({
  name: "App",
  components: { Cascader }
})
export default class extends Vue {
  private data = data;
  private selelt = [1, 1.1]; //最后一个子数据就可以完成双向绑定。 如果是一个数组呢？需要兼容是数组的情况
  @Watch("selelt")
  handler(newVal: any) {
    console.log(newVal);
  }
}
</script>

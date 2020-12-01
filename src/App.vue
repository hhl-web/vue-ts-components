<template>
  <div id="app">
    <Cascader
      :options="data"
      v-model="selelt"
      :props="{ value: 'id', label: 'text' }"
      :iptProps="{ size: 'small', placeholder: '请选择' }"
      filterable
    ></Cascader>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue, Watch } from "vue-property-decorator";
import { Cascader } from "./components/index";
import img from "./assets/imgs/green.png";
import value from "./assets/imgs/green.png";
const data = [
  {
    text: "代买早餐1",
    id: 1,
    children: [
      {
        text: "肯德基",
        id: 1.1,
      },
      {
        text: "汉堡",
        id: 1.2,
      },
    ],
  },
  {
    text: "指南",
    id: 2,
    children: [
      {
        text: "设计原则",
        id: 2.1,
        children: [
          {
            text: "导航",
            id: 2.1,
          },
        ],
      },
    ],
  },
  {
    text: "可控3",
    children: [],
    id: 3,
  },
  {
    text: "可控4",
    children: [],
    id: 4,
  },
  {
    text: "可控5",
    children: [],
    id: 5,
  },
  {
    text: "可控6",
    children: [],
    id: 6,
  },
];
@Component({
  name: "App",
  components: { Cascader },
})
export default class extends Vue {
  private data = data;
  private selelt = "";
  @Watch("selelt")
  handler(newVal: any) {
    console.log(newVal);
  }
}
</script>

<template>
  <div id="app">
    <UploadXlsx
      start="A"
      end="H"
      :headerStr="headerStr"
      :callback="handlerRequest"
    ></UploadXlsx>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from "vue-property-decorator";
import { UploadXlsx } from "../../components/index";
import { _headerStr } from "../../mock/upload";
@Component({
  name: "App",
  components: {
    UploadXlsx
  }
})
export default class extends Vue {
  @Ref() table: any;
  private headerStr = _headerStr;
  // 请求函数
  handlerRequest(arg: any) {
    setTimeout(() => {
      console.log(arg, "arg");
      return 1;
    }, 2000);
  }
}
</script>

<style scoped lang="scss">
.uploadContainer {
  display: flex;
  width: 200px;
  justify-content: space-between;
}
</style>
<template>
  <div class="uploadContainer">
    <el-upload
      class="upload"
      :ref="upload"
      name="file"
      with-credentials
      :on-change="onChangeHandler"
      :on-remove="handleRemove"
      :multiple="true"
      :show-file-list="true"
      :file-list="fileList"
      :auto-upload="false"
      action=""
    >
      <el-button type="primary">导入文件</el-button>
      <slot name="tip"></slot>
    </el-upload>
    <el-button
      type="primary"
      size="mini"
      @click="uploadFile"
      style="height: 35px"
      >上传</el-button
    >
  </div>
</template>
<script lang="ts">
// excel支持的格式
const _SheetJSFT = ["xlsx", "xls"].map(function(x) {
  return "." + x;
});
import { Component, Mixins, Ref, Prop } from "vue-property-decorator";
import UploadXlsx from "../../mixins/uploadXlsx";
let upload = Symbol("upload");
@Component({
  name: "Upload",
})
export default class extends Mixins(UploadXlsx) {
  @Prop({
    type: Array,
    default() {
      return [];
    },
  })
  headerStr: any;
  @Prop({
    type: Function,
    required: true,
  })
  callback!: Function;
  @Prop({
    type: String,
    default: "A",
  })
  start!: string;
  @Prop({
    type: String,
    default: "",
  })
  end!: string;
  @Prop({
    type: Boolean,
    default: false,
  })
  multiple?: boolean;
  private SheetJSFT = _SheetJSFT;
  private fileList: any = [];
  private upload = upload;
  //处理文件
  handlerFile() {
    this.fileList.forEach((file: any) => {
      let { name } = file;
      let str = name.slice(name.lastIndexOf("."), name.length);
      if (!this.SheetJSFT.includes(str)) {
        return this.$message({
          type: "error",
          message: "文件格式不符合要求,请检查文件格式",
        });
      }
      this.handlerReaderFile(file, this.headerStr, this.start, this.end)
        .then((res: any) => {
          Promise.all(this.handlerCallback(res)).then((res) => {
            console.log("res成功了", res); //输出3个1
          });
        })
        .catch((err: any) => {
          this.$message({
            type: "error",
            message: err,
          });
        });
    });
  }
  //文件上传
  uploadFile() {
    this.handlerFile();
  }
  // 只保留最后新选择的文件
  onChangeHandler(file: any, fileList: any) {
    if (this.multiple) {
      this.fileList = fileList;
    } else {
      if (fileList.length > 1) {
        this.fileList = [fileList[fileList.length - 1]];
      } else {
        this.fileList = fileList;
      }
    }
  }
  //处理callback
  handlerCallback(args: any) {
    return args.map((arg: Array<any>) => {
      return new Promise((resolve) => {
        resolve(this.callback(arg));
      });
    });
  }
  //文件移除
  handleRemove(file: any, fileList: any) {
    this.fileList = fileList;
  }
}
</script>

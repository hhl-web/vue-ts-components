//该声明文件是告诉TS以.vue为后缀的文件交给vue模块处理，文件中的vue是指vue的实例
declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

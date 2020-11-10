<template>
  <div id="app">
    <Table
      :data.sync="tableData"
      :isSort="isSort"
      :tableHeader="headerData"
      :open="isOpen"
      ref="table"
      :callback="getTableData"
      @select-change="onSelectChange"
      :loading="loading"
    >
      <template v-slot:header>
        <el-button @click="onExpandTree" size="mini">{{
          isOpen ? "关闭分类" : "展开分类"
        }}</el-button>
        <el-button @click="onSortable" size="mini">
          {{ isSort ? "关闭排序" : "开启排序" }}
        </el-button>
      </template>
      <template v-slot:footer>
        <el-pagination background layout="prev, pager, next" :total="1000">
        </el-pagination>
      </template>
    </Table>
    <!-- <UploadXlsx
      start="A"
      end="H"
      :headerStr="headerStr"
      :callback="handlerRequest"
    ></UploadXlsx> -->
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from "vue-property-decorator";
import { Table, UploadXlsx } from "./components/index";
const _headerStr = [
  { str: "一级分类ID", key: "frontend_category_lv1", type: "number" },
  { str: "二级分类ID", key: "frontend_category_lv2", type: "number" },
  { str: "三级分类ID", key: "frontend_category_lv3", type: "number" },
  { str: "商品名称", key: "product_name", type: "string" },
  { str: "商品ID", key: "product_id", type: "number" },
];
const tableData = [
  {
    id: 1,
    text: "父1",
    level: 1,
    type: "自然属性",
    manage_categories: "无",
    remark: "无",
    children: [
      {
        id: 1 - 1,
        text: "子1",
        level: 2,
        type: "自然属性",
        manage_categories: "无",
        remark: "无",
        children: [],
      },
      {
        id: 1 - 2,
        text: "子2",
        level: 2,
        type: "自然属性",
        manage_categories: "无",
        remark: "无",
        children: [
          {
            id: 1 - 2 - 1,
            text: "子2-子1",
            level: 3,
            type: "自然属性",
            manage_categories: "无",
            remark: "无",
            children: [],
          },
          {
            id: 1 - 2 - 2,
            text: "子2-子2",
            level: 3,
            type: "自然属性",
            manage_categories: "无",
            remark: "无",
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    text: "父2",
    level: 1,
    type: "分类属性",
    manage_categories: "无",
    remark: "无",
    children: [
      {
        id: 2 - 1,
        text: "父-子1",
        level: 2,
        type: "自然属性",
        manage_categories: "无",
        remark: "无",
        children: [],
      },
    ],
  },
];
import img from "./assets/imgs/green.png";
@Component({
  name: "App",
  components: {
    UploadXlsx,
    Table,
  },
})
export default class extends Vue {
  @Ref() table: any;
  private headerStr = _headerStr;
  private headerData = [
    {
      name: "请选择",
      props: "select",
      select: true,
      attr: {
        size: "mini",
      },
    },
    {
      name: "ID",
      props: "id",
    },
    {
      name: "名称",
      props: "text",
      tree: true,
      images: img,
      before: (row: any) => {
        if (row.level === 2) return `${row.text}（特殊）`;
        return `${row.text}`;
      },
    },
    {
      name: "级别",
      props: "level",
    },
    {
      name: "分类属性",
      props: "type",
    },
    {
      name: "类别",
      props: "manage_categories",
    },
    {
      name: "备注",
      props: "remark",
    },
    {
      name: "操作",
      props: "actions",
      actions: [
        {
          click: (row: any) => {
            const table: any = this.$refs.table;
            table.handlerDepDel(this.tableData, row.id);
            this.$message({
              type: `success`,
              message: `${row.text}删除成功！`,
            });
            //调删除接口
          },
          label: "删除",
          attr: {
            size: "mini",
          },
          before: (row: any, i: any) => {
            if (row.level === 2) {
              return true;
            }
          },
        },
        {
          click: (row: any, i: any, btn: any, evt: any) => {
            const table: any = this.$refs.table;
            table.handlerEdit(btn, row, evt, "type");
            //调用编辑的接口
          },
          label: "编辑",
          attr: {
            size: "mini",
          },
        },
        {
          click: (row: any, i: any, evt: any) => {
            console.log(row, i, evt);
          },
          label: "查看详情",
          attr: {
            size: "mini",
          },
        },
      ],
    },
  ];
  private tableData = tableData;
  private isOpen = true;
  private isSort = false;
  private loading = false;
  //是否开启展开关闭
  private onExpandTree() {
    this.isOpen = !this.isOpen;
    this.table.openAllTree(this.isOpen);
  }
  //是否排序
  private onSortable() {
    this.isSort = !this.isSort;
  }
  //拖拽成功的回调
  private getTableData(arr: Array<any>) {
    console.log(arr);
  }
  //处理选择框
  onSelectChange(rowArr: Array<any>) {
    console.log(rowArr, "---所选择的值");
  }
  handlerRequest(arg: any) {
    setTimeout(() => {
      console.log(arg, "arg");
      return 1;
    }, 2000);
  }
  mounted() {
    console.log("挂载了");
  }
}
</script>

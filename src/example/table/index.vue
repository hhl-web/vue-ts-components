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
      @tree-change="onTreeChange"
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
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from "vue-property-decorator";
import { Table } from "../../components/index";
import { tableData } from "../../mock/table/index.js";
import img from "../../assets/imgs/green.png";
@Component({
  name: "App",
  components: {
    Table
  }
})
export default class extends Vue {
  @Ref() table: any;
  private headerData = [
    {
      name: "单选",
      props: "select",
      select: true,
      attr: {
        size: "mini"
      }
    },
    {
      name: "ID",
      props: "id"
    },
    {
      name: "名称",
      props: "text",
      tree: true,
      treeSelect: true,
      images: img,
      before: (row: any) => {
        if (row.level === 2) return `${row.text}（特殊）`;
        return `${row.text}`;
      }
    },
    {
      name: "级别",
      props: "level"
    },
    {
      name: "分类属性",
      props: "type"
    },
    {
      name: "类别",
      props: "manage_categories"
    },
    {
      name: "备注",
      props: "remark"
    },
    {
      name: "操作",
      props: "actions",
      actions: [
        {
          click: (row: any) => {
            const table: any = this.$refs.table;
            table.handlerDepDel(this.tableData, row.id);
            //调删除接口
            this.$message({
              type: `success`,
              message: `${row.text}删除成功！`
            });
          },
          label: "删除",
          attr: {
            size: "mini"
          },
          before: (row: any, i: any) => {
            if (row.level === 2) {
              return true;
            }
          }
        },
        {
          click: (row: any, i: any, evt: any) => {
            const table: any = this.$refs.table;
            table.handlerEdit(row, evt, "type");
            //调用编辑的接口
          },
          label: "编辑",
          edit: true,
          attr: {
            size: "mini"
          }
        },
        {
          click: (row: any, i: any, evt: any) => {
            console.log(row, i, evt);
          },
          label: "查看详情",
          attr: {
            size: "mini"
          }
        }
      ]
    }
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
    console.log("---所选择的值");
  }
  //树选中
  onTreeChange(list: Array<any>) {
    console.log(list);
  }
}
</script>

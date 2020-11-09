<template>
  <div class="table">
    <slot name="header" />
    <div class="content">
      <div class="header">
        <template v-for="(item, index) in $attrs.tableHeader">
          <span
            :key="`${item.props}`"
            :class="{cell: true, [`cell_${index}`]: true}"
          >{{ item.name }}</span>
        </template>
      </div>
      <recursiveRow
        v-loading="$attrs.loading"
        v-bind="$attrs"
        v-on="$listeners"
      />
    </div>
    <div class="footer">
      <slot name="footer" />
    </div>
  </div>
</template>
<script lang="ts">
import './style/index.scss'
import { Component, Vue } from 'vue-property-decorator'
import RecursiveRow from './recursiveRow.vue'

@Component({
  name: 'Table',
  components: {
    RecursiveRow
  }
})
export default class extends Vue {
  private iptValue: any;
  // 删除
  private handlerDepDel(arr: any = [], id: number) {
    if (!Array.isArray(arr)) return
    arr.forEach((item: any, index: number) => {
      if (item.id === id) {
        this.$delete(arr, index)
        return
      }
      console.log(item.Children)
      if (item.children && item.children.length !== 0) {
        this.handlerDepDel(item.children, id)
      }
    })
  }

  private openAllTree(bool: boolean) {
    let index = 0
    while (this.$children[++index]) {
      const el: any = this.$children[index]
      if (el.$body) {
        el.allOpen(bool)
      }
    }
  }

  /** btn:按钮的信息
   * row：每行的数据
   * expre：表格数据字段
   */
  private handlerEdit(btn: any, row: any, evt: any, expre: string) {
    if (btn.label === '编辑') {
      btn.label = '关闭编辑'
      Object.assign(row, {
        isChange: expre,
        component: 'input',
        attr: {
          value: row[expre]
        },
        listener: {
          change: (evt: any) => {
            this.iptValue = evt
          }
        }
      })
    } else {
      btn.label = '编辑'
      row[expre] = this.iptValue ? this.iptValue.target.value : row[expre]
      this.$delete(row, 'component')
      this.$delete(row, 'attr')
      this.$delete(row, 'listener')
    }
  }
}
</script>

<template>
  <div class="table-component">
    <el-table
      v-loading="options.loading"
      :data="dataSource"
      :stripe="options.stripe"
      :border="options.border"
      height="500px"
      header-row-class-name="table-header-row"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange">
      <!--selection选择框-->
      <el-table-column v-if="options.mutiSelect" type="selection" style="width:50px" align="center"/>
      <!--序号-->
      <el-table-column v-if="options.index" label="序号" type="index" width="50" align="center"/>
      <!--数据列-->
      <template v-for="(column, index) in columns">
        <el-table-column
          :key="index"
          :prop="column.prop"
          :label="column.label"
          :align="column.align||'center'"
          :width="column.width"
          :fixed="column.fixed">
          <template slot-scope="scope">
            <template v-if="!column.render">
              {{ scope.row[column.prop] }}
            </template>
            <!-- render -->
            <template v-else>
              <RenderDom :row="scope.row" :index="index" :render="column.render" />
            </template>
            <!-- render button -->
            <template v-if="column.button">
              <template v-for="(btn, i) in column.group">
                <el-button
                  :key="i"
                  :type="btn.type"
                  :size="btn.size || 'mini'"
                  :icon="btn.icon"
                  :disabled="btn.disabled"
                  :plain="btn.plain"
                  @click.stop="btn.onClick( scope.row, scope.$index )"
                >{{ btn.name }}</el-button>
              </template>
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
export default {
  components: {
    RenderDom: {
      functional: true, // 函数式组件 - 无 data 和 this 上下文 => better render
      props: {
        row: Object,
        index: Number,
        render: Function
      },
      /**
       * @param {Function} createElement - 原生创建dom元素的方法， 弃用，推荐使用 jsx
       * @param {Object} ctx - 渲染的节点的this对象
       * @argument 传递参数 row index
       */
      render(createElement, ctx) {
        const { row, index } = ctx.props
        return ctx.props.render(row, index)
      }
    }
  },
  props: {
    dataSource: { type: Array, default: () => ([]) },
    options: { type: Object, default: () => ({}) }, // 表格参数控制 maxHeight、stripe 等等...
    columns: { type: Array, default: () => ({}) },
    fetch: { type: Function, default: () => { return () => {} } } // 获取数据的函数
    // pagination: { type: Object, default: () => ({}) } // 分页，不传则不显示
  },
  created() {
    // 传入的options覆盖默认设置
    this.$parent.options = Object.assign({
      maxHeight: 500,
      stripe: true, // 是否为斑马纹
      border: true
    }, this.options)

    this.options.initTable && this.fetch()
  },
  methods: {
    handleSelectionChange(selection) {
      this.$emit('selection-change', selection)
    },
    handleRowClick(row, event, column) {
      this.$emit('row-click', row, event, column)
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
.el-table th,
  .el-table tr.table-header-row {
    background: #e5c5d2; /* 示例， 对表格样式上的修饰 */
  }

</style>

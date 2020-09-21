<template>
  <div class="operatLog-container">
    <el-table :data="dataSource" border>
      <el-table-column :label="$t('good.actionTime')" prop="gmtCreate"/>
      <el-table-column :label="$t('good.actionContent')" prop="log"/>
      <el-table-column :label="$t('good.actionUser')" prop="username"/>
    </el-table>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    dataSource: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>

</style>

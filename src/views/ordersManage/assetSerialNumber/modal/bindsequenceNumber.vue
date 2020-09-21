<template>
  <el-dialog
    :visible.sync="visible"
    :before-close="handleClose"
    title="绑定序列号"
    width="520px"
    center
  >
    <el-table
      :max-height="400"
      :data="tableData"
      border
      stripe
      style="width: 100%"
    >
      <el-table-column label="商品SKUID" align="center" prop="oid" show-overflow-tooltip/>
      <el-table-column label="商品名称" align="center" prop="goodsname" show-overflow-tooltip/>
      <el-table-column label="商品规格" align="center" prop="skuContent" show-overflow-tooltip/>
      <el-table-column label="商品数量" align="center" prop="count"/>
      <el-table-column label="资产序列号" align="center">
        <template slot-scope="scope">
          <ul>
            <li v-for="item in scope.row.count" :key="item">
              <el-input
                v-model="scope.row.snlist[item - 1]"
                placeholder="绑定序列号"
                style="margin-top:6px;"/>
            </li>
          </ul>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer" style="text-align:right">
      <el-button @click="handleClose('cacel')">取 消</el-button>
      <el-button type="primary" @click="handleClose('ok')" >确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { addSn } from '@/api/inventorys'

export default {
  props: ['show', 'propsData'],
  data() {
    return {
      visible: this.show,
      tableData: []
    }
  },
  watch: {
    show() {
      this.visible = this.show
    },
    propsData() {
      console.log(this.propsData);
      this.tableData = this.deal(this.propsData.list)
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {

    handleClose(val) {
      if (val === 'ok') {
        this.submit()
        this.$emit('handOk')
      } else if (val === 'cacel') {
        this.$confirm('确认关闭？')
          .then(_ => {
            this.$emit('handCancel')
          })
          .catch(_ => {});
      } else {
        this.$emit('handCancel')
      }
    },

    deal(arr) {
      const newarr = []
      arr.map((item, index) => {
        item.snlist = []
        if (item.snList && item.snList.length > 0) {
          item.snlist = item.snList
        } else {
          item.snlist[index] = ''
        }
        newarr.push(item)
      })
      console.log('deal', newarr)
      return newarr
    },
    // 确定
    submit() {
      console.log('确定', this.propsData);
      const newarr = []
      this.propsData.list.map(item => {
        newarr.push({ orderNo: item.oid, snList: item.snlist })
      })
      const params = {
        snVoList: newarr
      }
      addSn({ ...params }).then(res => {
        if (res.code === 200) {
          this.$message.success('操作成功')
        } else {
          this.$message.error(res.msg);
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>


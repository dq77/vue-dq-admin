<template>
  <div class="content">
    <el-dialog
      v-el-drag-dialog
      :visible.sync="Visible"
      :before-close="handleClose"
      title="回仓确认"
      width="520px"
      center
    >
      <el-form :model="obj" label-width="120px">
        <el-form-item label="资产序列号：">
          <el-input v-if="!obj.snList || obj.snList.length < 1" v-model="snList[0]" placeholder="请输入资产序列号" class="input-200"/>
          <el-checkbox-group v-else v-model="snList">
            <el-checkbox v-for="(item,index) in obj.snList" :key="index" :label="item"/>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="message" :rows="3" type="textarea" placeholder="建议填写备注说明情况"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="text-align:right">
        <el-button @click="handleClose('cacel')">取 消</el-button>
        <el-button type="primary" @click="handleClose('ok')" >已确认回仓</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import elDragDialog from '@/directive/el-dragDialog'

export default {
  directives: { elDragDialog },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    dataSource: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      Visible: this.show,
      snList: [],
      sn: '',
      message: '',
      obj: {},
      options: [{ value: '1', label: '1' }]
    }
  },
  watch: {
    show() {
      this.Visible = this.show
    },
    dataSource: {
      handler(val) {
        console.log('回仓确认', val);
        this.obj = val;
      },
      deep: true
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    handleClose(val) {
      if (val === 'ok') {
        const data = {
          snList: this.snList,
          remark: this.message,
          refundNo: this.obj.refundNo
        }
        console.log('data', data);
        this.$emit('handOk', data);
      } else if (val === 'cacel') {
        this.$emit('handCancel')
      } else {
        this.$emit('handCancel')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-row{
  margin-bottom: 16px;
  .el-col{
    line-height: 2
  }
  .left-padding{
    padding-left:70px;
  }
  .right-padding{
    text-align: right;
    padding-right: 18px;
  }
}
  .hr{
    border: 0.5px solid #dfe4ea;
  }
</style>


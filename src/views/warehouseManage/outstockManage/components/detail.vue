<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="outstockDetail-container">
    <div class="order-btn">
      <el-button icon="el-icon-back" type="primary" class="go-back" @click="goBack()">返回</el-button>
      <div v-if="obj.actions">
        <el-button v-if="obj.actions.EDIT_FREIGHT" icon="el-icon-upload2" type="warning" @click="openDlg('outSendDlg')">修改发货方式</el-button>
        <el-button v-if="obj.actions.EDIT_STOCK_OUT" icon="el-icon-menu" type="success" @click="openDlg('outStockDlg')">修改出库仓库</el-button>
        <el-button v-if="obj.actions.BOOK_FREIGHT" icon="el-icon-goods" type="primary" @click="openDlg('subSendDlg')">预约物流</el-button>
        <el-button v-if="obj.actions.EXECUTE_STOCK_OUT" icon="el-icon-check" type="primary" @click="openDlg('addDlg')">确认出库</el-button>
        <el-button v-if="obj.status == 'SUBMITTED' || obj.status == 'STOCK_OUT_PARTLY'" icon="el-icon-close" type="danger" @click="reject()">驳回至发货确认环节</el-button>
        <el-button v-if="obj.status == 'COMPLETED'" icon="el-icon-delete" type="danger" @click="closeOrder()">作废</el-button>
      </div>
    </div>
    <div class="outstockDetail-content">
      <base-info :base-obj="obj" />
      <goods-info :goods-obj="obj" @refresh="refresh" />
      <log-info v-if="obj.status == 'SAVED'" :log-obj="obj" />
    </div>
    <stock-dialog
      :show="outStockDlg"
      :data-source="obj"
      @handClose="closeDialog"
      @handOk="changeStock"
    />
    <change-send
      :show="outSendDlg"
      :data-source="obj"
      @handClose="closeDialog"
      @handOk="changeSend"
    />
    <send-dialog :show="subSendDlg" :data-source="obj" @handClose="closeDialog" @handOk="refresh" />
    <add-dialog :show="addDlg" :data-source="obj.goods" @handClose="closeDialog" @handOk="submit" />
  </div>
</template>

<script>
import baseInfo from '../components/baseInfo';
import logInfo from '../components/logInfo';
import goodsInfo from '../components/goodsInfo';
import stockDialog from '../components/changeStock';
import changeSend from '../components/changeSend';
import sendDialog from '../components/submitSend';
import addDialog from '../components/add';
import outstockApi from '@/api/warehouse/outstock';
// import { deepClone } from '@/utils/index.js'
export default {
  components: {
    baseInfo,
    logInfo,
    goodsInfo,
    stockDialog,
    changeSend,
    sendDialog,
    addDialog
  },
  data() {
    return {
      obj: {}, // 订单详情
      outStockDlg: false, // 修改出库仓库 弹窗
      outSendDlg: false, // 修改发货方式 弹窗
      subSendDlg: false, // 预约物流 弹窗
      addDlg: false // 出库弹窗
    };
  },
  watch: {
    $route(to, from) {
      console.error('路由变化');
    }
  },
  created() {
    this.id = this.$route.query.id;
    this.getDetail(this.id);
  },
  beforeRouteUpdate(to, from, next) {
    console.log('修改路由参数', to, from, next);
    next();
  },
  methods: {
    getDetail(id) {
      let data = {}
      if ( this.$route.query.id ) {
        data.stockOutId = this.$route.query.id
        data.status = 'COMPLETED'
      } else {
        data.stockOutId = this.$route.query.groupId
        data.status = 'SUBMITTED'
      }
      outstockApi.getOutstockDetail(data).then(res => {
        if (res.code === 200) {
          res.data.goods.map(good => {
            // good.sns = []
            good.serialNumberUpload = false;
            good.file = '';
          });
          this.obj = res.data;
        } else {
          this.$message.info(res.msg);
        }
      });
    },
    // 返回上一页
    goBack() {
      this.$router.go(-1);
    },
    // 修改出库仓库 修改发货方式 预约物流 打开弹窗
    openDlg(dlg) {
      this[dlg] = true;
    },

    // 关闭弹窗
    closeDialog(dlg) {
      this[dlg] = false;
    },
    // 确认修改出库仓库
    changeStock(val) {
      let data = {
        groupId: this.obj.groupId,
        stockOutWarehouseId: val.stockOutWarehouseId,
        version: this.obj.version
      };
      outstockApi.changeStockOut(data).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
          this.closeDialog('outStockDlg');
          this.refresh();
        } else {
          this.$message.info(res.msg);
        }
      });
    },
    // 确认修改发货方式
    changeSend(val) {
      const data = {
        freightId: val.freight.freightId,
        freightServiceProvider: val.freightServiceProvider,
        version: val.freight.version
      };
      outstockApi.changeFreight(data).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
          this.closeDialog('outSendDlg');
          this.refresh();
        } else {
          this.$message.info(res.msg);
        }
      });
    },
    // 驳回至发货确认环节
    reject() {
      this.$confirm('确定要驳回此出库单至发货确认环节吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        outstockApi.rejectStockOut({ groupId: this.obj.groupId, version: this.obj.version }).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '驳回成功!'
            });
            this.goBack()
          } else {
            this.$message.info(res.msg)
          }
        })
      })
    },
    // 确认出库
    submit(val) {
      let data = {
        groupId: this.obj.groupId,
        remark: val.remark,
        sns: [],
        version: this.obj.version
      };
      val.goods.map(item => {
        data.sns.push(...item.sns)
        data.createAssetIfNotExisted = item.createAssetIfNotExisted
      })
      outstockApi.deliverOut(data).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '出库成功!'
          });
          this.closeDialog('addDlg');
          this.getDetail(this.$route.query.id);
        } else {
          this.$message.info(res.msg);
        }
      });
    },
    // 作废
    closeOrder() {
      this.$confirm('确定要作废此出库单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        outstockApi
          .breakOutstock({ stockOutId: this.obj.id, version: this.obj.version })
          .then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '作废成功!'
              });
              this.getDetail(this.$route.query.id);
            } else {
              this.$message.info(res.msg);
            }
          });
      });
    },
    refresh(obj) {
      this.getDetail(this.$route.query.id);
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
.outstockDetail-container {
  padding: 15px;
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  .outstockDetail-content {
    flex: 1;
    overflow: auto;
  }
  .addRemark {
    text-align: right;
  }
  .order-btn {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
}
</style>
<style lang="scss">
.distpicker-address-wrapper {
  select {
    height: 28px;
  }
}
</style>

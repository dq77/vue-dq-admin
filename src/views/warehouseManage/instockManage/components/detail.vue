<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="orderDetail-container">
    <div class="order-btn">
      <el-button icon="el-icon-back" type="primary" class="go-back" @click="goBack()">{{ $t('common.back') }}</el-button>
      <div v-if="obj.status=='COMPLETED'">
        <el-button icon="el-icon-delete" type="danger" @click="closeOrder()">{{ $t('warehouse.broke') }}</el-button>
      </div>
    </div>
    <div class="orderDetail-content">
      <base-info :baseobj="obj" />
      <goods-info :goodsobj="obj" @refresh="refresh" />
    </div>
  </div>
</template>

<script>
import baseInfo from '../components/baseInfo';
import goodsInfo from '../components/goodsInfo';
import instockApi from '@/api/warehouse/instock';
// import { deepClone } from '@/utils/index.js'
export default {
  components: {
    'base-info': baseInfo,
    'goods-info': goodsInfo
  },
  data() {
    return {
      orderObj: {}, // 选择的订单对象
      expressObj: {
        expressType: 'SEND',
        orderNo: ''
      },
      companyList: [], // 物流公司下拉框
      expressData: {}, // 物流详情对象
      selectObj: {}, // 选择的订单信息
      obj: {}, // 订单详情
      isEdit: false, // 编辑物流单号
      isCreate: false, // 创建物流单号
      company: '',
      formRemark: {
        remark: ''
      }
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
    // 返回上一页
    goBack() {
      this.$router.go(-1);
    },
    getDetail() {
      const data = {};
      if (this.$route.query.id) {
        data.stockInId = this.$route.query.id;
        data.status = 'COMPLETED';
      } else {
        data.stockInId = this.$route.query.groupId;
        data.status = 'SUBMITTED';
      }

      instockApi.getInstockDetail(data).then(res => {
        if (res.code === 200) {
          res.data.goodsLists.map(good => {
            good.situation = res.data.situation
            good.instockNum = '';
            good.sns = []
            good.serialNumberUpload = false;
            good.file = '';
          });
          this.obj = res.data;
        } else {
          this.$message.info(res.msg);
        }
      });
    },
    // 作废订单
    closeOrder() {
      this.$confirm(this.$t('warehouse.confirmbrokeinstock'), this.$t('common.tips'), {
        type: 'warning'
      })
        .then(() => {
          instockApi
            .breakInstock({ stockInId: this.obj.id, version: this.obj.version })
            .then(res => {
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: this.$t('warehouse.brokesuccess')
                });
                this.getDetail();
              } else {
                this.$message.info(res.msg);
              }
            });
        })
        .catch(() => {});
    },
    refresh(id) {
      this.getDetail();
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
.orderDetail-container {
  padding: 15px;
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  .orderDetail-content {
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

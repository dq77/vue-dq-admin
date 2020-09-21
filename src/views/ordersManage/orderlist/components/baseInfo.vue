<template>
  <div class="order-base">
    <el-card class="box-card">
      <div slot="header" class="base-info title-info">
        <span>基本信息</span>
        <span class="order-status">{{ baseObj.status | orderStatusFilter }}</span>
      </div>
      <div class="info-content">
        <table v-loading="false" class="table">
          <tr>
            <td class="table-td-bgcolor">订单号</td>
            <td>{{ baseObj.orderNo }}</td>
            <td class="table-td-bgcolor">用户昵称</td>
            <td>
              <router-link :to="`/member/memberUser/memberInfo/${baseObj.uid}`">
                <el-button type="text">{{ baseObj.username || '未完善昵称' }}</el-button>
              </router-link>
            </td>
          </tr>
          <tr>
            <td class="table-td-bgcolor">用户手机号</td>
            <td>
              {{ baseObj.userMobile || baseObj.receiverMobile || '--' }}
            </td>
            <td class="table-td-bgcolor">下单时间</td>
            <td>{{ baseObj.createTime }}</td>
          </tr>
          <tr>
            <td class="table-td-bgcolor">订单来源</td>
            <td>{{ baseObj.channel | channelFilter }}</td>
            <td class="table-td-bgcolor">订单类型</td>
            <td>
              <span v-if="baseObj.tradeType === 'Lease'">租赁</span>
              <span v-if="baseObj.tradeType === 'Sales'">售卖</span>
              <span v-if="baseObj.tradeType === 'Renewal'">续租</span>
              <span v-if="baseObj.tradeType === 'Buyout'">买断</span>
            </td>
          </tr>
          <tr>
            <td class="table-td-bgcolor">收货信息</td>
            <td>
              {{ baseObj.receiverName }}
              {{ baseObj.receiverMobile }}
              {{ baseObj.receiverProvince }}
              {{ baseObj.receiverCity }}
              {{ baseObj.receiverDistrict }}
              {{ baseObj.receiverDetailAddress }}
            </td>
            <td class="table-td-bgcolor">用户备注</td>
            <td>{{ baseObj.buyerRemark }}</td>
          </tr>
          <tr>
            <td class="table-td-bgcolor">客服备注</td>
            <td colspan="1">
              <span v-if="baseObj.sellerRemark && baseObj.sellerRemark[0]" class="remark">
                {{ baseObj.sellerRemark[baseObj.sellerRemark.length-1].content }}
                <!-- <span v-for="(item, index) in baseObj.sellerRemark" :key="index">{{ item.content }}</span> -->
              </span>
              <el-button type="text" @click="customerRemark()">查看</el-button>
            </td>
          </tr>
        </table>
      </div>
    </el-card>
    <el-dialog
      :visible.sync="customerDialog"
      title="客服备注"
      center>
      <el-table :data="baseObj.sellerRemark" border>
        <el-table-column label="时间" prop="operateTime"/>
        <el-table-column label="内容" prop="content"/>
        <el-table-column label="操作人" prop="username"/>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    baseObj: {
      type: Object,
      default: () => { console.log('进入基本方法'); }
    }
  },
  data() {
    return {
      customerDialog: false // 客服备注
    }
  },
  watch: {
    baseObj: {
      handler(value) {
        console.log('进入基本信息');
        console.log('baseInfo', value);
        this.baseInfo = value;
      },
      deep: true
    }
  },
  methods: {
    // 去会员详情页
    goUser(id) {
      this.$router.push({
        name: 'memberinfo',
        param: {
          id: id
        }
      })
    },
    customerRemark() {
      this.customerDialog = true;
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
  .order-base {
    .box-card {
      margin: 16px 0;
      .table-td-bgcolor{
        background: #FAFAFA;
      }
      .table{
        width: 100%;
        border: 1px solid #ebeef5;
        border-collapse: collapse;
        tr td:nth-of-type(1){
          width: 12%;
        }
        tr td:nth-of-type(3){
          width: 12%;
        }
      }
      .table tr td{
        border: 1px solid #ebeef5;
        text-align: center;
        height:36px;
        font-size: 12px;
        color: #606266;
        padding: 0 6px;
        box-sizing: border-box;
      }
      .title-info {
        padding: 10px 10px 10px 15px;
        border-left: 2px solid #2592FC;
        background-color: #f3f3f3;
      }
      .order-status {
        margin-left: 40px;
        color: orange;
      }
    }
    .address-input {
      margin-top: 10px;
    }
    .input-300 {
      width: 250px;
    }
    .remark {
      // display: block;
      // width: 80%;
      // overflow: hidden;
      // text-overflow:ellipsis;
      // white-space: nowrap;
    }
  }
</style>
<style lang="scss">
  .is-leaf {
    background-color: #f3f3ff;
  }
</style>

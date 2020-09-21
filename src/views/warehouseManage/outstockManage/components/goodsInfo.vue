<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="outstock-goods">
    <el-card class="box-card">
      <div slot="header" class="goods-info title-info">
        <span>商品信息</span>
      </div>
      <div class="info-content">
        <!-- <el-button type="primary" @click="add()">入库处理</el-button> -->
        <el-table :data="goodsObj.goods" border style="width:100%">
          <el-table-column label="SKUID" prop="skuId" />
          <el-table-column label="商品编码" prop="goodsCode" />
          <el-table-column label="商品名称&规格" prop="name">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
              <span v-if="scope.row.specification">[{{ scope.row.specification }}]</span>
            </template>
          </el-table-column>
          <el-table-column label="商品业务类型" prop="period">
            <template slot-scope="scope">
              <span>{{ scope.row.businessType }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="goodsCount"/>
          <el-table-column prop="warehouse" label="出库仓库">
            <template slot-scope="scope">
              <span :class="scope.row.name">{{ goodsObj.warehouse.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="freightProviderDesc" label="发货方式">
            <template slot-scope="scope">
              <span :class="scope.row.name">{{goodsObj.freight?goodsObj.freight.freightProviderDesc:'--'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="trackingNo" label="物流单号">
            <template slot-scope="scope">
              <span v-if="goodsObj.freight && goodsObj.freight.trackingNo" :class="scope.row.name">{{ goodsObj.freight.trackingNo }}</span>
              <div v-else class="tac">--</div>
            </template>
          </el-table-column>
          <el-table-column v-if="goodsObj.status == 'COMPLETED' || goodsObj.status == 'INVALID' || goodsObj.status == 'ARCHIVED'" label="资产序列号">
            <template slot-scope="scope">
              <el-popover placement="top-start" trigger="hover">
                <el-button slot="reference" type="text" class="pop-btn">
                  <span
                    v-for="( item, index ) in scope.row.sns"
                    :key="item"
                  >{{ index==0?'':'、' }}{{ item }}</span>
                </el-button>
                <el-table :data="scope.row.sns" border style="width: 100%;">
                  <el-table-column label="sn" width="150px" prop="sns">
                    <template slot-scope="scope">
                      <span>{{ scope.row }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
// import orderApi from '@/api/order/order.js';
// import billApi from '@/api/order/bill.js';
export default {
  components: {},
  props: {
    goodsObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
.outstock-goods {
  .box-card {
    margin-bottom: 16px;
    .title-info {
      padding: 10px 10px 10px 15px;
    border-left: 2px solid #2592fc;
      background-color: #f3f3f3;
    }
    .pop-btn {
      width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .tac{
      text-align: center;
    }
  }
}
</style>

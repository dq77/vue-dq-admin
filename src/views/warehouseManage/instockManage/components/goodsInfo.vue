<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="instock-goods">
    <el-card class="box-card">
      <div slot="header" class="goods-info title-info">
        <span>{{ $t('warehouse.goodinfo') }}</span>
      </div>
      <div class="info-content">
        <el-button
          v-if="goodsobj.status == 'SUBMITTED'"
          :disabled="selectGoodsList.length == 0"
          type="primary"
          class="in-stock-btn"
          @click="add()"
        >{{ $t('warehouse.toinstock') }}</el-button>
        <div class="export-btn">
          <el-button v-if="goodsobj.status == 'SUBMITTED'" type="primary" @click="batchAdd">批量入库</el-button>
          <el-button v-if="goodsobj.status == 'SUBMITTED' && goodsobj.situation == 'PURCHASE'" type="primary" @click="snexport">{{ $t('warehouse.exportsn') }}</el-button>
          <el-button v-if="goodsobj.status == 'COMPLETED'" type="primary" @click="snexportFront">{{ $t('warehouse.exportsn') }}</el-button>
        </div>
        <el-table ref="multipleTable" :data="goodsobj.goodsLists" border style="width:100%" @selection-change="handleSelectionChange">
          <el-table-column v-if="goodsobj.status == 'SUBMITTED'" key="selection" type="selection" width="55"/>
          <el-table-column label="SKUID" prop="skuId" />
          <el-table-column :label="$t('warehouse.goodcode')" prop="goodsCode" />
          <el-table-column :label="$t('warehouse.goodnamespec')" prop="name">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
              <span v-if="scope.row.specification">[{{ scope.row.specification }}]</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('good.businessTypes')" prop="businessType" />
          <el-table-column v-if="goodsobj.status == 'SUBMITTED'" :label="$t('warehouse.shouldinmun')" prop="warehousingAmount"/>
          <el-table-column v-if="goodsobj.status == 'SUBMITTED'" :label="$t('warehouse.alreadayinstocknum')" prop="insideWarehouseCount"/>
          <el-table-column v-if="goodsobj.status == 'SUBMITTED'" :label="$t('warehouse.waitforinstocknum')" prop="outOfWarehouseCount"/>
          <el-table-column v-if="goodsobj.status != 'SUBMITTED'" :label="$t('warehouse.instocknum')" prop="insideWarehouseCount"/>
          <el-table-column v-if="goodsobj.status != 'SUBMITTED'" :label="$t('warehouse.serialNumber')" prop="sns">
            <template slot-scope="scope">
              <el-popover placement="top-start" trigger="hover">
                <el-button slot="reference" type="text" class="pop-btn">
                  <span
                    v-for="( item, index ) in scope.row.insideWarehouseSns"
                    :key="item"
                  >{{ index==0?'':' ' }}{{ item }}</span>
                </el-button>
                <el-table :data="scope.row.insideWarehouseSns" border>
                  <el-table-column :label="$t('warehouse.serialNumber')" prop="insideWarehouseSns" width="250px">
                    <template slot-scope="scope">{{ scope.row }}</template>
                  </el-table-column>
                </el-table>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <add-dialog
        :show="addDialog"
        :data-source="selectGoodsList"
        @handClose="closeDialog"
        @handOk="submit"
      />
      <!-- 弹窗 -->
      <add-module :show="snInModal" @handOk="importSnOk" @handCancel="importSnClose" />
    </el-card>
  </div>
</template>

<script>
import instockApi from '@/api/warehouse/instock';
import { downloadpurchaseUrl } from '@/api/purchase/index';
import addDialog from './add';
import addModule from './addSnModal'
import exportExcel from '../../../../utils/xlsx.js'
export default {
  components: {
    addDialog,
    addModule
  },
  props: {
    goodsobj: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      returnType: 1, // 退款方式 1退款 2扣款
      selectGoodsList: [],
      snInModal: false,
      addDialog: false // 入库弹窗
    };
  },
  methods: {
    // 批量选择
    handleSelectionChange(value) {
      this.selectGoodsList = [];
      for (const item of value) {
        if (item.outOfWarehouseCount === 0) {
          this.$message.error(this.$t('warehouse.instocknumnot0'));
          this.$refs.multipleTable.toggleRowSelection(item, false);
          return false;
        } else {
          this.selectGoodsList.push(item);
        }
      }
    },

    // 入库
    add() {
      this.goodsobj.goodsLists.map(item => {
        if (item.outOfWarehouseSns && item.outOfWarehouseSns.length > 0) {
          item.sns = item.outOfWarehouseSns
        } else {
          item.sns = [];
        }
      });
      this.addDialog = true;
    },

    // 导出序列号
    snexport() {
      downloadpurchaseUrl(this.goodsobj.businessNo).then(res => {
        if (res.code === 200) {
          window.open(res.data)
        } else {
          this.$message.info(res.msg);
        }
      })
    },
    snexportFront() {
      const exportList = []
      this.goodsobj.goodsLists.map(item => {
        item.insideWarehouseSns.map(sn => {
          exportList.push({
            'SPU_ID': item.spuId,
            'SKU_ID': item.skuId,
            'sn': sn
          })
        })
        if (!item.insideWarehouseSns || item.insideWarehouseSns.length === 0) {
          exportList.push({
            'SPU_ID': item.spuId,
            'SKU_ID': item.skuId,
            'sn': ''
          })
        }
      })
      exportExcel(exportList, `Goods Info ${new Date().Format('yyyyMMdd')}.xlsx`)
    },

    // 关闭弹窗
    closeDialog(val) {
      this.addDialog = val;
      this.selectGoodsList.map(item => {
        item.serialNumberUpload = false;
        item.serialNumber = '';
        item.file = '';
        item.sns = [];
        item.instockNum = '';
      });
    },
    batchAdd() {
      this.snInModal = true;
    },
    // 关闭批量导入
    importSnOk(vo) {
      this.snInModal = false;
      const val = {
        remark: '',
        goods: []
      }
      for (const key in vo) {
        val.goods.push({
          skuId: key,
          instockNum: vo[key].length,
          sns: vo[key]
        })
      }
      this.submit(val)
    },
    importSnClose() {
      this.snInModal = false;
    },
    // 入库提交
    submit(val) {
      const data = {
        groupId: this.goodsobj.groupId,
        remark: val.remark,
        skuIdCount: {},
        skuIdSns: {},
        version: this.goodsobj.version
      };
      val.goods.map(item => {
        data.skuIdCount[item.skuId] = item.instockNum;
        data.skuIdSns[item.skuId] = item.sns;
      });
      instockApi.instockGoods(data).then(res => {
        if (res.code === 200) {
          this.$message.success(this.$t('warehouse.instocksuccess'));
          this.addDialog = false;
          this.$emit('refresh', this.goodsobj.id);
        } else {
          this.$message.info(res.msg);
        }
      });
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
.instock-goods {
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
    .in-stock-btn {
      margin-bottom: 10px;
    }
    .export-btn{
      float: right;
    }
  }
}
</style>

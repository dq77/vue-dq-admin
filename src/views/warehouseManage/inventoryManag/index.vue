<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="inventorylist-container">
    <div class="search-container">
      <el-form :inline="true">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item :label="$t('warehouse.stockname')">
              <el-select v-model="queryForm.warehouseId" :remote-method="searchWarehouse" :placeholder="$t('warehouse.iptstockname')" filterable clearable remote reserve-keyword @change="chooseWarehouse">
                <el-option v-for="item in warehouses" :key="item.id" :label="item.name" :value="item.id">{{ item.name }}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('warehouse.goodsCategory')">
              <select-category :category-id="queryForm.goodsCategory" width="180px" @select="confirmCategory"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('good.good')">
              <el-input v-model="queryForm.goodsKeyword" :placeholder="$t('warehouse.iptgoodkeyword')" class="ipt208" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('good.updownstatus')">
              <el-select v-model="queryForm.status" clearable>
                <el-option :label="$t('common.all')" value="" />
                <el-option :label="$t('good.uptable')" value="ENABLED"/>
                <el-option :label="$t('good.downtable')" value="DISABLED"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="search-btn">
        <el-popover placement="right" width="600" trigger="hover" class="pop-tip">
          <el-button slot="reference" type="text">
            {{ $t('warehouse.inventoryexplain') }}
            <i class="el-icon-question" />
          </el-button>
          <el-form label-suffix=":" label-width="120px" class="popform stockInfo">
            <el-form-item :label="$t('warehouse.isinstocknum')" class="popItem">{{ $t('warehouse.isinstocknumexp') }}</el-form-item>
            <el-form-item :label="$t('warehouse.cansaleinventory')" class="popItem">{{ $t('warehouse.cansaleinventoryexp') }}</el-form-item>
            <el-form-item :label="$t('warehouse.pricelockinventory')" class="popItem">{{ $t('warehouse.pricelockinventoryexp') }}</el-form-item>
            <el-form-item :label="$t('warehouse.readysendlockinventory')" class="popItem">{{ $t('warehouse.readysendlockinventoryexp') }}</el-form-item>
            <el-form-item :label="$t('warehouse.sendinginventory')" class="popItem">{{ $t('warehouse.sendinginventoryexp') }}</el-form-item>
            <el-form-item :label="$t('warehouse.leasinginventory')" class="popItem">{{ $t('warehouse.leasinginventoryexp') }}</el-form-item>
            <el-form-item :label="$t('warehouse.tobereturned')" class="popItem"/>
            <el-form-item :label="$t('warehouse.returning')" class="popItem"/>
            <el-form-item :label="$t('warehouse.cancelinginventory')" class="popItem">{{ $t('warehouse.cancelinginventoryexp') }}</el-form-item>
            <el-form-item :label="$t('warehouse.buytoinstock')" class="popItem">{{ $t('warehouse.buytoinstockexp') }}</el-form-item>
            <el-form-item :label="$t('warehouse.allowoverline')" class="popItem">{{ $t('warehouse.allowoverlinexp') }}</el-form-item>
            <el-form-item :label="$t('warehouse.warninginventory')" class="popItem">{{ $t('warehouse.warninginventoryexp') }}</el-form-item>
          </el-form>
        </el-popover>
        <el-button type="primary" @click="search()">{{ $t('common.find') }}</el-button>
        <!-- <el-button type="primary" @click="add()">新增</el-button> -->
      </div>
    </div>
    <div class="stockmanager-table">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column :label="$t('good.goodNo')" prop="goodsCode"/>
        <!-- <el-table-column :label="$t('good.businessTypes')" prop="businessTypeDesc"/> -->
        <el-table-column :label="$t('good.goodname')" prop="goodsName" width="200">
          <template slot-scope="scope">
            {{ scope.row.goodsName }}{{ scope.row.specification?' ['+scope.row.specification+']':'' }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('warehouse.isinstocknum')" prop="inventoryDataSummary">
          <template slot-scope="scope">
            <span v-if="scope.row.inventoryDataSummary">{{ scope.row.inventoryDataSummary['0'] }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('warehouse.cansaleinventory')" prop="inventoryDataSummary">
          <template slot-scope="scope">
            <span v-if="scope.row.inventoryDataSummary">{{ scope.row.freeQuantity || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('warehouse.pricelockinventory')" prop="inventoryDataSummary">
          <template slot-scope="scope">
            <span v-if="scope.row.inventoryDataSummary">{{ scope.row.inventoryDataSummary['1'] }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('warehouse.readysendlockinventory')" prop="inventoryDataSummary">
          <template slot-scope="scope">
            <span v-if="scope.row.inventoryDataSummary">{{ scope.row.inventoryDataSummary['2'] }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('warehouse.sendinginventory')" prop="inventoryDataSummary">
          <template slot-scope="scope">
            <span v-if="scope.row.inventoryDataSummary">{{ scope.row.inventoryDataSummary['3'] }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('warehouse.leasinginventory')" prop="inventoryDataSummary">
          <template slot-scope="scope">
            <span v-if="scope.row.inventoryDataSummary">{{ scope.row.inventoryDataSummary['4'] }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('warehouse.tobereturned')" prop="inventoryDataSummary">
          <template slot-scope="scope">
            <span v-if="scope.row.inventoryDataSummary">{{ scope.row.inventoryDataSummary['5'] }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('warehouse.returning')" prop="inventoryDataSummary">
          <template slot-scope="scope">
            <span v-if="scope.row.inventoryDataSummary">{{ scope.row.inventoryDataSummary['6'] }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('warehouse.cancelinginventory')" prop="inventoryDataSummary">
          <template slot-scope="scope">
            <span v-if="scope.row.inventoryDataSummary">{{ scope.row.inventoryDataSummary['7'] }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('warehouse.buytoinstock')" prop="inventoryDataSummary">
          <template slot-scope="scope">
            <span v-if="scope.row.inventoryDataSummary">{{ scope.row.inventoryDataSummary['8'] }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('warehouse.allowoverline')" prop="toleranceValue"/>
        <el-table-column :label="$t('warehouse.warninginventory')" prop="alarmValue"/>
        <el-table-column :label="$t('common.actions')" min-width="150px" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" plain icon="el-icon-edit" @click="edit(scope.row)">{{ $t('common.edit') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />
    </div>
    <add-dialog
      :show="addDialog"
      :data-source="commonData"
      @handClose="closeDialog"
      @handOk="updateInventory"
    />
  </div>
</template>

<script>
import pagination from '@/components/Pagination/index';
import addDialog from './components/add';
import selectCategory from '@/components/selectCategory/index'
import { getstocklist, updateInventories } from '@/api/inventorys';
import warehouseApi from '@/api/warehouse/warehouse';
export default {
  components: {
    pagination,
    addDialog,
    selectCategory
  },
  data() {
    return {
      queryForm: {
        warehouseId: '',
        goodsCategory: '',
        goodsKeyword: '',
        status: ''
      },
      searchForm: {
        warehouseId: '',
        goodsCategory: '',
        goodsKeyword: '',
        status: ''
      },
      listQuery: {
        page: 1,
        pageSize: 10
      },
      warehouses: [], // 仓库列表
      total: 1,
      tableData: [{}],
      commonData: {}, // 新增编辑数据
      addDialog: false // 新增编辑弹窗
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取列表信息
    getList() {
      const data = {
        page: this.listQuery.page,
        pageSize: this.listQuery.pageSize,
        ...this.searchForm
      };
      getstocklist(data).then(res => {
        if (res.code === 200) {
          // res.data.list[0].inventoryDataSummary = {
          //   "0":10, "1":1, "2":2, "3":3, "4":4, "5":5, "6":6, "7":7, "8":8, "9":9, "10":10
          // }
          res.data.list.map(item => {
            for (let i = 0; i < 11; i++) {
              item.inventoryDataSummary[i] = item.inventoryDataSummary[i] || 0
            }
          })
          this.tableData = res.data.list || [];
          this.total = res.data.totalRecords;
        } else {
          this.$message.info(res.msg);
        }
      });
    },

    // 确认类目下拉框
    confirmCategory(item) {
      if (item.length) {
        this.queryForm.goodsCategory = item[item.length - 1].id
      } else {
        this.queryForm.goodsCategory = ''
      }
    },
    // 搜索仓库
    searchWarehouse(query) {
      if (query !== '') {
        const data = {
          page: 1,
          pageSize: 10,
          enabled: true,
          name: query
        };
        warehouseApi.getStockList(data).then(res => {
          if (res.code === 200) {
            this.warehouses = res.data.list;
          } else {
            this.$message.info(res.msg);
          }
        });
      } else {
        this.warehouses = [];
      }
    },
    // 选中仓库
    chooseWarehouse(id) {
      this.queryForm.warehouseId = id;
    },

    // 查询条件
    search() {
      this.searchForm = {
        ...this.queryForm
      };
      this.listQuery.page = 1;
      this.getList();
    },

    // 编辑
    edit(row) {
      this.addDialog = true;
      this.commonData = {
        ...row
      };
    },

    // 关闭弹窗
    closeDialog(val) {
      this.addDialog = val;
    },
    // 更新预警值
    updateInventory(val) {
      const data = {
        skuId: this.commonData.skuId,
        spuId: this.commonData.spuId,
        alarmValue: val.alarmValue - 0,
        toleranceValue: val.toleranceValue - 0
      }
      updateInventories(data).then(res => {
        if (res.code === 200) {
          this.$message.success(this.$t('common.editSuccess'));
          this.addDialog = false;
          this.getList();
        } else {
          this.$message.info(res.msg);
        }
      });
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss">
.inventorylist-container {
  padding: 15px;
  .search-container {
    padding: 15px;
    background-color: #fff;
    margin-bottom: 15px;
    padding-left: 25px;

    .distpicker {
      select {
        cursor: pointer;
        color: #606266;
        font-size: 12px;
        min-width: 100px;
        padding: 0 10px;
        text-align: center;
        height: 28px;
        line-height: 26px;
        -webkit-appearance: none;
        -moz-appearance: none;
      }
      select:hover {
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
      }
      select:focus {
        outline: none;
      }
    }
    .ipt208{
      width: 208px;
    }
    .search-btn {
      display: flex;
      justify-content: space-between;
      .pop-tip {
        display: block;
        .el-icon-question {
          font-size: 16px;
          margin-left: 2px;
          vertical-align: text-top;
        }
      }
    }
  }
  .stockmanager-table {
    padding: 15px;
    background-color: #fff;
  }
}
.popform.stockInfo {
  .popItem {
    margin-bottom: 10px !important;
    .el-form-item__label,
    .el-form-item__content {
      font-size: 13px !important;
      line-height: 18px;
    }
  }
}
</style>

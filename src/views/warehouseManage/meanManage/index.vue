<!--
 * @Author: 刁琪
 * @Date: 2019-01-14 16:26:57
 * @LastEditors: your name
 * @LastEditTime: 2019-02-28 19:41:35
 -->
<template>
  <div class="inventory-page">
    <!-- 条件筛选区 -->
    <div class="topfilter">
      <el-card class="searchOption" shadow="hover">
        <el-form :model="params" :inline="true" label-position="right" label-width="80px">
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item :label="$t('warehouse.skuid')">
                <el-input
                  v-model.trim="params.skuId"
                  :placeholder="$t('warehouse.iptskuid')"
                  class="input-200"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('good.goodname')">
                <el-input v-model.trim="params.goodsKeyword" :placeholder="$t('good.iptgoodname')" class="input-200" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('good.category')">
                <el-select v-model="params.category" :placeholder="$t('warehouse.iptsignfrom')" class="input-200">
                  <el-option :label="$t('common.all')" value=""/>
                  <el-option v-for="item in categorylist" :key="item.id" :label="item.name" :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item :label="$t('warehouse.snid')">
                <el-input
                  v-model.trim="params.sn"
                  :placeholder="$t('warehouse.iptsnid')"
                  class="input-200"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('common.status')">
                <el-select v-model="params.status" :placeholder="$t('warehouse.slctstatus')" class="input-200">
                  <el-option :label="$t('common.all')" value=""/>
                  <el-option :label="$t('warehouse.createmean')" value="CREATED" />
                  <el-option :label="$t('warehouse.instockmean')" value="IN_STOCK" />
                  <el-option :label="$t('warehouse.transitmean')" value="IN_TRANSIT" />
                  <el-option :label="$t('warehouse.rentingmean')" value="RENTING" />
                  <el-option :label="$t('warehouse.sellingmean')" value="SELLING" />
                  <el-option :label="$t('warehouse.transferredmean')" value="TRANSFERRED" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col style="text-align:right">
              <el-button type="primary" size="small" icon="el-icon-search" @click="searchTable">{{ $t('common.find') }}</el-button>
              <el-button type="primary" size="small" @click="batchAdd">
                <svg-icon icon-class="bachadd" />{{ $t('warehouse.massadd') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <!-- 表格 -->
    <div class="content">
      <el-table v-loading="loading" :data="tableData" border style="width: 100%">
        <el-table-column :label="$t('warehouse.snid')" prop="sn"/>
        <el-table-column :label="$t('good.goodname')" prop="goods">
          <template slot-scope="scope">
            <span v-if="scope.row.goods">{{ scope.row.goods.name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.status')">
          <template slot-scope="scope">
            <span>{{ scope.row.status | filtrAssestStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('warehouse.meanbuyday')" prop="assetPurchase">
          <template slot-scope="scope">
            <span v-if="scope.row.assetPurchase">{{ scope.row.assetPurchase.stockInTime }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.actions')" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" plain icon="el-icon-view" @click="toDetail(scope.row)">{{ $t('common.see') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="fetchTableData"/>
    </div>
    <!-- 弹窗 -->
    <add-module :show="visible" @handOk="handOk" @handCancel="handCancel" />
  </div>
</template>
<script>
import pagination from '@/components/Pagination/index'
import addModule from './modal/addmodal'
import { saveParameter } from '@/utils/saveParameter.js'
import {
  getassestList, // 获取库存列表
  selectCategory // 类目下拉列表
} from '@/api/inventorys';

export default {
  components: {
    pagination,
    addModule
  },
  data() {
    return {
      visible: false,
      loading: false,
      categorylist: [],
      params: {
        skuId: '',
        goodsKeyword: '',
        category: '',
        sn: '',
        status: ''
      },
      tempSearch: {}, // 查询条件中间变量
      listQuery: {
        page: 1,
        pageSize: 10
      },
      total: 1,
      // 表格数据
      tableData: []
    };
  },
  created() {
    this.fetchCateorylist();
  },
  mounted() {
    if (
      sessionStorage.getItem('pageFlag') &&
      this.$route.path === sessionStorage.getItem('path')
    ) {
      const parameter = JSON.parse(sessionStorage.getItem('parameter'));
      const listQuery = JSON.parse(sessionStorage.getItem('listQuery'));
      this.params = {
        ...parameter
      };
      this.listQuery = {
        ...listQuery
      };
      this.tempSearch = {
        ...parameter
      };
      sessionStorage.removeItem('pageFlag')
      sessionStorage.removeItem('path')
    }
    this.searchTable();
  },
  methods: {
    toDetail(row) {
      saveParameter(this.$route.path, JSON.stringify(this.tempSearch), JSON.stringify(this.listQuery))
      this.$router.push({
        name: `meanDetail`,
        params: {
          sn: row.sn
        },
        query: {
          skuId: row.skuId
        }
      })
    },

    // 获取类目下拉列表
    fetchCateorylist() {
      selectCategory().then(res => {
        if (res.code === 200) {
          this.categorylist = res.data;
        }
      });
    },

    // 获取表格数据
    fetchTableData() {
      const params = {
        page: this.listQuery.page,
        pageSize: this.listQuery.pageSize,
        ...this.tempSearch
      }
      this.loading = true
      setTimeout(() => {
        getassestList(params).then(res => {
          if (res.code === 200) {
            this.tableData = res.data.list || []
            // 每次回到列表页后都把标志清除掉，避免每次都从缓存中读取查询条件
            sessionStorage.removeItem('pageFlag');
            this.total = res.data.totalRecords;
          }
          this.loading = false
        })
      }, 200)
    },

    // 表格搜索
    searchTable() {
      this.tempSearch = {
        ...this.params
      };
      this.listQuery.page = 1;
      this.fetchTableData();
    },

    handOk() {
      this.visible = false;
      this.fetchTableData();
    },
    handCancel() {
      this.visible = false;
    },

    // 批量新增
    batchAdd() {
      this.visible = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.inventory-page {
  padding: 15px;
  .content {
    padding: 15px;
    background-color: #fff;
    margin-top: 15px;
  }
}
</style>


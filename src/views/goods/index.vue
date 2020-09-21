<!--
 * @Description: In User Settings Edit-ta
 * @Author: 钟文强
 * @Date: 2019-08-12 14:17:38
 * @LastEditTime: 2020-03-11 10:00:11
 * @LastEditors: Zhang Pengbin
 -->
<template>
  <div class="goods-container">
    <div class="goods-search">
      <el-form :model="formData" :inline="true" label-width="100px">
        <el-form-item :label="$t('good.channel')">
          <el-select v-model="formData.channel" clearable>
            <el-option :label="$t('common.all')" value=""/>
            <el-option v-for="item in channelList" :key="item.code" :value="item.code" :label="item.name"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('good.category')">
          <!-- <el-select v-model="formData.categoryId" clearable>
            <el-option :label="$t('common.all')" value=""/>
            <el-option v-for="item in categoryList" :key="item.id" :value="item.id" :label="item.name"/>
          </el-select> -->
          <select-category :category-id="formData.categoryId" @select="confirmCategory"/>
        </el-form-item>
        <el-form-item :label="$t('good.goodsType')">
          <el-select v-model="formData.goodsType" clearable>
            <el-option :label="$t('common.all')" value=""/>
            <el-option :value="0" :label="$t('good.common')"/>
            <el-option :value="10" :label="$t('good.group')"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('good.updownstatus')">
          <el-select v-model="formData.showStatus" clearable>
            <el-option :label="$t('common.all')" value=""/>
            <el-option :value="20" :label="$t('good.uptable')"/>
            <el-option :value="10" :label="$t('good.downtable')"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('good.businessTypes')">
          <el-select v-model="formData.businessTypes" clearable>
            <el-option :label="$t('common.all')" value=""/>
            <el-option :value="0" :label="$t('good.rent')"/>
            <el-option :value="20" :label="$t('good.sale')"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('good.goodkeyWords')">
          <el-input v-model="formData.keyWords" :placeholder="$t('good.iptkeyWords')" class="input-180" clearable/>
        </el-form-item>
        <el-form-item label="erpCode">
          <el-input v-model="formData.erpCode" :placeholder="$t('good.ipterpCode')" class="input-180" clearable/>
        </el-form-item>
        <el-form-item :label="$t('good.labelCategory')">
          <el-input v-model="formData.labelCategoryName" :placeholder="$t('good.iptlabelCategory')" class="input-180" clearable/>
        </el-form-item>
        <el-form-item :label="$t('good.supplierMode')">
          <el-select v-model="formData.supplierMode">
            <el-option :label="$t('common.all')" value=""/>
            <el-option :label="$t('good.supply')" value="SUPPLY"/>
            <el-option :label="$t('good.deliver')" value="DELIVER"/>
            <el-option :label="$t('good.selling')" value="SELLING"/>
          </el-select>
          <el-input v-if="formData.supplierMode == 'DELIVER' || formData.supplierMode == 'SELLING' " v-model="formData.supplierKeyword" :placeholder="$t('good.iptsupplier')" class="input-180 supplier-ipt" clearable/>
        </el-form-item>
        <div class="search-btn">
          <el-button icon="el-icon-search" type="primary" @click="search()">{{ $t('common.find') }}</el-button>
          <el-button icon="el-icon-plus" type="primary" @click="addGoods">{{ $t('common.new') }}</el-button>
          <el-button icon="el-icon-download" type="primary" @click="exportGoods()">{{ $t('common.export') }}</el-button>
        </div>
      </el-form>
    </div>
    <div class="goods-content">
      <el-table v-loading="loading" :data="tableData" :max-height="600" border>
        <el-table-column :label="$t('good.goodid')" prop="spuNo" width="200px"/>
        <el-table-column :label="$t('good.good')" prop="spuName" width="250px">
          <template slot-scope="scope">
            <div class="goods-name">
              <img :src="scope.row.headFigure" @click="seeBigPic(scope.row.headFigure)">
              <div class="goods-spu">
                <el-tooltip :content="scope.row.spuName" class="item" effect="light" placement="top-start">
                  <div>{{ scope.row.spuName }}</div>
                </el-tooltip>
                <el-tooltip :content="scope.row.channelList" class="item" effect="light" placement="top-start">
                  <div class="textColor">{{ $t('good.channel') }}：{{ scope.row.channelList }}</div>
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('good.goodsType')">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 0">{{ $t('good.commongood') }}</span>
            <span v-if="scope.row.type ===10">{{ $t('good.groupgood') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('good.businessTypes')">
          <template slot-scope="scope">
            <span v-if="scope.row.businessType === 0">{{ $t('good.rent') }}</span>
            <span v-if="scope.row.businessType ===20">{{ $t('good.sale') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('good.supplierMode')">
          <template slot-scope="scope">
            <div v-if="scope.row.goodsStrategy">
              <span v-if="scope.row.goodsStrategy.supplierMode == 'SUPPLY'">{{ $t('good.supply') }}</span>
              <span v-if="scope.row.goodsStrategy.supplierMode == 'SELLING'">{{ $t('good.deliver') }}</span>
              <span v-if="scope.row.goodsStrategy.supplierMode == 'DELIVER'">{{ $t('good.selling') }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('good.category')" prop="categoryName"/>
        <el-table-column :label="$t('good.specification')">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              trigger="hover">
              <!-- <el-button v-if="scope.row.specificationType === 0" type="text" slot="reference">无多规格</el-button> -->
              <el-button slot="reference" type="text">
                <span v-if="scope.row.specificationType === 0 || scope.row.type === 10">{{ $t('good.singlespec') }}</span>
                <span v-if="scope.row.specificationType === 10">{{ $t('good.specifications') }}</span>
              </el-button>
              <!-- <el-button v-if="scope.row.specificationType === 10" type="text" slot="reference">多规格</el-button> -->
              <el-table :data="scope.row.skuVOList" border style="width: 100%;">
                <el-table-column v-if="scope.row.specificationType === 10 && scope.row.type !== 10" :key="Math.random()" :label="$t('good.skuspec')" width="150px">
                  <template slot-scope="scope">
                    <span>{{ scope.row.detail }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="scope.row.type === 10" :key="Math.random()" :label="$t('good.goodingroups')" width="150px">
                  <template slot-scope="scope">
                    <span v-for="(item,index) in scope.row.skuVOList" :key="index">{{ item.spuName }}{{ item.detail }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="scope.row.businessType === 0" :key="Math.random()" :label="$t('good.stage')" width="150px">
                  <template slot-scope="scope">
                    <div v-for="(item, index) in scope.row.skuStageVOList" :key="index">{{ item.stageNumber }}{{ item.unit }}</div>
                  </template>
                </el-table-column>
                <el-table-column v-if="scope.row.businessType === 0" :key="Math.random()" :label="$t('good.stageprice')" width="150px">
                  <template slot-scope="scope">
                    <div v-for="(item,index) in scope.row.skuStageVOList" :key="index">{{ item.stagePrice + '$' }}/{{ item.unit }}</div>
                  </template>
                </el-table-column>
                <el-table-column v-if="scope.row.businessType === 20" :key="Math.random()" :label="$t('good.stagenumber')" width="150px">
                  <template slot-scope="scope">
                    <div v-for="(item, index) in scope.row.skuStageVOList" :key="index">{{ item.stageNumber }}{{ $t('good.stageNum') }}</div>
                  </template>
                </el-table-column>
                <el-table-column v-if="scope.row.businessType === 20" :key="Math.random()" :label="$t('good.onestageprice')" width="150px">
                  <template slot-scope="scope">
                    <div v-for="(item, index) in scope.row.skuStageVOList" :key="index">{{ Math.floor(scope.row.salePrice/item.stageNumber * 100)/ 100 }}$/{{ item.unit }}</div>
                  </template>
                </el-table-column>
                <el-table-column v-if="scope.row.businessType === 20" :key="Math.random()" :label="$t('good.salePrice')" width="150px">
                  <template slot-scope="scope">
                    <span>{{ scope.row.salePrice + '$' }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="scope.row.businessType === 0" :key="Math.random()" :label="$t('good.onePayPrice')" width="150px">
                  <template slot-scope="scope">
                    <div v-for="(item, index) in scope.row.skuStageVOList" :key="index">{{ item.onePayPrice + '$' }}</div>
                  </template>
                </el-table-column>
                <!-- <el-table-column label="首付($)" width="150px"/> -->
                <el-table-column v-if="scope.row.businessType === 0" :key="Math.random()" :label="$t('good.renewalStagePrice')" width="150px">
                  <template slot-scope="scope">
                    <div v-for="(item,index) in scope.row.skuStageVOList" :key="index">{{ item.renewalStagePrice + '$' }}/{{ item.unit }}</div>
                  </template>
                </el-table-column>
                <el-table-column v-if="scope.row.businessType === 0" :key="Math.random()" :label="$t('good.renewalOnePrice')" width="150px">
                  <template slot-scope="scope">
                    <div v-for="(item, index) in scope.row.skuStageVOList" :key="index">{{ item.renewalOnePrice + '$' }}</div>
                  </template>
                </el-table-column>
              </el-table>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.status')">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 20" type="success">{{ $t('good.uptable') }}</el-tag>
            <el-tag v-if="scope.row.status === 10" type="info">{{ $t('good.downtable') }}</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column :label="$t('good.commission')">
          <template slot-scope="scope">
            <span>{{ scope.row.commissionRate }}%</span>
          </template>
        </el-table-column> -->
        <el-table-column :label="$t('good.isRenewal')" min-width="100px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isRenewal === 1" type="success">{{ $t('good.canRenewal') }}</el-tag>
            <el-tag v-if="scope.row.isRenewal === 0" type="info">{{ $t('good.cantRenewal') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.actions')" width="260px" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-view" plain @click="view(scope.row)">{{ $t('common.detail') }}</el-button>
            <el-button type="info" icon="el-icon-edit" plain @click="edit(scope.row)">{{ $t('common.edit') }}</el-button>
            <el-button v-if="scope.row.status === 10" type="success" icon="el-icon-sort-up" plain @click="onShelf(scope.row)">{{ $t('good.upgood') }}</el-button>
            <el-button v-if="scope.row.status === 20" type="primary" icon="el-icon-sort-down" plain @click="offShelf(scope.row)">{{ $t('good.downgood') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList"/>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img :src="dialogHeadFigure" width="100%" alt >
    </el-dialog>
    <goods-detail :dialog="dialog" :obj="goodsObj" @closeDialog="close()"/>
    <form id="hiddenForm" ref="hiddenForm" :action="exportBaseUrl" method="post" style="display:none" target="targetIfr">
      <input ref="input" type="hidden">
    </form>
    <iframe name="targetIfr" style="display:none"/>
  </div>
</template>

<script>
import ZTable from '@/components/tableList/tableList.vue';
import selectCategory from '@/components/selectCategory/index'
import goodsApi from '@/api/goods.js';
import goodsDetail from './goodsDetail'
import pagination from '@/components/Pagination/index'
import { baseUrl } from '@/common/config.js'
import { saveParameter } from '@/utils/saveParameter.js'
export default {
  components: {
    'z-table': ZTable,
    selectCategory,
    'goods-detail': goodsDetail,
    pagination
  },
  data() {
    return {
      channelList: [], // 获取的渠道下拉框
      categoryList: [], // 获取的类目下拉框
      total: 0,
      exportBaseUrl: `${baseUrl}/goods/export`,
      loading: true,
      dialogVisible: false, // 商品图片放大框
      dialogHeadFigure: '', // 放大框商品图片地址
      formData: {
        channel: '',
        categoryId: '',
        goodsType: '',
        showStatus: '',
        businessTypes: '',
        keyWords: '',
        erpCode: '',
        labelCategoryName: '', // 类目标签
        supplierMode: '',
        supplierKeyword: ''
      },
      initForm: {
        channel: '',
        categoryId: '',
        goodsType: '',
        showStatus: '',
        businessTypes: '',
        keyWords: ''
      }, // 搜索框对象
      goodsObj: {},
      listQuery: {
        page: 1,
        pageSize: 10
      },
      dialog: false,
      tableData: []
    };
  },
  watch: {
    formData: {
      deep: true,
      handler() {
        this.formData.keyWords = this.formData.keyWords.replace(/\s/g, '');
      }
    }
  },
  created() {
    this.channelFunction();
    this.categoryFunction();
  },
  mounted() {
    if (sessionStorage.getItem('pageFlag') && sessionStorage.getItem('path') === this.$route.path) {
      const listQuery = JSON.parse(sessionStorage.getItem('listQuery'));
      const parameter = JSON.parse(sessionStorage.getItem('parameter'));
      this.$set(this.listQuery, 'page', listQuery.page);
      this.$set(this.listQuery, 'pageSize', listQuery.pageSize);
      this.initForm = {
        ...parameter
      }
      this.formData = {
        ...parameter
      }
    }
    this.fetchTableData();
  },
  methods: {
    // 上架
    onShelf(row) {
      goodsApi.onShelf(row.spuNo).then(res => {
        if (res.code === 200) {
          this.fetchTableData();
        }
      })
    },
    // 下架
    offShelf(row) {
      goodsApi.offShelf(row.spuNo).then(res => {
        if (res.code === 200) {
          this.fetchTableData();
        }
      })
    },
    getList() {
      this.fetchTableData();
    },
    view(row) {
      this.getDetail(row.spuNo);
    },
    // 编辑商品
    edit(row) {
      // 缓存方法必须在路由跳转之前，否则path的值是跳转之后的路径，不是当前页面的路径了
      saveParameter(this.$route.path, JSON.stringify(this.initForm), JSON.stringify(this.listQuery));
      this.$router.push({
        name: 'addGoods',
        query: {
          spuNo: row.spuNo
        }
      })

      // 点击编辑保存成功之后,给个编辑页面标志，回到列表页可以确认是编辑页面跳转的
      // sessionStorage.setItem('path', this.$route.path);
      // sessionStorage.setItem('pageFlag', true);
      // sessionStorage.setItem('parameter', JSON.stringify(this.initForm));
      // sessionStorage.setItem('listQuery', JSON.stringify(this.listQuery));
    },
    // 新增租用商品
    addGoods() {
      this.$router.push({
        name: 'addGoods'
      });
    },
    exportGoods() {
      var form = this.$refs.hiddenForm;
      var input = this.$refs.input;
      input.type = 'hidden';
      input.name = 'goodsSearchVO';
      input.value = JSON.stringify(this.formData);
      form.submit();
    },
    // 获取商品详情
    getDetail(no) {
      goodsApi.goodsDetail(no).then(res => {
        if (res.code === 200) {
          this.goodsObj = res.data;
          this.dialog = true;
          console.log('商品详情', res);
        }
      })
    },
    // 获取渠道下拉框
    channelFunction() {
      goodsApi.getChannel().then(res => {
        if (res.code === 200 && res.data) {
          this.channelList = res.data;
        }
      })
    },
    // 获取类目下拉框
    categoryFunction() {
      goodsApi.selectCategory().then(res => {
        if (res.code === 200 && res.data) {
          this.categoryList = res.data;
        }
      })
    },
    // 确认类目下拉框
    confirmCategory(item) {
      if (item.length) {
        this.formData.categoryId = item[item.length - 1].id
      } else {
        this.formData.categoryId = ''
      }
    },
    // 条件查询
    search() {
      this.listQuery.page = 1;
      this.listQuery.pageSize = 10;
      this.initForm = {
        ...this.formData
      }
      this.fetchTableData()
    },
    seeBigPic(picAddr) {
      this.dialogVisible = true
      this.dialogHeadFigure = picAddr
    },
    // 获取表格数据事件
    fetchTableData() {
      const data = {
        page: this.listQuery.page,
        pageSize: this.listQuery.pageSize,
        ...this.initForm
      }
      if (data.supplierMode === 'SUPPLY') {
        delete data.supplierKeyword
      } else if (!data.supplierMode) {
        delete data.supplierMode
        delete data.supplierKeyword
      }
      goodsApi.goodsList(data).then(res => {
        if (res.code === 200 && res.data) {
          console.log('商品类表', res);
          this.tableData = res.data.list;
          this.tableData = this.tableData.map(item => {
            item.channelList = item.channelList.map(one => {
              return one === '人工' ? '手工建单' : one
            }).join('、')
            return item;
          })
          this.loading = false;
          this.total = res.data.totalCount;
          sessionStorage.removeItem('pageFlag');
          this.listQuery.page = res.data.page;
          this.listQuery.pageSize = res.data.pageSize;
        }
      })
    },
    // 点击行事件
    handleRowClick(value) {
      console.log(value);
    },
    // 选择数目发生变化
    handleSelectionChange(selection) {
      console.log(selection);
    },
    // 关闭弹窗
    close() {
      console.log('监听事件', this.dialog);
      this.dialog = false;
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
.goods-container {
  padding: 20px;
  .search-btn {
    display: flex;
    justify-content: flex-end;
  }
  .supplier-ipt{
    margin-left: 5px;
  }
  .goods-search {
    background-color: #fff;
    padding: 20px;
    margin-bottom: 16px;
  }
  .goods-content {
    // display: flex;
    // flex-direction: column;
    // flex: 1;
    background-color: #fff;
    padding: 16px;
  }
  .input-180 {
    width: 180px;
  }
  .textColor {
    color: #969696;
  }
  .goods-name {
    display: flex;
    img {
      width: 50px;
      height: 50px;
    }
    .goods-spu {
      flex: 1;
      margin-left: 6px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      div {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
<style lang="scss">
  .goods-container {
    .merger {
      text-align: center;
      padding: 0;
      .cell {
        padding: 0;
        .content {
          border-bottom: 1px solid #ebeef5;
          display: flex;
          justify-content: flex-start;
          .content-left {
            width: 50%;
            padding: 0 5px;
            // text-align: left;
            // border-right: 1px solid #ebeef5;
          }
          .content-right {
            text-align: left;
            width: 50%;
            div span:first-child {
              display: inline-block;
              // width:50%;
              width: 60px;
            }
          }
        }
      }
      .cell div:last-of-type {
          border-bottom: 0;
        }
    }
  }
</style>

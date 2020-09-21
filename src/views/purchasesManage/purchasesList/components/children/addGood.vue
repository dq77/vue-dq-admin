<template>
  <el-dialog v-el-drag-dialog :visible.sync="visible" :before-close="handleClose" :title="$t('warehouse.addgood')" width="70%">
    <div class="good_content">
      <!-- 筛序区域 -->
      <div>
        <el-form :model="params" :inline="true">
          <el-form-item :label="$t('good.channel')">
            <el-select v-model="params.channel" :placeholder="$t('good.iptchannel')" class="input-120">
              <el-option :label="$t('common.all')" value="-1" />
              <el-option v-for="item in sourceList" :key="item.id" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('good.category')">
            <select-category :category-id="params.categoryId" @select="confirmCategory" />
          </el-form-item>
          <el-form-item :label="$t('good.goodname')">
            <el-input v-model.trim="params.keyWords" :placeholder="$t('good.iptgoodname')" class="input-120" clearable />
          </el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">{{ $t('common.search') }}</el-button>
        </el-form>
        <el-table
          v-loading="loading"
          ref="gridData"
          :data="gridData"
          :row-key="(row)=>{ return row.skuId}"
          stripe
          highlight-current-row
          border
          max-height="400"
          @select="handleSelece"
          @select-all="handleSeleceAll"
          @row-click="handleClickRow"
        >
          <el-table-column :reserve-selection="true" type="selection" />
          <el-table-column :label="$t('warehouse.goodnamespec')" prop="spuName" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.spuName }}</span>
              <span v-if="scope.row.detail">{{ `[${scope.row.detail}]` }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('good.businessTypes')" prop="name" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.businessType === 0">{{ $t('good.rent') }}</el-tag>
              <el-tag v-if="scope.row.businessType ===20">{{ $t('good.sale') }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="skuId" label="SKUID" align="center" />
          <el-table-column :label="$t('warehouse.goodcode')" prop="spuNo" align="center" />
        </el-table>
        <Pagination
          v-if="total>0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.pageSize"
          layout="total, prev, pager, next"
          @pagination="paginationChange"
        />
      </div>
    </div>
    <div class="dialog_footer" style="text-align:right">
      <el-button size="medium" type="danger" @click="handleClose('cancel')">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" size="medium" @click="handleClose('ok')">{{ $t('common.add') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Pagination from '@/components/Pagination';
import goodApi from '@/api/goods';
import store from '@/store';
import { mapGetters } from 'vuex';
import elDragDialog from '@/directive/el-dragDialog';
import selectCategory from '@/components/selectCategory/index';

export default {
  directives: { elDragDialog }, // 自定义指令
  components: {
    selectCategory,
    Pagination
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: true,
      params: { channel: '-1', categoryId: '-1', keyWords: '' },
      visible: this.show,
      gridData: [],
      sourceList: [], // 渠道
      cateoryList: [], // 类目
      total: 0, // 总数量
      listQuery: {
        page: 1,
        pageSize: 10
      },
      multipleSelection: [], // 已勾选的数组
      handsSelect: false, // 是否点击了勾选
      defaultSelectArr: []
    };
  },
  computed: {
    ...mapGetters(['deleteList', 'checkedPurchaseGood'])
  },
  watch: {
    show() {
      this.visible = this.show;
      if (this.show) {
        this.fetchTableList();
      } else {
        this.$refs.gridData.clearSelection();
      }
    }
  },
  created() {},
  mounted() {
    this.fetchChannel(); // 获取渠道
    this.fetchCatorty(); // 获取类目
  },
  methods: {
    // 分页选择
    paginationChange() {
      this.loading = true;
      this.fetchTableList();
    },

    // 弹窗关闭
    handleClose(val) {
      if (val === 'ok') {
        this.confirmation();
      } else if (val === 'cacel') {
        this.$confirm(this.$t('setCenter.confirmclose'))
          .then(_ => {
            this.$emit('handCancel');
          })
          .catch(_ => {});
      } else {
        this.$emit('handCancel');
      }
      this.listQuery.page = 1;
    },

    // 获取可选择的商品列表
    fetchTableList() {
      const params = {
        ...this.listQuery,
        ...this.params,
        businessTypes: '',
        erpCode: '',
        goodsType: '',
        labelCategoryName: '',
        showStatus: ''
      };
      goodApi.goodsList({ ...params }).then(res => {
        if (res.code === 200) {
          this.gridData = this.downgradeData(res.data.list) || [];
          this.loading = false;
          this.total = res.data.totalCount || 0;
          if (this.checkedPurchaseGood.length > 0) {
            this.dealselecte(this.gridData, this.checkedPurchaseGood);
          }
        }
      });
    },

    // 获取渠道
    fetchChannel() {
      goodApi.getChannel().then(res => {
        if (res.code === 200) {
          this.sourceList = res.data || [];
        }
      });
    },
    // 确认类目下拉框
    confirmCategory(item) {
      if (item.length) {
        this.params.categoryId = item[item.length - 1].id;
      } else {
        this.params.categoryId = '';
      }
    },

    // 获取类目
    fetchCatorty() {
      goodApi.selectCategory().then(res => {
        if (res.code === 200) {
          this.cateoryList = res.data || [];
        }
      });
    },

    // 筛选列表
    search() {
      this.fetchTableList();
    },

    // 点击某一行的选中
    handleClickRow(row, event, column) {
      this.$refs.gridData.toggleRowSelection(row);
      this.selectDealWith(row);
    },

    // 全选操作
    handleSeleceAll(selection) {
      if (selection.length > 0) {
        selection.map(row => {
          this.selectDealWith(row, false);
        });
      } else if (selection.length === 0) {
        const defaultSelecteIds = this.defaultSelectArr.map(v => v.skuId);
        this.gridData.map(item => {
          if (defaultSelecteIds.includes(item.skuId)) {
            this.defaultSelectArr.splice(
              this.defaultSelectArr.findIndex(v => v.skuId === item.skuId),
              1
            );
          }
          console.log(' this.defaultSelectArr>>', this.defaultSelectArr);
        });
      }
    },

    // 用户点击勾选
    handleSelece(selection, row) {
      // 此处需要做去重处理
      const hash = {};
      const newarr = selection.reduce(function(item, next) {
        hash[next.skuId * 1]
          ? ''
          : (hash[next.skuId * 1] = true && item.push(next));
        return item;
      }, []);
      console.log('选中数组:', newarr, this.show);
      console.log('selection>>', selection, 'row==>', row);
      this.multipleSelection = newarr;
      this.selectDealWith(row);
    },

    selectDealWith(row, isSplice = true) {
      const defaultSelecteIds = this.defaultSelectArr.map(v => v.skuId);
      console.log(
        'defaultSelecteIds>>',
        defaultSelecteIds,
        '当前选中行的skuid>>',
        row.skuId
      );
      if (!defaultSelecteIds.includes(row.skuId)) {
        this.defaultSelectArr.push(row);
      } else {
        if (isSplice) {
          this.defaultSelectArr.splice(
            this.defaultSelectArr.findIndex(item => item.skuId === row.skuId),
            1
          );
        }
      }
      console.log('defaultSelectArr222>>', this.defaultSelectArr);
    },

    // 添加商品数据
    confirmation() {
      const deepmultipleSelection = this.multipleSelection.slice(0);
      const selectArr = this.defaultSelectArr;
      console.log('selectArr>', selectArr);
      let storeData = [];
      if (selectArr.length > 0) {
        const selecteIds = selectArr.map(v => v.skuId);
        deepmultipleSelection.map((v, index) => {
          if (!selecteIds.includes(v.skuId)) {
            selectArr.push(v);
          }
        });
        console.log('selectArr222>', selectArr);
        storeData = selectArr;
      } else {
        storeData = deepmultipleSelection;
      }
      store.dispatch('SelecetedGood', storeData).then(res => {
        this.$message.success('添加成功');
        this.$emit('handOk');
      });
    },

    dealselecte(gridData, arr) {
      console.log('默认已经选择的数组', arr);
      this.defaultSelectArr = arr.slice(0);
      const selecteIds = arr.map(v => {
        return v.skuId;
      });

      gridData.forEach((row, index) => {
        if (selecteIds.includes(row.skuId * 1)) {
          this.$refs.gridData.toggleRowSelection(gridData[index]);
        }
      });
    },

    // 将获取到的列表由 spuId 级别 降级为 skuId 级别数据
    downgradeData(arr) {
      var skuIdArrData = []; // c
      arr.map(a => {
        if (a.skuVOList) {
          a.skuVOList.map(v => {
            skuIdArrData.push({
              skuId: v.id,
              detail: v.detail,
              spuName: v.spuName,
              businessType: a.businessType,
              spuNo: v.spuNo
            });
          });
        }
      });
      console.log(skuIdArrData);
      return skuIdArrData;
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog_footer {
  margin-top: 10px;
}
</style>

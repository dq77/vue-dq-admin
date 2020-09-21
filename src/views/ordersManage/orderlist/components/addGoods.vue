<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="order-list-add-goods">
    <el-dialog :visible.sync="dialog" title="添加商品" center width="980px" @close="cancel">
      <el-form ref="formData" :model="formData" inline>
        <el-form-item label="渠道">
          <el-select v-model="formData.channel" class="input-150">
            <el-option value="" label="全部"/>
            <el-option v-for="item in channelList" :key="item.code" :value="item.code" :label="item.name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="类目">
          <!-- <el-select v-model="formData.categoryId" class="input-150">
            <el-option value="" label="全部"/>
            <el-option v-for="item in categoryList" :key="item.id" :value="item.id" :label="item.name"/>
          </el-select> -->
          <select-category :category-id="formData.categoryId" @select="confirmCategory"/>
        </el-form-item>
        <el-form-item label="商品">
          <el-input v-model="formData.keyWords" class="input-150" placeholder="请输入商品名称" clearable/>
        </el-form-item>
        <el-form-item label="业务类型">
          <el-select v-model="formData.businessTypes" class="input-150">
            <el-option value label="全部"/>
            <el-option :value="0" label="租赁"/>
            <el-option :value="20" label="售卖"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="search()">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" ref="selectTable" :data="tableData" :max-height="400" :row-key="(row)=>{ return row.id}" border @selection-change="handleSelectionChange">
        <el-table-column :reserve-selection="true" type="selection" width="55"/>
        <el-table-column prop="spuName" label="商品名称">
          <template slot-scope="scope">
            <div>{{ scope.row.spuName }} <span v-if="scope.row.detail">[{{ scope.row.detail }}]</span></div>
          </template>
        </el-table-column>
        <el-table-column label="业务类型" width="100px" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.businessType === 0">租赁</span>
            <span v-if="scope.row.businessType ===20">售卖</span>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="SKUID" width="80px"/>
        <el-table-column prop="inventory" label="库存量" width="80px"/>
        <el-table-column prop="erpCode" label="商品编码" width="200px"/>
        <el-table-column v-if="orderType === 'RENTING'" label="租期" width="130px" fixed="right">
          <template slot-scope="scope">
            <el-select v-model="scope.row.chooseStageNum" class="input-100" @change="(val) => {changeItemStage(scope.row, val)}">
              <!-- <el-option v-for="item in scope.row.skuStageVOList" :key="item.stageNumber" :value="item.stageNumber" :label="item.stageNumber+(item.unit=='月'?'个月':'天')">
                {{ item.stageNumber }}{{ item.unit=='月'?'个月':'天' }}
              </el-option> -->
              <el-option v-for="item in skuStageVOList" :key="item.stageNumber" :value="item.stageNumber" :label="item.stageNumber+(item.unit=='月'?'个月':'天')"/>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList"/>
      <div slot="footer">
        <el-button type="info" @click="cancel()">取消</el-button>
        <el-button type="primary" @click="save()">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import goodsApi from '@/api/goods.js';
import { getinventories } from '@/api/inventorys';
import { deepClone } from '@/utils/index.js';
import store from '@/store';
import { mapGetters } from 'vuex';
import pagination from '@/components/Pagination/index'
import selectCategory from '@/components/selectCategory/index'
export default {
  components: {
    selectCategory,
    pagination
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    orderType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialog: false, // 添加商品弹窗
      loading: false,
      channelList: [], // 获取的渠道下拉框
      categoryList: [], // 获取的类目下拉框
      chooseSkus: [], // 选中的行数据(不含选择的租期) [{}, {}]
      total: 0,
      skuStageVOList: [
        { stageNumber: 7, unit: '天' },
        { stageNumber: 15, unit: '天' },
        { stageNumber: 45, unit: '天' },
        { stageNumber: 3, unit: '月' },
        { stageNumber: 6, unit: '月' },
        { stageNumber: 9, unit: '月' },
        { stageNumber: 12, unit: '月' }
      ],
      formData: {
        channel: '',
        categoryId: '',
        keyWords: '',
        businessTypes: ''
      },
      listQuery: {
        page: 1,
        pageSize: 10
      },
      tableData: []
    }
  },
  computed: {
    ...mapGetters(['selectedOrderGoods'])
  },
  watch: {
    show: {
      handler(val) {
        this.dialog = val
        if (val) {
          this.search();
        } else {
          this.$refs.selectTable.clearSelection();
          this.clearSearch()
        }
      }
    }
  },
  created() {
    this.channelFunction();
    this.categoryFunction();
    this.search();
  },
  methods: {

    // 条件查询
    search() {
      this.listQuery.page = 1;
      this.listQuery.pageSize = 10;
      this.initForm = {
        ...this.formData
      }
      this.fetchTableData()
    },
    getList() {
      this.fetchTableData();
    },
    // 获取表格数据事件
    fetchTableData() {
      this.loading = true
      this.chooseStage = []
      const data = {
        page: this.listQuery.page,
        pageSize: this.listQuery.pageSize,
        ...this.initForm
      }
      goodsApi.goodsList(data).then(res => {
        if (res.code === 200 && res.data) {
          this.tableData = []
          let index = 0
          res.data.list.map(spu => {
            spu.skuVOList.map(sku => {
              sku.businessType = spu.businessType
              sku.spuId = spu.spuId
              sku.index = index
              sku.quantity = 1
              sku.skuId = sku.id
              sku.discountPrice = ''
              sku.chooseStage = this.skuStageVOList[0]
              sku.chooseStageNum = sku.chooseStage.stageNumber

              this.chooseSkus.map(chooseSku => {
                if (chooseSku.id === sku.id) {
                  sku.chooseStage = chooseSku.chooseStage
                  sku.chooseStageNum = chooseSku.chooseStageNum
                  sku.unitPrice = chooseSku.unitPrice
                  sku.quantity = chooseSku.quantity
                  sku.discountPrice = chooseSku.discountPrice
                }
              })

              this.tableData.push(sku)
              index++
            })
          })
          this.total = res.data.totalCount;
          this.listQuery.page = res.data.page;
          this.listQuery.pageSize = res.data.pageSize;
          if (this.selectedOrderGoods.length > 0) {
            this.dealselecte(this.selectedOrderGoods);
          }
          this.getInventory()
        }
      })
    },
    getInventory() {
      const spulist = []
      this.tableData.map(item => {
        spulist.push(item.spuId)
      })
      const param = {
        spuId: Array.from(new Set(spulist)).join(',')
      }
      getinventories(param).then(res => {
        if (res.code === 200) {
          res.data.map(spu => {
            for (const skuid in spu.skuFreeQuantity) {
              const clctrow = this.tableData.filter(row => {
                return row.id - 0 === skuid - 0
              })[0]
              if (clctrow) {
                this.$set(clctrow, 'inventory', spu.skuFreeQuantity[skuid])
              }
            }
          })
        } else {
          this.$message.info(res.msg);
        }
        this.loading = false
      })
    },
    // 多选触发
    handleSelectionChange(val) {
      this.chooseSkus = val
    },
    // 获取渠道下拉框
    channelFunction() {
      goodsApi.getChannel().then(res => {
        if (res.code === 200 && res.data) {
          this.channelList = res.data;
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
    // 获取类目下拉框
    categoryFunction() {
      goodsApi.selectCategory().then(res => {
        if (res.code === 200 && res.data) {
          this.categoryList = res.data;
        }
      })
    },
    // 切换已选择的租期
    changeItemStage(item, val) {
      this.chooseSkus.map(sku => {
        if (sku.id == item.id) {
          sku.chooseStage = this.skuStageVOList.filter(stage => {
            return stage.stageNumber == val
          })[0]
          sku.chooseStageNum = val
        }
      })
    },
    dealselecte(arr) {
      const selecteIds = arr.map(v => {
        return v.id;
      });
      this.tableData.forEach((row, index) => {
        if (selecteIds.includes(row.id)) {
          this.$refs.selectTable.toggleRowSelection(this.tableData[index]);
        }
      });
    },
    save() {
      this.chooseSkus = [...this.chooseSkus, ...this.selectedOrderGoods]
      const res = new Map();
      const hash = this.chooseSkus.filter((a) => !res.has(a.id) && res.set(a.id, 1))
      console.log(hash);
      store.dispatch('addOrderGoods', deepClone(hash)).then(res => {
        this.$message.success('添加成功');
        this.$emit('handOk');
      });
    },
    cancel() {
      this.chooseSkus = this.selectedOrderGoods
      this.$emit('handClose')
    },
    clearSearch() {
      for (const key in this.formData) {
        this.formData[key] = ''
      }
    }

  }
}
</script>

<style rel='stylesheet/scss' lang="scss">
.order-list-add-goods{
  .el-dialog__body{
    padding: 0 25px;
  }
  .input-150{
    width: 150px;
  }
}
</style>
